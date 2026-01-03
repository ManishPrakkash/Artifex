"""
Test FastAPI Backend Locally
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

print("=" * 80)
print("TESTING FASTAPI BACKEND")
print("=" * 80)

# Test 1: Health check
print("\n1. Health Check...")
response = requests.get(f"{BASE_URL}/")
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")

# Test 2: Create agent
print("\n2. Creating Agent...")
create_response = requests.post(
    f"{BASE_URL}/api/agents/create",
    json={
        "description": "Create a simple weather information agent",
        "output_dir": "my_generated_agents"
    }
)
print(f"Status: {create_response.status_code}")
result = create_response.json()
print(f"Response: {json.dumps(result, indent=2)}")

session_id = result.get("session_id")
print(f"\nSession ID: {session_id}")

# Test 3: Check progress
print("\n3. Checking Progress...")
for i in range(10):
    time.sleep(3)
    status_response = requests.get(f"{BASE_URL}/api/sessions/{session_id}")
    status = status_response.json()
    
    print(f"Step {status['current_step']}/6 - Status: {status['status']}")
    
    if status['status'] == 'complete':
        print("\n✅ Agent Created Successfully!")
        print(f"Output: {status.get('output_directory')}")
        break
    elif status['status'] == 'error':
        print(f"\n❌ Error: {status.get('error')}")
        break

# Test 4: Get agent config
if status['status'] == 'complete':
    print("\n4. Getting Agent Config...")
    config_response = requests.get(f"{BASE_URL}/api/agents/{session_id}/config")
    config = config_response.json()
    print(f"Project: {config.get('project_name')}")
    print(f"Agents: {list(config.get('agents', {}).keys())}")

print("\n" + "=" * 80)
