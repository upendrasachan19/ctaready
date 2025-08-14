# AI Compliance Assistant Architecture

## Overview
AI-powered CTA compliance assistant using OpenAI GPT-4 with function calling, usage tracking, safety controls, and structured guidance delivery. Designed to provide educational information while avoiding legal advice liability.

## Core AI Architecture

### 4.1 OpenAI Integration Layer

- [ ] **Task: Create AI service foundation**
  ```typescript
  // lib/ai/openai-client.ts
  import OpenAI from 'openai'
  
  export class AIComplianceService {
    private openai: OpenAI
    
    constructor() {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
    }
    
    async generateResponse(
      conversation: ConversationContext,
      message: string,
      userId: string
    ): Promise<AIResponse> {
      // Usage validation
      // Context preparation  
      // Function calling setup
      // Response generation
      // Usage tracking
      // Safety validation
    }
  }
  ```
  - Priority: Critical
  - Dependencies: OpenAI API key, usage tracking system
  - Estimated time: 3 hours

- [ ] **Task: Define AI response types**
  ```typescript
  // types/ai.ts
  interface AIResponse {
    id: string
    message: string
    type: ResponseType
    confidence: number
    sources?: string[]
    follow_up_questions?: string[]
    suggested_actions?: SuggestedAction[]
    disclaimers: string[]
    token_usage: TokenUsage
  }
  
  type ResponseType = 
    | 'eligibility_assessment'
    | 'beneficial_owner_guidance' 
    | 'deadline_calculation'
    | 'document_checklist'
    | 'general_guidance'
    | 'clarification_needed'
  
  interface SuggestedAction {
    type: 'create_entity' | 'add_owner' | 'schedule_filing' | 'upgrade_plan'
    label: string
    description: string
    url?: string
  }
  ```
  - Priority: High
  - Dependencies: Business requirements
  - Estimated time: 1 hour

### 4.2 Function Calling System

- [ ] **Task: Create structured function definitions**
  ```typescript
  // lib/ai/functions.ts
  export const AI_FUNCTIONS = {
    assess_cta_eligibility: {
      name: 'assess_cta_eligibility',
      description: 'Assess whether an entity needs to file CTA reports',
      parameters: {
        type: 'object',
        properties: {
          entity_type: { type: 'string', enum: ['corporation', 'llc', 'partnership'] },
          formation_date: { type: 'string', format: 'date' },
          is_foreign_entity: { type: 'boolean' },
          has_business_operations: { type: 'boolean' },
          employee_count: { type: 'number' },
          annual_revenue: { type: 'number' }
        },
        required: ['entity_type', 'formation_date']
      }
    },
    
    identify_beneficial_owners: {
      name: 'identify_beneficial_owners',
      description: 'Help identify who qualifies as beneficial owners',
      parameters: {
        type: 'object', 
        properties: {
          ownership_structure: { type: 'array', items: { type: 'object' } },
          control_mechanisms: { type: 'array', items: { type: 'string' } },
          entity_officers: { type: 'array', items: { type: 'object' } }
        }
      }
    },
    
    calculate_filing_deadline: {
      name: 'calculate_filing_deadline',
      description: 'Calculate CTA filing deadlines based on entity formation',
      parameters: {
        type: 'object',
        properties: {
          formation_date: { type: 'string', format: 'date' },
          entity_type: { type: 'string' },
          is_existing_entity: { type: 'boolean' }
        },
        required: ['formation_date', 'entity_type']
      }
    },
    
    generate_document_checklist: {
      name: 'generate_document_checklist',
      description: 'Create personalized document preparation checklist',
      parameters: {
        type: 'object',
        properties: {
          entity_info: { type: 'object' },
          beneficial_owners_count: { type: 'number' },
          has_foreign_owners: { type: 'boolean' }
        }
      }
    }
  } as const
  ```
  - Priority: High
  - Dependencies: CTA requirements research
  - Estimated time: 4 hours

- [ ] **Task: Implement function handlers**
  ```typescript
  // lib/ai/function-handlers.ts
  export class FunctionHandler {
    async assessCTAEligibility(params: AssessmentParams): Promise<EligibilityResult> {
      // Apply CTA eligibility rules
      // Generate explanation
      // Provide confidence score
      // List required next steps
    }
    
    async identifyBeneficialOwners(params: OwnershipParams): Promise<OwnershipAnalysis> {
      // Analyze ownership percentages
      // Identify control mechanisms
      // Flag complex structures
      // Suggest documentation needs
    }
    
    async calculateFilingDeadline(params: DeadlineParams): Promise<DeadlineResult> {
      // Calculate based on formation date
      // Consider entity type rules
      // Account for weekends/holidays
      // Generate calendar entries
    }
    
    async generateDocumentChecklist(params: ChecklistParams): Promise<DocumentChecklist> {
      // Create personalized checklist
      // Prioritize by importance
      // Include acquisition guidance
      // Estimate completion time
    }
  }
  ```
  - Priority: High
  - Dependencies: Function definitions, CTA rules engine
  - Estimated time: 6 hours

## Conversation Management

### 4.3 Context Management System

- [ ] **Task: Create conversation context builder**
  ```typescript
  // lib/ai/context-manager.ts
  interface ConversationContext {
    user_id: string
    conversation_id: string
    user_profile: UserProfile
    entities: Entity[]
    conversation_history: Message[]
    current_focus?: {
      entity_id: string
      topic: string
    }
    usage_stats: {
      messages_this_month: number
      tokens_used: number
      plan_limits: PlanLimits
    }
  }
  
  export class ContextManager {
    async buildContext(userId: string, conversationId: string): Promise<ConversationContext> {
      // Load user profile and entities
      // Retrieve conversation history
      // Calculate usage statistics
      // Determine current focus
    }
    
    async updateContext(
      context: ConversationContext,
      newMessage: Message,
      aiResponse: AIResponse
    ): Promise<ConversationContext> {
      // Add messages to history
      // Update usage statistics
      // Adjust focus based on content
      // Persist context changes
    }
  }
  ```
  - Priority: High
  - Dependencies: Database schema, user management
  - Estimated time: 3 hours

- [ ] **Task: Implement conversation persistence**
  ```typescript
  // lib/ai/conversation-store.ts
  export class ConversationStore {
    async createConversation(userId: string, title?: string): Promise<string> {
      // Create new conversation record
      // Generate conversation ID
      // Set initial context
    }
    
    async saveMessage(
      conversationId: string,
      message: Message,
      response: AIResponse
    ): Promise<void> {
      // Save message pair
      // Update token usage
      // Index for search
    }
    
    async getConversationHistory(
      conversationId: string,
      limit?: number
    ): Promise<Message[]> {
      // Retrieve message history
      // Apply pagination
      // Include context metadata
    }
    
    async searchConversations(
      userId: string,
      query: string
    ): Promise<ConversationSearchResult[]> {
      // Full-text search across conversations
      // Rank by relevance
      // Include snippets
    }
  }
  ```
  - Priority: Medium
  - Dependencies: Database schema
  - Estimated time: 2 hours

### 4.4 Usage Tracking & Limits

- [ ] **Task: Create usage enforcement system**
  ```typescript
  // lib/ai/usage-manager.ts
  interface UsageLimits {
    messages_per_month: number
    tokens_per_month: number
    conversations_per_month: number
    advanced_features_enabled: boolean
  }
  
  export class UsageManager {
    async checkUsageLimit(
      userId: string,
      requestType: 'message' | 'token' | 'conversation'
    ): Promise<UsageCheckResult> {
      // Check current usage against limits
      // Calculate remaining allowance
      // Suggest upgrade if needed
    }
    
    async recordUsage(
      userId: string,
      usage: {
        tokens: number
        message_count: number
        conversation_id: string
      }
    ): Promise<void> {
      // Record usage statistics
      // Update monthly totals
      // Trigger alerts if approaching limits
    }
    
    async resetMonthlyUsage(userId: string): Promise<void> {
      // Reset monthly counters
      // Preserve historical data
      // Log reset event
    }
  }
  ```
  - Priority: High
  - Dependencies: Subscription system
  - Estimated time: 2 hours

## Safety & Compliance Controls

### 4.5 Prompt Engineering & Safety

- [ ] **Task: Create safe prompt templates**
  ```typescript
  // lib/ai/prompts.ts
  export const SYSTEM_PROMPT = `
  You are CTAReady Assistant, an educational tool for Corporate Transparency Act (CTA) compliance.
  
  CRITICAL SAFETY RULES:
  1. You provide EDUCATIONAL INFORMATION ONLY, never legal advice
  2. Always include disclaimers about consulting qualified professionals
  3. Base responses on official FinCEN guidance and regulations
  4. Never make definitive legal determinations
  5. Encourage users to verify information with legal counsel
  6. Do not process or store sensitive personal information
  
  RESPONSE GUIDELINES:
  - Use structured function calling for consistency
  - Provide confidence levels for assessments
  - Include relevant sources and references
  - Offer follow-up questions to gather needed info
  - Suggest practical next steps
  
  PROHIBITED ACTIONS:
  - Filing reports on behalf of users
  - Making final compliance determinations
  - Storing SSNs, passport numbers, or other PII
  - Providing tax or legal advice
  - Guaranteeing compliance outcomes
  `
  
  export const RESPONSE_TEMPLATES = {
    eligibility_assessment: `
      Based on the information provided, here's an educational assessment of CTA filing requirements:
      
      {assessment_result}
      
      IMPORTANT DISCLAIMER: This is educational guidance only. Final compliance determinations 
      should be made with qualified legal or compliance professionals.
      
      Sources: {sources}
      Confidence Level: {confidence}%
    `,
    
    beneficial_owner_guidance: `
      Here's educational guidance on beneficial ownership identification:
      
      {ownership_analysis}
      
      DISCLAIMER: Beneficial ownership rules can be complex. Consult with legal professionals 
      for definitive determinations, especially for complex ownership structures.
    `
  }
  ```
  - Priority: Critical
  - Dependencies: Legal review
  - Estimated time: 4 hours

- [ ] **Task: Implement response validation**
  ```typescript
  // lib/ai/safety-validator.ts
  export class SafetyValidator {
    async validateResponse(response: string): Promise<ValidationResult> {
      // Check for prohibited content
      // Ensure disclaimers are included
      // Validate confidence levels
      // Flag potentially problematic responses
    }
    
    private checkProhibitedContent(content: string): string[] {
      const prohibitedPatterns = [
        /legal advice/i,
        /guaranteed compliance/i,
        /we will file/i,
        /definitive determination/i
      ]
      
      // Scan for prohibited patterns
      // Return list of violations
    }
    
    async addSafetyDisclaimers(response: AIResponse): Promise<AIResponse> {
      // Add appropriate disclaimers
      // Include source references
      // Add confidence caveats
    }
  }
  ```
  - Priority: High
  - Dependencies: Legal requirements
  - Estimated time: 2 hours

## User Interface Components

### 4.6 Chat Interface

- [ ] **Task: Create AI chat component**
  ```typescript
  // components/ai/AIAssistant.tsx
  interface AIAssistantProps {
    entityId?: string
    conversationId?: string
    initialMessage?: string
    showUsageLimit?: boolean
  }
  
  export function AIAssistant({ entityId, conversationId, initialMessage }: AIAssistantProps) {
    // Message input and send
    // Conversation history display
    // Typing indicators
    // Usage limit warnings
    // Suggested follow-up questions
    // Action buttons for structured responses
  }
  ```
  - Features: Auto-scroll, message formatting, code highlighting
  - Priority: High
  - Dependencies: AI service, UI components
  - Estimated time: 4 hours

- [ ] **Task: Create message components**
  ```typescript
  // components/ai/MessageBubble.tsx
  interface MessageBubbleProps {
    message: Message
    isUser: boolean
    showActions?: boolean
  }
  
  // components/ai/AIResponse.tsx
  interface AIResponseProps {
    response: AIResponse
    onActionClick: (action: SuggestedAction) => void
  }
  
  // components/ai/UsageMeter.tsx
  interface UsageMeterProps {
    used: number
    limit: number
    resetDate: Date
  }
  ```
  - Priority: High
  - Dependencies: Design system
  - Estimated time: 3 hours

### 4.7 Specialized AI Tools

- [ ] **Task: Create eligibility checker widget**
  ```typescript
  // components/ai/EligibilityChecker.tsx
  export function EligibilityChecker() {
    // Quick questionnaire form
    // Real-time eligibility assessment
    // Results display with explanations
    // Next steps guidance
    // Share/save results
  }
  ```
  - Integration with free tools section
  - Priority: High
  - Estimated time: 3 hours

- [ ] **Task: Create beneficial owner wizard**
  ```typescript
  // components/ai/BeneficialOwnerWizard.tsx
  export function BeneficialOwnerWizard({ entityId }: { entityId: string }) {
    // Step-by-step ownership mapping
    // Interactive ownership tree
    // AI-powered suggestions
    // Export to entity profile
  }
  ```
  - Priority: High
  - Dependencies: Entity management
  - Estimated time: 4 hours

- [ ] **Task: Create document checklist generator**
  ```typescript
  // components/ai/ChecklistGenerator.tsx
  export function ChecklistGenerator({ entityId, owners }: ChecklistProps) {
    // AI-generated personalized checklist
    // Interactive task completion
    // Document upload integration
    // Progress tracking
  }
  ```
  - Priority: Medium
  - Dependencies: Document management
  - Estimated time: 3 hours

## API Endpoints

### 4.8 AI API Routes

- [ ] **Task: Create AI chat API**
  ```typescript
  // app/api/ai/chat/route.ts
  export async function POST(request: Request) {
    // Validate authentication
    // Check usage limits
    // Process message with AI
    // Save conversation
    // Return structured response
  }
  
  // app/api/ai/conversations/route.ts
  export async function GET(request: Request) {
    // List user conversations
    // Support pagination
    // Include metadata
  }
  
  // app/api/ai/usage/route.ts
  export async function GET(request: Request) {
    // Return current usage statistics
    // Calculate remaining limits
    // Provide usage history
  }
  ```
  - Priority: High
  - Dependencies: Authentication, database
  - Estimated time: 3 hours

### 4.9 Specialized Tool APIs

- [ ] **Task: Create free tool APIs**
  ```typescript
  // app/api/tools/eligibility/route.ts
  // app/api/tools/deadline/route.ts
  // app/api/tools/ownership/route.ts
  ```
  - Rate limiting for free tools
  - Email capture integration
  - Analytics tracking
  - Priority: Medium
  - Estimated time: 2 hours

## Performance & Optimization

### 4.10 Caching Strategy

- [ ] **Task: Implement AI response caching**
  ```typescript
  // lib/ai/cache-manager.ts
  export class AICacheManager {
    async getCachedResponse(
      questionHash: string,
      contextHash: string
    ): Promise<AIResponse | null> {
      // Check cache for similar questions
      // Validate context relevance
      // Return cached response if valid
    }
    
    async cacheResponse(
      question: string,
      context: ConversationContext,
      response: AIResponse
    ): Promise<void> {
      // Hash question and context
      // Store with expiration
      // Index for efficient lookup
    }
  }
  ```
  - Priority: Medium
  - Dependencies: Redis/caching infrastructure
  - Estimated time: 2 hours

### 4.11 Cost Optimization

- [ ] **Task: Implement token optimization**
  ```typescript
  // lib/ai/token-optimizer.ts
  export class TokenOptimizer {
    optimizePrompt(context: ConversationContext, message: string): string {
      // Compress conversation history
      // Remove redundant context
      // Prioritize recent messages
      // Maintain essential information
    }
    
    async estimateTokenCost(prompt: string): Promise<number> {
      // Estimate token usage
      // Calculate API cost
      // Warn on expensive requests
    }
  }
  ```
  - Priority: Medium
  - Estimated time: 1.5 hours

## Testing & Quality Assurance

### 4.12 AI Testing Framework

- [ ] **Task: Create AI response testing**
  ```typescript
  // tests/ai/response-quality.test.ts
  describe('AI Response Quality', () => {
    test('includes required disclaimers', () => {})
    test('provides structured responses', () => {})
    test('maintains appropriate confidence levels', () => {})
    test('suggests relevant follow-up actions', () => {})
    test('respects usage limits', () => {})
  })
  ```
  - Priority: High
  - Dependencies: Testing framework
  - Estimated time: 3 hours

- [ ] **Task: Create safety validation tests**
  - Test prohibited content detection
  - Verify disclaimer inclusion
  - Validate response confidence levels
  - Test edge cases and error handling
  - Priority: Critical
  - Estimated time: 4 hours

## Monitoring & Analytics

### 4.13 AI Performance Monitoring

- [ ] **Task: Implement AI metrics tracking**
  ```typescript
  // lib/ai/metrics.ts
  interface AIMetrics {
    response_time: number
    token_usage: number
    user_satisfaction: number
    conversation_completion_rate: number
    function_call_success_rate: number
  }
  
  export function trackAIInteraction(
    interaction: AIInteraction,
    metrics: AIMetrics
  ): void {
    // Track response quality
    // Monitor usage patterns
    // Identify improvement opportunities
  }
  ```
  - Priority: Medium
  - Dependencies: Analytics infrastructure
  - Estimated time: 2 hours

## Success Criteria

- [ ] AI provides accurate CTA guidance with disclaimers
- [ ] Usage limits enforced per subscription tier
- [ ] Function calling produces structured responses
- [ ] Conversation history persisted and searchable
- [ ] Safety validation prevents problematic responses
- [ ] Chat interface provides smooth user experience
- [ ] Specialized tools work independently
- [ ] Performance optimized for sub-3s responses
- [ ] Comprehensive testing validates quality
- [ ] Cost management keeps API usage efficient

## Total Estimated Time: 55-60 hours
## Critical Path: AI Service → Function Calling → Safety Controls → Chat Interface → Testing