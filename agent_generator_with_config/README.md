# 🤖 Agent Generator with Config

AI-powered agent generation system that creates custom AI agents from natural language descriptions or configurations.

---

## 🚀 Quick Start

### **1. Setup**
```bash
# Install dependencies
pip install google-adk>=1.0.0

# Add API key to .env
GOOGLE_API_KEY=your-key-here
```

### **2. Create Custom Agent (AI-Powered)**
```bash
python create_custom_agent.py
```

### **3. Test Your Agent**
```bash
python test_agent.py
```

---

## 📋 Available Commands

| Command | Purpose |
|---------|---------|
| `python test_api_key.py` | Verify API key works |
| `python create_custom_agent.py` | **Create custom agent (AI-powered)** ⭐ |
| `python generate_test_agent.py` | Generate 3 test agents |
| `python test_agent.py` | Test any agent interactively |
| `python test_agent.py "question"` | Test with single question |
| `python test_configs.py` | Validate configurations |

---

## 🎯 How It Works

### **Method 1: AI-Powered (Recommended)**
```bash
python create_custom_agent.py
```

1. Describe your agent in natural language
2. AI designs the configuration
3. Code is generated automatically
4. Agent saved to `my_generated_agents/`

**Example:**
```
Description: Create a task manager that can create, track, and prioritize tasks

🤖 AI designs configuration
✅ Agent created in my_generated_agents/task_manager
```

### **Method 2: Manual Configuration**
```bash
python generate_test_agent.py
```

Edit the file to add your custom configuration, then run.

---

## 📁 Project Structure

```
agent_generator_with_config/
├── create_custom_agent.py    # ⭐ AI-powered agent creator
├── test_agent.py              # Universal agent tester
├── test_api_key.py            # API verification
├── code_generator.py          # Core generation engine
├── config_schema.py           # Configuration schemas
├── model_config.py            # Model settings
│
├── my_generated_agents/       # Your custom agents (AI-created)
├── generated_test_agents/     # Test agents
└── generated_agents/          # Manually configured agents
```

---

## 🧪 Testing Agents

### **Interactive Mode**
```bash
python test_agent.py
```

### **Single Question**
```bash
python test_agent.py "What can you do?"
```

### **Change Agent to Test**
Edit `test_agent.py` line 20:
```python
AGENT_PATH = "my_generated_agents/your_agent_name"
```

---

## 📊 Generated Agents

Each agent includes:
- `agent.py` - Main agent code
- `__init__.py` - Package initialization
- `requirements.txt` - Dependencies
- `README.md` - Documentation
- `.env.example` - Environment variables

---

## 🔧 Configuration

### **Environment Variables (.env)**
```bash
GOOGLE_API_KEY=your-api-key-here
DEFAULT_MODEL=gemini-pro
```

### **Get API Key**
https://aistudio.google.com/app/apikey

---

## 💡 Examples

### **Create Task Manager**
```bash
python create_custom_agent.py

Description: Create a task management agent that can:
- Create and track tasks
- Set priorities
- Mark tasks complete
- List all tasks
```

### **Create Chatbot**
```bash
python create_custom_agent.py

Description: Create a customer support chatbot that answers FAQs
```

### **Create Research Assistant**
```bash
python create_custom_agent.py

Description: Create a research assistant that can search and analyze information
```

---

## 🎓 Core Components

### **1. Code Generator (`code_generator.py`)**
Converts configurations into working Python agent code.

### **2. Config Schema (`config_schema.py`)**
Validates agent configurations.

### **3. Model Config (`model_config.py`)**
Manages Gemini model settings.

### **4. Custom Agent Creator (`create_custom_agent.py`)**
AI-powered agent design and generation.

---

## 📝 Agent Configuration Format

```python
{
    "project_name": "my_agent",
    "description": "What the agent does",
    "version": "1.0.0",
    "main_agent": "agent_name",
    
    "agents": {
        "agent_name": {
            "name": "agent_name",
            "type": "llm_agent",
            "model": "gemini-pro",
            "instruction": "Agent instructions...",
            "tools": [],
            "sub_agents": [],
            "config": {}
        }
    },
    
    "tools": {},
    "requirements": [],
    "environment_variables": {}
}
```

---

## ⚠️ Troubleshooting

### **429 Rate Limit Error**
- Wait 1-2 hours for quota reset
- Get new API key
- Check usage: https://ai.dev/usage?tab=rate-limit

### **API Key Invalid**
- Verify key in `.env` file
- Get new key: https://aistudio.google.com/app/apikey

### **Model Not Found**
- Using `gemini-pro` (stable)
- Alternative: `gemini-1.5-pro`

---

## 🔌 Next.js Integration

### **Backend API Route**
```javascript
// pages/api/chat.js
import { exec } from 'child_process';

export default async function handler(req, res) {
  const { prompt } = req.body;
  
  const { stdout } = await execAsync(
    `python test_agent.py "${prompt}"`
  );
  
  res.json({ response: stdout });
}
```

### **Frontend**
```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ prompt: message })
});
```

---

## ✅ Features

- ✅ AI-powered agent design
- ✅ Natural language input
- ✅ Automatic code generation
- ✅ Multiple agent types
- ✅ Custom tools support
- ✅ Environment variables
- ✅ Ready for production
- ✅ Next.js integration ready

---

## 📚 Documentation

- **COMMANDS.md** - Quick command reference
- **AGENT_LOCATIONS.md** - Where agents are stored
- **.env.example** - Environment variables template

---

## 🎯 Workflow

```
1. python test_api_key.py          # Verify API
2. python create_custom_agent.py   # Create agent
3. python test_agent.py            # Test agent
4. Integrate with your app         # Use it!
```

---

## 🛠️ Requirements

- Python 3.8+
- google-adk>=1.0.0
- Google API key (free tier works)

---

## 📄 License

Copyright 2025 Google LLC - Apache License 2.0

---

## 🎉 Status

✅ **Fully Working**  
✅ **Production Ready**  
✅ **5+ Agents Generated**  
✅ **AI-Powered Creation**

---

**Create your first agent now:**
```bash
python create_custom_agent.py
```

🚀 **Happy Agent Building!**
