'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  email: string
  name: string
  image: string
  emailVerified: boolean
}

interface UserProfile {
  id: string
  value: number
  membership?: {
    typeName: string
    isActive: boolean
  }
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  signOut: () => Promise<void>
  refresh: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const updateUser = async (supabaseUser: any) => {
    if (supabaseUser) {
      console.log('用户认证状态变化:', { 
        id: supabaseUser.id, 
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.name
      })

      // 检查是否是OAuth用户（Google、Apple等）
      const providers = supabaseUser.app_metadata?.providers || []
      const isGoogleUser = providers.includes('google')
      const isAppleUser = providers.includes('apple')
      const isOAuthUser = isGoogleUser || isAppleUser
      
      console.log('OAuth检查:', { providers, isGoogleUser, isAppleUser, isOAuthUser })

      if (isOAuthUser) {
        try {
          console.log('开始为OAuth用户创建业务用户记录...')
          
          // 确定提供商
          const provider = isGoogleUser ? 'Google' : isAppleUser ? 'Apple' : 'Unknown'
          
          // 调用API创建或更新用户
          const response = await fetch('/api/sync-google-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: supabaseUser.id,
              email: supabaseUser.email,
              name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name,
              image: supabaseUser.user_metadata?.avatar_url,
              provider: provider,
            })
          })

          const result = await response.json()
          console.log('用户同步结果:', result)
        } catch (error) {
          console.error('同步OAuth用户失败:', error)
        }
      }

      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || '',
        image: supabaseUser.user_metadata?.avatar_url || '',
        emailVerified: supabaseUser.email_confirmed_at !== null,
      })
      // 用户登录后自动获取profile
      if (supabaseUser) {
        fetchUserProfile()
      }
    } else {
      setUser(null)
      setUserProfile(null)
    }
  }

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data.user)
      }
    } catch (error) {
      console.error('获取用户资料失败:', error)
      setUserProfile(null)
    }
  }

  const refreshUser = async () => {
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser()
      updateUser(supabaseUser)
    } catch (error) {
      console.error('刷新用户信息失败:', error)
      setUser(null)
    }
  }

  useEffect(() => {
    const getCurrentUser = async () => {
      setIsLoading(true)
      try {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        await updateUser(supabaseUser)
      } catch (error) {
        console.error('获取用户信息失败:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    getCurrentUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('认证状态变化:', event, { hasUser: !!session?.user })
      
      try {
        await updateUser(session?.user || null)
      } catch (error) {
        console.error('处理认证状态变化失败:', error)
      } finally {
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('退出登录失败:', error)
    }
  }

  const value: AuthContextType = {
    user,
    userProfile,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    refresh: refreshUser,
    refreshProfile: fetchUserProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// 保持向后兼容
export const useOptionalAuth = useAuth