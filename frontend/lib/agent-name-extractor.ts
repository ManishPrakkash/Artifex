/**
 * Agent Name Extractor using Gemini AI
 * Dynamically extracts agent type and name from user input
 */

interface AgentNameResult {
  agentName: string
  agentType: string
  shortDescription: string
}

/**
 * Extract agent name and type from user description using Gemini AI
 */
export async function extractAgentName(userInput: string): Promise<AgentNameResult> {
  try {
    // For client-side execution, check both process.env and window
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || 
                   (typeof window !== 'undefined' ? (window as any).ENV?.NEXT_PUBLIC_GOOGLE_API_KEY : null)

    if (!apiKey) {
      console.warn("Google API key not found, using fallback extraction")
      return fallbackExtractAgentName(userInput)
    }

    console.log("Using Gemini API for agent name extraction...")

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Extract a concise agent name and type from this user description. 
                  
User description: "${userInput}"

Rules:
- Agent name should be 2-4 words maximum
- Agent type should be a single category (e.g., "calculator", "chatbot", "analyzer", "manager")
- Short description should be one sentence
- If the user says "calculator" or "BMI" or "weight/height", call it "BMI Calculator Agent"
- If the user mentions "task" or "todo", call it "Task Manager Agent"
- If the user mentions "support" or "help", call it "Support Assistant Agent"
- Be specific based on the actual description

Respond ONLY with valid JSON in this exact format:
{
  "agentName": "BMI Calculator Agent",
  "agentType": "calculator",
  "shortDescription": "Calculates BMI from height and weight"
}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 200,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!textContent) {
      throw new Error("No response from Gemini API")
    }

    // Extract JSON from response (handles markdown code blocks)
    const jsonMatch = textContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response")
    }

    const result = JSON.parse(jsonMatch[0]) as AgentNameResult
    console.log("✅ Gemini extraction successful:", result.agentName)
    return result
  } catch (error) {
    console.error("❌ Error extracting agent name with Gemini:", error)
    console.log("🔄 Falling back to keyword-based extraction")
    return fallbackExtractAgentName(userInput)
  }
}

/**
 * Fallback extraction without AI (keyword-based)
 */
function fallbackExtractAgentName(userInput: string): AgentNameResult {
  const lower = userInput.toLowerCase()
  console.log("🔍 Using fallback extraction for:", userInput)

  // BMI/Health/Weight/Height
  if (
    lower.includes("bmi") ||
    lower.includes("weight") ||
    lower.includes("height") ||
    lower.includes("body mass")
  ) {
    return {
      agentName: "BMI Calculator Agent",
      agentType: "calculator",
      shortDescription: "Calculates BMI from height and weight measurements",
    }
  }

  // Calculator
  if (lower.includes("calculator") || lower.includes("calculate") || lower.includes("math")) {
    return {
      agentName: "Calculator Agent",
      agentType: "calculator",
      shortDescription: "Performs mathematical calculations",
    }
  }

  // Task/Todo Manager
  if (lower.includes("task") || lower.includes("todo") || lower.includes("project")) {
    return {
      agentName: "Task Manager Agent",
      agentType: "manager",
      shortDescription: "Manages tasks and projects efficiently",
    }
  }

  // Support/Help
  if (lower.includes("support") || lower.includes("help") || lower.includes("customer")) {
    return {
      agentName: "Support Assistant Agent",
      agentType: "assistant",
      shortDescription: "Provides customer support and assistance",
    }
  }

  // Research
  if (lower.includes("research") || lower.includes("analyze") || lower.includes("study")) {
    return {
      agentName: "Research Assistant Agent",
      agentType: "assistant",
      shortDescription: "Helps with research and analysis",
    }
  }

  // Code/Development
  if (lower.includes("code") || lower.includes("developer") || lower.includes("programming")) {
    return {
      agentName: "Code Assistant Agent",
      agentType: "assistant",
      shortDescription: "Assists with coding and development",
    }
  }

  // Data Analysis
  if (lower.includes("data") || lower.includes("analytics") || lower.includes("statistics")) {
    return {
      agentName: "Data Analysis Agent",
      agentType: "analyzer",
      shortDescription: "Analyzes data and generates insights",
    }
  }

  // Content/Writing
  if (lower.includes("content") || lower.includes("writing") || lower.includes("blog")) {
    return {
      agentName: "Content Writer Agent",
      agentType: "writer",
      shortDescription: "Creates and edits written content",
    }
  }

  // Default fallback
  return {
    agentName: "AI Assistant Agent",
    agentType: "assistant",
    shortDescription: "General-purpose AI assistant",
  }
}

/**
 * Browser-safe version that can be called from client components
 */
export async function extractAgentNameClient(userInput: string): Promise<AgentNameResult> {
  // For client-side, we'll use the browser fetch API
  return extractAgentName(userInput)
}
