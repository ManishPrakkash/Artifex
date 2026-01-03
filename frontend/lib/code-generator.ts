import JSZip from "jszip"
import type { AgentProjectConfig, AgentConfig, ToolConfig } from "@/types/agent-config"

class CodeGenerator {
    private generateAgentFile(agentId: string, agent: AgentConfig): string {
        const toolImports = agent.tools.length > 0
            ? `from tools import ${agent.tools.join(", ")}`
            : ""

        const subAgentImports = agent.sub_agents.length > 0
            ? agent.sub_agents.map(sa => `from agents.${sa} import ${sa}`).join("\n")
            : ""

        return `"""
${agent.name}
${agent.description}
"""

from google.adk.agents import LlmAgent
${toolImports}
${subAgentImports}

${agentId} = LlmAgent(
    name="${agent.name}",
    model="${agent.model || 'gemini-2.0-flash'}",
    instruction="""${agent.instruction || ""}""",
    tools=[${agent.tools.map(t => t).join(", ")}],
    sub_agents=[${agent.sub_agents.map(sa => sa).join(", ")}],
)
`
    }

    private generateToolFile(toolId: string, tool: ToolConfig): string {
        if (tool.type === "builtin") {
            return `"""
${tool.name}
${tool.description}
"""

from google.adk.tools import ${tool.builtin_type || toolId}

# Re-export the builtin tool
${toolId} = ${tool.builtin_type || toolId}
`
        }

        const imports = tool.imports?.join("\n") || ""

        return `"""
${tool.name}
${tool.description}
"""

${imports}
from google.adk.tools import FunctionTool

${tool.function_code || `def ${toolId}():
    """${tool.description}"""
    pass`}

# Export as a FunctionTool
${toolId}_tool = FunctionTool(${toolId})
`
    }

    private generateMainFile(config: AgentProjectConfig): string {
        return `"""
${config.project_name}
${config.description}
Version: ${config.version}
"""

import os
from dotenv import load_dotenv
from agents.${config.main_agent} import ${config.main_agent}

# Load environment variables
load_dotenv()

# Export the main agent
root_agent = ${config.main_agent}

if __name__ == "__main__":
    print(f"Loaded agent: {root_agent.name}")
`
    }

    private generateRequirements(config: AgentProjectConfig): string {
        return config.requirements.join("\n")
    }

    private generateEnvExample(config: AgentProjectConfig): string {
        return Object.entries(config.environment_variables_example)
            .map(([key, value]) => `${key}=${value}`)
            .join("\n")
    }

    private generateReadme(config: AgentProjectConfig): string {
        return `# ${config.project_name}

${config.description}

## Version
${config.version}

## Setup

1. Create a virtual environment:
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

3. Copy \`.env.example\` to \`.env\` and fill in your API keys:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. Run the agent:
   \`\`\`bash
   python main.py
   \`\`\`

## Agents

${Object.entries(config.agents)
                .map(([id, agent]) => `### ${agent.name}\n${agent.description}`)
                .join("\n\n")}

## Tools

${Object.entries(config.tools)
                .map(([id, tool]) => `### ${tool.name}\n${tool.description}`)
                .join("\n\n")}
`
    }

    async generateAndDownload(config: AgentProjectConfig): Promise<void> {
        const zip = new JSZip()

        // Create directory structure
        const agentsFolder = zip.folder("agents")
        const toolsFolder = zip.folder("tools")

        // Generate agent files
        for (const [agentId, agent] of Object.entries(config.agents)) {
            agentsFolder?.file(`${agentId}.py`, this.generateAgentFile(agentId, agent))
        }

        // Add __init__.py for agents
        const agentExports = Object.keys(config.agents)
            .map(id => `from .${id} import ${id}`)
            .join("\n")
        agentsFolder?.file("__init__.py", agentExports)

        // Generate tool files
        for (const [toolId, tool] of Object.entries(config.tools)) {
            toolsFolder?.file(`${toolId}.py`, this.generateToolFile(toolId, tool))
        }

        // Add __init__.py for tools
        const toolExports = Object.keys(config.tools)
            .map(id => `from .${id} import ${id}`)
            .join("\n")
        toolsFolder?.file("__init__.py", toolExports)

        // Generate main files
        zip.file("main.py", this.generateMainFile(config))
        zip.file("requirements.txt", this.generateRequirements(config))
        zip.file(".env.example", this.generateEnvExample(config))
        zip.file("README.md", this.generateReadme(config))

        // Generate and download
        const content = await zip.generateAsync({ type: "blob" })
        const url = URL.createObjectURL(content)
        const link = document.createElement("a")
        link.href = url
        // Create clean filename from agent name: lowercase, replace spaces/special chars with hyphens
        const cleanName = config.project_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
        link.download = `${cleanName}-agent.zip`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }
}

export const codeGenerator = new CodeGenerator()
