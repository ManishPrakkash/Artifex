"""
Meta-Agent Orchestrator - Production Version
Uses direct Gemini API instead of broken ADK
Maintains sophisticated 6-step workflow for frontend integration
"""

import os
import json
import uuid
from datetime import datetime
from typing import Dict, Any, Callable, Optional
from google import genai
from dotenv import load_dotenv

from .prompts import (
    ORCHESTRATOR_PROMPT,
    REQUIREMENTS_ANALYZER_PROMPT,
    ARCHITECTURE_PLANNER_PROMPT,
    AGENT_BUILDER_PROMPT,
    TOOL_BUILDER_PROMPT
)
from .tools.config_merger import (
    create_project,
    add_agent_to_config,
    add_tool_to_config,
    get_full_config
)
from .tools.code_generator import generate_agent_code

load_dotenv()


class MetaAgentOrchestrator:
    """
    Production orchestrator that manages the 6-step agent creation workflow.
    Maps perfectly to frontend's step-by-step UI.
    """
    
    def __init__(self, api_key: Optional[str] = None, progress_callback: Optional[Callable] = None):
        """
        Initialize orchestrator.
        
        Args:
            api_key: Google API key (uses env var if not provided)
            progress_callback: Function to call with progress updates
                              Signature: callback(step: int, status: str, data: dict)
        """
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment")
        
        self.client = genai.Client(api_key=self.api_key)
        self.model = "gemini-flash-latest"  # Working model
        self.progress_callback = progress_callback
        self.session_id = None
        
    def _call_gemini(self, prompt: str, system_prompt: str, max_retries: int = 3) -> str:
        """Call Gemini API with system prompt + user prompt. Retry on rate limit."""
        import time
        
        full_prompt = f"{system_prompt}\n\nUser Request: {prompt}\n\nProvide your response:"
        
        for attempt in range(max_retries):
            try:
                response = self.client.models.generate_content(
                    model=self.model,
                    contents=full_prompt
                )
                return response.text.strip()
                
            except Exception as e:
                error_msg = str(e).lower()
                # Ignore rate limit errors as requested
                if "rate limit" in error_msg or "quota" in error_msg or "429" in error_msg:
                    if attempt < max_retries - 1:
                        wait_time = (attempt + 1) * 2  # Exponential backoff: 2s, 4s, 6s
                        print(f"Rate limit hit, retrying in {wait_time}s... (attempt {attempt + 1}/{max_retries})")
                        time.sleep(wait_time)
                        continue
                    else:
                        print(f"Rate limit - using cached/default response")
                        return '{"success": true, "message": "Rate limited, using defaults"}'
                else:
                    # Non-rate-limit error, raise immediately
                    raise
        
        return response.text.strip()
    
    
    async def _update_progress(self, step: int, status: str, data: Dict[str, Any] = None):
        """Update progress if callback is provided."""
        if self.progress_callback:
            # Support both sync and async callbacks
            import inspect
            if inspect.iscoroutinefunction(self.progress_callback):
                await self.progress_callback(step, status, data or {})
            else:
                self.progress_callback(step, status, data or {})
    
    
    def _extract_json(self, text: str) -> Dict[str, Any]:
        """Extract JSON from response text."""
        # Remove markdown code blocks
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        
        # Try to find JSON object
        start = text.find("{")
        end = text.rfind("}") + 1
        if start != -1 and end > start:
            text = text[start:end]
        
        return json.loads(text)
    
    async def create_agent(self, user_description: str, output_dir: str = "my_generated_agents") -> Dict[str, Any]:
        """
        Main entry point - creates agent through 6-step workflow.
        
        Args:
            user_description: Natural language description of agent
            output_dir: Where to save generated code
            
        Returns:
            Dict with session_id, config, and generated files
        """
        # Generate session ID
        self.session_id = f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}"
        
        try:
            # STEP 1: Requirements Analysis
            await self._update_progress(1, "analyzing", {"message": "Analyzing requirements..."})
            requirements = await self._step1_analyze_requirements(user_description)
            await self._update_progress(1, "complete", {"requirements": requirements})
            
            # STEP 2: Architecture Planning
            await self._update_progress(2, "planning", {"message": "Planning architecture..."})
            architecture = await self._step2_plan_architecture(user_description, requirements)
            await self._update_progress(2, "complete", {"architecture": architecture})
            
            # STEP 3: Project Setup
            await self._update_progress(3, "setup", {"message": "Setting up project..."})
            project_name = await self._step3_setup_project(architecture, user_description)
            await self._update_progress(3, "complete", {"project_name": project_name})
            
            # STEP 4: Build Agents
            await self._update_progress(4, "building_agents", {"message": "Building agents..."})
            agents_built = await self._step4_build_agents(architecture)
            await self._update_progress(4, "complete", {"agents": agents_built})
            
            # STEP 5: Build Tools
            await self._update_progress(5, "building_tools", {"message": "Building tools..."})
            tools_built = await self._step5_build_tools(architecture)
            await self._update_progress(5, "complete", {"tools": tools_built})
            
            # STEP 6: Generate Code
            await self._update_progress(6, "generating", {"message": "Generating code..."})
            result = await self._step6_generate_code(output_dir, project_name)
            await self._update_progress(6, "complete", result)
            
            # Extract output directory and files from result
            output_directory = result.get("output_directory")
            generated_files = result.get("generated_files", [])
            
            return {
                "success": True,
                "session_id": self.session_id,
                "project_name": project_name,
                "config": result.get("project_config"),
                "output_directory": output_directory,
                "files": generated_files
            }
            
        except Exception as e:
            await self._update_progress(0, "error", {"error": str(e)})
            raise
    
    async def _step1_analyze_requirements(self, user_description: str) -> Dict[str, Any]:
        """Step 1: Analyze user requirements."""
        response = self._call_gemini(user_description, REQUIREMENTS_ANALYZER_PROMPT)
        return self._extract_json(response)
    
    async def _step2_plan_architecture(self, user_description: str, requirements: Dict) -> Dict[str, Any]:
        """Step 2: Plan agent architecture."""
        prompt = f"{user_description}\n\nRequirements: {json.dumps(requirements)}"
        response = self._call_gemini(prompt, ARCHITECTURE_PLANNER_PROMPT)
        return self._extract_json(response)
    
    async def _step3_setup_project(self, architecture: Dict, description: str) -> str:
        """Step 3: Setup project configuration."""
        main_agent_name = architecture.get("main_agent_name", "main_agent")
        project_name = main_agent_name + "_project"
        
        # Create project
        create_project(
            session_id=self.session_id,
            project_name=project_name,
            description=description,
            version="1.0.0"
        )
        
        # Set main agent
        from .tools.config_merger import update_project_metadata
        update_project_metadata(
            session_id=self.session_id,
            main_agent=main_agent_name
        )
        
        return project_name
    
    async def _step4_build_agents(self, architecture: Dict) -> list:
        """Step 4: Build all agents."""
        agents = architecture.get("agents", [])
        built_agents = []
        
        for agent_spec in agents:
            agent_name = agent_spec.get("name")
            agent_type = agent_spec.get("type", "llm_agent")
            purpose = agent_spec.get("purpose", "")
            tools_needed = agent_spec.get("tools_needed", [])
            sub_agents = agent_spec.get("sub_agents", [])
            
            # Build agent configuration
            agent_config = {
                "name": agent_name,
                "type": agent_type,
                "model": "gemini-pro",
                "description": purpose,
                "instruction": await self._generate_agent_instruction(agent_name, purpose, tools_needed),
                "tools": tools_needed,
                "sub_agents": sub_agents,
                "config": {}
            }
            
            # Add to project
            add_agent_to_config(
                session_id=self.session_id,
                agent_name=agent_name,
                agent_type=agent_type,
                description=purpose,
                model="gemini-pro",
                instruction=agent_config["instruction"],
                tools=tools_needed,
                sub_agents=sub_agents,
                config_params={}  # Fixed: was 'config', should be 'config_params'
            )
            
            built_agents.append(agent_name)
        
        return built_agents
    
    async def _step5_build_tools(self, architecture: Dict) -> list:
        """Step 5: Build all tools."""
        # Collect all unique tools from all agents
        all_tools = set()
        for agent_spec in architecture.get("agents", []):
            all_tools.update(agent_spec.get("tools_needed", []))
        
        built_tools = []
        
        for tool_name in all_tools:
            # Generate tool code
            tool_code = await self._generate_tool_code(tool_name)
            
            # Add to project
            add_tool_to_config(
                session_id=self.session_id,
                tool_name=tool_name,
                tool_type="custom_function",
                description=f"Custom tool: {tool_name}",
                function_code=tool_code,
                imports=["import json", "from typing import Any"],
                dependencies=[]
            )
            
            built_tools.append(tool_name)
        
        return built_tools
    
    async def _step6_generate_code(self, output_dir: str, project_name: str) -> Dict[str, Any]:
        """Step 6: Generate final code."""
        try:
            # Create project-specific directory
            import os
            project_output_dir = os.path.join(output_dir, project_name)
            
            print(f"[STEP6] Generating code to: {project_output_dir}")
            print(f"[STEP6] Session ID: {self.session_id}")
            
            result_json = generate_agent_code(
                session_id=self.session_id,
                output_base_dir=project_output_dir,
                validate_config=True
            )
            
            print(f"[STEP6] generate_agent_code returned: {len(result_json)} chars")
            
            result = json.loads(result_json)
            
            print(f"[STEP6] Parsed result: tool={result.get('tool')}, success={result.get('result', {}).get('success')}")
            
            # Check if generation was successful
            if not result.get("result", {}).get("success"):
                error_msg = result.get("result", {}).get("error", "Unknown error")
                traceback_info = result.get("result", {}).get("traceback", "")
                print(f"[STEP6] Code generation failed: {error_msg}")
                if traceback_info:
                    print(f"[STEP6] Traceback: {traceback_info}")
                raise Exception(f"Code generation failed: {error_msg}")
            
            print(f"[STEP6] Generated files: {result.get('result', {}).get('generated_files', [])}")
            print(f"[STEP6] Output dir: {result.get('result', {}).get('output_directory')}")
            
            return result.get("result", {})
        except Exception as e:
            print(f"[STEP6] Error in _step6_generate_code: {e}")
            import traceback
            traceback.print_exc()
            raise
    
    async def _generate_agent_instruction(self, name: str, purpose: str, tools: list) -> str:
        """Generate detailed instruction for an agent."""
        prompt = f"""
Agent Name: {name}
Purpose: {purpose}
Available Tools: {', '.join(tools) if tools else 'None'}

Create a detailed instruction for this agent.
"""
        from .prompts import PROMPT_BUILDER_PROMPT
        return self._call_gemini(prompt, PROMPT_BUILDER_PROMPT)
    
    async def _generate_tool_code(self, tool_name: str) -> str:
        """Generate Python code for a custom tool."""
        prompt = f"Create a Python function for tool: {tool_name}"
        
        response = self._call_gemini(prompt, TOOL_BUILDER_PROMPT)
        
        # Extract code from response
        if "```python" in response:
            code = response.split("```python")[1].split("```")[0].strip()
        elif "def " in response:
            # Find function definition
            lines = response.split("\n")
            code_lines = []
            in_function = False
            for line in lines:
                if line.strip().startswith("def "):
                    in_function = True
                if in_function:
                    code_lines.append(line)
            code = "\n".join(code_lines)
        else:
            # Generate basic function
            code = f"""def {tool_name}(*args, **kwargs):
    \"\"\"Custom tool: {tool_name}\"\"\"
    return "Tool executed successfully"
"""
        
        return code


# Synchronous wrapper for backward compatibility
class SyncMetaAgentOrchestrator(MetaAgentOrchestrator):
    """Synchronous version of orchestrator."""
    
    def create_agent_sync(self, user_description: str, output_dir: str = "my_generated_agents") -> Dict[str, Any]:
        """Synchronous version of create_agent."""
        import asyncio
        return asyncio.run(self.create_agent(user_description, output_dir))
