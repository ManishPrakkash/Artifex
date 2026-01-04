# 🤖 Artifex - AgentBuilder

Artifex is a next-generation AI agent builder that converts natural language requirements into complete, executable multi-agent systems using Google ADK. This project provides both a powerful backend meta-agent system and a modern web interface for creating custom AI agents.


## 🌟 Overview

ArtifexAgentBuilder transforms the complex process of AI agent development into an intuitive, conversation-driven experience. Simply describe what you want your agent to do, and the system will:

- Analyze your requirements
- Design the optimal agent architecture
- Generate complete, production-ready Python code
- Provide a modern web interface for interaction

## 🏗️ Architecture

### System Architecture Overview

```mermaid
graph LR
    %% =========================
    %% ARTIFEX – Architecture
    %% =========================
    Title["🎨 **ARTIFEX**<br/>AI Agent Builder Platform"]:::title

    %% -------- Frontend --------
    subgraph FE["🌐 Frontend (Next.js)"]
        UI["🏠 Landing"]
        Chat["💬 Chat"]
        Graph["📊 Graph"]
        Editor["💻 Editor"]
        Config["⚙️ Config"]
    end

    %% -------- API + Meta --------
    subgraph API_META["🔌 API & Meta Layer"]
        REST["🌍 FastAPI"]
        WS["⚡ WebSocket"]
        Orchestrator["🎯 Orchestrator<br/>Google ADK"]
    end

    %% -------- Agents + Core --------
    subgraph AGENT_CORE["🧠 Agents & Core Services"]
        Req["📝 Requirements"]
        Arch["🏗️ Architecture"]
        Build["🔧 Agent Builder"]
        Tools["🛠️ Tool Builder"]
        Merge["🔄 Config Merger"]
        CodeGen["📦 Code Generator"]
        Validate["✅ Validator"]
    end

    %% -------- Data --------
    subgraph DATA["💾 Data Layer"]
        DB["🗃️ Sessions"]
        Templates["📋 Templates"]
        FS["📁 File Storage"]
    end

    %% -------- Output --------
    subgraph OUT["🎁 Generated Output"]
        Agent["🐍 agent.py"]
        ToolFile["🔨 tools.py"]
        Deps["📦 requirements.txt"]
        Docs["📖 README.md"]
    end

    %% -------- Flow --------
    Title --> UI
    UI --> Chat --> REST --> Orchestrator

    Orchestrator --> Req --> Arch --> Build --> Tools --> Merge
    Merge --> CodeGen --> Validate

    Validate --> Agent
    Validate --> ToolFile
    Validate --> Deps
    Validate --> Docs

    Merge --> WS
    WS --> Graph
    WS --> Editor
    WS --> Config

    DB --> Merge
    Templates --> CodeGen
    Agent --> FS

    %% -------- Styles --------
    classDef title fill:#0d1b2a,color:#ffffff,stroke:#0d1b2a,stroke-width:2px

    classDef frontend fill:#e3f2fd,stroke:#1e88e5,color:#0d1b2a
    classDef api fill:#ede7f6,stroke:#5e35b1,color:#0d1b2a
    classDef core fill:#e8f0fe,stroke:#3949ab,color:#0d1b2a
    classDef data fill:#e0f2f1,stroke:#00796b,color:#0d1b2a
    classDef out fill:#fff3e0,stroke:#ef6c00,color:#0d1b2a

    class UI,Chat,Graph,Editor,Config frontend
    class REST,WS,Orchestrator api
    class Req,Arch,Build,Tools,Merge,CodeGen,Validate core
    class DB,Templates,FS data
    class Agent,ToolFile,Deps,Docs out
```

### Process Flow & Sequence

```mermaid
sequenceDiagram
    participant User
    participant Frontend as "Next.js Frontend"
    participant API as "REST API"
    participant Orchestrator as "Meta-Agent Orchestrator"
    participant ReqAnalyzer as "Requirements Analyzer"
    participant ArchPlanner as "Architecture Planner"
    participant AgentBuilder as "Agent Builder"
    participant ToolBuilder as "Tool Builder"
    participant CodeGen as "Code Generator"
    participant Output as "Generated Files"

    User->>Frontend: "Create a research agent with web search"
    Frontend->>API: POST /create-agent
    API->>Orchestrator: Natural language request
    
    Note over Orchestrator: Google ADK Meta-Agent System
    
    Orchestrator->>ReqAnalyzer: Analyze requirements
    ReqAnalyzer-->>Orchestrator: Structured requirements
    
    Orchestrator->>ArchPlanner: Design architecture
    ArchPlanner-->>Orchestrator: Agent structure plan
    
    loop For each agent in plan
        Orchestrator->>AgentBuilder: Create agent config
        AgentBuilder-->>Orchestrator: Agent configuration
    end
    
    loop For each tool needed
        Orchestrator->>ToolBuilder: Create custom tool
        ToolBuilder-->>Orchestrator: Tool implementation
    end
    
    Orchestrator->>CodeGen: Generate Python code
    CodeGen->>Output: Create agent.py, requirements.txt, README.md
    
    CodeGen-->>API: Generation complete + file paths
    API-->>Frontend: WebSocket update with progress
    Frontend-->>User: Visual graph + code preview
    
    Note over User,Output: Technologies Used:<br/>Frontend: Next.js, React, Tailwind CSS, ReactFlow<br/>Backend: Google ADK, Python, Pydantic<br/>API: FastAPI/Express, WebSocket<br/>Output: Complete Python ADK Project
```

## 🚀 Features

### Backend (Meta-Agent System)
- **🧠 Intelligent Analysis**: Natural language requirement extraction
- **🏛️ Architecture Design**: Multi-agent system planning
- **🔧 Custom Tool Creation**: Python function generation with proper error handling
- **📝 Complete Code Generation**: Production-ready agent projects
- **🔄 Session Management**: Persistent configuration throughout creation process
- **✅ Validation & Testing**: Ensures generated agents are functional

### Frontend (Web Interface)
- **💬 Interactive Chat**: Natural conversation with the meta-agent
- **🎨 Visual Agent Designer**: Drag-and-drop agent configuration
- **📊 Agent Graph Visualization**: Real-time architecture visualization
- **💻 Code Editor**: Syntax-highlighted code preview and editing
- **📱 Responsive Design**: Modern, mobile-friendly interface
- **🌙 Dark/Light Mode**: Customizable theme support

## 📁 Project Structure

```
Artifex/
├── agent_generator_with_config/     # Backend Meta-Agent System
│   ├── meta_agent/                  # Core meta-agent implementation
│   │   ├── agent.py                 # Main orchestrator agent
│   │   ├── sub_agents/              # Specialized sub-agents
│   │   ├── tools/                   # Configuration and generation tools
│   │   └── prompts.py               # Agent instruction templates
│   ├── config_schema.py             # Pydantic models for validation
│   ├── code_generator.py            # Config-to-code conversion
│   ├── generated_test_agents/       # Example generated agents
│   └── test_configs.py              # Sample configurations
└── frontend/                        # Next.js Web Application
    ├── app/                         # Next.js app router
    ├── components/                  # React components
    │   ├── agent-chat.tsx           # Chat interface
    │   ├── agent-config.tsx         # Configuration forms
    │   ├── agent-graph.tsx          # Visual graph display
    │   ├── code-editor.tsx          # Code editing interface
    │   └── ui/                      # Reusable UI components
    ├── lib/                         # Utility functions
    ├── types/                       # TypeScript definitions
    └── styles/                      # Global styles
```

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 18+
- pnpm (recommended) or npm

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd ArtifexAgentBuilder/agent_generator_with_config
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables (optional):**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys if needed
   ```

4. **Test the meta-agent:**
   ```bash
   python quick_start.py
   ```

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd ArtifexAgentBuilder/frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   pnpm install
   # or: npm install
   ```

3. **Start the development server:**
   ```bash
   pnpm dev
   # or: npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 🎯 Usage Examples

### Backend (Python API)

#### Simple Agent Creation
```python
from meta_agent import root_agent

# Describe your agent
request = """
Create a research assistant that can search the web, 
analyze web pages, and provide well-sourced answers.
"""

# Generate the agent
response = root_agent.run(request)
print(response)
```

#### Complex Multi-Agent System
```python
request = """
Create a customer service system with:
- Intent classification agent
- Product specialist agent  
- Order tracking agent
- Human escalation capability
"""

response = root_agent.run(request)
```

### Frontend (Web Interface)

1. **Open the web application** at `http://localhost:3000`
2. **Start a conversation** with the meta-agent in the chat interface
3. **Describe your agent** in natural language
4. **Review the generated configuration** in the visual graph
5. **Preview and edit code** in the integrated editor
6. **Download your agent** as a complete Python project

## 🔧 Supported Agent Types

- **🤖 LLM Agent**: Single AI agent with tools and custom prompts
- **🔄 Sequential Agent**: Runs sub-agents in ordered sequence
- **⚡ Parallel Agent**: Runs multiple sub-agents simultaneously
- **🔁 Loop Agent**: Repeats sub-agent execution until conditions are met

## 🛠️ Available Tools

### Builtin Tools
- `google_search` - Web search capabilities
- `url_context` - Load and analyze web pages
- `load_memory` - Access stored memories
- `preload_memory` - Load specific memories
- `load_artifacts` - Access saved artifacts
- `transfer_to_agent` - Call other agents
- `get_user_choice` - User interaction prompts
- `exit_loop` - Loop control mechanisms

### Custom Tools
- **Python Functions**: Generate custom tools with proper error handling
- **API Integrations**: Connect to external services and APIs
- **Data Processing**: Create pandas, numpy, and ML-based tools
- **File Operations**: Handle file I/O and data persistence

## 📊 Example Generated Agents

### Research Assistant
```json
{
  "agents": {
    "research_agent": {
      "type": "llm_agent",
      "tools": ["google_search", "url_context"],
      "instruction": "You are a research assistant..."
    }
  }
}
```

### E-commerce Support System
```json
{
  "agents": {
    "intent_classifier": {
      "type": "llm_agent",
      "tools": ["classify_intent"]
    },
    "product_specialist": {
      "type": "llm_agent", 
      "tools": ["product_search", "inventory_check"]
    },
    "orchestrator": {
      "type": "sequential_agent",
      "sub_agents": ["intent_classifier", "product_specialist"]
    }
  }
}
```

## 🔍 Development

### Running Tests
```bash
# Backend tests
cd agent_generator_with_config
python test_enhanced_features.py

# Frontend tests  
cd frontend
pnpm test
```

### Building for Production
```bash
# Frontend production build
cd frontend
pnpm build
pnpm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built on Google's Agent Development Kit (ADK)
- Frontend powered by Next.js, React, and Tailwind CSS
- UI components from Radix UI and shadcn/ui
- Code editing with TipTap editor

## 🔗 Links

- [Google ADK Documentation](https://developers.google.com/adk)
- [Next.js Documentation](https://nextjs.org/docs)
- [Project Repository](https://github.com/ManishPrakkash/Artifex)

---

**Made with ☕ for the AI agent development community** 