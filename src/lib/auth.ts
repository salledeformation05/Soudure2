import { supabase } from './supabase'
import type { User, UserRole } from '../types'

export interface AuthResponse {
  user: User | null
  error: Error | null
}

// Sign up with email and password
export async function signUp(email: string, password: string, fullName?: string): Promise<AuthResponse> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('No user returned')

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email!,
        full_name: fullName || null,
        role: 'client',
        language: 'fr'
      })

    if (profileError) throw profileError

    const user = await getProfile(authData.user.id)
    return { user, error: null }
  } catch (error) {
    return { user: null, error: error as Error }
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    if (!data.user) throw new Error('No user returned')

    const user = await getProfile(data.user.id)
    return { user, error: null }
  } catch (error) {
    return { user: null, error: error as Error }
  }
}

// Sign out
export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error as Error }
  }
}

// Get current session
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return await getProfile(user.id)
}

// Get user profile
export async function getProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    email: data.email,
    role: data.role as UserRole,
    full_name: data.full_name || undefined,
    phone: data.phone || undefined,
    language: data.language,
    location: data.location || undefined,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

// Update profile
export async function updateProfile(userId: string, updates: Partial<User>): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: updates.full_name,
        phone: updates.phone,
        language: updates.language,
        location: updates.location,
      })
      .eq('id', userId)

    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error as Error }
  }
}

// Password reset
export async function resetPassword(email: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error as Error }
  }
}

// Update password
export async function updatePassword(newPassword: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error as Error }
  }
}

// Auth state change listener
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    (async () => {
      if (session?.user) {
        const user = await getProfile(session.user.id)
        callback(user)
      } else {
        callback(null)
      }
    })()
  })
}
