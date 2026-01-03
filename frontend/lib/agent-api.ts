import type { AgentProjectConfig, AgentConfig, ToolConfig } from "@/types/agent-config"

// Generate dynamic agent configuration based on agent info
export function generateDynamicConfig(agentName: string, agentType: string, agentDescription: string): AgentProjectConfig {
    // Extract keywords from description to determine tools and capabilities
    const lowerDesc = agentDescription.toLowerCase()
    const lowerType = agentType.toLowerCase()

    // Determine what tools to include based on agent type/description
    const tools: Record<string, ToolConfig> = {}
    const agentTools: string[] = []
    const subAgents: string[] = []

    // Add Google Search for most agents
    tools["google_search"] = {
        name: "Google Search",
        type: "builtin",
        description: "Search the web for relevant information",
        builtin_type: "google_search" as any,
    }
    agentTools.push("google_search")

    // Travel-related tools
    if (lowerDesc.includes("travel") || lowerDesc.includes("trip") || lowerDesc.includes("vacation") || lowerType.includes("travel")) {
        tools["search_destinations"] = {
            name: "Search Destinations",
            type: "custom_function",
            description: "Search for travel destinations and get information",
            function_code: `def search_destinations(query: str, travel_type: str = "any") -> dict:
    """Search for travel destinations matching the query."""
    return {"destinations": [], "query": query}`,
            imports: ["from typing import Optional"],
            dependencies: [],
        }
        tools["get_flight_info"] = {
            name: "Get Flight Info",
            type: "custom_function",
            description: "Get flight information and prices",
            function_code: `def get_flight_info(origin: str, destination: str, date: str) -> dict:
    """Get flight information between two locations."""
    return {"flights": [], "origin": origin, "destination": destination}`,
            imports: [],
            dependencies: ["httpx>=0.28.0"],
        }
        tools["hotel_search"] = {
            name: "Hotel Search",
            type: "custom_function",
            description: "Search for hotels and accommodations",
            function_code: `def hotel_search(location: str, check_in: str, check_out: str) -> dict:
    """Search for hotels in the specified location."""
    return {"hotels": [], "location": location}`,
            imports: [],
            dependencies: [],
        }
        agentTools.push("search_destinations", "get_flight_info", "hotel_search")

        // Add sub-agents for travel
        subAgents.push("itinerary_agent", "booking_agent")
    }

    // Customer support tools
    if (lowerDesc.includes("support") || lowerDesc.includes("customer") || lowerDesc.includes("help") || lowerType.includes("support")) {
        tools["knowledge_base_search"] = {
            name: "Knowledge Base Search",
            type: "custom_function",
            description: "Search internal knowledge base for answers",
            function_code: `def knowledge_base_search(query: str) -> str:
    """Search the knowledge base for relevant articles."""
    return f"Results for: {query}"`,
            imports: ["from typing import Optional"],
            dependencies: [],
        }
        tools["create_ticket"] = {
            name: "Create Support Ticket",
            type: "custom_function",
            description: "Create a support ticket for escalation",
            function_code: `def create_ticket(title: str, description: str, priority: str = "medium") -> dict:
    """Create a new support ticket."""
    return {"ticket_id": "TICKET-001", "title": title}`,
            imports: [],
            dependencies: [],
        }
        agentTools.push("knowledge_base_search", "create_ticket")
        subAgents.push("escalation_agent")
    }

    // Code/development tools
    if (lowerDesc.includes("code") || lowerDesc.includes("programming") || lowerDesc.includes("developer") || lowerType.includes("code")) {
        tools["code_analyzer"] = {
            name: "Code Analyzer",
            type: "custom_function",
            description: "Analyze code for bugs and improvements",
            function_code: `def code_analyzer(code: str, language: str = "python") -> dict:
    """Analyze code and return suggestions."""
    return {"issues": [], "suggestions": []}`,
            imports: ["import ast"],
            dependencies: [],
        }
        tools["documentation_generator"] = {
            name: "Documentation Generator",
            type: "custom_function",
            description: "Generate documentation for code",
            function_code: `def documentation_generator(code: str) -> str:
    """Generate documentation for the provided code."""
    return "Generated documentation"`,
            imports: [],
            dependencies: [],
        }
        agentTools.push("code_analyzer", "documentation_generator")
        subAgents.push("review_agent")
    }

    // Research tools
    if (lowerDesc.includes("research") || lowerDesc.includes("analyze") || lowerDesc.includes("study") || lowerType.includes("research")) {
        tools["web_scraper"] = {
            name: "Web Scraper",
            type: "custom_function",
            description: "Scrape web pages for research data",
            function_code: `def web_scraper(url: str) -> dict:
    """Scrape content from a web page."""
    return {"content": "", "url": url}`,
            imports: ["import httpx", "from bs4 import BeautifulSoup"],
            dependencies: ["httpx>=0.28.0", "beautifulsoup4>=4.12.0"],
        }
        tools["summarizer"] = {
            name: "Text Summarizer",
            type: "custom_function",
            description: "Summarize long texts and documents",
            function_code: `def summarizer(text: str, max_length: int = 500) -> str:
    """Summarize the given text."""
    return text[:max_length] + "..."`,
            imports: [],
            dependencies: [],
        }
        agentTools.push("web_scraper", "summarizer")
    }

    // Add a generic data tool for all agents
    tools["data_processor"] = {
        name: "Data Processor",
        type: "custom_function",
        description: "Process and format data for the agent",
        function_code: `def data_processor(data: dict, format_type: str = "json") -> str:
    """Process data and return in specified format."""
    import json
    return json.dumps(data, indent=2)`,
        imports: ["import json"],
        dependencies: [],
    }
    agentTools.push("data_processor")

    // Build the agents configuration
    const agents: Record<string, AgentConfig> = {
        main_agent: {
            name: agentName,
            type: "llm_agent" as any,
            description: agentDescription,
            model: "gemini-2.0-flash",
            instruction: `You are ${agentName}. ${agentDescription}. Be helpful, professional, and assist users with their requests. Use the available tools when needed to provide accurate information.`,
            tools: agentTools,
            sub_agents: subAgents,
            config: {},
        },
    }

    // Add sub-agents based on type
    if (subAgents.includes("itinerary_agent")) {
        agents["itinerary_agent"] = {
            name: "Itinerary Planner",
            type: "llm_agent" as any,
            description: "Creates detailed travel itineraries",
            model: "gemini-2.0-flash",
            instruction: "You specialize in creating detailed travel itineraries. Consider timing, locations, and user preferences.",
            tools: ["search_destinations"],
            sub_agents: [],
            config: {},
        }
    }

    if (subAgents.includes("booking_agent")) {
        agents["booking_agent"] = {
            name: "Booking Assistant",
            type: "llm_agent" as any,
            description: "Handles travel bookings and reservations",
            model: "gemini-2.0-flash",
            instruction: "You handle travel bookings including flights and hotels. Ensure accuracy and confirm all details.",
            tools: ["get_flight_info", "hotel_search"],
            sub_agents: [],
            config: {},
        }
    }

    if (subAgents.includes("escalation_agent")) {
        agents["escalation_agent"] = {
            name: "Escalation Handler",
            type: "llm_agent" as any,
            description: "Handles escalated support issues",
            model: "gemini-2.0-flash",
            instruction: "You handle escalated customer issues. Be empathetic and work to resolve problems quickly.",
            tools: ["create_ticket"],
            sub_agents: [],
            config: {},
        }
    }

    if (subAgents.includes("review_agent")) {
        agents["review_agent"] = {
            name: "Code Reviewer",
            type: "llm_agent" as any,
            description: "Reviews code for quality and best practices",
            model: "gemini-2.0-flash",
            instruction: "You review code for quality, bugs, and best practices. Provide constructive feedback.",
            tools: ["code_analyzer"],
            sub_agents: [],
            config: {},
        }
    }

    // Calculate requirements based on tools
    const requirements = new Set(["google-genai>=0.8.0", "google-adk>=0.1.0", "python-dotenv>=1.0.0"])
    Object.values(tools).forEach(tool => {
        if (tool.dependencies) {
            tool.dependencies.forEach(dep => requirements.add(dep))
        }
    })

    return {
        project_name: agentName,
        description: agentDescription,
        version: "1.0.0",
        main_agent: "main_agent",
        agents,
        tools,
        requirements: Array.from(requirements),
        environment_variables: {
            GOOGLE_API_KEY: "",
            GOOGLE_CLOUD_PROJECT: "",
        },
        environment_variables_example: {
            GOOGLE_API_KEY: "your-api-key-here",
            GOOGLE_CLOUD_PROJECT: "your-project-id",
        },
    }
}

// Fetch agent configuration - now uses dynamic generation
export async function fetchAgentConfig(agentName?: string, agentType?: string, agentDescription?: string): Promise<AgentProjectConfig> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // If agent info provided, generate dynamic config
    if (agentName && agentDescription) {
        return generateDynamicConfig(agentName, agentType || "custom", agentDescription)
    }

    // Default fallback config
    return generateDynamicConfig("AI Assistant", "custom", "A helpful AI assistant for various tasks")
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
