export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          subscription_tier: 'free' | 'basic' | 'premium'
          ai_credits: number
          profile: Json
          email_verified: boolean
          last_sign_in: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          subscription_tier?: 'free' | 'basic' | 'premium'
          ai_credits?: number
          profile?: Json
          email_verified?: boolean
          last_sign_in?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          subscription_tier?: 'free' | 'basic' | 'premium'
          ai_credits?: number
          profile?: Json
          email_verified?: boolean
          last_sign_in?: string | null
        }
      }
      companies: {
        Row: {
          id: string
          user_id: string
          legal_name: string
          dba_names: string[] | null
          formation_country: string
          formation_state: string | null
          us_registration_date: string | null
          ein: string | null
          business_type: string | null
          principal_address: Json | null
          mailing_address: Json | null
          filing_deadline: string | null
          status: 'active' | 'inactive' | 'archived'
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          legal_name: string
          dba_names?: string[] | null
          formation_country: string
          formation_state?: string | null
          us_registration_date?: string | null
          ein?: string | null
          business_type?: string | null
          principal_address?: Json | null
          mailing_address?: Json | null
          status?: 'active' | 'inactive' | 'archived'
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          legal_name?: string
          dba_names?: string[] | null
          formation_country?: string
          formation_state?: string | null
          us_registration_date?: string | null
          ein?: string | null
          business_type?: string | null
          principal_address?: Json | null
          mailing_address?: Json | null
          status?: 'active' | 'inactive' | 'archived'
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      beneficial_owners: {
        Row: {
          id: string
          company_id: string
          full_name: string
          date_of_birth: string | null
          residential_address: Json | null
          identification_type: 'passport' | 'drivers_license' | 'state_id' | 'other' | null
          identification_number: string | null
          identification_country: string | null
          identification_state: string | null
          ownership_percentage: number | null
          control_types: string[]
          is_company_applicant: boolean
          encrypted_id_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          full_name: string
          date_of_birth?: string | null
          residential_address?: Json | null
          identification_type?: 'passport' | 'drivers_license' | 'state_id' | 'other' | null
          identification_number?: string | null
          identification_country?: string | null
          identification_state?: string | null
          ownership_percentage?: number | null
          control_types?: string[]
          is_company_applicant?: boolean
          encrypted_id_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          full_name?: string
          date_of_birth?: string | null
          residential_address?: Json | null
          identification_type?: 'passport' | 'drivers_license' | 'state_id' | 'other' | null
          identification_number?: string | null
          identification_country?: string | null
          identification_state?: string | null
          ownership_percentage?: number | null
          control_types?: string[]
          is_company_applicant?: boolean
          encrypted_id_image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          company_id: string
          report_type: 'initial' | 'updated' | 'corrected' | null
          status: 'draft' | 'completed' | 'submitted' | 'filed'
          data: Json
          pdf_url: string | null
          submission_reference: string | null
          created_at: string
          updated_at: string
          submitted_at: string | null
          filed_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          report_type?: 'initial' | 'updated' | 'corrected' | null
          status?: 'draft' | 'completed' | 'submitted' | 'filed'
          data?: Json
          pdf_url?: string | null
          submission_reference?: string | null
          created_at?: string
          updated_at?: string
          submitted_at?: string | null
          filed_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          report_type?: 'initial' | 'updated' | 'corrected' | null
          status?: 'draft' | 'completed' | 'submitted' | 'filed'
          data?: Json
          pdf_url?: string | null
          submission_reference?: string | null
          created_at?: string
          updated_at?: string
          submitted_at?: string | null
          filed_at?: string | null
        }
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          title: string | null
          messages: Json[]
          tokens_used: number
          conversation_type: 'general' | 'compliance' | 'assistance'
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          messages?: Json[]
          tokens_used?: number
          conversation_type?: 'general' | 'compliance' | 'assistance'
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          messages?: Json[]
          tokens_used?: number
          conversation_type?: 'general' | 'compliance' | 'assistance'
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          changes: Json | null
          ip_address: string | null
          user_agent: string | null
          session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          changes?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          changes?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing' | null
          tier: 'free' | 'basic' | 'premium' | null
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing' | null
          tier?: 'free' | 'basic' | 'premium' | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing' | null
          tier?: 'free' | 'basic' | 'premium' | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      usage_tracking: {
        Row: {
          id: string
          user_id: string
          resource_type: 'ai_chat' | 'report_generation' | 'document_upload'
          amount: number
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resource_type: 'ai_chat' | 'report_generation' | 'document_upload'
          amount?: number
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resource_type?: 'ai_chat' | 'report_generation' | 'document_upload'
          amount?: number
          metadata?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_companies_count: {
        Args: {
          user_uuid: string
        }
        Returns: number
      }
      get_user_current_usage: {
        Args: {
          user_uuid: string
          resource: string
        }
        Returns: number
      }
      check_user_credits: {
        Args: {
          user_uuid: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}