# Database Schema & Data Models

## Overview
Comprehensive database design for CTAReady.com supporting multi-entity management, subscription tiers, AI interactions, and compliance requirements with row-level security.

## Core Data Architecture

### 2.1 Authentication & Users

#### `auth.users` (Supabase built-in)
- Managed by Supabase Auth
- Contains: id, email, email_confirmed_at, etc.

#### `public.users` (Profile extension)
```sql
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  company_name TEXT,
  country_code CHAR(2), -- ISO country code
  phone TEXT,
  timezone TEXT DEFAULT 'UTC',
  language_code CHAR(2) DEFAULT 'en',
  subscription_tier subscription_tier_enum DEFAULT 'free',
  subscription_status subscription_status_enum DEFAULT 'active',
  stripe_customer_id TEXT UNIQUE,
  ai_usage_count INTEGER DEFAULT 0,
  ai_usage_reset_date TIMESTAMPTZ DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enums
CREATE TYPE subscription_tier_enum AS ENUM ('free', 'starter', 'growth', 'scale');
CREATE TYPE subscription_status_enum AS ENUM ('active', 'past_due', 'canceled', 'unpaid');

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);
```

- [ ] **Task: Create users table and enums**
  - Priority: Critical
  - Dependencies: Supabase project setup
  - Estimated time: 1 hour

- [ ] **Task: Setup RLS policies for users**
  ```sql
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
  CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
  ```
  - Priority: Critical
  - Estimated time: 30 minutes

### 2.2 Entity Management

#### `public.entities` (Companies/Organizations)
```sql
CREATE TABLE public.entities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  entity_type entity_type_enum NOT NULL,
  tax_id_number TEXT, -- EIN, SSN, FTIN, etc.
  tax_id_type TEXT, -- Type of tax ID
  formation_date DATE,
  formation_jurisdiction TEXT, -- State or country
  us_address JSONB, -- Structured address
  foreign_address JSONB, -- For foreign entities
  is_foreign_entity BOOLEAN DEFAULT FALSE,
  current_company_applicant JSONB, -- Current applicant info
  fincen_id TEXT UNIQUE, -- FinCEN ID if obtained
  filing_status filing_status_enum DEFAULT 'not_filed',
  filing_deadline DATE,
  last_filed_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enums
CREATE TYPE entity_type_enum AS ENUM (
  'corporation', 'llc', 'limited_partnership', 'limited_liability_partnership',
  'business_trust', 'other'
);

CREATE TYPE filing_status_enum AS ENUM (
  'not_required', 'required', 'in_progress', 'filed', 'overdue', 'amended'
);

-- Indexes
CREATE INDEX idx_entities_user_id ON entities(user_id);
CREATE INDEX idx_entities_filing_deadline ON entities(filing_deadline);
CREATE INDEX idx_entities_filing_status ON entities(filing_status);
```

- [ ] **Task: Create entities table with enums**
  - Priority: Critical
  - Dependencies: Users table
  - Estimated time: 1.5 hours

- [ ] **Task: Setup entity RLS policies**
  ```sql
  ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Users can manage own entities" ON entities 
    USING (user_id = auth.uid());
  ```
  - Priority: Critical
  - Estimated time: 30 minutes

### 2.3 Beneficial Ownership

#### `public.beneficial_owners`
```sql
CREATE TABLE public.beneficial_owners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Personal Information (encrypted)
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  address JSONB, -- Current address
  
  -- Identification
  id_type identification_type_enum NOT NULL,
  id_number_encrypted TEXT, -- Encrypted ID number
  id_jurisdiction TEXT, -- State/country of issuance
  id_image_url TEXT, -- Secure storage URL
  
  -- Ownership Information
  ownership_percentage DECIMAL(5,2), -- e.g., 25.50
  control_type control_type_enum[],
  ownership_details JSONB, -- Additional ownership structure
  
  -- Status
  is_company_applicant BOOLEAN DEFAULT FALSE,
  verification_status verification_status_enum DEFAULT 'pending',
  finra_id TEXT UNIQUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enums
CREATE TYPE identification_type_enum AS ENUM (
  'us_passport', 'state_drivers_license', 'state_id', 'foreign_passport'
);

CREATE TYPE control_type_enum AS ENUM (
  'ownership_25_plus', 'senior_officer', 'substantial_control', 'other_control'
);

CREATE TYPE verification_status_enum AS ENUM (
  'pending', 'verified', 'rejected', 'expired'
);

-- Indexes
CREATE INDEX idx_beneficial_owners_entity_id ON beneficial_owners(entity_id);
CREATE INDEX idx_beneficial_owners_user_id ON beneficial_owners(user_id);
```

- [ ] **Task: Create beneficial owners table**
  - Priority: High
  - Dependencies: Entities table
  - Estimated time: 2 hours

- [ ] **Task: Implement encryption for PII fields**
  - Setup client-side encryption utilities
  - Create encryption/decryption functions
  - Priority: Critical (Security requirement)
  - Estimated time: 3 hours

### 2.4 AI Interactions

#### `public.ai_conversations`
```sql
CREATE TABLE public.ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entity_id UUID REFERENCES entities(id) ON DELETE SET NULL,
  
  title TEXT, -- Auto-generated conversation title
  messages JSONB NOT NULL, -- Array of messages
  context_data JSONB, -- Additional context for AI
  
  token_usage INTEGER DEFAULT 0,
  model_used TEXT DEFAULT 'gpt-4',
  conversation_type conversation_type_enum DEFAULT 'general',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE conversation_type_enum AS ENUM (
  'general', 'eligibility', 'beneficial_owner', 'deadline', 'compliance'
);

-- Indexes
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_created_at ON ai_conversations(created_at);
```

- [ ] **Task: Create AI conversations tracking**
  - Priority: High
  - Dependencies: Users and entities tables
  - Estimated time: 1 hour

### 2.5 Documents & Reports

#### `public.generated_reports`
```sql
CREATE TABLE public.generated_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE NOT NULL,
  
  report_type report_type_enum NOT NULL,
  report_data JSONB NOT NULL, -- Structured report content
  file_url TEXT, -- Generated PDF URL
  file_hash TEXT, -- For integrity checking
  
  generation_method generation_method_enum DEFAULT 'ai_assisted',
  is_final BOOLEAN DEFAULT FALSE,
  version INTEGER DEFAULT 1,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE report_type_enum AS ENUM (
  'boi_initial', 'boi_corrected', 'boi_updated', 'eligibility_assessment'
);

CREATE TYPE generation_method_enum AS ENUM (
  'ai_assisted', 'template_based', 'manual'
);

-- Indexes
CREATE INDEX idx_reports_entity_id ON generated_reports(entity_id);
CREATE INDEX idx_reports_user_id ON generated_reports(user_id);
CREATE INDEX idx_reports_type ON generated_reports(report_type);
```

- [ ] **Task: Create reports tracking system**
  - Priority: High
  - Dependencies: Entities table
  - Estimated time: 1 hour

### 2.6 Audit Logging

#### `public.audit_logs`
```sql
CREATE TABLE public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  
  action_type audit_action_enum NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  
  old_values JSONB,
  new_values JSONB,
  changes_summary TEXT,
  
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE audit_action_enum AS ENUM (
  'created', 'updated', 'deleted', 'viewed', 'exported', 'filed'
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

- [ ] **Task: Create audit logging system**
  - Priority: Medium
  - Dependencies: All main tables
  - Estimated time: 2 hours

### 2.7 Subscription Management

#### `public.subscriptions`
```sql
CREATE TABLE public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_price_id TEXT NOT NULL,
  
  plan_tier subscription_tier_enum NOT NULL,
  status subscription_status_enum NOT NULL,
  
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  
  -- Usage limits based on plan
  entity_limit INTEGER,
  ai_usage_limit INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

- [ ] **Task: Create subscription management tables**
  - Priority: High
  - Dependencies: Users table
  - Estimated time: 1 hour

## Database Functions & Triggers

### 2.8 Utility Functions

- [ ] **Task: Create updated_at trigger function**
  ```sql
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ language 'plpgsql';
  ```
  - Apply to all tables with updated_at
  - Priority: Medium
  - Estimated time: 30 minutes

- [ ] **Task: Create subscription limit enforcement functions**
  - Entity count validation
  - AI usage limit checking
  - Plan upgrade suggestions
  - Priority: High
  - Estimated time: 2 hours

### 2.9 Security Functions

- [ ] **Task: Create data anonymization functions**
  - For GDPR compliance
  - Selective PII removal
  - Data export utilities
  - Priority: Medium
  - Estimated time: 2 hours

## Views & Materialized Views

### 2.10 Dashboard Views

- [ ] **Task: Create user dashboard view**
  ```sql
  CREATE VIEW user_dashboard AS
  SELECT 
    u.id,
    u.full_name,
    u.subscription_tier,
    COUNT(e.id) as entity_count,
    COUNT(CASE WHEN e.filing_status = 'overdue' THEN 1 END) as overdue_entities,
    u.ai_usage_count,
    s.ai_usage_limit
  FROM users u
  LEFT JOIN entities e ON u.id = e.user_id
  LEFT JOIN subscriptions s ON u.id = s.user_id
  WHERE s.status = 'active'
  GROUP BY u.id, s.ai_usage_limit;
  ```
  - Priority: Medium
  - Estimated time: 1 hour

## Data Migration & Seeding

### 2.11 Initial Data Setup

- [ ] **Task: Create seed data scripts**
  - Default subscription plans
  - Country codes and jurisdictions
  - Entity type configurations
  - Priority: Medium
  - Estimated time: 1 hour

- [ ] **Task: Create data validation scripts**
  - Referential integrity checks
  - Data consistency validation
  - Performance testing queries
  - Priority: Low
  - Estimated time: 1 hour

## Testing & Validation

### 2.12 Database Testing

- [ ] **Task: Create database test suite**
  - RLS policy testing
  - Constraint validation
  - Performance benchmarks
  - Priority: Medium
  - Estimated time: 3 hours

## Success Criteria
- [ ] All tables created with proper constraints
- [ ] RLS policies implemented and tested
- [ ] Encryption working for PII data
- [ ] Subscription limits enforced
- [ ] Audit logging functional
- [ ] Dashboard views optimized
- [ ] Test suite passing

## Total Estimated Time: 20-25 hours
## Critical Path: Users → Entities → Beneficial Owners → RLS → Encryption