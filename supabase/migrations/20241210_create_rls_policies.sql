-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficial_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Companies policies
CREATE POLICY "Users can view their own companies" ON companies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own companies" ON companies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own companies" ON companies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own companies" ON companies
  FOR DELETE USING (auth.uid() = user_id);

-- Beneficial owners policies
CREATE POLICY "Users can view beneficial owners of their companies" ON beneficial_owners
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM companies 
      WHERE companies.id = beneficial_owners.company_id 
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert beneficial owners for their companies" ON beneficial_owners
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies 
      WHERE companies.id = beneficial_owners.company_id 
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update beneficial owners of their companies" ON beneficial_owners
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM companies 
      WHERE companies.id = beneficial_owners.company_id 
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete beneficial owners of their companies" ON beneficial_owners
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM companies 
      WHERE companies.id = beneficial_owners.company_id 
      AND companies.user_id = auth.uid()
    )
  );

-- Reports policies
CREATE POLICY "Users can view reports of their companies" ON reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM companies 
      WHERE companies.id = reports.company_id 
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert reports for their companies" ON reports
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies 
      WHERE companies.id = reports.company_id 
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update reports of their companies" ON reports
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM companies 
      WHERE companies.id = reports.company_id 
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete reports of their companies" ON reports
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM companies 
      WHERE companies.id = reports.company_id 
      AND companies.user_id = auth.uid()
    )
  );

-- AI conversations policies
CREATE POLICY "Users can view their own conversations" ON ai_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" ON ai_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON ai_conversations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" ON ai_conversations
  FOR DELETE USING (auth.uid() = user_id);

-- Audit logs policies (read-only for users)
CREATE POLICY "Users can view their own audit logs" ON audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view their own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Usage tracking policies
CREATE POLICY "Users can view their own usage" ON usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

-- Service role policies (for backend operations)
-- These allow the service role to bypass RLS for administrative tasks

-- Create a function to check if the current role is service_role
CREATE OR REPLACE FUNCTION is_service_role() RETURNS BOOLEAN AS $$
BEGIN
  RETURN current_setting('role') = 'service_role';
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Service role policies for audit logs and usage tracking
CREATE POLICY "Service role can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (is_service_role());

CREATE POLICY "Service role can insert usage tracking" ON usage_tracking
  FOR INSERT WITH CHECK (is_service_role());

CREATE POLICY "Service role can manage subscriptions" ON subscriptions
  FOR ALL USING (is_service_role());

-- Functions for common operations

-- Function to get user's companies count
CREATE OR REPLACE FUNCTION get_user_companies_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER 
    FROM companies 
    WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's current usage for a resource type
CREATE OR REPLACE FUNCTION get_user_current_usage(user_uuid UUID, resource TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(amount), 0)::INTEGER
    FROM usage_tracking 
    WHERE user_id = user_uuid 
    AND resource_type = resource
    AND created_at >= date_trunc('month', NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has remaining credits
CREATE OR REPLACE FUNCTION check_user_credits(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COALESCE(ai_credits, 0)::INTEGER
    FROM users 
    WHERE id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;