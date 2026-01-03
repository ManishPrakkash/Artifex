# 🤖 Artifex - Agent Builder

**AI-Powered Agent Creation Platform**  
Build, deploy, and manage custom AI agents through an intuitive interface or programmatic API.

> 🎉 **NEW**: Frontend now features **dynamic agent naming**! Instead of showing "Customer Support Agent" everywhere, it intelligently extracts the agent type from your description (e.g., "BMI Calculator Agent", "Task Manager Agent") using Gemini AI. [Learn more →](../QUICKSTART_DYNAMIC_NAMES.md)

---

## 🌟 Overview

Artifex is a full-stack platform for creating custom AI agents from natural language descriptions. It features:

- 🎨 **Next.js Frontend** - Beautiful UI for agent creation and management
- ⚡ **FastAPI Backend** - Production-ready REST API with WebSocket support
- 🧠 **Meta-Agent System** - AI-powered agent design and generation
- 🔥 **Firebase Integration** - Session management and data persistence
- 📦 **Auto-Generation** - Turn descriptions into working code automatically

---

## 🏗️ Architecture

```
Artifex/
├── frontend/                   # Next.js + React + TypeScript
│   ├── app/                   # Next.js app router
│   ├── components/            # React components (UI, chat, editor)
│   └── lib/                   # API clients and utilities
│
├── agent_generator_with_config/
│   ├── backend/               # FastAPI server
│   │   ├── api.py            # Main API routes
│   │   └── requirements.txt   # Backend dependencies
│   │
│   ├── meta_agent/            # AI agent orchestration
│   │   ├── orchestrator.py   # Meta-agent coordinator
│   │   └── sub_agents/       # Specialized sub-agents
│   │
│   └── my_generated_agents/   # Your custom agents
│
└── server/                    # Additional services
```

---

## 🚀 Quick Start

### **Prerequisites**
- Python 3.8+
- Node.js 18+
- Google API Key ([Get one here](https://aistudio.google.com/app/apikey))
- Firebase Project (optional, for persistence)

### **1. Clone & Setup**
```bash
git clone https://github.com/ManishPrakkash/Artifex.git
cd Artifex
```

### **2. Backend Setup**
```bash
cd agent_generator_with_config

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY
```

### **3. Frontend Setup**
```bash
cd ../frontend

# Install dependencies
npm install
# or
pnpm install

# Configure environment (optional)
cp .env.example .env.local
```

### **4. Run the Platform**

**Backend Server:**
```bash
cd agent_generator_with_config/backend
uvicorn api:app --reload --port 8000
```

**Frontend Development:**
```bash
cd frontend
npm run dev
# Open http://localhost:3000
```

---

## 📡 Backend API

### **Base URL**
- Local: `http://localhost:8000`
- Production: Your Render deployment URL

### **Key Endpoints**

#### **Health Check**
```bash
GET /health
```

#### **Generate Agent**
```bash
POST /api/generate
Content-Type: application/json

{
  "description": "Create a task manager that can create, track, and prioritize tasks",
  "session_id": "unique-session-id"
}
```

#### **Stream Agent Generation**
```bash
POST /api/generate/stream
# Server-Sent Events (SSE) stream
```

#### **WebSocket Chat**
```bash
WS /ws/chat/{session_id}
```

#### **List Generated Agents**
```bash
GET /api/agents
```

#### **Download Agent**
```bash
GET /api/agents/{agent_name}/download
```

### **API Features**

- ✅ RESTful endpoints
- ✅ WebSocket support for real-time updates
- ✅ Server-Sent Events (SSE) for streaming
- ✅ CORS enabled for frontend integration
- ✅ Firebase session storage
- ✅ Background task processing
- ✅ File downloads (ZIP archives)
- ✅ Health monitoring

### **Backend Environment Variables**

```bash
# .env in agent_generator_with_config/
GOOGLE_API_KEY=your-google-api-key-here
DEFAULT_MODEL=gemini-2.0-flash-exp
FIREBASE_SERVICE_ACCOUNT_JSON=your-firebase-credentials-json
```

---

## 🎨 Frontend

### **Technology Stack**

- **Framework:** Next.js 14 (App Router)
- **UI Components:** Radix UI + shadcn/ui
- **Styling:** Tailwind CSS
- **Rich Text:** TipTap Editor
- **Forms:** React Hook Form + Zod
- **State:** React Hooks
- **API Client:** Fetch API

### **Key Features**

- 🎨 Modern, responsive design
- 💬 Real-time chat interface
- 📝 Rich text editor for agent descriptions
- 📊 Visual agent graph/flowchart
- 💻 Code editor with syntax highlighting
- 🔄 Live preview of generated agents
- 📱 Mobile-friendly UI
- 🌗 Dark mode support (via theme-provider)
- ✨ **Dynamic agent naming** - AI extracts agent names from descriptions

### **Dynamic Agent Naming** ✨

The frontend now intelligently extracts agent names from your description using Gemini AI:

**Examples**:
- Input: "I need a BMI calculator" → Shows: **"BMI Calculator Agent"**
- Input: "Create a task manager" → Shows: **"Task Manager Agent"**  
- Input: "Build a calculator" → Shows: **"Calculator Agent"**

**Setup** (optional, works without API key too):
```bash
# frontend/.env.local
NEXT_PUBLIC_GOOGLE_API_KEY=your-google-api-key
```

[Full guide →](../QUICKSTART_DYNAMIC_NAMES.md) | [Documentation →](../frontend/DYNAMIC_AGENT_NAMES.md)

### **Frontend Environment Variables**

```bash
# .env.local in frontend/
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

### **Build & Deploy**

```bash
cd frontend

# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

---

## 🛠️ CLI Tools (Backend)

For programmatic agent creation without the UI:

### **Available Commands**

| Command | Purpose |
|---------|---------|
| `python test_api_key.py` | Verify API key works |
| `python create_custom_agent.py` | **Create custom agent (AI-powered)** ⭐ |
| `python generate_test_agent.py` | Generate 3 test agents |
| `python test_agent.py` | Test any agent interactively |
| `python test_agent.py "question"` | Test with single question |
| `python test_configs.py` | Validate configurations |

### **CLI Examples**

**Create Task Manager:**
```bash
python create_custom_agent.py

Description: Create a task management agent that can:
- Create and track tasks
- Set priorities
- Mark tasks complete
- List all tasks
```

**Test Generated Agent:**
```bash
python test_agent.py
# Interactive mode with chat interface
```

---

## 🧠 Meta-Agent System

The Meta-Agent orchestrates specialized sub-agents to design and build your custom agent:

### **Sub-Agents**

1. **Requirements Analyzer** - Analyzes natural language description
2. **Architecture Planner** - Designs agent structure
3. **Prompt Builder** - Creates agent instructions
4. **Tool Builder** - Generates custom tools
5. **Agent Builder** - Assembles final agent code

### **Generation Flow**

```
User Description
    ↓
Requirements Analysis
    ↓
Architecture Design
    ↓
Tool Generation
    ↓
Prompt Engineering
    ↓
Code Generation
    ↓
Working Agent ✨
```

---

## 📦 Generated Agent Structure

Each generated agent includes:

```
my_agent_name/
├── agent.py              # Main agent code
├── __init__.py           # Package initialization
├── requirements.txt      # Python dependencies
├── README.md            # Agent documentation
├── .env.example         # Environment template
└── generation_summary.json  # Metadata
```

---

## 🔧 Configuration

### **Agent Configuration Format**

```json
{
  "project_name": "my_agent",
  "description": "What the agent does",
  "version": "1.0.0",
  "main_agent": "agent_name",
  "agents": {
    "agent_name": {
      "name": "agent_name",
      "type": "llm_agent",
      "model": "gemini-2.0-flash-exp",
      "instruction": "Agent instructions...",
      "tools": [],
      "sub_agents": [],
      "config": {}
    }
  },
  "tools": {},
  "requirements": ["google-genai>=1.0.0"],
  "environment_variables": {
    "GOOGLE_API_KEY": "required"
  }
}
```

---

## 🚢 Deployment

### **Backend (Render)**

1. Create new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure build settings:
   ```
   Build Command: cd agent_generator_with_config && pip install -r backend/requirements.txt
   Start Command: cd agent_generator_with_config/backend && uvicorn api:app --host 0.0.0.0 --port $PORT
   ```
4. Add environment variables:
   - `GOOGLE_API_KEY`
   - `FIREBASE_SERVICE_ACCOUNT_JSON`
5. Deploy!

### **Frontend (Vercel)**

1. Import project on [Vercel](https://vercel.com)
2. Configure:
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   ```
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
4. Deploy!

---

## 🔥 Firebase Setup (Optional)

For session persistence and data storage:

1. Create Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Generate service account key (Settings → Service Accounts)
4. Add credentials to backend `.env` as JSON string
5. Configure frontend with Firebase config

---

## 🧪 Testing

### **Backend Tests**
```bash
cd agent_generator_with_config/backend
python test_api.py          # Test basic endpoints
python test_api_complete.py # Full integration tests
```

### **Frontend Tests**
```bash
cd frontend
npm run test    # Run tests (if configured)
npm run lint    # Check code quality
```

---

## ⚠️ Troubleshooting

### **Backend Issues**

**429 Rate Limit Error:**
- Wait 1-2 hours for quota reset
- Get new API key
- Check usage: [Google AI Studio](https://ai.dev/usage?tab=rate-limit)

**Firebase Connection:**
- Verify `FIREBASE_SERVICE_ACCOUNT_JSON` is valid JSON
- Check Firestore rules allow read/write
- API works without Firebase (uses in-memory storage)

**Model Not Found:**
- Using `gemini-2.0-flash-exp` (recommended)
- Alternative: `gemini-1.5-pro`

### **Frontend Issues**

**API Connection Failed:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend server is running
- Verify CORS is enabled on backend

**Build Errors:**
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules`: `rm -rf node_modules`
- Reinstall: `npm install`

---

## 💡 Use Cases

- 🤖 **Chatbots** - Customer support, FAQ bots
- 📊 **Data Analyzers** - Parse and analyze data
- ✅ **Task Managers** - TODO lists, project tracking
- 🔍 **Research Assistants** - Information gathering
- 📝 **Content Generators** - Writing, summarization
- 🎯 **Decision Engines** - Rule-based decision making
- 🔧 **Automation Tools** - Workflow automation

---

## 📚 Documentation

- [API Documentation](agent_generator_with_config/backend/README.md)
- [Frontend Guide](frontend/README.md)
- [Agent Configuration Schema](agent_generator_with_config/config_schema.py)
- [Meta-Agent System](agent_generator_with_config/meta_agent/README.md)

---

## 🛠️ Tech Stack

**Backend:**
- FastAPI
- Python 3.8+
- Google Generative AI (Gemini)
- Firebase Admin SDK
- Uvicorn (ASGI server)

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Radix UI
- shadcn/ui

**Infrastructure:**
- Render (Backend)
- Vercel (Frontend)
- Firebase (Database)

---

## ✅ Features

**Backend:**
- ✅ RESTful API
- ✅ WebSocket support
- ✅ SSE streaming
- ✅ Background tasks
- ✅ File downloads
- ✅ Firebase integration
- ✅ Production-ready

**Frontend:**
- ✅ Modern UI/UX
- ✅ Real-time chat
- ✅ Code editor
- ✅ Visual agent builder
- ✅ Responsive design
- ✅ Dark mode
- ✅ Mobile-friendly

**Agent Generation:**
- ✅ Natural language input
- ✅ AI-powered design
- ✅ Auto code generation
- ✅ Multiple agent types
- ✅ Custom tools
- ✅ Ready-to-deploy

---

## 🎯 Getting Started Workflow

```
1. Setup backend + frontend
2. Get Google API key
3. Configure .env files
4. Start both servers
5. Open http://localhost:3000
6. Describe your agent
7. Watch it generate! ✨
```

---

## 📄 License

Copyright 2025 Google LLC - Apache License 2.0

---

## 🎉 Status

✅ **Backend:** Production-ready FastAPI server  
✅ **Frontend:** Modern Next.js interface  
✅ **Meta-Agent:** AI-powered generation  
✅ **Firebase:** Session persistence  
✅ **Deployed:** Ready for Render + Vercel  

---

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## 📞 Support

- 📧 Issues: [GitHub Issues](https://github.com/ManishPrakkash/Artifex/issues)
- 📖 Docs: See `/docs` folder
- 💬 Discussions: GitHub Discussions

---

**Start building AI agents now:**

```bash
# Backend
cd agent_generator_with_config/backend && uvicorn api:app --reload

# Frontend
cd frontend && npm run dev
```

🚀 **Welcome to Artifex - Build Smarter Agents!**
