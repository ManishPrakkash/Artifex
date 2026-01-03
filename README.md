# 🤖 Artifex - AI Agent Development Kit

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?logo=google&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)

**Artifex** is a comprehensive AI agent development platform that enables users to create, configure, and deploy intelligent agents across 11 specialized domains. Built with Google's Gemini AI and powered by Firebase, Artifex provides an intuitive interface for building both simple and complex multi-agent systems.

---

## ✨ Overview

Artifex revolutionizes AI agent creation by combining:
- 🎯 **Domain-Intelligent Matching** - Automatically maps user requirements to 11 specialized domains
- 🧠 **Dynamic Node Generation** - Creates custom agent components based on specific user needs
- 📊 **Visual Agent Architecture** - Interactive graph visualization of agent structure
- 🔥 **Firebase Integration** - Complete authentication and real-time capabilities
- 🚀 **One-Click Deployment** - Generate production-ready agent code instantly

### Key Capabilities
- ✅ **70+ Entity Recognition Patterns** - Understands flights, hotels, employees, tasks, budgets, and more
- ✅ **26 Action Pattern Detection** - Recognizes tracking, managing, analyzing, predicting, and other operations
- ✅ **Smart Node Selection** - Shows only the 3-6 most relevant components for your use case
- ✅ **Multi-Domain Support** - Handles everything from travel planning to code development
- ✅ **Custom Agent Generation** - Creates tailored solutions for any business need

---

## 🏗️ Architecture

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Landing    │  │    Chat      │  │    Graph     │     │
│  │     Page     │  │  Interface   │  │  Visualizer  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                │
│                     ┌──────▼──────┐                         │
│                     │   Domain    │                         │
│                     │   Matcher   │◄──Domain Registry JSON  │
│                     └──────┬──────┘                         │
└────────────────────────────┼────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Agent Config   │
                    │   Generator     │
                    └────────┬────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│              Backend (Meta-Agent System)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Orchestrator│  │  Sub-Agents  │  │   Builder    │     │
│  │              │──│  - Architect │──│   Agent      │     │
│  │              │  │  - Prompt    │  │              │     │
│  │              │  │  - Builder   │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Gemini AI     │
                    │   (2.0 Flash)   │
                    └─────────────────┘
```

### Process Flow & Sequence

1. **User Input** → Chat interface receives natural language request
2. **Domain Matching** → AI analyzes prompt and matches to best domain (11 options)
3. **Custom Node Extraction** → System detects entities and actions from prompt
4. **Relevance Scoring** → Nodes ranked by relevance to user requirements
5. **Config Generation** → Creates AgentProjectConfig with tools and sub-agents
6. **Graph Visualization** → Displays interactive agent architecture
7. **Code Generation** → Produces deployable Python agent code
8. **Download & Deploy** → User receives ready-to-run agent package

---

## 🚀 Features

### Backend (Meta-Agent System)

#### 🎯 Intelligent Domain Matching
- **11 Specialized Domains**: Management, Finance, Medical, Monitoring, Social, Research, Development, Education, Prediction, Travel, Generic
- **Smart Keyword Scoring**: Multi-word phrase detection, exact matches, partial matches
- **Domain Preference Logic**: Avoids generic fallback when specific domains match
- **Comprehensive Logging**: See exactly how domains are matched

#### 🎨 Dynamic Node Generation
- **Entity Detection**: Recognizes 70+ business entities (flights, employees, budgets, etc.)
- **Action Recognition**: Identifies 26 action types (tracking, managing, analyzing, etc.)
- **Automatic Combination**: Creates nodes by combining actions + entities
- **Relevance Filtering**: Shows only 3-6 most relevant components

#### 🔧 Agent Configuration
- **Custom Tools**: Generate Python functions based on requirements
- **Sub-Agent Creation**: Automatically creates specialized sub-agents
- **Dependency Management**: Handles Python package requirements
- **Environment Setup**: Configures API keys and environment variables

### Frontend (Web Interface)

#### 🎨 Modern UI/UX
- **Dark Theme**: Professional dark mode interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **TailwindCSS**: Beautiful, customizable styling
- **Smooth Animations**: Polished user experience

#### 🔐 Authentication
- **Firebase Auth**: Secure user authentication
- **Google OAuth**: One-click sign-in with Google
- **Email/Password**: Traditional authentication option
- **User Profiles**: Personalized agent history

#### 💬 Chat Interface
- **Natural Language Input**: Describe agents in plain English
- **Real-time Processing**: Instant feedback and responses
- **Agent History**: Save and revisit created agents
- **Gemini Integration**: Powered by Google's latest AI

#### 📊 Visual Graph
- **Interactive Nodes**: Click to view agent details
- **Hierarchical Layout**: Clear parent-child relationships
- **Real-time Updates**: Graph updates as configuration changes
- **Export Options**: Download graph as image

#### ⚙️ Configuration Editor
- **Agent Settings**: Modify agent properties and instructions
- **Tool Management**: Add, edit, or remove tools
- **Code Preview**: View generated Python code
- **Live Validation**: Real-time error checking

---

## 🌐 Supported Domains

### 1️⃣ Management & Operations
**Focus**: Business management and operational workflows

**Capabilities**:
- Employee Management - Manage employee data, records, and lifecycle
- Project Management - Track projects, milestones, and deliverables
- Task Management - Organize and assign tasks to team members
- Inventory Management - Track stock, supplies, and assets
- Workflow Automation - Automate business processes and approvals
- Resource Planning - Plan and allocate resources efficiently
- Performance Tracking - Monitor KPIs and performance metrics

**Keywords**: employee, project, task, inventory, workflow, resource, scheduling, payroll, performance, management, operations, team, staff, organization, hr, human resource

---

### 2️⃣ Finance & Prediction
**Focus**: Financial analysis, forecasting, and risk management

**Capabilities**:
- Expense Tracking - Monitor and categorize expenses
- Budgeting - Create and manage budgets
- Financial Analysis - Analyze financial data and trends
- Revenue Forecasting - Predict future revenue streams
- Risk Assessment - Evaluate financial risks and exposure
- Fraud Detection - Identify suspicious financial activities
- Pricing Optimization - Optimize product and service pricing

**Keywords**: expense, budget, financial, revenue, forecast, cost, risk, fraud, investment, pricing, finance, money, accounting, profit, loss, prediction, analytics

---

### 3️⃣ Medical & Health ⚕️
**Focus**: Health monitoring, fitness tracking, and wellness support (non-diagnostic)

**Capabilities**:
- Symptom Analysis - Log and track health symptoms (informational only)
- BMI Calculation - Calculate and track body mass index
- Fitness Tracking - Monitor exercise and fitness goals
- Diet Planning - Create meal plans and nutrition guides
- Health Monitoring - Track vital signs and health metrics
- Mental Health Support - Provide wellness and mindfulness resources

**Keywords**: health, medical, symptom, bmi, fitness, diet, patient, mental health, wellness, healthcare, diagnosis, treatment, nutrition, exercise, doctor, hospital

⚠️ **Disclaimer**: This agent provides informational support only and is not a substitute for professional medical advice.

---

### 4️⃣ Monitoring & Observability
**Focus**: System monitoring, alerting, and performance tracking

**Capabilities**:
- System Monitoring - Monitor system health and status
- Log Analysis - Parse and analyze system logs
- Uptime Tracking - Track service availability and uptime
- Alerting - Configure and manage alerts
- Anomaly Detection - Detect unusual patterns in metrics
- Performance Metrics - Collect and analyze performance data

**Keywords**: monitoring, server, uptime, logs, alerts, anomaly, performance, metrics, observability, devops, infrastructure, health check, status, availability

---

### 5️⃣ Social & Communication
**Focus**: Social media management, content moderation, and communication tools

**Capabilities**:
- Chat Assistant - Conversational AI for customer support
- Social Media Management - Manage social media posts and engagement
- Content Moderation - Review and moderate user-generated content
- Sentiment Analysis - Analyze sentiment in text and comments
- Community Management - Engage with and manage communities
- Email Assistant - Draft and manage email communications

**Keywords**: chat, social media, content, moderation, sentiment, community, notification, email, communication, messaging, twitter, facebook, instagram, post, engagement

---

### 6️⃣ Research & Analysis
**Focus**: Data analysis, market research, and document processing

**Capabilities**:
- Data Analysis - Analyze datasets and extract insights
- Market Research - Research market trends and competitors
- Trend Analysis - Identify and analyze trends over time
- Document Analysis - Extract information from documents
- Summarization - Create summaries of long content
- Comparison Analysis - Compare multiple options or datasets

**Keywords**: data, research, market, trend, analysis, academic, document, summarization, comparison, study, survey, statistics, insights, report

---

### 7️⃣ Development & Code
**Focus**: Software development, code review, and DevOps automation

**Capabilities**:
- Code Generation - Generate code from requirements
- Code Review - Review code for quality and issues
- Bug Detection - Identify bugs and potential issues
- Documentation Generation - Generate technical documentation
- API Testing - Test and validate APIs
- DevOps Automation - Automate deployment and operations

**Keywords**: code, development, programming, bug, documentation, api, devops, deployment, testing, review, git, software, build, ci/cd, automation

---

### 8️⃣ Education & Learning
**Focus**: Educational tools, tutoring, and learning management

**Capabilities**:
- Tutoring - Provide personalized tutoring assistance
- Quiz Generation - Create quizzes and assessments
- Curriculum Planning - Design learning curricula
- Concept Explanation - Explain complex concepts simply
- Assessment Grading - Grade assignments and provide feedback
- Learning Tracker - Track learning progress and goals

**Keywords**: education, learning, tutoring, quiz, curriculum, teaching, student, assessment, grading, course, training, knowledge, study, exam

---

### 9️⃣ Prediction & Intelligence
**Focus**: Predictive analytics, forecasting, and decision support

**Capabilities**:
- Behavior Prediction - Predict user behavior patterns
- Demand Forecasting - Forecast product or service demand
- User Intent Detection - Detect and interpret user intentions
- Recommendation Engine - Generate personalized recommendations
- Decision Support - Provide data-driven decision support
- Scenario Simulation - Simulate different scenarios and outcomes

**Keywords**: prediction, forecasting, intelligence, behavior, demand, recommendation, decision, scenario, ai, ml, machine learning, intent, pattern, analytics

---

### 🔟 Travel & Tourism
**Focus**: Travel planning, booking assistance, and trip management

**Capabilities**:
- Destination Research - Research and recommend travel destinations
- Itinerary Planning - Create detailed travel itineraries
- Flight Search - Search and compare flight options
- Hotel Booking - Find and book accommodations
- Activity Recommendations - Suggest tourist activities and attractions
- Budget Calculator - Calculate and manage travel budgets
- Travel Documentation - Assist with visa and travel documents

**Keywords**: travel, trip, vacation, tourism, destination, flight, hotel, booking, itinerary, tour, journey, adventure, holiday, sightseeing, accommodation, transport, visa, tourist, traveler, planner, guide, explore

---

### 1️⃣1️⃣ Generic / Custom
**Focus**: General-purpose and custom workflow agents

**Capabilities**:
- General Assistant - Multi-purpose AI assistant
- Multi-Domain Agent - Handle tasks across multiple domains
- Custom Workflow - Create custom workflows
- Task Coordinator - Coordinate complex multi-step tasks
- Information Retrieval - Search and retrieve information

**Keywords**: general, assistant, custom, multi, domain, experimental, generic, versatile, flexible, adaptable, universal

ℹ️ **Note**: Fallback domain when no specific match is found

---

## 📁 Project Structure

```
Artifex/
├── 📂 agent_generator_with_config/    # Backend agent generation system
│   ├── agent.py                       # Core agent implementation
│   ├── code_generator.py              # Python code generation
│   ├── config_schema.py               # Configuration schemas
│   ├── model_config.py                # Model configurations
│   ├── requirements.txt               # Python dependencies
│   ├── 📂 backend/                    # API backend
│   │   ├── api.py                     # FastAPI endpoints
│   │   ├── render.yaml                # Deployment config
│   │   └── requirements.txt           # API dependencies
│   ├── 📂 meta_agent/                 # Meta-agent orchestration
│   │   ├── orchestrator.py            # Main orchestrator
│   │   ├── prompts.py                 # AI prompts
│   │   └── 📂 sub_agents/             # Specialized sub-agents
│   │       ├── agent_builder.py       # Agent builder
│   │       ├── architecture_planner.py # Architecture designer
│   │       └── prompt_builder.py      # Prompt generator
│   └── 📂 fixed_agents/               # Pre-built agent templates
│
├── 📂 frontend/                       # Next.js web interface
│   ├── 📂 app/                        # Next.js app directory
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Home page
│   │   └── globals.css                # Global styles
│   ├── 📂 components/                 # React components
│   │   ├── agent-chat.tsx             # Chat interface
│   │   ├── agent-config.tsx           # Configuration editor
│   │   ├── agent-graph.tsx            # Graph visualization
│   │   ├── auth-modal.tsx             # Authentication UI
│   │   ├── landing-page.tsx           # Landing page
│   │   └── 📂 ui/                     # UI components (shadcn)
│   ├── 📂 lib/                        # Utility libraries
│   │   ├── agent-api.ts               # Agent API client
│   │   ├── domain-matcher.ts          # Domain matching logic
│   │   ├── domain-registry.json       # Domain definitions
│   │   ├── agent-name-extractor.ts    # Name extraction
│   │   ├── firebase.ts                # Firebase config
│   │   └── gemini-chat.ts             # Gemini AI integration
│   ├── 📂 contexts/                   # React contexts
│   │   ├── agent-context.tsx          # Agent state
│   │   └── auth-context.tsx           # Auth state
│   ├── package.json                   # Node dependencies
│   ├── next.config.mjs                # Next.js config
│   └── tailwind.config.ts             # Tailwind config
│
└── README.md                          # This file
```

---

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (3.9 or higher)
- **pnpm** (recommended) or npm
- **Firebase Account** (for authentication)
- **Google AI Studio API Key** (for Gemini)

### Backend Setup

1. **Navigate to backend directory**
```bash
cd agent_generator_with_config
```

2. **Create virtual environment**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
# Create .env file
echo "GOOGLE_API_KEY=your_gemini_api_key" > .env
```

5. **Run the backend API**
```bash
cd backend
uvicorn api:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
pnpm install
# or
npm install
```

3. **Set up Firebase**
- Create a Firebase project at [firebase.google.com](https://firebase.google.com)
- Enable Authentication (Google and Email/Password)
- Enable Firestore Database
- Copy your Firebase config to `frontend/lib/firebase.ts`

4. **Set up environment variables**
```bash
# Create .env.local file
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. **Run the development server**
```bash
pnpm dev
# or
npm run dev
```

The app will be available at `http://localhost:3000`

---

## 💡 Usage Examples

### Backend (Python API)

#### Simple Agent Creation

```python
from agent_generator_with_config.code_generator import generate_agent_code

# Define agent configuration
config = {
    "project_name": "Travel Planner",
    "description": "AI agent for planning trips and booking travel",
    "agents": {
        "main_agent": {
            "name": "Travel Planner",
            "type": "llm_agent",
            "model": "gemini-2.0-flash",
            "tools": ["flight_search", "hotel_booking"]
        }
    }
}

# Generate code
code = generate_agent_code(config)
print(code)
```

#### Complex Multi-Agent System

```python
config = {
    "project_name": "Employee Management System",
    "agents": {
        "main_agent": {
            "name": "HR Manager",
            "type": "llm_agent",
            "sub_agents": ["payroll_agent", "performance_agent"]
        },
        "payroll_agent": {
            "name": "Payroll Processor",
            "type": "sequential_agent",
            "tools": ["calculate_salary", "process_deductions"]
        },
        "performance_agent": {
            "name": "Performance Tracker",
            "type": "llm_agent",
            "tools": ["track_kpi", "generate_report"]
        }
    }
}
```

### Frontend (Web Interface)

1. **Sign in** with Google or Email/Password
2. **Describe your agent** in natural language:
   ```
   "Create a trip planner to search flights and book hotels"
   ```
3. **Review the graph** - See the agent architecture visualized
4. **Configure settings** - Adjust agent properties and tools
5. **Download code** - Get production-ready Python code
6. **Deploy** - Run the agent in your environment

---

## 🤖 Supported Agent Types

| Agent Type | Description | Use Case |
|------------|-------------|----------|
| **llm_agent** | Standard LLM-powered agent | General tasks, conversations, analysis |
| **sequential_agent** | Executes tasks in sequence | Workflows, pipelines, step-by-step processes |
| **parallel_agent** | Executes tasks concurrently | Data processing, batch operations |
| **loop_agent** | Iterates until condition met | Monitoring, polling, optimization |

---

## 🔧 Available Tools

### Builtin Tools
- **google_search** - Search the web for information
- **load_memory** - Access conversation history and context
- **url_context** - Extract content from URLs
- **load_artifacts** - Retrieve saved files and data

### Custom Tools
Custom tools are automatically generated based on your agent's domain and requirements:

**Example (Travel Domain)**:
```python
def flight_search(origin: str, destination: str, date: str) -> dict:
    """Search for flights between locations"""
    return {"flights": [...]}

def hotel_booking(location: str, check_in: str, check_out: str) -> dict:
    """Find and book hotels"""
    return {"hotels": [...]}
```

**Example (Finance Domain)**:
```python
def expense_tracking(amount: float, category: str, date: str) -> dict:
    """Track expenses by category"""
    return {"expense_id": "...", "total": ...}

def budget_analysis(period: str) -> dict:
    """Analyze budget vs actual spending"""
    return {"budget": ..., "actual": ..., "variance": ...}
```

---

## 🎯 Technology Stack

### Frontend
- ⚛️ **Next.js 15** - React framework with App Router
- 🎨 **TypeScript** - Type-safe development
- 💅 **TailwindCSS** - Utility-first CSS framework
- 🧩 **shadcn/ui** - Beautiful UI components
- 📊 **ReactFlow** - Graph visualization
- 🔥 **Firebase** - Authentication & Database
- 🤖 **Gemini AI** - Google's latest language model

### Backend
- 🐍 **Python 3.9+** - Core programming language
- ⚡ **FastAPI** - Modern web framework
- 🧠 **Google ADK** - Agent Development Kit
- 🤖 **Gemini 2.0 Flash** - AI model
- 📝 **Pydantic** - Data validation
- 🔧 **python-dotenv** - Environment management

### Tools & Services
- 🔐 **Firebase Authentication** - User management
- 💾 **Firestore** - NoSQL database
- 🌐 **Google AI Studio** - AI model access
- 📦 **pnpm** - Fast package manager
- 🎨 **Lucide Icons** - Icon library

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
pnpm build
vercel deploy
```

### Backend (Render/Railway)
```bash
# Use render.yaml for automatic deployment
git push origin main
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Google** - For Gemini AI and Firebase
- **Vercel** - For Next.js framework
- **shadcn** - For beautiful UI components
- **ReactFlow** - For graph visualization
- **Community** - For feedback and contributions

---

## 📧 Contact

**Repository**: [github.com/ManishPrakkash/Artifex](https://github.com/ManishPrakkash/Artifex)

**Issues**: [GitHub Issues](https://github.com/ManishPrakkash/Artifex/issues)

---

<div align="center">

**Made with ❤️ using Google Gemini AI**

⭐ Star this repo if you find it useful!

</div>
