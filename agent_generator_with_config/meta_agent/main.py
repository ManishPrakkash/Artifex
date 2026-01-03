# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""
Main entry point for the Agent Creator Meta-Agent.
Production version using direct Gemini API.
"""

import sys
import os
from pathlib import Path

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

from meta_agent.orchestrator import SyncMetaAgentOrchestrator


def progress_callback(step: int, status: str, data: dict):
    """Callback to display progress updates."""
    step_names = {
        1: "Requirements Analysis",
        2: "Architecture Planning",
        3: "Project Setup",
        4: "Building Agents",
        5: "Building Tools",
        6: "Code Generation"
    }
    
    step_name = step_names.get(step, f"Step {step}")
    
    if status == "complete":
        print(f"✅ {step_name} - Complete")
        if "requirements" in data:
            print(f"   Purpose: {data['requirements'].get('purpose', 'N/A')}")
        elif "architecture" in data:
            agents = data['architecture'].get('agents', [])
            print(f"   Agents: {len(agents)}")
        elif "project_name" in data:
            print(f"   Project: {data['project_name']}")
        elif "agents" in data:
            print(f"   Built: {', '.join(data['agents'])}")
        elif "tools" in data:
            print(f"   Built: {', '.join(data['tools'])}")
    elif status == "error":
        print(f"❌ Error: {data.get('error', 'Unknown error')}")
    else:
        print(f"🔄 {step_name} - {data.get('message', status)}...")


def test_simple_agent_creation():
    """Test creating a simple research assistant agent."""
    
    user_request = """
     i need a explainer agent as it should be explain in bullet format only in 5 bullet points 
    """
    
    print("=" * 80)
    print("AGENT CREATOR META-AGENT TEST")
    print("=" * 80)
    print(f"User Request: {user_request}")
    print("-" * 80)
    print()
    
    try:
        # Create orchestrator with progress callback
        orchestrator = SyncMetaAgentOrchestrator(progress_callback=progress_callback)
        
        # Create agent
        result = orchestrator.create_agent_sync(user_request)
        
        print()
        print("=" * 80)
        print("✅ AGENT CREATED SUCCESSFULLY!")
        print("=" * 80)
        print(f"Session ID: {result['session_id']}")
        print(f"Project: {result['project_name']}")
        print(f"Output: {result['output_directory']}")
        print(f"Files: {len(result['files'])}")
        print()
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()


def test_complex_agent_creation():
    """Test creating a more complex multi-agent system."""
    
    user_request = """
    Create a customer support workflow that:
    1. Classifies incoming support tickets
    2. Routes them to appropriate handlers
    3. Generates responses
    4. Escalates complex issues
    """
    
    print("=" * 80)
    print("COMPLEX MULTI-AGENT SYSTEM TEST")
    print("=" * 80)
    print(f"User Request: {user_request}")
    print("-" * 80)
    print()
    
    try:
        orchestrator = SyncMetaAgentOrchestrator(progress_callback=progress_callback)
        result = orchestrator.create_agent_sync(user_request)
        
        print()
        print("=" * 80)
        print("✅ MULTI-AGENT SYSTEM CREATED!")
        print("=" * 80)
        print(f"Session ID: {result['session_id']}")
        print(f"Project: {result['project_name']}")
        print()
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()


def main():
    """Main entry point."""
    import sys
    
    if len(sys.argv) > 1:
        mode = sys.argv[1]
        if mode == "simple":
            test_simple_agent_creation()
        elif mode == "complex":
            test_complex_agent_creation()
        else:
            print(f"Unknown mode: {mode}")
            print("Usage: python main.py [simple|complex]")
    else:
        # Default to simple
        test_simple_agent_creation()


if __name__ == "__main__":
    main()