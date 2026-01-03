#!/usr/bin/env python3
"""
Custom Agent Creator - Using AI to Design Agents
This bypasses the broken meta-agent and uses google.genai directly.
"""
import os
import json
from dotenv import load_dotenv
from google import genai
from code_generator import generate_agent_from_dict

# Load environment
load_dotenv()

def create_agent_with_ai(description: str):
    """
    Use AI to design an agent from a description.
    
    Args:
        description: Natural language description of the agent
        
    Returns:
        dict: Generated agent configuration
    """
    
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("❌ No GOOGLE_API_KEY found in .env")
        return None
    
    client = genai.Client(api_key=api_key)
    
    # AI prompt to design the agent
    prompt = f"""You are an AI agent architect. Design a complete agent configuration based on this description:

{description}

IMPORTANT RULES:
1. Do NOT include any tools - leave "tools" as empty array [] and empty dict {{}}
2. Put ALL functionality in the agent's "instruction" field
3. The agent should handle everything through conversation, not tools

Return a valid JSON configuration with this EXACT structure:
{{
    "project_name": "agent_name_in_snake_case",
    "description": "Brief description",
    "version": "1.0.0",
    "main_agent": "agent_name",
    "agents": {{
        "agent_name": {{
            "name": "agent_name",
            "type": "llm_agent",
            "model": "gemini-pro",
            "description": "What the agent does",
            "instruction": "Detailed instructions for the agent. Include ALL logic, calculations, and functionality here. The agent should explain how to do things, not execute code.",
            "tools": [],
            "sub_agents": [],
            "config": {{}}
        }}
    }},
    "tools": {{}},
    "requirements": [],
    "environment_variables": {{}}
}}

Make the instruction VERY detailed. The agent should guide users through processes, not execute code.
Return ONLY the JSON, no explanation."""

    try:
        print("🤖 AI is designing your agent...")
        print()
        
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt
        )
        
        # Extract JSON from response
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        # Parse JSON
        config = json.loads(response_text)
        
        print("✅ AI designed the agent configuration!")
        print()
        print(f"📝 Agent Name: {config['project_name']}")
        print(f"📝 Description: {config['description']}")
        print()
        
        return config
        
    except json.JSONDecodeError as e:
        print(f"❌ Failed to parse AI response as JSON: {e}")
        print(f"Response was: {response_text[:200]}...")
        return None
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def main():
    """Main function to create custom agents."""
    
    print("=" * 80)
    print("🚀 CUSTOM AGENT CREATOR (AI-Powered)")
    print("=" * 80)
    print()
    print("Describe the agent you want to create.")
    print("The AI will design it and generate all the code!")
    print()
    print("=" * 80)
    print()
    
    # Get agent description from user
    print("Enter your agent description (or press Enter for example):")
    print()
    
    description = input("Description: ").strip()
    
    if not description:
        # Use example
        description = """
        Create a task management agent that can:
        - Create and track tasks
        - Set priorities (high, medium, low)
        - Mark tasks as complete
        - List all tasks
        - Filter tasks by priority
        - Provide task statistics
        """
        print(f"Using example: {description}")
    
    print()
    print("-" * 80)
    print()
    
    # Design agent with AI
    config = create_agent_with_ai(description)
    
    if not config:
        print("❌ Failed to create agent configuration")
        return
    
    # Show configuration
    print("📋 Generated Configuration:")
    print(json.dumps(config, indent=2))
    print()
    print("-" * 80)
    print()
    
    # Ask for confirmation
    confirm = input("Generate this agent? (y/n): ").strip().lower()
    
    if confirm != 'y':
        print("❌ Cancelled")
        return
    
    print()
    print("🏗️  Generating agent code...")
    print()
    
    # Generate the agent
    try:
        output_dir = f"my_generated_agents/{config['project_name']}"
        files = generate_agent_from_dict(config, output_dir=output_dir)
        
        print("=" * 80)
        print("✅ AGENT CREATED SUCCESSFULLY!")
        print("=" * 80)
        print()
        print(f"📁 Location: {output_dir}")
        print(f"📝 Files created: {len(files)}")
        print()
        print("Files:")
        for filename in files.keys():
            print(f"  ✅ {filename}")
        print()
        print("=" * 80)
        print()
        print("🧪 To test your agent:")
        print(f"   1. Edit test_agent.py line 20:")
        print(f'      AGENT_PATH = "{output_dir}"')
        print(f"   2. Run: python test_agent.py")
        print()
        print("=" * 80)
        
    except Exception as e:
        print(f"❌ Error generating agent: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
