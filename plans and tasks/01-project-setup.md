# Project Setup & Infrastructure Tasks

## Overview
Initial project setup, development environment, and infrastructure configuration for CTAReady.com MVP.

## Infrastructure Setup

### 1.1 Domain & Hosting Configuration
- [ ] **Register ctaready.com domain**
  - Priority: Critical
  - Estimated time: 30 minutes
  - Dependencies: None
  - Deliverable: Domain registered, DNS configured

- [ ] **Setup Vercel project**
  - Connect GitHub repository
  - Configure custom domain
  - Setup environment variables structure
  - Configure deployment settings
  - Priority: Critical
  - Estimated time: 1 hour

### 1.2 Backend Infrastructure (Supabase)
- [ ] **Create Supabase project**
  - Setup PostgreSQL database
  - Configure authentication providers (email/password, Google OAuth)
  - Setup storage buckets for document uploads
  - Configure row-level security policies
  - Priority: Critical
  - Estimated time: 2 hours

- [ ] **Environment configuration**
  - Setup development, staging, production environments
  - Configure environment variables:
    ```
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=
    SUPABASE_SERVICE_ROLE_KEY=
    OPENAI_API_KEY=
    STRIPE_PUBLIC_KEY=
    STRIPE_SECRET_KEY=
    STRIPE_WEBHOOK_SECRET=
    ```
  - Priority: High
  - Estimated time: 1 hour

## Project Structure Setup

### 1.3 Next.js 14 Project Initialization
- [ ] **Create Next.js project**
  ```bash
  npx create-next-app@latest ctaready --typescript --tailwind --eslint --app
  ```
  - Configure TypeScript strict mode
  - Setup ESLint + Prettier
  - Configure path aliases (@/, @/components, @/lib, etc.)
  - Priority: Critical
  - Estimated time: 1 hour

- [ ] **Install core dependencies**
  ```json
  {
    "dependencies": {
      "@supabase/supabase-js": "^2.38.0",
      "@supabase/auth-helpers-nextjs": "^0.8.7",
      "lucide-react": "^0.294.0",
      "class-variance-authority": "^0.7.0",
      "clsx": "^2.0.0",
      "tailwind-merge": "^2.0.0",
      "@hookform/resolvers": "^3.3.2",
      "react-hook-form": "^7.47.0",
      "zod": "^3.22.4",
      "openai": "^4.20.0",
      "stripe": "^14.7.0",
      "@stripe/stripe-js": "^2.1.11",
      "react-pdf": "^7.5.1",
      "date-fns": "^2.30.0"
    },
    "devDependencies": {
      "@types/node": "^20.8.10",
      "@types/react": "^18.2.37",
      "@types/react-dom": "^18.2.15",
      "prisma": "^5.6.0"
    }
  }
  ```
  - Priority: Critical
  - Estimated time: 30 minutes

### 1.4 shadcn/ui Setup
- [ ] **Initialize shadcn/ui**
  ```bash
  npx shadcn-ui@latest init
  ```
  - Configure components directory
  - Setup theme configuration
  - Install required components:
    - Button, Input, Label, Card, Dialog, Select
    - Form, Textarea, Checkbox, RadioGroup
    - Alert, Badge, Progress, Skeleton
  - Priority: High
  - Estimated time: 1 hour

## Development Environment

### 1.5 Development Tools Configuration
- [ ] **Setup development scripts**
  ```json
  {
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint",
      "type-check": "tsc --noEmit",
      "db:generate": "supabase gen types typescript --local > lib/database.types.ts",
      "db:migrate": "supabase migration up",
      "db:reset": "supabase db reset"
    }
  }
  ```
  - Priority: Medium
  - Estimated time: 30 minutes

- [ ] **Configure VS Code workspace**
  - Setup .vscode/settings.json
  - Configure recommended extensions
  - Setup debugging configuration
  - Priority: Low
  - Estimated time: 30 minutes

### 1.6 Testing Setup
- [ ] **Install testing framework**
  ```bash
  npm install -D jest @testing-library/react @testing-library/jest-dom
  npm install -D @testing-library/user-event jest-environment-jsdom
  ```
  - Configure jest.config.js
  - Setup test utilities
  - Create basic test structure
  - Priority: Medium
  - Estimated time: 1 hour

## Security & Monitoring

### 1.7 Security Configuration
- [ ] **Setup security headers**
  - Configure next.config.js with security headers
  - Setup CSP (Content Security Policy)
  - Configure CORS policies
  - Priority: High
  - Estimated time: 1 hour

- [ ] **Environment security**
  - Setup .env.local with proper permissions
  - Configure environment variable validation
  - Setup secrets management
  - Priority: High
  - Estimated time: 30 minutes

### 1.8 Analytics & Monitoring
- [ ] **Setup PostHog analytics**
  - Install PostHog SDK
  - Configure event tracking
  - Setup user identification
  - Priority: Medium
  - Estimated time: 1 hour

- [ ] **Error monitoring**
  - Setup error boundary components
  - Configure error logging
  - Setup monitoring alerts
  - Priority: Medium
  - Estimated time: 1 hour

## Deployment Pipeline

### 1.9 CI/CD Configuration
- [ ] **GitHub Actions setup**
  - Configure automated testing
  - Setup deployment pipeline
  - Configure environment promotions
  - Priority: Medium
  - Estimated time: 2 hours

- [ ] **Database migrations**
  - Setup migration strategy
  - Configure automated migrations
  - Setup rollback procedures
  - Priority: High
  - Estimated time: 1 hour

## Success Criteria
- [ ] Development environment running locally
- [ ] Supabase connection established
- [ ] Basic Next.js app deployed to Vercel
- [ ] Environment variables configured
- [ ] shadcn/ui components accessible
- [ ] Testing framework functional
- [ ] Security headers implemented
- [ ] Analytics tracking active

## Total Estimated Time: 12-15 hours
## Critical Path: Domain → Vercel → Supabase → Next.js → shadcn/ui