import type { AgentProjectConfig, AgentConfig, ToolConfig } from "@/types/agent-config"

// Mock agent configuration data
const mockAgentConfig: AgentProjectConfig = {
    project_name: "Customer Support Agent",
    description: "An intelligent AI agent for handling customer support inquiries",
    version: "1.0.0",
    main_agent: "main_agent",
    agents: {
        main_agent: {
            name: "Main Support Agent",
            type: "llm_agent" as any,
            description: "Primary agent that handles customer inquiries and routes to specialized agents",
            model: "gemini-2.0-flash",
            instruction: "You are a helpful customer support agent. Be polite, professional, and assist customers with their inquiries. Route complex issues to specialized sub-agents when needed.",
            tools: ["google_search", "knowledge_base_search"],
            sub_agents: ["refund_agent", "technical_agent"],
            config: {},
        },
        refund_agent: {
            name: "Refund Processing Agent",
            type: "llm_agent" as any,
            description: "Handles refund and return requests",
            model: "gemini-2.0-flash",
            instruction: "You specialize in processing refunds and returns. Follow company policy and ensure customer satisfaction.",
            tools: ["process_refund", "check_order_status"],
            sub_agents: [],
            config: {},
        },
        technical_agent: {
            name: "Technical Support Agent",
            type: "llm_agent" as any,
            description: "Handles technical issues and troubleshooting",
            model: "gemini-2.0-flash",
            instruction: "You are a technical support specialist. Help customers troubleshoot issues and provide step-by-step solutions.",
            tools: ["troubleshooting_guide", "create_ticket"],
            sub_agents: [],
            config: {},
        },
    },
    tools: {
        google_search: {
            name: "Google Search",
            type: "builtin",
            description: "Search the web for relevant information",
            builtin_type: "google_search" as any,
        },
        knowledge_base_search: {
            name: "Knowledge Base Search",
            type: "custom_function",
            description: "Search internal knowledge base for answers",
            function_code: `def knowledge_base_search(query: str) -> str:
    """Search the knowledge base for relevant articles."""
    # Implementation here
    return f"Results for: {query}"`,
            imports: ["from typing import Optional"],
            dependencies: [],
        },
        process_refund: {
            name: "Process Refund",
            type: "custom_function",
            description: "Process a refund request for an order",
            function_code: `def process_refund(order_id: str, reason: str) -> dict:
    """Process a refund for the given order."""
    return {"status": "processed", "order_id": order_id}`,
            imports: [],
            dependencies: [],
        },
        check_order_status: {
            name: "Check Order Status",
            type: "custom_function",
            description: "Check the status of a customer order",
            function_code: `def check_order_status(order_id: str) -> dict:
    """Check the current status of an order."""
    return {"order_id": order_id, "status": "shipped"}`,
            imports: [],
            dependencies: [],
        },
        troubleshooting_guide: {
            name: "Troubleshooting Guide",
            type: "custom_function",
            description: "Get troubleshooting steps for common issues",
            function_code: `def troubleshooting_guide(issue_type: str) -> str:
    """Get troubleshooting steps for the given issue type."""
    return f"Troubleshooting steps for: {issue_type}"`,
            imports: [],
            dependencies: [],
        },
        create_ticket: {
            name: "Create Support Ticket",
            type: "custom_function",
            description: "Create a support ticket for escalation",
            function_code: `def create_ticket(title: str, description: str, priority: str = "medium") -> dict:
    """Create a new support ticket."""
    return {"ticket_id": "TICKET-001", "title": title}`,
            imports: [],
            dependencies: [],
        },
    },
    requirements: [
        "google-genai>=0.8.0",
        "google-adk>=0.1.0",
        "python-dotenv>=1.0.0",
        "httpx>=0.28.0",
    ],
    environment_variables: {
        GOOGLE_API_KEY: "",
        GOOGLE_CLOUD_PROJECT: "",
    },
    environment_variables_example: {
        GOOGLE_API_KEY: "your-api-key-here",
        GOOGLE_CLOUD_PROJECT: "your-project-id",
    },
}

// Fetch agent configuration
export async function fetchAgentConfig(): Promise<AgentProjectConfig> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { ...mockAgentConfig }
}

// Update agent configuration
export async function updateAgent(
    agentId: string,
    agentData: AgentConfig
): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    console.log(`Updating agent ${agentId}:`, agentData)
    // In a real implementation, this would make an API call
}

// Update tool configuration
export async function updateTool(
    toolId: string,
    toolData: ToolConfig
): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    console.log(`Updating tool ${toolId}:`, toolData)
    // In a real implementation, this would make an API call
}
