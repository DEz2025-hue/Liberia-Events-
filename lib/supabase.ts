import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      purchases: {
        Row: {
          id: string
          name: string
          email: string
          token: string
          payment_status: 'pending' | 'completed' | 'failed'
          stripe_payment_intent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          token: string
          payment_status?: 'pending' | 'completed' | 'failed'
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          token?: string
          payment_status?: 'pending' | 'completed' | 'failed'
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      token_usage: {
        Row: {
          id: string
          token: string
          used: boolean
          first_accessed_at: string | null
          last_accessed_at: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          token: string
          used?: boolean
          first_accessed_at?: string | null
          last_accessed_at?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          token?: string
          used?: boolean
          first_accessed_at?: string | null
          last_accessed_at?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stream_settings: {
        Row: {
          id: string
          is_live: boolean
          stream_url: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          is_live?: boolean
          stream_url?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          is_live?: boolean
          stream_url?: string | null
          updated_at?: string
        }
      }
    }
  }
}