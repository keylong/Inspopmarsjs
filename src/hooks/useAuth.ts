'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }

    getCurrentUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])
  
  return {
    user: user ? {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || '',
      image: user.user_metadata?.avatar_url || '',
      emailVerified: user.email_confirmed_at !== null,
    } : null,
    isLoading,
    isAuthenticated: !!user,
    signOut: async () => {
      await supabase.auth.signOut()
    },
  }
}

// 用于不需要强制登录的场景
export function useOptionalAuth() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }

    getCurrentUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])
  
  return {
    user: user ? {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || '',
      image: user.user_metadata?.avatar_url || '',
      emailVerified: user.email_confirmed_at !== null,
    } : null,
    isLoading,
    isAuthenticated: !!user,
    signOut: async () => {
      await supabase.auth.signOut()
    },
  }
}