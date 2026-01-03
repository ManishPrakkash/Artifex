import type { AgentProjectConfig, AgentConfig, ToolConfig } from "@/types/agent-config"
import { matchPromptToDomain, getDomainConfiguration } from "./domain-matcher"

// Generate dynamic agent configuration based on agent info using domain matching
export function generateDynamicConfig(agentName: string, agentType: string, agentDescription: string, userPrompt?: string): AgentProjectConfig {
    // Use domain matching for intelligent configuration
    const matchedDomain = matchPromptToDomain(userPrompt || agentDescription)
    const domainConfig = getDomainConfiguration(matchedDomain, agentName, userPrompt || agentDescription)
    
    console.log("🎯 Domain matched:", matchedDomain.displayName)
    console.log("📦 Selected nodes:", domainConfig.subAgents.map(s => s.name).join(", "))
    
    // Build tools from domain configuration
    const tools: Record<string, ToolConfig> = {}
    
    // Add Google Search for most agents
    tools["google_search"] = {
        name: "Google Search",
        type: "builtin",
        description: "Search the web for relevant information",
        builtin_type: "google_search" as any,
    }
    
    // Create tools from domain nodes
    domainConfig.subAgents.forEach((subAgent, index) => {
        const toolId = subAgent.id
        tools[toolId] = {
            name: subAgent.name,
            type: "custom_function",
            description: subAgent.description,
            function_code: `def ${toolId}(query: str) -> dict:
    """${subAgent.description}"""
    return {"status": "success", "data": query}`,
            imports: [],
            dependencies: [],
        }
    })
    
    // Add a data processor tool
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
    
    // Build agents configuration
    const agents: Record<string, AgentConfig> = {}
    const mainAgentTools = ["google_search", "data_processor", ...domainConfig.subAgents.map(s => s.id)]
    const subAgentIds = domainConfig.subAgents.map(s => s.id)
    
    // Main agent
    agents["main_agent"] = {
        name: agentName,
        type: "llm_agent" as any,
        description: agentDescription,
        model: "gemini-2.0-flash",
        instruction: `You are ${agentName}. ${agentDescription}. Use the available tools when needed to provide accurate information. You can delegate tasks to specialized sub-agents for better results.`,
        tools: mainAgentTools,
        sub_agents: subAgentIds.slice(0, 3), // Limit to first 3 sub-agents for clarity
        config: {},
    }
    
    // Create sub-agents from domain nodes
    domainConfig.subAgents.forEach((subAgent, index) => {
        agents[subAgent.id] = {
            name: subAgent.name,
            type: "llm_agent" as any,
            description: subAgent.description,
            model: "gemini-2.0-flash",
            instruction: `You specialize in ${subAgent.name.toLowerCase()}. ${subAgent.description}. Provide detailed and accurate assistance in this area.`,
            tools: [subAgent.id, "data_processor"],
            sub_agents: [],
            config: {},
        }
    })

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

// Fetch agent configuration - now uses dynamic generation with user prompt
export async function fetchAgentConfig(agentName?: string, agentType?: string, agentDescription?: string, userPrompt?: string): Promise<AgentProjectConfig> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // If agent info provided, generate dynamic config
    if (agentName && agentDescription) {
        return generateDynamicConfig(agentName, agentType || "custom", agentDescription, userPrompt)
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
