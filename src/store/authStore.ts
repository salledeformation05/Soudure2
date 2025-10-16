import { create } from 'zustand'
import type { User } from '../types'
import { getCurrentUser, signIn, signOut, signUp, onAuthStateChange } from '../lib/auth'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
  setUser: (user: User) => void
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,

  setUser: (user: User) => set({ user }),

  initialize: async () => {
    try {
      const user = await getCurrentUser()
      set({ user, loading: false, initialized: true })

      // Listen for auth changes
      onAuthStateChange((user) => {
        set({ user })
      })
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      set({ loading: false, initialized: true })
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true })
    const { user, error } = await signIn(email, password)
    set({ user, loading: false })
    return { error }
  },

  signUp: async (email: string, password: string, fullName?: string) => {
    set({ loading: true })
    const { user, error } = await signUp(email, password, fullName)
    set({ user, loading: false })
    return { error }
  },

  signOut: async () => {
    set({ loading: true })
    await signOut()
    set({ user: null, loading: false })
  },
}))
