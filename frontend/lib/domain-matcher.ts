/**
 * Domain Matcher - Analyzes user prompts and matches them to domains
 * 
 * This module provides functionality to:
 * 1. Load domain definitions from the JSON registry
 * 2. Match user prompts to the most relevant domain
 * 3. Extract domain-specific configurations for agent creation
 */

import domainRegistry from './domain-registry.json'

export interface DomainNode {
  id: string
  label: string
  description: string
}

export interface Domain {
  id: string
  displayName: string
  description: string
  keywords: string[]
  nodes: DomainNode[]
  defaultTools: string[]
  uiBlocks: string[]
  agentTypes: string[]
  metadata?: {
    nonDiagnostic?: boolean
    disclaimer?: string
  }
}

export interface DomainRegistryData {
  domains: Domain[]
}

/**
 * Get all available domains from the registry
 */
export function getAllDomains(): Domain[] {
  return (domainRegistry as DomainRegistryData).domains
}

/**
 * Get a specific domain by ID
 */
export function getDomainById(domainId: string): Domain | undefined {
  return getAllDomains().find(domain => domain.id === domainId)
}

/**
 * Calculate keyword match score between user prompt and domain keywords
 * Enhanced algorithm with better weighting and multi-word phrase detection
 */
function calculateKeywordScore(prompt: string, keywords: string[], domainName: string): number {
  const promptLower = prompt.toLowerCase()
  const words = promptLower.split(/\s+/).filter(w => w.length > 2) // Ignore very short words
  
  let score = 0
  let exactMatches = 0
  let partialMatches = 0
  
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase()
    const keywordWords = keywordLower.split(/\s+/)
    
    // Multi-word exact phrase match (highest weight)
    if (keywordWords.length > 1 && promptLower.includes(keywordLower)) {
      score += 10
      exactMatches++
      return
    }
    
    // Single word exact match (high weight)
    if (words.includes(keywordLower)) {
      score += 5
      exactMatches++
      return
    }
    
    // Substring match in prompt (medium-high weight)
    if (promptLower.includes(keywordLower)) {
      score += 3
      partialMatches++
      return
    }
    
    // Word contains keyword or vice versa (lower weight)
    const hasPartialMatch = words.some(word => {
      // Avoid very short matches
      if (keywordLower.length < 3 || word.length < 3) return false
      return word.includes(keywordLower) || keywordLower.includes(word)
    })
    
    if (hasPartialMatch) {
      score += 1
      partialMatches++
    }
  })
  
  // Boost score if domain name itself is mentioned
  const domainNameLower = domainName.toLowerCase()
  if (promptLower.includes(domainNameLower)) {
    score += 15
    exactMatches++
  }
  
  // Bonus for multiple exact matches (indicates strong relevance)
  if (exactMatches >= 2) {
    score += exactMatches * 2
  }
  
  return score
}

/**
 * Match user prompt to the most relevant domain
 * Returns the best matching domain or falls back to generic domain
 */
export function matchPromptToDomain(userPrompt: string): Domain {
  const domains = getAllDomains()
  
  // Calculate scores for each domain
  const domainScores = domains.map(domain => ({
    domain,
    score: calculateKeywordScore(userPrompt, domain.keywords, domain.displayName)
  }))
  
  // Sort by score (highest first)
  domainScores.sort((a, b) => b.score - a.score)
  
  // Debug logging
  console.log("🎯 Domain Matching Results:")
  domainScores.slice(0, 5).forEach((item, idx) => {
    console.log(`  ${idx + 1}. ${item.domain.displayName}: ${item.score} points`)
  })
  
  // Get the best match
  const bestMatch = domainScores[0]
  const secondBest = domainScores[1]
  
  // If the best score is 0, fall back to generic domain
  if (bestMatch.score === 0) {
    console.log("⚠️ No keywords matched, falling back to Generic domain")
    const genericDomain = domains.find(d => d.id === 'generic_custom')
    return genericDomain || domains[0]
  }
  
  // If best and second best are very close, prefer non-generic if applicable
  if (secondBest && bestMatch.score - secondBest.score <= 2) {
    if (bestMatch.domain.id === 'generic_custom' && secondBest.score > 0) {
      console.log(`✨ Close match detected, preferring specific domain: ${secondBest.domain.displayName}`)
      return secondBest.domain
    }
  }
  
  console.log(`✅ Best match: ${bestMatch.domain.displayName} (${bestMatch.score} points)`)
  return bestMatch.domain
}

/**
 * Extract specific features/requirements from user prompt
 * Returns custom nodes based on what user is asking for
 * Comprehensive patterns covering all domains
 */
function extractCustomNodesFromPrompt(prompt: string, domainId: string): DomainNode[] {
  const customNodes: DomainNode[] = []
  const promptLower = prompt.toLowerCase()
  
  // Comprehensive action patterns
  const actionPatterns = [
    { pattern: /track(ing)?|monitor(ing)?|watch(ing)?/i, action: 'tracking', verb: 'Track' },
    { pattern: /manage(ment)?|organiz(e|ing)|admin(istration)?/i, action: 'management', verb: 'Manage' },
    { pattern: /analyz(e|ing)|analysis|assess(ment)?|evaluat(e|ing)/i, action: 'analysis', verb: 'Analyze' },
    { pattern: /calculat(e|ing|ion)|compute|measure/i, action: 'calculation', verb: 'Calculate' },
    { pattern: /search(ing)?|find(ing)?|lookup/i, action: 'search', verb: 'Search' },
    { pattern: /book(ing)?|reserv(e|ation)|schedul(e|ing)/i, action: 'booking', verb: 'Book' },
    { pattern: /plan(ning)?|design(ing)?|strateg(y|ize)/i, action: 'planning', verb: 'Plan' },
    { pattern: /recommend(ation)?|suggest(ion)?|advis(e|ing)/i, action: 'recommendation', verb: 'Recommend' },
    { pattern: /generat(e|ing|ion)|creat(e|ing)|build(ing)?/i, action: 'generation', verb: 'Generate' },
    { pattern: /predict(ion)?|forecast(ing)?|estimat(e|ing)/i, action: 'prediction', verb: 'Predict' },
    { pattern: /detect(ion)?|identif(y|ication)|recogniz(e|ing)/i, action: 'detection', verb: 'Detect' },
    { pattern: /automat(e|ion)|process(ing)?/i, action: 'automation', verb: 'Automate' },
    { pattern: /notif(y|ication)|alert(ing)?|remind(er)?/i, action: 'notification', verb: 'Notify' },
    { pattern: /report(ing)?|document(ation)?/i, action: 'reporting', verb: 'Report' },
    { pattern: /optim(ize|ization)|improv(e|ing)/i, action: 'optimization', verb: 'Optimize' },
    { pattern: /review(ing)?|audit(ing)?|check(ing)?/i, action: 'review', verb: 'Review' },
    { pattern: /support(ing)?|help(ing)?|assist(ance)?/i, action: 'support', verb: 'Support' },
    { pattern: /integrat(e|ion)|connect(ing)?|sync(ing)?/i, action: 'integration', verb: 'Integrate' },
    { pattern: /test(ing)?|validat(e|ion)|verif(y|ication)/i, action: 'testing', verb: 'Test' },
    { pattern: /deploy(ment)?|launch(ing)?|release/i, action: 'deployment', verb: 'Deploy' },
    { pattern: /log(ging)?|record(ing)?|captur(e|ing)/i, action: 'logging', verb: 'Log' },
    { pattern: /summariz(e|ation)|brief(ing)?|overview/i, action: 'summarization', verb: 'Summarize' },
    { pattern: /compar(e|ison)|contrast|differentiat(e|ing)/i, action: 'comparison', verb: 'Compare' },
    { pattern: /grade|grading|scoring|rating/i, action: 'grading', verb: 'Grade' },
    { pattern: /tutor(ing)?|teach(ing)?|train(ing)?/i, action: 'tutoring', verb: 'Tutor' },
    { pattern: /moderate|moderation|filter(ing)?/i, action: 'moderation', verb: 'Moderate' }
  ]
  
  // Comprehensive entity patterns for ALL domains
  const entityPatterns = [
    // Travel & Tourism
    { pattern: /\b(flight|flights|airplane|airline)\b/i, entity: 'flight', label: 'Flight', desc: 'flight information and bookings' },
    { pattern: /\b(hotel|hotels|accommodation|lodging|resort)\b/i, entity: 'hotel', label: 'Hotel', desc: 'hotel and accommodation options' },
    { pattern: /\b(destination|destinations|place|location)\b/i, entity: 'destination', label: 'Destination', desc: 'travel destinations and locations' },
    { pattern: /\b(itinerary|itineraries|schedule|route)\b/i, entity: 'itinerary', label: 'Itinerary', desc: 'trip itineraries and schedules' },
    { pattern: /\b(activity|activities|tour|tours|attraction)\b/i, entity: 'activity', label: 'Activity', desc: 'activities and tourist attractions' },
    { pattern: /\b(visa|passport|document|documentation)\b/i, entity: 'travel_document', label: 'Travel Documentation', desc: 'visa and travel documents' },
    
    // Management & Operations
    { pattern: /\b(employee|employees|staff|personnel|worker)\b/i, entity: 'employee', label: 'Employee', desc: 'employee information and management' },
    { pattern: /\b(task|tasks|todo|assignment)\b/i, entity: 'task', label: 'Task', desc: 'task management and tracking' },
    { pattern: /\b(project|projects|initiative)\b/i, entity: 'project', label: 'Project', desc: 'project tracking and management' },
    { pattern: /\b(inventory|stock|warehouse|asset)\b/i, entity: 'inventory', label: 'Inventory', desc: 'inventory and stock management' },
    { pattern: /\b(workflow|process|procedure|operation)\b/i, entity: 'workflow', label: 'Workflow', desc: 'workflow automation and processes' },
    { pattern: /\b(resource|resources|allocation)\b/i, entity: 'resource', label: 'Resource', desc: 'resource planning and allocation' },
    { pattern: /\b(payroll|salary|wage|compensation)\b/i, entity: 'payroll', label: 'Payroll', desc: 'payroll processing and management' },
    { pattern: /\b(performance|kpi|metric|productivity)\b/i, entity: 'performance', label: 'Performance', desc: 'performance tracking and KPIs' },
    { pattern: /\b(leave|vacation|time.?off|absence)\b/i, entity: 'leave', label: 'Leave', desc: 'leave and absence management' },
    
    // Finance & Prediction
    { pattern: /\b(budget|budgets|budgeting)\b/i, entity: 'budget', label: 'Budget', desc: 'budget planning and management' },
    { pattern: /\b(expense|expenses|cost|spending)\b/i, entity: 'expense', label: 'Expense', desc: 'expense tracking and monitoring' },
    { pattern: /\b(revenue|income|earnings|sales)\b/i, entity: 'revenue', label: 'Revenue', desc: 'revenue tracking and forecasting' },
    { pattern: /\b(invoice|invoices|bill|billing)\b/i, entity: 'invoice', label: 'Invoice', desc: 'invoice generation and management' },
    { pattern: /\b(payment|payments|transaction)\b/i, entity: 'payment', label: 'Payment', desc: 'payment processing and transactions' },
    { pattern: /\b(financial|finance|accounting)\b/i, entity: 'financial', label: 'Financial', desc: 'financial analysis and reporting' },
    { pattern: /\b(risk|risks|exposure|threat)\b/i, entity: 'risk', label: 'Risk', desc: 'risk assessment and management' },
    { pattern: /\b(fraud|fraudulent|suspicious)\b/i, entity: 'fraud', label: 'Fraud', desc: 'fraud detection and prevention' },
    { pattern: /\b(pricing|price|pricing.?strategy)\b/i, entity: 'pricing', label: 'Pricing', desc: 'pricing optimization and strategy' },
    { pattern: /\b(forecast|forecasting|projection)\b/i, entity: 'forecast', label: 'Forecast', desc: 'forecasting and predictions' },
    
    // Medical & Health
    { pattern: /\b(symptom|symptoms|sign|condition)\b/i, entity: 'symptom', label: 'Symptom', desc: 'symptom logging and tracking' },
    { pattern: /\b(bmi|body.?mass|weight|height)\b/i, entity: 'bmi', label: 'BMI', desc: 'BMI calculation and tracking' },
    { pattern: /\b(fitness|exercise|workout|training)\b/i, entity: 'fitness', label: 'Fitness', desc: 'fitness tracking and goals' },
    { pattern: /\b(diet|nutrition|meal|food|calorie)\b/i, entity: 'diet', label: 'Diet', desc: 'diet planning and nutrition' },
    { pattern: /\b(health|wellness|wellbeing|vital)\b/i, entity: 'health', label: 'Health', desc: 'health monitoring and wellness' },
    { pattern: /\b(mental|mindfulness|stress|anxiety)\b/i, entity: 'mental_health', label: 'Mental Health', desc: 'mental health and wellness support' },
    { pattern: /\b(patient|medical|clinical|healthcare)\b/i, entity: 'patient', label: 'Patient', desc: 'patient information and care' },
    
    // Development & Code
    { pattern: /\b(code|coding|programming|script)\b/i, entity: 'code', label: 'Code', desc: 'code development and management' },
    { pattern: /\b(bug|bugs|issue|defect|error)\b/i, entity: 'bug', label: 'Bug', desc: 'bug detection and tracking' },
    { pattern: /\b(api|endpoint|rest|service)\b/i, entity: 'api', label: 'API', desc: 'API development and testing' },
    { pattern: /\b(test|tests|testing|qa)\b/i, entity: 'test', label: 'Test', desc: 'testing and quality assurance' },
    { pattern: /\b(deploy|deployment|ci.?cd|pipeline)\b/i, entity: 'deployment', label: 'Deployment', desc: 'deployment automation and CI/CD' },
    { pattern: /\b(git|version.?control|repository|repo)\b/i, entity: 'version_control', label: 'Version Control', desc: 'version control and repository management' },
    { pattern: /\b(devops|infrastructure|container|docker)\b/i, entity: 'devops', label: 'DevOps', desc: 'DevOps automation and infrastructure' },
    
    // Monitoring & Observability
    { pattern: /\b(server|servers|system|infrastructure)\b/i, entity: 'server', label: 'Server', desc: 'server monitoring and management' },
    { pattern: /\b(uptime|availability|downtime|status)\b/i, entity: 'uptime', label: 'Uptime', desc: 'uptime tracking and availability' },
    { pattern: /\b(log|logs|logging|audit)\b/i, entity: 'log', label: 'Log', desc: 'log analysis and auditing' },
    { pattern: /\b(alert|alerts|notification|alarm)\b/i, entity: 'alert', label: 'Alert', desc: 'alerting and notifications' },
    { pattern: /\b(anomaly|anomalies|outlier|unusual)\b/i, entity: 'anomaly', label: 'Anomaly', desc: 'anomaly detection and analysis' },
    { pattern: /\b(metric|metrics|measurement|telemetry)\b/i, entity: 'metric', label: 'Metric', desc: 'metrics collection and analysis' },
    
    // Social & Communication
    { pattern: /\b(chat|conversation|messaging|message)\b/i, entity: 'chat', label: 'Chat', desc: 'chat and messaging functionality' },
    { pattern: /\b(social.?media|post|posts|tweet|facebook)\b/i, entity: 'social_media', label: 'Social Media', desc: 'social media management and posting' },
    { pattern: /\b(content|article|blog|publication)\b/i, entity: 'content', label: 'Content', desc: 'content creation and management' },
    { pattern: /\b(sentiment|emotion|mood|feeling)\b/i, entity: 'sentiment', label: 'Sentiment', desc: 'sentiment analysis and tracking' },
    { pattern: /\b(community|forum|discussion|engagement)\b/i, entity: 'community', label: 'Community', desc: 'community management and engagement' },
    { pattern: /\b(email|mail|newsletter|campaign)\b/i, entity: 'email', label: 'Email', desc: 'email management and campaigns' },
    { pattern: /\b(customer|client|user|visitor)\b/i, entity: 'customer', label: 'Customer', desc: 'customer support and management' },
    
    // Research & Analysis
    { pattern: /\b(data|dataset|database|information)\b/i, entity: 'data', label: 'Data', desc: 'data processing and analysis' },
    { pattern: /\b(market|markets|industry|sector)\b/i, entity: 'market', label: 'Market', desc: 'market research and analysis' },
    { pattern: /\b(trend|trends|pattern|tendency)\b/i, entity: 'trend', label: 'Trend', desc: 'trend analysis and identification' },
    { pattern: /\b(document|documents|file|paper)\b/i, entity: 'document', label: 'Document', desc: 'document processing and analysis' },
    { pattern: /\b(summary|summaries|abstract|overview)\b/i, entity: 'summary', label: 'Summary', desc: 'summarization and abstraction' },
    { pattern: /\b(research|study|investigation|survey)\b/i, entity: 'research', label: 'Research', desc: 'research and investigation' },
    
    // Education & Learning
    { pattern: /\b(quiz|quizzes|test|exam|assessment)\b/i, entity: 'quiz', label: 'Quiz', desc: 'quiz generation and assessment' },
    { pattern: /\b(curriculum|syllabus|course|lesson)\b/i, entity: 'curriculum', label: 'Curriculum', desc: 'curriculum planning and design' },
    { pattern: /\b(student|learner|pupil|trainee)\b/i, entity: 'student', label: 'Student', desc: 'student progress and management' },
    { pattern: /\b(concept|topic|subject|material)\b/i, entity: 'concept', label: 'Concept', desc: 'concept explanation and teaching' },
    { pattern: /\b(learning|education|knowledge|skill)\b/i, entity: 'learning', label: 'Learning', desc: 'learning tracking and development' },
    
    // Prediction & Intelligence
    { pattern: /\b(behavior|behaviour|pattern|habit)\b/i, entity: 'behavior', label: 'Behavior', desc: 'behavior prediction and analysis' },
    { pattern: /\b(demand|requirement|need|consumption)\b/i, entity: 'demand', label: 'Demand', desc: 'demand forecasting and planning' },
    { pattern: /\b(recommendation|suggestion|advice)\b/i, entity: 'recommendation', label: 'Recommendation', desc: 'personalized recommendations' },
    { pattern: /\b(decision|choice|selection|option)\b/i, entity: 'decision', label: 'Decision', desc: 'decision support and analysis' },
    { pattern: /\b(scenario|simulation|model|what.?if)\b/i, entity: 'scenario', label: 'Scenario', desc: 'scenario simulation and modeling' },
    { pattern: /\b(intent|intention|purpose|goal)\b/i, entity: 'intent', label: 'Intent', desc: 'intent detection and understanding' },
    
    // Generic/Common
    { pattern: /\b(order|orders|purchase|transaction)\b/i, entity: 'order', label: 'Order', desc: 'order processing and management' },
    { pattern: /\b(report|reports|reporting|analytics)\b/i, entity: 'report', label: 'Report', desc: 'report generation and analytics' },
    { pattern: /\b(notification|notifications|reminder)\b/i, entity: 'notification', label: 'Notification', desc: 'notifications and reminders' },
    { pattern: /\b(search|query|lookup|find)\b/i, entity: 'search', label: 'Search', desc: 'search and information retrieval' },
    { pattern: /\b(backup|restore|recovery|archive)\b/i, entity: 'backup', label: 'Backup', desc: 'backup and recovery management' },
    { pattern: /\b(security|authentication|authorization|access)\b/i, entity: 'security', label: 'Security', desc: 'security and access control' }
  ]
  
  // Find matching actions and entities
  const foundActions: Array<{action: string, verb: string}> = []
  const foundEntities: Array<{entity: string, label: string, desc: string}> = []
  
  actionPatterns.forEach(ap => {
    if (ap.pattern.test(prompt)) {
      foundActions.push({ action: ap.action, verb: ap.verb })
    }
  })
  
  entityPatterns.forEach(ep => {
    if (ep.pattern.test(prompt)) {
      foundEntities.push({ entity: ep.entity, label: ep.label, desc: ep.desc })
    }
  })
  
  console.log(`🔍 Detected ${foundActions.length} actions and ${foundEntities.length} entities from prompt`)
  
  // Generate custom nodes by combining actions + entities
  foundEntities.forEach(entity => {
    if (foundActions.length > 0) {
      foundActions.forEach(action => {
        const nodeId = `${entity.entity}_${action.action}`
        const nodeLabel = `${entity.label} ${action.verb}`
        const nodeDesc = `${action.verb} ${entity.desc}`
        
        // Avoid duplicates
        if (!customNodes.some(n => n.id === nodeId)) {
          customNodes.push({
            id: nodeId,
            label: nodeLabel,
            description: nodeDesc
          })
        }
      })
    } else {
      // No actions found, create default management node
      const nodeId = `${entity.entity}_management`
      if (!customNodes.some(n => n.id === nodeId)) {
        customNodes.push({
          id: nodeId,
          label: `${entity.label} Management`,
          description: `Manage ${entity.desc}`
        })
      }
    }
  })
  
  // Limit custom nodes to avoid overwhelming the graph
  if (customNodes.length > 8) {
    console.log(`⚠️ Too many custom nodes (${customNodes.length}), limiting to 8 most relevant`)
    return customNodes.slice(0, 8)
  }
  
  return customNodes
}

/**
 * Get domain configuration for agent creation with intelligent node selection
 */
export interface DomainConfiguration {
  domain: Domain
  mainAgent: {
    name: string
    type: string
    description: string
  }
  subAgents: Array<{
    id: string
    name: string
    description: string
    type: string
    relevanceScore?: number
    isCustom?: boolean
  }>
  tools: string[]
  uiBlocks: string[]
}

/**
 * Score how relevant a node is to the user prompt
 */
function scoreNodeRelevance(node: DomainNode, userPrompt: string): number {
  const promptLower = userPrompt.toLowerCase()
  const nodeLabelLower = node.label.toLowerCase()
  const nodeDescLower = node.description.toLowerCase()
  const nodeIdLower = node.id.toLowerCase()
  
  let score = 0
  
  // Check if node label words appear in prompt
  const labelWords = nodeLabelLower.split(/\s+/)
  labelWords.forEach(word => {
    if (word.length > 2 && promptLower.includes(word)) {
      score += 5
    }
  })
  
  // Check if node ID (without underscores) appears in prompt
  const nodeIdWords = nodeIdLower.split('_')
  nodeIdWords.forEach(word => {
    if (word.length > 2 && promptLower.includes(word)) {
      score += 4
    }
  })
  
  // Check description keywords
  const descWords = nodeDescLower.split(/\s+/)
  descWords.forEach(word => {
    if (word.length > 3 && promptLower.includes(word)) {
      score += 2
    }
  })
  
  // Exact label match gets highest score
  if (promptLower.includes(nodeLabelLower)) {
    score += 15
  }
  
  return score
}

export function getDomainConfiguration(domain: Domain, agentName: string, userPrompt?: string): DomainConfiguration {
  // Select primary agent type (prefer llm_agent)
  const primaryAgentType = domain.agentTypes.includes('llm_agent') 
    ? 'llm_agent' 
    : domain.agentTypes[0]
  
  // Extract custom nodes from user prompt
  const customNodes = userPrompt ? extractCustomNodesFromPrompt(userPrompt, domain.id) : []
  
  if (customNodes.length > 0) {
    console.log("🎨 Generated custom nodes from prompt:", customNodes.map(n => n.label).join(", "))
  }
  
  // Create sub-agents from domain nodes with relevance scoring
  let domainSubAgents = domain.nodes.map(node => ({
    id: node.id,
    name: node.label,
    description: node.description,
    type: domain.agentTypes.includes('sequential_agent') ? 'sequential_agent' : 'llm_agent',
    relevanceScore: userPrompt ? scoreNodeRelevance(node, userPrompt) : 0,
    isCustom: false
  }))
  
  // Add custom nodes with high relevance
  const customSubAgents = customNodes.map(node => ({
    id: node.id,
    name: node.label,
    description: node.description,
    type: 'llm_agent' as const,
    relevanceScore: 20, // Custom nodes get high relevance since they're extracted from user intent
    isCustom: true
  }))
  
  // Combine domain nodes + custom nodes
  let allSubAgents = [...customSubAgents, ...domainSubAgents]
  
  // If user prompt provided, intelligently select most relevant nodes
  if (userPrompt) {
    // Sort by relevance
    allSubAgents.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
    
    // Log relevance scores
    console.log("📊 Node Relevance Scores:")
    allSubAgents.slice(0, 10).forEach((agent, idx) => {
      if (agent.relevanceScore && agent.relevanceScore > 0) {
        const customTag = agent.isCustom ? " (custom)" : ""
        console.log(`  ${idx + 1}. ${agent.name}: ${agent.relevanceScore} points${customTag}`)
      }
    })
    
    // Select nodes based on relevance
    const hasRelevantNodes = allSubAgents.some(a => (a.relevanceScore || 0) > 0)
    
    if (hasRelevantNodes) {
      // More strict filtering - only highly relevant nodes
      const highlyRelevantThreshold = 8
      const relevantThreshold = 4
      
      // First, take all highly relevant nodes (score >= 8)
      let selectedNodes = allSubAgents.filter(a => (a.relevanceScore || 0) >= highlyRelevantThreshold)
      
      // If we have less than 3 highly relevant, add moderately relevant (score >= 4)
      if (selectedNodes.length < 3) {
        const moderatelyRelevant = allSubAgents.filter(a => 
          (a.relevanceScore || 0) >= relevantThreshold && (a.relevanceScore || 0) < highlyRelevantThreshold
        )
        selectedNodes = [...selectedNodes, ...moderatelyRelevant]
      }
      
      // Limit to 3-6 nodes for clarity
      const minNodes = Math.min(3, allSubAgents.filter(a => (a.relevanceScore || 0) > 0).length)
      const maxNodes = 6
      
      if (selectedNodes.length < minNodes) {
        selectedNodes = allSubAgents.slice(0, minNodes)
      } else if (selectedNodes.length > maxNodes) {
        selectedNodes = selectedNodes.slice(0, maxNodes)
      }
      
      allSubAgents = selectedNodes
      console.log(`✅ Selected ${allSubAgents.length} highly relevant nodes (${allSubAgents.filter(a => a.isCustom).length} custom)`)
    } else {
      // No specific relevance, use all nodes but limit to 4 for clarity
      allSubAgents = allSubAgents.slice(0, 4)
      console.log(`ℹ️ Using default node selection (top ${allSubAgents.length} nodes)`)
    }
  } else {
    // No prompt context, limit to reasonable number
    allSubAgents = allSubAgents.slice(0, 4)
  }
  
  return {
    domain,
    mainAgent: {
      name: agentName,
      type: primaryAgentType,
      description: domain.description
    },
    subAgents: allSubAgents,
    tools: domain.defaultTools,
    uiBlocks: domain.uiBlocks
  }
}

/**
 * Extract agent type from user prompt
 * Used for backward compatibility with existing name extraction
 */
export function extractAgentTypeFromPrompt(prompt: string): string {
  const domain = matchPromptToDomain(prompt)
  return domain.displayName.toLowerCase().replace(/[^a-z0-9]/g, '_')
}

/**
 * Get nodes for a specific domain
 */
export function getDomainNodes(domainId: string): DomainNode[] {
  const domain = getDomainById(domainId)
  return domain?.nodes || []
}

/**
 * Check if domain requires special handling (e.g., medical disclaimer)
 */
export function requiresDisclaimer(domain: Domain): boolean {
  return domain.metadata?.nonDiagnostic === true
}

/**
 * Get disclaimer text for a domain
 */
export function getDisclaimer(domain: Domain): string | null {
  return domain.metadata?.disclaimer || null
}
