# 🎯 AGENT GENERATOR - QUICK COMMAND MENU

## 📍 Base Directory


---

## ✅ WORKING COMMANDS (Tested & Verified)

### 1️⃣ TEST API KEY
python test_api_key.py

### 2️⃣ GENERATE TEST AGENTS (3 agents)
python generate_test_agent.py

### 3️⃣ TEST ANY AGENT (Interactive)
python test_agent.py

### 4️⃣ TEST AGENT (Single Prompt)
python test_agent.py "Your question here"

### 5️⃣ CREATE CUSTOM AGENT (AI-Powered) ⭐ NEW!
python create_custom_agent.py

### 6️⃣ VALIDATE CONFIGURATIONS
python test_configs.py

### 7️⃣ TEST ADVANCED FEATURES
python test_enhanced_features.py

---

## 📁 AGENT LOCATIONS

generated_test_agents/        # 3 test agents
generated_agents/             # Custom agents (direct config)
my_generated_agents/          # AI-created agents (meta-agent)

---

## 🔧 CHANGE AGENT TO TEST

Edit: test_agent.py (line 20)
AGENT_PATH = "generated_test_agents/simple_test_agent"

Options:
- "generated_test_agents/simple_test_agent"
- "generated_test_agents/custom_tool_test_agent"
- "generated_test_agents/web_search_agent"
- "generated_agents/employee_leave_manager"
- "my_generated_agents/i_need_to_create_a_nutrition_t"
- "test_original_generator"

---

## 🎯 MOST USED COMMANDS

# Quick test
python test_api_key.py

# Generate agents
python generate_test_agent.py

# Test agent
python test_agent.py

# Create custom agent
cd meta_agent && python main.py simple

---

## ⚠️ CURRENT STATUS

✅ Backend: Working
✅ Generation: Working
✅ Testing: Working
⏰ API Limit: Wait 1-2 hours

---

## 🔑 ENVIRONMENT

File: .env
Required: GOOGLE_API_KEY=your-key-here
Get key: https://aistudio.google.com/app/apikey

---

## 📊 QUICK WORKFLOW

1. python test_api_key.py          # Verify API
2. python generate_test_agent.py   # Generate agents
3. python test_agent.py            # Test agent
4. cd meta_agent; python main.py simple  # Create custom

---

Copy this menu anywhere for quick reference! 🚀
