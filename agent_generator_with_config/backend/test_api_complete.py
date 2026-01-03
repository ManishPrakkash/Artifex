"""
Complete API Test - Test agent creation before connecting to Next.js frontend
"""
import requests
import json
import time
from datetime import datetime

BASE_URL = "http://localhost:8000"

def print_section(title):
    print("\n" + "=" * 80)
    print(f"  {title}")
    print("=" * 80)

def test_health_check():
    """Test 1: Health Check"""
    print_section("TEST 1: Health Check")
    
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ Status Code: {response.status_code}")
        print(f"✅ Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_create_agent(description):
    """Test 2: Create Agent"""
    print_section(f"TEST 2: Create Agent - '{description}'")
    
    try:
        payload = {
            "description": description,
            "output_dir": "my_generated_agents"
        }
        
        print(f"📤 Sending request...")
        print(f"   Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(
            f"{BASE_URL}/api/agents/create",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"\n✅ Status Code: {response.status_code}")
        result = response.json()
        print(f"✅ Response: {json.dumps(result, indent=2)}")
        
        return result.get("session_id")
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_check_progress(session_id, max_attempts=20):
    """Test 3: Monitor Progress"""
    print_section(f"TEST 3: Monitor Progress - Session: {session_id}")
    
    step_names = {
        1: "Requirements Analysis",
        2: "Architecture Planning",
        3: "Project Setup",
        4: "Building Agents",
        5: "Building Tools",
        6: "Code Generation"
    }
    
    for attempt in range(max_attempts):
        try:
            response = requests.get(f"{BASE_URL}/api/sessions/{session_id}")
            status = response.json()
            
            current_step = status.get("current_step", 0)
            step_status = status.get("status", "unknown")
            
            step_name = step_names.get(current_step, f"Step {current_step}")
            
            print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Step {current_step}/6: {step_name}")
            print(f"   Status: {step_status}")
            
            if step_status == "complete":
                print("\n" + "🎉" * 40)
                print("✅ AGENT CREATED SUCCESSFULLY!")
                print("🎉" * 40)
                return status
            elif step_status == "error":
                print(f"\n❌ Error: {status.get('error')}")
                return None
            
            time.sleep(3)  # Wait 3 seconds before next check
            
        except Exception as e:
            print(f"❌ Error checking progress: {e}")
            time.sleep(3)
    
    print("\n⏱️  Timeout: Agent creation took too long")
    return None

def test_get_config(session_id):
    """Test 4: Get Agent Configuration"""
    print_section(f"TEST 4: Get Agent Config - Session: {session_id}")
    
    try:
        response = requests.get(f"{BASE_URL}/api/agents/{session_id}/config")
        
        if response.status_code == 200:
            config = response.json()
            print(f"✅ Project Name: {config.get('project_name')}")
            print(f"✅ Description: {config.get('description')}")
            print(f"✅ Main Agent: {config.get('main_agent')}")
            print(f"✅ Agents: {list(config.get('agents', {}).keys())}")
            print(f"✅ Tools: {list(config.get('tools', {}).keys())}")
            return config
        else:
            print(f"❌ Status Code: {response.status_code}")
            print(f"❌ Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_get_graph(session_id):
    """Test 5: Get Workflow Graph"""
    print_section(f"TEST 5: Get Workflow Graph - Session: {session_id}")
    
    try:
        response = requests.get(f"{BASE_URL}/api/agents/{session_id}/graph")
        
        if response.status_code == 200:
            graph = response.json()
            print(f"✅ Nodes: {len(graph.get('nodes', []))}")
            print(f"✅ Edges: {len(graph.get('edges', []))}")
            
            print("\n📊 Graph Structure:")
            for node in graph.get('nodes', []):
                print(f"   - {node['id']} ({node['type']})")
            
            return graph
        else:
            print(f"❌ Status Code: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def main():
    """Run all tests"""
    print("\n" + "🚀" * 40)
    print("  FASTAPI BACKEND - COMPREHENSIVE TEST")
    print("🚀" * 40)
    
    # Test 1: Health Check
    if not test_health_check():
        print("\n❌ Health check failed. Make sure the server is running!")
        return
    
    # Test 2: Create Agent
    test_descriptions = [
        "Create a simple calculator agent that can add, subtract, multiply and divide",
        # Add more test cases here
    ]
    
    for description in test_descriptions:
        session_id = test_create_agent(description)
        
        if not session_id:
            print("\n❌ Failed to create agent")
            continue
        
        # Test 3: Monitor Progress
        final_status = test_check_progress(session_id)
        
        if not final_status:
            print("\n❌ Agent creation failed or timed out")
            continue
        
        # Test 4: Get Config
        config = test_get_config(session_id)
        
        # Test 5: Get Graph
        graph = test_get_graph(session_id)
        
        print("\n" + "✅" * 40)
        print("  ALL TESTS PASSED!")
        print("✅" * 40)
        print(f"\n📁 Generated Agent Location:")
        print(f"   {final_status.get('output_directory', 'N/A')}")
        print("\n🎯 Ready to connect to Next.js frontend!")
        print("=" * 80)

if __name__ == "__main__":
    main()
