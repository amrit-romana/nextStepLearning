import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthStore {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
    })
  },

  setLoading: (isLoading) => {
    set({ isLoading })
  },

  logout: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    set({
      user: null,
      isAuthenticated: false,
    })
  },

  checkAuth: async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    })
  },
}))
