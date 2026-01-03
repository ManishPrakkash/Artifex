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
  // DIRECT TEXT ANALYSIS - No API calls
  // Use smart keyword extraction as primary method
  console.log("📝 Using direct text analysis for agent name extraction...")
  console.log("   Input:", userInput)
  const result = fallbackExtractAgentName(userInput)
  console.log("   Result:", result)
  return result
  
  /* API-based extraction (disabled to avoid rate limits and delays)
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
                  text: `You are an AI agent naming expert. Extract a concise, specific agent name from the user's description.

User's request: "${userInput}"

Your task:
1. Identify the main purpose/function from the user's description
2. Create a specific agent name (2-4 words) that reflects that purpose
3. Determine the agent type category
4. Write a one-sentence description

Guidelines:
- Focus on what the user ACTUALLY described, not generic examples
- If user mentions "data analysis" → create a data-related agent
- If user mentions "employee/HR/leave" → create an employee management agent  
- If user mentions "calculator/BMI" → create a calculator agent
- Be creative and specific to their exact request

Agent type must be ONE of: calculator, analyzer, manager, assistant, writer, chatbot

Respond with ONLY valid JSON (no markdown, no explanation):
{
  "agentName": "Specific Name Based On User Input",
  "agentType": "appropriate_type",
  "shortDescription": "One sentence describing what it does"
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
    console.log("✅ Gemini extraction successful:", result)
    console.log("   📝 Agent Name:", result.agentName)
    console.log("   🏷️  Agent Type:", result.agentType)
    return result
  } catch (error) {
    console.error("❌ Error extracting agent name with Gemini:", error)
    console.log("🔄 Falling back to keyword-based extraction")
    return fallbackExtractAgentName(userInput)
  }
  */ // End of API-based extraction (currently disabled)
}

/**
 * Fallback extraction without AI (keyword-based)
 * Extracts meaningful words from user input and creates agent name
 * FULLY DYNAMIC - works for ANY agent type, not hardcoded
 * Handles wide variety of scenarios and edge cases
 */
function fallbackExtractAgentName(userInput: string): AgentNameResult {
  const lower = userInput.toLowerCase()
  console.log("🔍 Using dynamic text analysis for:", userInput)

  // Comprehensive list of acronyms that should be uppercase
  const acronyms = [
    'ai', 'ml', 'hr', 'it', 'bi', 'ui', 'ux', 'api', 'bmi', 'crm', 'erp', 
    'seo', 'pdf', 'sql', 'csv', 'json', 'xml', 'html', 'css', 'rest', 'oauth',
    'jwt', 'sms', 'mms', 'gps', 'iot', 'vpn', 'ftp', 'http', 'https', 'ssh',
    'aws', 'gcp', 'nlp', 'ocr', 'qr', 'roi', 'kpi', 'saas', 'paas', 'pos',
    'ecommerce', 'b2b', 'b2c', 'cms', 'lms', 'ats', 'hrms', 'scm', 'wms'
  ]

  // Comprehensive filler words to remove
  const fillerWords = [
    // Pronouns
    'i', 'me', 'my', 'mine', 'you', 'your', 'yours', 'he', 'him', 'his', 'she', 'her', 'hers',
    'it', 'its', 'we', 'us', 'our', 'ours', 'they', 'them', 'their', 'theirs',
    
    // Common verbs
    'need', 'want', 'create', 'make', 'build', 'develop', 'design', 'get', 'give',
    'help', 'do', 'does', 'did', 'done', 'doing', 'is', 'am', 'are', 'was', 'were',
    'be', 'been', 'being', 'have', 'has', 'had', 'having', 'can', 'could', 'will',
    'would', 'should', 'shall', 'may', 'might', 'must',
    
    // Articles and prepositions
    'a', 'an', 'the', 'for', 'to', 'from', 'in', 'on', 'at', 'by', 'with', 'about',
    'into', 'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down',
    'of', 'off', 'over', 'under', 'between', 'among',
    
    // Conjunctions
    'and', 'or', 'but', 'so', 'yet', 'nor', 'because', 'since', 'while', 'if',
    'when', 'where', 'what', 'which', 'who', 'whom', 'whose', 'why', 'how',
    
    // Other common words
    'that', 'this', 'these', 'those', 'please', 'like', 'just', 'very', 'too',
    'also', 'such', 'some', 'any', 'each', 'every', 'all', 'both', 'few', 'more',
    'most', 'other', 'another', 'same', 'different', 'own', 'good', 'new', 'old'
  ]

  // Words that should be kept even if short
  const keepShortWords = ['ai', 'ml', 'hr', 'it', 'ui', 'ux', 'bi', 'io', 'go', 'r', 'c']

  // Split into words and filter
  const words = lower
    .split(/\s+/)
    .filter(word => {
      const cleaned = word.replace(/[^\w]/g, '')
      
      // Keep important short words
      if (keepShortWords.includes(cleaned)) return true
      
      // Remove filler words
      if (fillerWords.includes(cleaned)) return false
      
      // Remove very short words (1-2 chars) that aren't in keep list
      if (cleaned.length < 2) return false
      
      // Keep meaningful words
      return cleaned.length > 0
    })
    .map(word => word.replace(/[^\w]/g, '')) // Clean punctuation
    .filter(word => word.length > 0)

  console.log("   Extracted keywords:", words)

  // If we have meaningful words, create agent name from them
  if (words.length > 0) {
    // Find if "agent" is already in the words - if so, stop there
    const agentIndex = words.findIndex(w => w.toLowerCase() === 'agent')
    let relevantWords = words
    
    if (agentIndex !== -1) {
      // Take words up to and including "agent", ignore everything after
      relevantWords = words.slice(0, agentIndex + 1)
      console.log("   Found 'agent' at index", agentIndex, "- using only:", relevantWords)
    }
    
    // Capitalize each word (handle acronyms and special cases)
    const capitalizedWords = relevantWords.map(word => {
      const lowerWord = word.toLowerCase()
      
      // Check if it's an acronym
      if (acronyms.includes(lowerWord)) {
        return lowerWord.toUpperCase() // BMI, AI, HR, etc.
      }
      
      // Check if it's a compound word with common patterns
      if (lowerWord.includes('ecommerce')) return 'E-Commerce'
      if (lowerWord.includes('email')) return 'Email'
      if (lowerWord.includes('chatbot')) return 'Chatbot'
      
      // Normal capitalization
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    
    // If "agent" was already in the input, we already have it
    // Otherwise, take first 3-4 meaningful words and add "Agent"
    let nameWords
    let agentName
    
    if (agentIndex !== -1) {
      // Already has "agent", use all capitalized words
      nameWords = capitalizedWords
      agentName = nameWords.join(' ')
    } else {
      // No "agent" found, take first 3-4 words and add "Agent"
      const maxWords = relevantWords.length <= 2 ? 2 : (relevantWords.length <= 4 ? relevantWords.length : 4)
      nameWords = capitalizedWords.slice(0, maxWords)
      agentName = nameWords.join(' ') + ' Agent'
    }

    // Comprehensive dynamic type detection
    let agentType = 'assistant' // default for unknown types
    
    // Calculator/Math related
    if (words.some(w => ['calculat', 'calculate', 'calculator', 'math', 'compute', 'equation', 'formula', 'arithmetic'].some(t => w.includes(t)))) {
      agentType = 'calculator'
    }
    // Analysis/Data related
    else if (words.some(w => ['analyz', 'analyze', 'analysis', 'data', 'statistic', 'metric', 'insight', 'report', 'dashboard', 'visualization', 'chart', 'graph'].some(t => w.includes(t)))) {
      agentType = 'analyzer'
    }
    // Management/Organization related
    else if (words.some(w => ['manag', 'manage', 'manager', 'task', 'project', 'organiz', 'plan', 'schedule', 'workflow', 'employee', 'team', 'staff', 'hr', 'inventory', 'resource'].some(t => w.includes(t)))) {
      agentType = 'manager'
    }
    // Writing/Content related
    else if (words.some(w => ['writ', 'write', 'writer', 'content', 'blog', 'article', 'editor', 'author', 'copywriter', 'journalist', 'documentation'].some(t => w.includes(t)))) {
      agentType = 'writer'
    }
    // Chat/Conversation related
    else if (words.some(w => ['chat', 'conversation', 'talk', 'dialog', 'messaging', 'communicate', 'reply', 'respond'].some(t => w.includes(t)))) {
      agentType = 'chatbot'
    }
    // Tracking/Monitoring related
    else if (words.some(w => ['track', 'monitor', 'watch', 'observe', 'surveillance', 'log', 'record', 'audit', 'trace'].some(t => w.includes(t)))) {
      agentType = 'tracker'
    }
    // Search/Discovery related
    else if (words.some(w => ['search', 'find', 'finder', 'lookup', 'discover', 'explorer', 'browse', 'query', 'scan', 'detect'].some(t => w.includes(t)))) {
      agentType = 'search'
    }
    // Automation/Bot related
    else if (words.some(w => ['automat', 'bot', 'script', 'workflow', 'trigger', 'schedule', 'batch'].some(t => w.includes(t)))) {
      agentType = 'automation'
    }
    // Translation/Language related
    else if (words.some(w => ['translat', 'language', 'localization', 'interpret', 'multilingual'].some(t => w.includes(t)))) {
      agentType = 'translator'
    }
    // Recommendation/Suggestion related
    else if (words.some(w => ['recommend', 'suggest', 'advice', 'guide', 'tip'].some(t => w.includes(t)))) {
      agentType = 'recommender'
    }
    // Validation/Testing related
    else if (words.some(w => ['validat', 'verify', 'check', 'test', 'inspect', 'review', 'audit'].some(t => w.includes(t)))) {
      agentType = 'validator'
    }
    // Conversion/Transform related
    else if (words.some(w => ['convert', 'transform', 'format', 'parse', 'export', 'import', 'migrate'].some(t => w.includes(t)))) {
      agentType = 'converter'
    }
    // Prediction/Forecast related
    else if (words.some(w => ['predict', 'forecast', 'estimate', 'projection', 'trend', 'model'].some(t => w.includes(t)))) {
      agentType = 'predictor'
    }
    // Notification/Alert related
    else if (words.some(w => ['notif', 'alert', 'remind', 'notification', 'alarm', 'warning'].some(t => w.includes(t)))) {
      agentType = 'notifier'
    }
    // Shopping/E-commerce related
    else if (words.some(w => ['shop', 'ecommerce', 'store', 'product', 'cart', 'checkout', 'payment', 'order'].some(t => w.includes(t)))) {
      agentType = 'commerce'
    }
    // Learning/Education related
    else if (words.some(w => ['learn', 'teach', 'tutor', 'educat', 'train', 'course', 'lesson', 'quiz', 'study'].some(t => w.includes(t)))) {
      agentType = 'tutor'
    }
    // Security/Privacy related
    else if (words.some(w => ['secur', 'protect', 'encrypt', 'privacy', 'authentication', 'authorization', 'permission'].some(t => w.includes(t)))) {
      agentType = 'security'
    }
    // Health/Medical related
    else if (words.some(w => ['health', 'medical', 'patient', 'doctor', 'diagnos', 'symptom', 'treatment', 'wellness', 'fitness'].some(t => w.includes(t)))) {
      agentType = 'health'
    }
    // Finance/Accounting related
    else if (words.some(w => ['financ', 'account', 'budget', 'expense', 'invoice', 'payment', 'transaction', 'bank', 'money', 'currency'].some(t => w.includes(t)))) {
      agentType = 'finance'
    }
    // Social/Community related
    else if (words.some(w => ['social', 'community', 'network', 'friend', 'follower', 'post', 'share', 'like', 'comment'].some(t => w.includes(t)))) {
      agentType = 'social'
    }

    // Create description from the words
    const descriptionWords = words.slice(0, 6).join(' ')
    
    const result = {
      agentName,
      agentType,
      shortDescription: `Helps with ${descriptionWords}`,
    }

    console.log("   ✅ Generated:", result.agentName, `(${result.agentType})`)
    return result
  }

  // Ultimate fallback if no words extracted
  console.log("   ⚠️  No meaningful words found, using default")
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
