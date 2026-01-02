import type { PromptSuggestion } from "@/types"

// Mock prompts for the landing page
export const mockPrompts: PromptSuggestion[] = [
    {
        id: "1",
        title: "Build a customer support agent",
        description: "Create an AI agent that handles customer inquiries",
    },
    {
        id: "2",
        title: "Create a code review assistant",
        description: "An agent that reviews code and provides feedback",
    },
    {
        id: "3",
        title: "Design a research assistant",
        description: "An AI that helps with research and summarization",
    },
    {
        id: "4",
        title: "Build a data analysis agent",
        description: "An agent that analyzes data and generates insights",
    },
    {
        id: "5",
        title: "Create a content writer",
        description: "An AI assistant for writing and editing content",
    },
]

// Step types for the agent building process
export interface AgentStep {
    id: string
    stepNumber: number
    title: string
    description: string
    status: "pending" | "running" | "completed" | "error"
    toolName?: string
    toolDescription?: string
    result?: Record<string, any>
}

// Counter for generating unique step IDs
let stepIdCounter = 0
const generateStepId = (stepNumber: number): string => {
    stepIdCounter += 1
    return `step-${stepNumber}-${stepIdCounter}-${Date.now()}`
}

// Generate mock steps based on user prompt
export function generateAgentSteps(prompt: string): AgentStep[] {
    const lowerPrompt = prompt.toLowerCase()

    if (lowerPrompt.includes("customer support") || lowerPrompt.includes("support agent")) {
        return [
            {
                id: generateStepId(1),
                stepNumber: 1,
                title: "Step 1",
                description: "Analyzing customer support requirements",
                status: "pending",
                toolName: "requirements_analyzer",
                toolDescription: "Understanding customer support needs",
                result: {
                    purpose: "Handles customer inquiries with empathy and efficiency",
                    main_capabilities: [
                        "Ticket management",
                        "Knowledge base search",
                        "Escalation handling"
                    ],
                    suggested_tools: [
                        "search_knowledge_base",
                        "create_ticket",
                        "escalate_issue"
                    ],
                    complexity: "medium"
                }
            },
            {
                id: generateStepId(2),
                stepNumber: 2,
                title: "Step 2",
                description: "Designing agent architecture",
                status: "pending",
                toolName: "architecture_designer",
                toolDescription: "Creating optimal agent structure",
                result: {
                    agent_type: "llm_agent",
                    sub_agents: ["ticket_handler", "knowledge_searcher", "escalation_manager"],
                    model: "gemini-2.0-flash",
                    communication_pattern: "hierarchical"
                }
            },
            {
                id: generateStepId(3),
                stepNumber: 3,
                title: "Step 3",
                description: "Generating agent tools",
                status: "pending",
                toolName: "tool_generator",
                toolDescription: "Building custom tools for the agent",
                result: {
                    tools_created: 4,
                    tools: [
                        { name: "search_knowledge_base", type: "custom_function" },
                        { name: "create_ticket", type: "custom_function" },
                        { name: "get_ticket_status", type: "custom_function" },
                        { name: "escalate_to_human", type: "custom_function" }
                    ]
                }
            },
            {
                id: generateStepId(4),
                stepNumber: 4,
                title: "Step 4",
                description: "Writing agent instructions",
                status: "pending",
                toolName: "instruction_writer",
                toolDescription: "Crafting precise agent behavior guidelines",
                result: {
                    instruction_length: 450,
                    key_behaviors: [
                        "Empathetic responses",
                        "Clear escalation criteria",
                        "Knowledge base priority"
                    ],
                    tone: "professional and helpful"
                }
            },
            {
                id: generateStepId(5),
                stepNumber: 5,
                title: "Step 5",
                description: "Finalizing agent configuration",
                status: "pending",
                toolName: "config_finalizer",
                toolDescription: "Assembling the complete agent package",
                result: {
                    status: "ready",
                    configuration_complete: true
                }
            },
            {
                id: generateStepId(6),
                stepNumber: 6,
                title: "Step 6",
                description: "Finalizing customer support system",
                status: "pending",
                toolName: "generate_agent_code",
                toolDescription: "Generating complete support system code",
                result: {
                    files_generated: [
                        "agent.py",
                        "requirements.txt",
                        "README.md",
                        ".env.example"
                    ],
                    agents_created: 3,
                    tools_created: 4,
                    ready_for_deployment: true
                }
            }
        ]
    }

    // Default steps for other prompts - also 5 steps like customer support
    return [
        {
            id: generateStepId(1),
            stepNumber: 1,
            title: "Step 1",
            description: "Analyzing your requirements",
            status: "pending",
            toolName: "requirements_analyzer",
            toolDescription: "Understanding your agent needs",
            result: {
                purpose: "Custom AI agent for your specific use case",
                main_capabilities: ["Task automation", "Information processing"],
                complexity: "medium"
            }
        },
        {
            id: generateStepId(2),
            stepNumber: 2,
            title: "Step 2",
            description: "Designing agent structure",
            status: "pending",
            toolName: "architecture_designer",
            toolDescription: "Creating optimal agent architecture",
            result: {
                agent_type: "llm_agent",
                model: "gemini-2.0-flash",
                sub_agents: []
            }
        },
        {
            id: generateStepId(3),
            stepNumber: 3,
            title: "Step 3",
            description: "Generating tools and capabilities",
            status: "pending",
            toolName: "tool_generator",
            toolDescription: "Building agent tools",
            result: {
                tools_created: 2,
                tools: [
                    { name: "main_tool", type: "custom_function" }
                ]
            }
        },
        {
            id: generateStepId(4),
            stepNumber: 4,
            title: "Step 4",
            description: "Writing agent instructions",
            status: "pending",
            toolName: "instruction_writer",
            toolDescription: "Crafting agent behavior guidelines",
            result: {
                instruction_length: 350,
                key_behaviors: ["Clear responses", "Task focused"],
                tone: "professional"
            }
        },
        {
            id: generateStepId(5),
            stepNumber: 5,
            title: "Step 5",
            description: "Finalizing configuration",
            status: "pending",
            toolName: "config_finalizer",
            toolDescription: "Completing agent setup",
            result: {
                status: "ready",
                configuration_complete: true
            }
        },
        {
            id: generateStepId(6),
            stepNumber: 6,
            title: "Step 6",
            description: "Generating agent code",
            status: "pending",
            toolName: "generate_agent_code",
            toolDescription: "Generating complete agent code",
            result: {
                files_generated: [
                    "agent.py",
                    "requirements.txt",
                    "README.md",
                    ".env.example"
                ],
                agents_created: 1,
                tools_created: 2,
                ready_for_deployment: true
            }
        }
    ]
}

// Simulate AI response for the chat interface
export async function simulateAIResponse(message: string): Promise<string> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))

    const responses = [
        "I understand you want to build an AI agent. Let me help you configure the capabilities and behaviors. What specific tasks should this agent handle?",
        "Great idea! I can help you set up the tools and integrations needed for this agent. Would you like to add web search, document processing, or API integrations?",
        "I'm now configuring your agent with the specified requirements. The agent will have natural language understanding and the ability to maintain context across conversations.",
        "Your agent is taking shape! I've added the core capabilities. Would you like to customize the personality and tone of the responses?",
        "Perfect! I'm finalizing the agent configuration. You can preview and test the agent in the preview panel on the right.",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
}

// Simulate agent building progress
export function simulateAgentBuilding(
    onProgress: (progress: number) => void
): void {
    let progress = 0
    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5
        if (progress >= 100) {
            progress = 100
            clearInterval(interval)
        }
        onProgress(Math.min(Math.round(progress), 100))
    }, 500)
}

// Simulate agent response for the agent chat preview
export async function simulateAgentResponse(message: string): Promise<string> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 500))

    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
        return "I'd be happy to help you! Could you please describe your issue in more detail? I can assist with product inquiries, order tracking, returns, and general questions about our services."
    }

    if (lowerMessage.includes("order") || lowerMessage.includes("track")) {
        return "I can help you track your order. Please provide your order number, and I'll look up the current status for you. You can find your order number in the confirmation email we sent you."
    }

    if (lowerMessage.includes("return") || lowerMessage.includes("refund")) {
        return "I understand you'd like to process a return or refund. Our return policy allows returns within 30 days of purchase. Would you like me to start the return process for you?"
    }

    if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
        return "I can help you with pricing information. Which product or service are you interested in learning more about?"
    }

    // Default response
    return "Thank you for your message! I'm here to assist you with any questions or concerns. How can I help you today?"
}
