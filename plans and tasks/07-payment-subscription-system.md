# Payment Integration & Subscription Management

## Overview
Complete Stripe-based subscription system supporting multiple pricing tiers, usage tracking, plan management, billing automation, and revenue optimization.

## Stripe Integration Foundation

### 7.1 Stripe Configuration & Setup

- [ ] **Task: Configure Stripe integration**
  ```typescript
  // lib/stripe/config.ts
  import Stripe from 'stripe'
  
  export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
    appInfo: {
      name: 'CTAReady',
      version: '1.0.0',
    },
  })
  
  export const STRIPE_CONFIG = {
    webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,
    public_key: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!,
    pricing_plans: {
      free: { price_id: null, features: { ai_chats: 3, entities: 1 } },
      starter: { price_id: 'price_starter_monthly', features: { ai_chats: -1, entities: 1 } },
      growth: { price_id: 'price_growth_monthly', features: { ai_chats: -1, entities: 5 } },
      scale: { price_id: 'price_scale_monthly', features: { ai_chats: -1, entities: -1 } }
    }
  } as const
  ```
  - Priority: Critical
  - Dependencies: Stripe account setup
  - Estimated time: 2 hours

- [ ] **Task: Create Stripe product and price setup**
  ```typescript
  // scripts/setup-stripe-products.ts
  export async function setupStripeProducts() {
    // Create products for each plan
    // Create monthly and annual prices
    // Setup promotional pricing
    // Configure tax settings
    // Enable payment methods
  }
  
  const PRODUCTS = [
    {
      id: 'starter',
      name: 'CTAReady Starter',
      description: 'Perfect for single entity compliance',
      features: ['Unlimited AI assistance', '1 entity', 'All report features'],
      monthly_price: 1900, // $19.00
      annual_price: 19000  // $190.00 (17% discount)
    },
    {
      id: 'growth', 
      name: 'CTAReady Growth',
      description: 'Ideal for small businesses with multiple entities',
      features: ['Unlimited AI assistance', '5 entities', 'Priority support'],
      monthly_price: 4900,
      annual_price: 49000
    },
    {
      id: 'scale',
      name: 'CTAReady Scale', 
      description: 'Enterprise solution for advisors and large organizations',
      features: ['Unlimited entities', 'API webhooks', 'White-label options'],
      monthly_price: 9900,
      annual_price: 99000
    }
  ]
  ```
  - Priority: Critical
  - Dependencies: Business plan finalization
  - Estimated time: 1 hour

### 7.2 Customer & Subscription Management

- [ ] **Task: Create customer management system**
  ```typescript
  // lib/stripe/customer-manager.ts
  export class StripeCustomerManager {
    async createCustomer(user: User): Promise<Stripe.Customer> {
      // Create Stripe customer
      // Sync with user profile
      // Set up default payment method
      // Configure billing preferences
    }
    
    async updateCustomer(
      customerId: string, 
      updates: CustomerUpdate
    ): Promise<Stripe.Customer> {
      // Update customer information
      // Sync changes to database
      // Handle address changes for tax
    }
    
    async getCustomerByUserId(userId: string): Promise<Stripe.Customer | null> {
      // Retrieve customer from Stripe
      // Cache customer data
      // Handle customer not found
    }
    
    async addPaymentMethod(
      customerId: string, 
      paymentMethodId: string
    ): Promise<void> {
      // Attach payment method
      // Set as default if first
      // Validate payment method
    }
  }
  ```
  - Priority: Critical
  - Dependencies: User management, Stripe config
  - Estimated time: 3 hours

- [ ] **Task: Create subscription lifecycle manager**
  ```typescript
  // lib/stripe/subscription-manager.ts
  export class SubscriptionManager {
    async createSubscription(
      customerId: string,
      priceId: string,
      options?: SubscriptionOptions
    ): Promise<Stripe.Subscription> {
      // Create new subscription
      // Handle trial periods
      // Set up proration settings
      // Configure billing cycle
    }
    
    async upgradeSubscription(
      subscriptionId: string,
      newPriceId: string
    ): Promise<Stripe.Subscription> {
      // Calculate proration
      // Update subscription
      // Handle immediate charge
      // Update user permissions
    }
    
    async downgradeSubscription(
      subscriptionId: string,
      newPriceId: string
    ): Promise<Stripe.Subscription> {
      // Schedule downgrade for period end
      // Calculate refund/credit
      // Notify user of changes
      // Plan feature restrictions
    }
    
    async cancelSubscription(
      subscriptionId: string,
      options: CancelOptions
    ): Promise<Stripe.Subscription> {
      // Immediate vs. end of period
      // Retention offers
      // Data export options
      // Cancellation survey
    }
    
    async pauseSubscription(subscriptionId: string): Promise<void> {
      // Pause billing
      // Maintain data access
      // Set resume date
    }
  }
  ```
  - Priority: Critical
  - Dependencies: Customer management
  - Estimated time: 5 hours

## Plan Management & Features

### 7.3 Usage Tracking & Enforcement

- [ ] **Task: Create usage tracking system**
  ```typescript
  // lib/subscription/usage-tracker.ts
  interface UsageMetrics {
    user_id: string
    period_start: Date
    period_end: Date
    
    ai_conversations: number
    ai_messages: number
    entities_created: number
    entities_active: number
    reports_generated: number
    
    storage_used: number // bytes
    api_calls: number
    
    last_updated: Date
  }
  
  export class UsageTracker {
    async recordUsage(
      userId: string,
      usageType: UsageType,
      amount: number = 1
    ): Promise<void> {
      // Increment usage counter
      // Check against plan limits
      // Trigger warnings near limits
      // Log usage event
    }
    
    async getCurrentUsage(userId: string): Promise<UsageMetrics> {
      // Get current billing period usage
      // Include historical trends
      // Calculate remaining allowances
    }
    
    async checkUsageLimit(
      userId: string,
      usageType: UsageType
    ): Promise<{
      allowed: boolean
      remaining: number
      resetDate: Date
      upgradeRequired?: boolean
    }> {
      // Check current usage vs limits
      // Provide upgrade suggestions
      // Handle unlimited plans
    }
    
    async resetUsageMetrics(userId: string): Promise<void> {
      // Reset monthly counters
      // Archive historical data
      // Trigger billing period notifications
    }
  }
  ```
  - Priority: High
  - Dependencies: Database schema, subscription data
  - Estimated time: 4 hours

- [ ] **Task: Create feature gate system**
  ```typescript
  // lib/subscription/feature-gates.ts
  interface PlanFeatures {
    ai_chat_limit: number // -1 for unlimited
    entity_limit: number
    report_generation: boolean
    priority_support: boolean
    api_access: boolean
    white_label: boolean
    collaboration: boolean
    advanced_analytics: boolean
  }
  
  export class FeatureGate {
    async checkFeatureAccess(
      userId: string,
      feature: keyof PlanFeatures
    ): Promise<{
      hasAccess: boolean
      reason?: string
      upgradeRequired?: boolean
      recommendedPlan?: string
    }> {
      // Check user's current plan
      // Validate feature access
      // Suggest upgrades if needed
    }
    
    async enforceEntityLimit(userId: string): Promise<boolean> {
      // Count user's entities
      // Check against plan limit
      // Block creation if exceeded
    }
    
    async enforceAIUsageLimit(userId: string): Promise<boolean> {
      // Check monthly AI usage
      // Compare against plan limits
      // Handle unlimited plans
    }
  }
  ```
  - Priority: High
  - Dependencies: Usage tracking, plan configuration
  - Estimated time: 3 hours

### 7.4 Plan Comparison & Upgrade Flow

- [ ] **Task: Create pricing page component**
  ```typescript
  // components/pricing/PricingTable.tsx
  interface PricingPlan {
    id: string
    name: string
    price: {
      monthly: number
      annual: number
    }
    features: Feature[]
    popular?: boolean
    recommended?: boolean
    cta: string
  }
  
  export function PricingTable({ 
    currentPlan, 
    onSelectPlan 
  }: PricingTableProps) {
    // Plan comparison table
    // Feature highlighting
    // Current plan indication
    // Upgrade/downgrade CTAs
    // Annual discount display
    // Usage-based recommendations
  }
  
  // components/pricing/FeatureComparison.tsx
  export function FeatureComparison() {
    // Detailed feature matrix
    // Interactive comparisons
    // FAQ integration
    // Calculator for ROI
  }
  ```
  - Features: Interactive comparison, usage-based suggestions
  - Priority: High
  - Dependencies: Plan configuration, UI components
  - Estimated time: 4 hours

- [ ] **Task: Create upgrade/downgrade flow**
  ```typescript
  // components/billing/PlanChangeFlow.tsx
  export function PlanChangeFlow({ 
    currentPlan, 
    targetPlan, 
    onComplete 
  }: PlanChangeFlowProps) {
    // Plan comparison summary
    // Proration calculation
    // Feature impact explanation
    // Payment confirmation
    // Immediate vs. scheduled changes
  }
  
  // lib/subscription/plan-change-handler.ts
  export class PlanChangeHandler {
    async calculatePlanChange(
      currentPlan: string,
      targetPlan: string,
      billingCycle: 'monthly' | 'annual'
    ): Promise<PlanChangeCalculation> {
      // Calculate proration
      // Determine immediate charges/credits
      // Show feature changes
      // Calculate savings/costs
    }
    
    async executePlanChange(
      userId: string,
      targetPlan: string,
      timing: 'immediate' | 'next_cycle'
    ): Promise<PlanChangeResult> {
      // Process Stripe subscription change
      // Update user permissions immediately
      // Send confirmation notifications
      // Update usage limits
    }
  }
  ```
  - Priority: High
  - Dependencies: Stripe integration, notification system
  - Estimated time: 5 hours

## Payment Processing & Billing

### 7.5 Payment Methods & Processing

- [ ] **Task: Create payment method management**
  ```typescript
  // components/billing/PaymentMethods.tsx
  export function PaymentMethods({ customerId }: { customerId: string }) {
    // List of saved payment methods
    // Add new payment method
    // Set default payment method
    // Remove payment methods
    // Payment method validation
    // International card support
  }
  
  // components/billing/AddPaymentMethod.tsx
  export function AddPaymentMethod({ 
    onSuccess, 
    onError 
  }: AddPaymentMethodProps) {
    // Stripe Elements integration
    // Real-time validation
    // 3D Secure support
    // Error handling
    // Success confirmation
  }
  ```
  - Features: Stripe Elements, 3D Secure, international cards
  - Priority: High
  - Dependencies: Stripe Elements, UI components
  - Estimated time: 4 hours

- [ ] **Task: Create billing history & invoices**
  ```typescript
  // components/billing/BillingHistory.tsx
  export function BillingHistory({ customerId }: { customerId: string }) {
    // Invoice listing
    // Payment status indicators
    // Download PDF invoices
    // Payment retry options
    // Refund status display
  }
  
  // lib/billing/invoice-manager.ts
  export class InvoiceManager {
    async getInvoices(customerId: string): Promise<Stripe.Invoice[]> {
      // Retrieve customer invoices
      // Sort by date
      // Include payment status
    }
    
    async generateInvoicePDF(invoiceId: string): Promise<Buffer> {
      // Generate branded PDF invoice
      // Include tax details
      // Company information
      // Payment instructions
    }
    
    async sendInvoiceEmail(invoiceId: string): Promise<void> {
      // Send invoice via email
      // Include PDF attachment
      // Payment link
      // Due date reminder
    }
  }
  ```
  - Priority: Medium
  - Dependencies: PDF generation, email system
  - Estimated time: 3 hours

### 7.6 Webhook Processing System

- [ ] **Task: Create Stripe webhook handler**
  ```typescript
  // app/api/webhooks/stripe/route.ts
  export async function POST(req: Request) {
    // Verify webhook signature
    // Parse webhook event
    // Route to appropriate handler
    // Return success response
    // Log webhook events
  }
  
  // lib/webhooks/stripe-handlers.ts
  export class StripeWebhookHandler {
    async handleSubscriptionUpdated(event: Stripe.Event): Promise<void> {
      // Update local subscription data
      // Sync user permissions
      // Send notification emails
      // Update usage limits
    }
    
    async handlePaymentSucceeded(event: Stripe.Event): Promise<void> {
      // Record successful payment
      // Send receipt email
      // Update account status
      // Trigger onboarding if new
    }
    
    async handlePaymentFailed(event: Stripe.Event): Promise<void> {
      // Record failed payment
      // Initiate dunning process
      // Send notification emails
      // Update account status
    }
    
    async handleSubscriptionDeleted(event: Stripe.Event): Promise<void> {
      // Update user status
      // Trigger offboarding flow
      // Schedule data retention
      // Send cancellation confirmation
    }
    
    async handleInvoicePaymentFailed(event: Stripe.Event): Promise<void> {
      // Start dunning management
      // Send payment retry emails
      // Update account status
      // Schedule service restrictions
    }
  }
  ```
  - Priority: Critical
  - Dependencies: Webhook verification, event routing
  - Estimated time: 6 hours

### 7.7 Failed Payment Recovery

- [ ] **Task: Create dunning management system**
  ```typescript
  // lib/billing/dunning-manager.ts
  interface DunningConfiguration {
    retry_schedule: number[] // Days: [1, 3, 5, 7, 14]
    email_templates: {
      soft_decline: string
      hard_decline: string
      final_notice: string
    }
    grace_period: number // Days before service restriction
    restriction_actions: RestrictionAction[]
  }
  
  export class DunningManager {
    async handleFailedPayment(
      customerId: string,
      invoiceId: string,
      attempt: number
    ): Promise<void> {
      // Schedule payment retry
      // Send appropriate email
      // Update account status
      // Log dunning activity
    }
    
    async processRetrySchedule(): Promise<void> {
      // Find invoices due for retry
      // Attempt payment collection
      // Update retry counters
      // Escalate if necessary
    }
    
    async applyServiceRestrictions(customerId: string): Promise<void> {
      // Limit access to paid features
      // Maintain data access
      // Show payment prompts
      // Enable self-service recovery
    }
    
    async sendPaymentReminder(
      customerId: string,
      template: string
    ): Promise<void> {
      // Personalized payment reminders
      // One-click payment links
      // Payment method update options
      // Customer service contact info
    }
  }
  ```
  - Priority: High
  - Dependencies: Email system, scheduling
  - Estimated time: 4 hours

## Promotions & Trial Management

### 7.8 Trial & Promotional Pricing

- [ ] **Task: Create trial management system**
  ```typescript
  // lib/subscription/trial-manager.ts
  export class TrialManager {
    async startFreeTrial(
      userId: string,
      planId: string,
      trialDays: number = 14
    ): Promise<Stripe.Subscription> {
      // Create trial subscription
      // Set trial period
      // Grant full plan access
      // Schedule trial end reminder
    }
    
    async extendTrial(
      subscriptionId: string,
      additionalDays: number
    ): Promise<void> {
      // Extend trial period
      // Update billing date
      // Notify customer
      // Log extension reason
    }
    
    async convertTrialToPaid(subscriptionId: string): Promise<void> {
      // End trial period
      // Start billing immediately
      // Send conversion confirmation
      // Update analytics
    }
    
    async handleTrialEnding(subscriptionId: string): Promise<void> {
      // Send trial ending notifications
      // Offer conversion incentives
      // Schedule access restrictions
      // Trigger conversion campaigns
    }
  }
  ```
  - Priority: Medium
  - Dependencies: Subscription management, email system
  - Estimated time: 3 hours

- [ ] **Task: Create promotional code system**
  ```typescript
  // lib/subscription/promo-manager.ts
  interface PromotionalOffer {
    code: string
    discount_type: 'percentage' | 'fixed_amount' | 'months_free'
    discount_value: number
    valid_plans: string[]
    usage_limit?: number
    expires_at: Date
    new_customers_only: boolean
  }
  
  export class PromoManager {
    async validatePromoCode(
      code: string,
      userId: string,
      planId: string
    ): Promise<ValidationResult> {
      // Check code validity
      // Verify user eligibility
      // Check usage limits
      // Calculate discount
    }
    
    async applyPromoCode(
      subscriptionId: string,
      promoCode: string
    ): Promise<void> {
      // Apply Stripe coupon
      // Track usage
      // Send confirmation
      // Update analytics
    }
    
    async createPromotionalCampaign(
      campaign: PromotionalCampaign
    ): Promise<void> {
      // Create Stripe coupons
      // Setup tracking
      // Generate unique codes
      // Schedule campaign
    }
  }
  ```
  - Priority: Low
  - Dependencies: Stripe coupons, analytics
  - Estimated time: 2 hours

## Analytics & Reporting

### 7.9 Revenue Analytics

- [ ] **Task: Create subscription analytics**
  ```typescript
  // lib/analytics/subscription-analytics.ts
  interface SubscriptionMetrics {
    mrr: number // Monthly Recurring Revenue
    arr: number // Annual Recurring Revenue
    churn_rate: number
    ltv: number // Customer Lifetime Value
    cac: number // Customer Acquisition Cost
    
    plan_distribution: Record<string, number>
    conversion_rates: {
      trial_to_paid: number
      free_to_paid: number
      upgrade_rate: number
    }
    
    revenue_trends: RevenueDataPoint[]
    cohort_analysis: CohortData[]
  }
  
  export class SubscriptionAnalytics {
    async calculateMRR(): Promise<number> {
      // Sum all active monthly subscriptions
      // Normalize annual to monthly
      // Exclude trials and cancelled
    }
    
    async calculateChurnRate(period: 'monthly' | 'annual'): Promise<number> {
      // Calculate customer churn
      // Revenue churn
      // Voluntary vs involuntary
    }
    
    async generateRevenueReport(
      startDate: Date,
      endDate: Date
    ): Promise<RevenueReport> {
      // Revenue breakdown by plan
      // Growth metrics
      // Churn analysis
      // Cohort performance
    }
    
    async trackConversionFunnel(): Promise<ConversionMetrics> {
      // Free to trial conversion
      // Trial to paid conversion
      // Plan upgrade rates
      // Retention by cohort
    }
  }
  ```
  - Priority: Medium
  - Dependencies: Database analytics, reporting tools
  - Estimated time: 5 hours

### 7.10 Customer Success Metrics

- [ ] **Task: Create customer health scoring**
  ```typescript
  // lib/analytics/customer-health.ts
  interface CustomerHealthScore {
    user_id: string
    health_score: number // 0-100
    risk_level: 'low' | 'medium' | 'high'
    
    factors: {
      usage_frequency: number
      feature_adoption: number
      support_interactions: number
      payment_history: number
    }
    
    predictions: {
      churn_probability: number
      upsell_probability: number
      engagement_trend: 'increasing' | 'stable' | 'declining'
    }
  }
  
  export class CustomerHealthTracker {
    async calculateHealthScore(userId: string): Promise<CustomerHealthScore> {
      // Analyze usage patterns
      // Check engagement metrics
      // Review support history
      // Assess payment behavior
    }
    
    async identifyAtRiskCustomers(): Promise<User[]> {
      // Find customers with declining health scores
      // Predict churn probability
      // Prioritize intervention targets
    }
    
    async identifyUpsellOpportunities(): Promise<UpsellOpportunity[]> {
      // Find power users hitting limits
      // Analyze feature usage patterns
      // Score expansion readiness
    }
  }
  ```
  - Priority: Low
  - Dependencies: Usage analytics, predictive modeling
  - Estimated time: 4 hours

## User Interface Components

### 7.11 Billing Dashboard

- [ ] **Task: Create subscription management dashboard**
  ```typescript
  // components/billing/BillingDashboard.tsx
  export function BillingDashboard() {
    // Current plan summary
    // Usage metrics and limits
    // Payment method management
    // Billing history
    // Plan change options
    // Cancellation flow
  }
  
  // components/billing/UsageMetrics.tsx
  export function UsageMetrics({ usage, limits }: UsageMetricsProps) {
    // Visual usage indicators
    // Progress bars for limits
    // Trend analysis
    // Upgrade suggestions
    // Reset date countdown
  }
  
  // components/billing/PlanUpgradePrompt.tsx
  export function PlanUpgradePrompt({ 
    currentUsage, 
    recommendedPlan 
  }: UpgradePromptProps) {
    // Contextual upgrade suggestions
    // Benefit highlighting
    // Cost-benefit analysis
    // One-click upgrade
  }
  ```
  - Features: Real-time usage, upgrade suggestions, self-service
  - Priority: High
  - Dependencies: Usage tracking, plan management
  - Estimated time: 5 hours

## Testing & Quality Assurance

### 7.12 Payment System Testing

- [ ] **Task: Create comprehensive payment tests**
  ```typescript
  // tests/payments/subscription-flow.test.ts
  describe('Subscription Management', () => {
    test('creates subscription successfully', () => {})
    test('handles plan upgrades with proration', () => {})
    test('processes plan downgrades correctly', () => {})
    test('manages trial periods properly', () => {})
    test('handles cancellation flow', () => {})
  })
  
  // tests/payments/webhook-handling.test.ts
  describe('Stripe Webhooks', () => {
    test('processes subscription updates', () => {})
    test('handles payment failures', () => {})
    test('manages invoice events', () => {})
    test('validates webhook signatures', () => {})
  })
  ```
  - Priority: Critical
  - Dependencies: Testing framework, Stripe test environment
  - Estimated time: 6 hours

- [ ] **Task: Create end-to-end payment testing**
  - Complete subscription signup flow
  - Plan change scenarios
  - Payment failure recovery
  - Cancellation and retention
  - International payment testing
  - Priority: High
  - Estimated time: 4 hours

## Security & Compliance

### 7.13 Payment Security

- [ ] **Task: Implement payment security measures**
  - PCI DSS compliance (Stripe handles)
  - Webhook signature verification
  - Secure API key management
  - Audit trail for all payment events
  - Fraud detection integration
  - Priority: Critical
  - Dependencies: Security infrastructure
  - Estimated time: 3 hours

### 7.14 Tax & Regulatory Compliance

- [ ] **Task: Configure tax handling**
  ```typescript
  // lib/billing/tax-calculator.ts
  export class TaxCalculator {
    async calculateTax(
      customerId: string,
      amount: number,
      currency: string
    ): Promise<TaxCalculation> {
      // Use Stripe Tax or external service
      // Handle US sales tax
      // International VAT/GST
      // Tax exemption certificates
    }
    
    async updateTaxLocation(
      customerId: string,
      address: Address
    ): Promise<void> {
      // Update customer address
      // Recalculate tax rates
      // Handle tax rate changes mid-billing
    }
  }
  ```
  - Priority: Medium
  - Dependencies: Tax service (Stripe Tax)
  - Estimated time: 2 hours

## Success Criteria

- [ ] Complete Stripe integration functional
- [ ] All pricing tiers properly configured
- [ ] Subscription lifecycle management working
- [ ] Usage tracking and enforcement active
- [ ] Plan upgrade/downgrade flows smooth
- [ ] Payment method management complete
- [ ] Webhook processing reliable
- [ ] Failed payment recovery automated
- [ ] Trial management operational
- [ ] Analytics and reporting functional
- [ ] Billing dashboard user-friendly
- [ ] International payment support
- [ ] Tax calculation accurate
- [ ] Security measures implemented
- [ ] Testing coverage comprehensive

## Total Estimated Time: 60-70 hours
## Critical Path: Stripe Setup → Subscription Management → Usage Tracking → Webhooks → Testing