/**
 * Gemini Chat Service
 * 
 * This file handles all communication with Google's Gemini AI.
 * It allows the built agent to "come alive" and chat with users.
 * Includes smart mock responses as fallback when API is unavailable.
 */

import { GoogleGenerativeAI, ChatSession } from '@google/generative-ai';

// ============================================
// Agent Context Interface
// ============================================

export interface AgentContext {
    agentName: string;
    purpose: string;
    agentType: string;
}

// ============================================
// System Prompt Builder
// ============================================

function buildSystemPrompt(context: AgentContext): string {
    return `You are "${context.agentName}", an AI assistant created by Artifex Agent Builder.

## Your Identity
- Name: ${context.agentName}
- Type: ${context.agentType}

## Your Purpose
${context.purpose}

## Behavior Guidelines
1. Always stay in character as "${context.agentName}"
2. Be helpful and provide accurate information related to your purpose
3. If asked about something outside your capabilities, politely redirect to your main purpose
4. Be concise but thorough in your responses
5. Use a professional and helpful communication style

## Important
- You were just created by the user using Artifex
- This is a preview chat to test your capabilities
- Help the user understand what you can do`;
}

// ============================================
// Smart Mock Response Generator
// ============================================
// Provides contextual mock responses based on agent's purpose and user query

function generateSmartMockResponse(userMessage: string, context: AgentContext): string {
    const lowerMessage = userMessage.toLowerCase();
    const agentName = context.agentName;
    const purpose = context.purpose.toLowerCase();

    // Extract key topics from the agent's purpose
    const purposeKeywords = extractKeywords(purpose);

    // Common greeting responses - personalized with agent purpose
    if (lowerMessage.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
        return `Hello! I'm ${agentName}. I was created to help you with: **${context.purpose}**.\n\nI'm ready to assist you! What would you like to know or discuss?`;
    }

    // What can you do / capabilities questions
    if (lowerMessage.includes('what can you') || lowerMessage.includes('help me') || lowerMessage.includes('capabilities') || lowerMessage.includes('what do you')) {
        return `As ${agentName}, here's what I can help you with:\n\n` +
            `**My Specialty:**\n${context.purpose}\n\n` +
            `**I can assist with:**\n` +
            `• Answering questions about ${purposeKeywords.slice(0, 3).join(', ')}\n` +
            `• Providing recommendations and guidance\n` +
            `• Explaining concepts and processes\n` +
            `• Helping you make informed decisions\n` +
            `• Offering tips and best practices\n\n` +
            `What specific topic would you like to explore?`;
    }

    // Generate response based on matching keywords from purpose
    const matchedTopics = findMatchingTopics(lowerMessage, purpose);

    if (matchedTopics.length > 0) {
        // User asked about something related to the agent's purpose
        const responses = generateTopicResponses(matchedTopics, context);
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Check for common action words
    if (lowerMessage.includes('how') || lowerMessage.includes('what') || lowerMessage.includes('why') || lowerMessage.includes('when') || lowerMessage.includes('where')) {
        return generateQuestionResponse(userMessage, context, purposeKeywords);
    }

    // Check for request/action patterns
    if (lowerMessage.includes('can you') || lowerMessage.includes('please') || lowerMessage.includes('i need') || lowerMessage.includes('i want')) {
        return generateActionResponse(userMessage, context, purposeKeywords);
    }

    // Default - contextual response based on agent's purpose
    return generateDefaultResponse(userMessage, context, purposeKeywords);
}

// Extract important keywords from the agent's purpose
function extractKeywords(purpose: string): string[] {
    const stopWords = ['a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'and', 'but', 'if', 'or', 'because', 'until', 'while', 'that', 'which', 'who', 'whom', 'this', 'these', 'those', 'am', 'build', 'create', 'make', 'agent', 'assistant', 'bot', 'help', 'helps'];

    const words = purpose.split(/\s+/).filter(word =>
        word.length > 2 && !stopWords.includes(word.toLowerCase())
    );

    return [...new Set(words)].slice(0, 10);
}

// Find matching topics between user message and agent purpose
function findMatchingTopics(message: string, purpose: string): string[] {
    const messageWords = message.split(/\s+/).map(w => w.toLowerCase());
    const purposeWords = purpose.split(/\s+/).map(w => w.toLowerCase());

    return messageWords.filter(word =>
        word.length > 3 && purposeWords.some(pw => pw.includes(word) || word.includes(pw))
    );
}

// Generate responses about matched topics
function generateTopicResponses(topics: string[], context: AgentContext): string[] {
    const topicStr = topics.join(', ');
    return [
        `Great question about **${topicStr}**!\n\nBased on my purpose (${context.purpose}), here's what I can tell you:\n\n` +
        `• This is an important aspect of what I specialize in\n` +
        `• I can provide detailed guidance and recommendations\n` +
        `• Let me know if you'd like specific information or tips\n\n` +
        `What specific aspect of ${topicStr} would you like to explore?`,

        `I'm glad you asked about **${topicStr}**! This is right in my wheelhouse.\n\n` +
        `As ${context.agentName}, I can help you with:\n` +
        `1. Understanding the basics and best practices\n` +
        `2. Providing specific recommendations\n` +
        `3. Answering detailed questions\n` +
        `4. Offering tips based on common scenarios\n\n` +
        `Tell me more about what you need!`,

        `**${topicStr.charAt(0).toUpperCase() + topicStr.slice(1)}** - excellent topic!\n\n` +
        `Based on ${context.purpose}, I can offer:\n\n` +
        `✓ Comprehensive guidance\n` +
        `✓ Practical recommendations\n` +
        `✓ Step-by-step assistance\n` +
        `✓ Best practices and tips\n\n` +
        `What would be most helpful for you?`,

        `You're asking about the right things! **${topicStr}** is central to my expertise.\n\n` +
        `Here's how I can help:\n` +
        `• Answer your specific questions\n` +
        `• Provide detailed explanations\n` +
        `• Offer personalized recommendations\n` +
        `• Share insights and tips\n\n` +
        `Go ahead and ask me anything specific!`,

        `Perfect! **${topicStr}** is exactly what I'm designed to help with.\n\n` +
        `My capabilities include:\n` +
        `📌 In-depth knowledge about this topic\n` +
        `📌 Practical advice and guidance\n` +
        `📌 Customized recommendations\n` +
        `📌 Answers to your specific questions\n\n` +
        `What details would you like to know?`,
    ];
}

// Generate response for question-type queries
function generateQuestionResponse(message: string, context: AgentContext, keywords: string[]): string {
    const keywordStr = keywords.slice(0, 3).join(', ');
    const responses = [
        `That's a thoughtful question!\n\nAs ${context.agentName}, my expertise covers: ${context.purpose}\n\n` +
        `To give you the best answer, I'd consider factors like ${keywordStr}.\n\n` +
        `Could you provide more details about your specific situation?`,

        `Good question! Let me help you understand this.\n\n` +
        `Based on my specialty in ${keywordStr}, here's my perspective:\n\n` +
        `• This topic has several important aspects to consider\n` +
        `• The answer often depends on your specific needs\n` +
        `• I can provide more tailored guidance with more details\n\n` +
        `What's your particular context or goal?`,

        `I appreciate the question!\n\n` +
        `As your ${context.agentName}, I think about this in terms of:\n` +
        `1. Your specific needs and goals\n` +
        `2. Best practices in ${keywordStr}\n` +
        `3. Practical considerations\n\n` +
        `Tell me more about what you're trying to achieve!`,

        `That's exactly the kind of question I'm here to help with!\n\n` +
        `My approach to answering this involves considering:\n` +
        `• Your unique situation\n` +
        `• Key factors related to ${keywordStr}\n` +
        `• Best practices and recommendations\n\n` +
        `Share more details and I'll give you specific guidance!`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

// Generate response for action/request queries
function generateActionResponse(message: string, context: AgentContext, keywords: string[]): string {
    const keywordStr = keywords.slice(0, 3).join(', ');
    const responses = [
        `Absolutely! I'd be happy to help with that.\n\n` +
        `As ${context.agentName}, here's how I can assist:\n\n` +
        `1. **Understand your needs**: Tell me more about what you're looking for\n` +
        `2. **Provide guidance**: I'll offer recommendations based on ${keywordStr}\n` +
        `3. **Answer questions**: I'm here to clarify anything\n\n` +
        `What specific help do you need?`,

        `Of course! That's exactly what I'm here for.\n\n` +
        `Let me help you with this step by step:\n` +
        `• First, tell me more about your specific requirements\n` +
        `• I'll provide tailored recommendations\n` +
        `• We can refine the approach as needed\n\n` +
        `What details can you share?`,

        `I'm ready to assist!\n\n` +
        `Based on my expertise in ${context.purpose}, I can:\n` +
        `✓ Provide specific recommendations\n` +
        `✓ Guide you through the process\n` +
        `✓ Answer any questions you have\n` +
        `✓ Offer tips and best practices\n\n` +
        `Let's get started - what's your priority?`,

        `Happy to help!\n\n` +
        `Here's my approach:\n` +
        `1. Understand exactly what you need\n` +
        `2. Apply my knowledge of ${keywordStr}\n` +
        `3. Provide actionable recommendations\n\n` +
        `Please share more details about your request!`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

// Generate default contextual response
function generateDefaultResponse(message: string, context: AgentContext, keywords: string[]): string {
    const keywordStr = keywords.slice(0, 4).join(', ');
    const responses = [
        `Thanks for your message!\n\n` +
        `As ${context.agentName}, I specialize in: **${context.purpose}**\n\n` +
        `I can help you with topics related to ${keywordStr}.\n\n` +
        `What specific information or assistance do you need?`,

        `I'm here to help!\n\n` +
        `My expertise covers: ${context.purpose}\n\n` +
        `Key areas I can assist with:\n` +
        `• ${keywords[0] || 'General guidance'}\n` +
        `• ${keywords[1] || 'Recommendations'}\n` +
        `• ${keywords[2] || 'Best practices'}\n\n` +
        `How can I assist you today?`,

        `Thank you for reaching out!\n\n` +
        `I'm ${context.agentName}, and I'm designed to help with ${context.purpose}.\n\n` +
        `Feel free to ask me about:\n` +
        `→ ${keywordStr}\n` +
        `→ Related topics and questions\n` +
        `→ Specific guidance you need\n\n` +
        `What would you like to know?`,

        `Great to hear from you!\n\n` +
        `As your ${context.agentName}, I focus on: **${context.purpose}**\n\n` +
        `I'm ready to help with questions about ${keywordStr} and related topics.\n\n` +
        `What can I help you with today?`,

        `Hello! I received your message.\n\n` +
        `Just a reminder - I'm ${context.agentName}, created to help with:\n` +
        `**${context.purpose}**\n\n` +
        `Ask me anything related to ${keywordStr}, and I'll do my best to assist!\n\n` +
        `What's on your mind?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

// ============================================
// Gemini Chat Service Class
// ============================================

class GeminiChatService {
    private genAI: GoogleGenerativeAI | null = null;
    private chatSession: ChatSession | null = null;
    private agentContext: AgentContext | null = null;
    private isInitialized: boolean = false;
    private useMockMode: boolean = false;

    /**
     * Initialize the Gemini client with API key
     */
    initialize(): boolean {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
            console.warn('⚠️ Gemini API key not configured - using mock mode');
            this.useMockMode = true;
            this.isInitialized = true;
            return true; // Return true but use mock mode
        }

        try {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.isInitialized = true;
            this.useMockMode = false;
            console.log('✅ Gemini chat service initialized');
            return true;
        } catch (error) {
            console.warn('⚠️ Failed to initialize Gemini - using mock mode');
            this.useMockMode = true;
            this.isInitialized = true;
            return true;
        }
    }

    /**
     * Start a new chat session with the agent's context
     */
    startChat(context: AgentContext): void {
        this.agentContext = context;

        if (this.useMockMode || !this.genAI) {
            console.log(`🤖 Started mock chat session for "${context.agentName}"`);
            return;
        }

        try {
            const model = this.genAI.getGenerativeModel({
                model: 'gemini-2.0-flash',
                systemInstruction: buildSystemPrompt(context),
            });

            this.chatSession = model.startChat({
                history: [],
            });

            console.log(`🤖 Started Gemini chat session for "${context.agentName}"`);
        } catch (error) {
            console.warn('⚠️ Failed to start Gemini session - falling back to mock mode');
            this.useMockMode = true;
        }
    }

    /**
     * Send a message to the agent and get a response
     */
    async sendMessage(userMessage: string): Promise<string> {
        if (!this.agentContext) {
            throw new Error('Chat session not started. Call startChat() first.');
        }

        // If in mock mode, use smart mock responses
        if (this.useMockMode || !this.chatSession) {
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
            return generateSmartMockResponse(userMessage, this.agentContext);
        }

        try {
            const result = await this.chatSession.sendMessage(userMessage);
            const response = result.response.text();
            return response;
        } catch (error: unknown) {
            console.error('Error sending message:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);

            // On quota error, fallback to mock mode silently
            if (errorMessage.includes('429') || errorMessage.includes('quota')) {
                console.log('📝 Quota exceeded - falling back to mock response');
                this.useMockMode = true;
                await new Promise(resolve => setTimeout(resolve, 500));
                return generateSmartMockResponse(userMessage, this.agentContext);
            }

            throw new Error('Failed to get response from agent. Please try again.');
        }
    }

    /**
     * Clear the current chat and start fresh
     */
    clearChat(): void {
        if (this.agentContext) {
            this.startChat(this.agentContext);
        }
    }

    /**
     * Check if the service is ready
     */
    isReady(): boolean {
        return this.isInitialized;
    }

    /**
     * Check if using mock mode
     */
    isMockMode(): boolean {
        return this.useMockMode;
    }

    /**
     * Get the current agent's name
     */
    getAgentName(): string {
        return this.agentContext?.agentName || 'Agent';
    }
}

// Export singleton instance
export const geminiChatService = new GeminiChatService();
