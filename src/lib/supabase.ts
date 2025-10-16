import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'client' | 'creator' | 'provider' | 'admin'
          language: string
          avatar_url: string | null
          location: string | null
          country: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      designs: {
        Row: {
          id: string
          creator_id: string
          title: string
          description: string | null
          image_url: string
          thumbnail_url: string | null
          category_id: string | null
          tags: string[]
          price: number
          status: 'pending' | 'approved' | 'rejected' | 'archived'
          rejection_reason: string | null
          views: number
          favorites: number
          sales: number
          available: boolean
          created_at: string
          updated_at: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string
          provider_id: string | null
          status: 'pending' | 'confirmed' | 'in_production' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          subtotal: number
          shipping_cost: number
          tax: number
          total: number
          currency: string
          delivery_name: string
          delivery_phone: string | null
          delivery_address: string
          delivery_city: string
          delivery_postal_code: string | null
          delivery_country: string
          delivery_instructions: string | null
          estimated_delivery_date: string | null
          actual_delivery_date: string | null
          tracking_number: string | null
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method: string | null
          payment_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
