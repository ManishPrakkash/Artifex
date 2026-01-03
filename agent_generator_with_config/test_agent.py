#!/usr/bin/env python3
"""
Universal Agent Tester
- Test any generated agent by changing the AGENT_PATH
- Works with direct google.genai API (no ADK complexity)
- Easy to integrate with Next.js frontend via API
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from google import genai

# ============================================================================
# CONFIGURATION - Change these to test different agents
# ============================================================================

# Path to the agent you want to test (relative to this file)
AGENT_PATH = "my_generated_agents/rock_paper_scissor_agent"

# Or test other agents by changing the path:
# AGENT_PATH = "generated_test_agents/custom_tool_test_agent"
# AGENT_PATH = "generated_test_agents/web_search_agent"
# AGENT_PATH = "my_generated_agents/your_custom_agent"

# ============================================================================

# Load environment variables
load_dotenv()

def load_agent_config(agent_path):
    """Load agent configuration from the agent.py file."""
    agent_dir = Path(__file__).parent / agent_path
    
    if not agent_dir.exists():
        print(f"❌ Agent directory not found: {agent_dir}")
        print(f"\n💡 Available agents:")
        base_dir = Path(__file__).parent / "generated_test_agents"
        if base_dir.exists():
            for agent in base_dir.iterdir():
                if agent.is_dir():
                    print(f"   - {agent.name}")
        return None
    
    # Read agent.py to extract configuration
    agent_file = agent_dir / "agent.py"
    if not agent_file.exists():
        print(f"❌ agent.py not found in {agent_dir}")
        return None
    
    # Extract agent name and description from the file
    with open(agent_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
        # Extract description from docstring
        import re
        desc_match = re.search(r'"""(.*?)"""', content, re.DOTALL)
        description = desc_match.group(1).strip() if desc_match else "AI Agent"
        
        # Extract instruction
        inst_match = re.search(r'instruction="""(.*?)"""', content, re.DOTALL)
        instruction = inst_match.group(1).strip() if inst_match else "You are a helpful AI assistant."
    
    return {
        "name": agent_path.split('/')[-1],
        "description": description,
        "instruction": instruction,
        "path": str(agent_dir)
    }


def test_agent_interactive(agent_config, api_key):
    """Interactive chat with the agent."""
    
    print("=" * 80)
    print(f"🤖 Testing Agent: {agent_config['name']}")
    print("=" * 80)
    print(f"📝 Description: {agent_config['description'][:100]}...")
    print(f"📁 Path: {agent_config['path']}")
    print()
    print("=" * 80)
    print("💬 Chat with your agent (type 'exit' to quit)")
    print("=" * 80)
    print()
    
    # Create Gemini client
    client = genai.Client(api_key=api_key)
    model = "gemini-flash-latest"
    
    # Chat loop
    conversation_history = []
    
    while True:
        user_input = input("You: ").strip()
        
        if user_input.lower() in ['exit', 'quit', 'bye']:
            print("\n👋 Goodbye!")
            break
        
        if not user_input:
            continue
        
        try:
            # Build prompt with agent instruction
            full_prompt = f"{agent_config['instruction']}\n\nUser: {user_input}\nAssistant:"
            
            # Call Gemini API
            response = client.models.generate_content(
                model=model,
                contents=full_prompt
            )
            
            agent_response = response.text
            
            print(f"\n🤖 Agent: {agent_response}")
            print()
            
            # Store conversation
            conversation_history.append({
                "user": user_input,
                "agent": agent_response
            })
            
        except Exception as e:
            error_str = str(e)
            print(f"\n❌ Error: {error_str}")
            print()
            
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                print("💡 Rate limit exceeded - wait 1-2 hours or get new API key")
            elif "404" in error_str:
                print(f"💡 Model '{model}' not found - try: gemini-1.5-flash or gemini-1.5-pro")
            elif "API key" in error_str:
                print("💡 Invalid API key - get new key from: https://aistudio.google.com/app/apikey")
            
            print()
    
    print()
    print("=" * 80)
    print(f"📊 Session Summary: {len(conversation_history)} exchanges")
    print("=" * 80)
    
    return conversation_history


def test_agent_single(agent_config, api_key, prompt):
    """
    Single prompt test - useful for API integration.
    This function can be called from Next.js backend.
    """
    client = genai.Client(api_key=api_key)
    model = "gemini-flash-latest"
    
    full_prompt = f"{agent_config['instruction']}\n\nUser: {prompt}\nAssistant:"
    
    response = client.models.generate_content(
        model=model,
        contents=full_prompt
    )
    
    return {
        "prompt": prompt,
        "response": response.text,
        "agent": agent_config['name'],
        "model": model
    }


def main():
    """Main function."""
    
    # Check API key
    api_key = os.getenv("GOOGLE_API_KEY")
    
    if not api_key:
        print("❌ No API key found in .env file")
        print("   Add: GOOGLE_API_KEY=your-key-here")
        exit(1)
    
    print("✅ API Key loaded")
    print()
    
    # Load agent configuration
    agent_config = load_agent_config(AGENT_PATH)
    
    if not agent_config:
        exit(1)
    
    # Check if running in single-prompt mode (for API integration)
    if len(sys.argv) > 1:
        # Single prompt mode: python test_agent.py "Your question here"
        prompt = " ".join(sys.argv[1:])
        result = test_agent_single(agent_config, api_key, prompt)
        
        print("=" * 80)
        print(f"🤖 {agent_config['name']}")
        print("=" * 80)
        print(f"📤 Prompt: {result['prompt']}")
        print(f"📥 Response: {result['response']}")
        print("=" * 80)
    else:
        # Interactive mode
        test_agent_interactive(agent_config, api_key)


# ============================================================================
# API Integration Example (for Next.js)
# ============================================================================

def api_chat(agent_path: str, prompt: str, api_key: str = None) -> dict:
    """
    Function to call from Next.js API route.
    
    Example Next.js API route (pages/api/chat.js):
    
    import { exec } from 'child_process';
    
    export default function handler(req, res) {
        const { agent, prompt } = req.body;
        
        exec(`python test_agent.py "${prompt}"`, (error, stdout) => {
            if (error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(200).json({ response: stdout });
            }
        });
    }
    """
    if not api_key:
        api_key = os.getenv("GOOGLE_API_KEY")
    
    agent_config = load_agent_config(agent_path)
    if not agent_config:
        return {"error": "Agent not found"}
    
    try:
        return test_agent_single(agent_config, api_key, prompt)
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    main()
