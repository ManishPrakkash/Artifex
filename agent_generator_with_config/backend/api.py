"""
FastAPI Backend for Agent Generator
Production-ready API for frontend integration
Deploys to Render with Firebase session storage
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import os
import json
import asyncio
from datetime import datetime
import sys
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, firestore
import importlib.util
import traceback
from google import genai

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from meta_agent.orchestrator import MetaAgentOrchestrator

# Initialize Firebase Admin
try:
    # Try to load service account from environment variable
    firebase_creds = os.getenv('FIREBASE_SERVICE_ACCOUNT_JSON')
    if firebase_creds:
        # Parse JSON from environment
        cred_dict = json.loads(firebase_creds)
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
    else:
        # Use default credentials or service account file
        firebase_admin.initialize_app()
    
    # Get Firestore client
    firebase_db = firestore.client()
    FIREBASE_ENABLED = True
except Exception as e:
    print(f"Warning: Firebase initialization failed: {e}")
    print("Continuing without Firebase - using in-memory storage only")
    firebase_db = None
    FIREBASE_ENABLED = False

# Initialize FastAPI
app = FastAPI(
    title="Agent Generator API",
    description="AI-powered agent generation with 6-step workflow",
    version="1.0.0"
)

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (replace with Firebase in production)
sessions: Dict[str, Dict[str, Any]] = {}
active_websockets: Dict[str, WebSocket] = {}


# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class CreateAgentRequest(BaseModel):
    description: str
    output_dir: Optional[str] = "my_generated_agents"


class CreateAgentResponse(BaseModel):
    session_id: str
    status: str
    message: str


class SessionStatus(BaseModel):
    session_id: str
    status: str
    current_step: int
    steps: Dict[str, Any]
    agent_config: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


class AgentConfig(BaseModel):
    project_name: str
    description: str
    version: str
    main_agent: str
    agents: Dict[str, Any]
    tools: Dict[str, Any]
    requirements: List[str]
    environment_variables: Dict[str, str]


# ============================================================================
# WEBSOCKET PROGRESS HANDLER
# ============================================================================

async def websocket_progress_callback(session_id: str, step: int, status: str, data: Dict[str, Any]):
    """Send progress updates via WebSocket."""
    # Create user-friendly message based on step and status
    step_messages = {
        1: {
            "analyzing": "🔍 Analyzing your requirements...",
            "complete": "✅ Requirements analyzed successfully!"
        },
        2: {
            "planning": "🏗️ Planning agent architecture...",
            "complete": "✅ Architecture designed!"
        },
        3: {
            "setup": "⚙️ Setting up project structure...",
            "complete": "✅ Project initialized!"
        },
        4: {
            "building_agents": "🤖 Building AI agents...",
            "complete": "✅ Agents built successfully!"
        },
        5: {
            "building_tools": "🔧 Creating custom tools...",
            "complete": "✅ Tools ready!"
        },
        6: {
            "generating": "💻 Generating code files...",
            "complete": "✅ Code generation complete!"
        }
    }
    
    user_message = step_messages.get(step, {}).get(status, data.get("message", f"Step {step}: {status}"))
    
    # Send to WebSocket
    if session_id in active_websockets:
        ws = active_websockets[session_id]
        try:
            await ws.send_json({
                "type": "progress",
                "step": step,
                "status": status,
                "data": data,
                "message": user_message,
                "timestamp": datetime.now().isoformat()
            })
        except Exception as e:
            print(f"WebSocket send error: {e}")
    
    # Update session storage
    if session_id in sessions:
        sessions[session_id]["current_step"] = step
        sessions[session_id]["steps"][str(step)] = {
            "status": status,
            "data": data,
            "message": user_message,
            "timestamp": datetime.now().isoformat()
        }
        
        # Update Firebase session progress
        if FIREBASE_ENABLED:
            try:
                firebase_db.collection('sessions').document(session_id).update({
                    "currentStep": step,
                    "status": status,
                    f"steps.{step}": {
                        "status": status,
                        "message": user_message,
                        "timestamp": datetime.now()
                    }
                })
            except Exception as e:
                print(f"Firebase update error: {e}")


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "online",
        "service": "Agent Generator API",
        "version": "1.0.0"
    }


@app.post("/api/agents/create", response_model=CreateAgentResponse)
async def create_agent(request: CreateAgentRequest, background_tasks: BackgroundTasks):
    """
    Start agent creation process.
    Returns session_id immediately, process runs in background.
    """
    import uuid
    
    # Create unique session ID with timestamp + UUID to prevent duplicates
    session_id = f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}"
    
    # Check if session already exists (safety check)
    if session_id in sessions:
        raise HTTPException(status_code=409, detail="Session already exists. Please try again.")
    
    sessions[session_id] = {
        "id": session_id,
        "description": request.description,
        "status": "initializing",
        "current_step": 0,
        "steps": {},
        "agent_config": None,
        "created_at": datetime.now().isoformat()
    }
    
    # Store in Firebase immediately to prevent duplicates
    if FIREBASE_ENABLED:
        try:
            firebase_db.collection('sessions').document(session_id).set({
                "sessionId": session_id,
                "description": request.description,
                "status": "initializing",
                "currentStep": 0,
                "createdAt": datetime.now()
            })
        except Exception as e:
            print(f"Firebase session creation failed: {e}")
    
    # Start background task
    background_tasks.add_task(
        run_agent_creation,
        session_id,
        request.description,
        request.output_dir
    )
    
    return CreateAgentResponse(
        session_id=session_id,
        status="started",
        message="Agent creation started"
    )


async def run_agent_creation(session_id: str, description: str, output_dir: str):
    """Background task to create agent."""
    try:
        # Create progress callback
        async def progress_cb(step: int, status: str, data: Dict[str, Any]):
            await websocket_progress_callback(session_id, step, status, data)
        
        # Create orchestrator
        orchestrator = MetaAgentOrchestrator(progress_callback=progress_cb)
        
        # Create agent
        result = await orchestrator.create_agent(description, output_dir)
        
        # Update session
        sessions[session_id]["status"] = "complete"
        sessions[session_id]["agent_config"] = result.get("config")
        sessions[session_id]["output_directory"] = result.get("output_directory")
        sessions[session_id]["files"] = result.get("files")
        
        # Store metadata in Firebase (not the code - just configuration)
        if FIREBASE_ENABLED:
            await store_agent_metadata_in_firebase(session_id, {
                "session_id": session_id,
                "description": description,
                "project_name": result.get("project_name"),
                "agent_config": result.get("config"),
                "created_at": datetime.now(),
                "status": "complete"
            })
        
    except Exception as e:
        sessions[session_id]["status"] = "error"
        sessions[session_id]["error"] = str(e)
        print(f"Error in agent creation: {traceback.format_exc()}")


@app.get("/api/sessions/{session_id}", response_model=SessionStatus)
async def get_session(session_id: str):
    """Get session status and progress."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    
    return SessionStatus(
        session_id=session_id,
        status=session["status"],
        current_step=session.get("current_step", 0),
        steps=session.get("steps", {}),
        agent_config=session.get("agent_config"),
        error=session.get("error")
    )


@app.get("/api/agents/{session_id}/config")
async def get_agent_config(session_id: str):
    """Get generated agent configuration."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    
    if session["status"] != "complete":
        raise HTTPException(status_code=400, detail="Agent not ready yet")
    
    return session.get("agent_config", {})


@app.get("/api/agents/{session_id}/graph")
async def get_agent_graph(session_id: str):
    """Get workflow graph data for visualization."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    config = session.get("agent_config")
    
    if not config:
        raise HTTPException(status_code=400, detail="Agent config not available")
    
    # Build graph from config
    nodes = []
    edges = []
    
    # Add agent nodes
    for agent_name, agent_data in config.get("agents", {}).items():
        nodes.append({
            "id": agent_name,
            "type": "agent",
            "data": {
                "label": agent_name,
                "description": agent_data.get("description", ""),
                "agentType": agent_data.get("type", "llm_agent")
            },
            "position": {"x": 0, "y": 0}  # Frontend will layout
        })
        
        # Add edges for sub-agents
        for sub_agent in agent_data.get("sub_agents", []):
            edges.append({
                "id": f"{agent_name}-{sub_agent}",
                "source": agent_name,
                "target": sub_agent,
                "type": "sub_agent"
            })
        
        # Add edges for tools
        for tool in agent_data.get("tools", []):
            edges.append({
                "id": f"{agent_name}-{tool}",
                "source": agent_name,
                "target": tool,
                "type": "tool_usage"
            })
    
    # Add tool nodes
    for tool_name, tool_data in config.get("tools", {}).items():
        nodes.append({
            "id": tool_name,
            "type": "tool",
            "data": {
                "label": tool_name,
                "description": tool_data.get("description", ""),
                "toolType": tool_data.get("type", "custom_function")
            },
            "position": {"x": 0, "y": 0}
        })
    
    return {"nodes": nodes, "edges": edges}


@app.post("/api/agents/{session_id}/download")
async def download_agent_code(session_id: str):
    """Download generated agent code as ZIP."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    
    if session["status"] != "complete":
        raise HTTPException(status_code=400, detail="Agent not ready yet")
    
    output_dir = session.get("output_directory")
    if not output_dir or not os.path.exists(output_dir):
        raise HTTPException(status_code=404, detail="Agent files not found")
    
    # Create ZIP file
    import shutil
    zip_path = f"/tmp/{session_id}.zip"
    shutil.make_archive(zip_path.replace(".zip", ""), "zip", output_dir)
    
    return FileResponse(
        zip_path,
        media_type="application/zip",
        filename=f"{session.get('agent_config', {}).get('project_name', 'agent')}.zip"
    )


@app.websocket("/ws/agents/{session_id}/progress")
async def websocket_progress(websocket: WebSocket, session_id: str):
    """WebSocket for real-time progress updates."""
    await websocket.accept()
    active_websockets[session_id] = websocket
    
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        if session_id in active_websockets:
            del active_websockets[session_id]


# ============================================================================
# FIREBASE INTEGRATION
# ============================================================================

async def store_agent_metadata_in_firebase(session_id: str, metadata: Dict[str, Any]):
    """Store agent metadata in Firebase (not code - just configuration)."""
    if not FIREBASE_ENABLED:
        return
    
    try:
        # Store in Firestore
        doc_ref = firebase_db.collection('agents').document(session_id)
        doc_ref.set(metadata)
        print(f"Agent metadata stored in Firebase: {session_id}")
    except Exception as e:
        print(f"Error storing metadata in Firebase: {e}")


# ============================================================================
# CHAT ENDPOINTS
# ============================================================================

class ChatMessage(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str
    session_id: str


# In-memory chat history
chat_histories: Dict[str, List[Dict[str, str]]] = {}
# Cache loaded agents to avoid re-loading
loaded_agents: Dict[str, Any] = {}


@app.post("/api/chat/{session_id}", response_model=ChatResponse)
async def chat_with_agent(session_id: str, message: ChatMessage):
    """
    Chat with a created agent.
    Loads the generated agent code and executes it with Gemini.
    """
    # Check if session exists
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    
    # Check if agent is complete
    if session["status"] != "complete":
        raise HTTPException(status_code=400, detail="Agent not ready yet")
    
    # Get output directory
    output_dir = session.get("output_directory")
    if not output_dir:
        raise HTTPException(status_code=500, detail="Agent files not found")
    
    try:
        # Initialize chat history for this session
        if session_id not in chat_histories:
            chat_histories[session_id] = []
        
        # Add user message to history
        chat_histories[session_id].append({
            "role": "user",
            "content": message.message
        })
        
        # Use Gemini directly to simulate agent response
        # In a real scenario, you'd load the generated agent code
        # For now, we'll use Gemini with the agent's purpose
        agent_config = session.get("agent_config", {})
        agent_description = session.get("description", "")
        
        # Create context for the agent
        system_context = f"""You are an AI agent created for the following purpose:
{agent_description}

Agent Configuration:
{json.dumps(agent_config, indent=2)}

Respond to user queries according to your purpose and capabilities.
"""
        
        # Get Gemini API key
        gemini_api_key = os.getenv("GOOGLE_API_KEY")
        if not gemini_api_key:
            raise HTTPException(status_code=500, detail="Gemini API key not configured")
        
        # Call Gemini
        client = genai.Client(api_key=gemini_api_key)
        
        # Build conversation history
        full_context = system_context + "\n\nConversation History:\n"
        for msg in chat_histories[session_id]:
            full_context += f"{msg['role']}: {msg['content']}\n"
        
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=full_context
        )
        
        agent_response = response.text.strip()
        
        # Add assistant response to history
        chat_histories[session_id].append({
            "role": "assistant",
            "content": agent_response
        })
        
        # Store chat in Firebase
        if FIREBASE_ENABLED:
            try:
                chat_ref = firebase_db.collection('chats').document(session_id).collection('messages')
                chat_ref.add({
                    "role": "user",
                    "content": message.message,
                    "timestamp": datetime.now()
                })
                chat_ref.add({
                    "role": "assistant",
                    "content": agent_response,
                    "timestamp": datetime.now()
                })
            except Exception as e:
                print(f"Error storing chat in Firebase: {e}")
        
        return ChatResponse(
            response=agent_response,
            session_id=session_id
        )
        
    except Exception as e:
        print(f"Error in chat: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@app.get("/api/chat/{session_id}/history")
async def get_chat_history(session_id: str):
    """Get chat history for a session."""
    if session_id not in chat_histories:
        return {"messages": []}
    
    return {"messages": chat_histories[session_id]}


# ============================================================================
# STARTUP
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )
