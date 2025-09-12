'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { requestManager } from '@/lib/request-manager'

interface User {
  id: string
  email: string
  name: string
  image: string
  emailVerified: boolean
}

interface UserProfile {
  id: string
  email?: string
  name?: string
  value: number
  buytype?: number
  buydate?: Date | null
  token?: string | null
  membership?: {
    type: string
    typeName: string
    isActive: boolean
    daysRemaining: number | null
    expiresAt: string | null
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
  forceRefreshProfile?: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const initialFetchDone = useRef(false)

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
        fetchUserProfile(supabaseUser.id)
      }
    } else {
      setUser(null)
      setUserProfile(null)
      // 清除用户相关缓存
      requestManager.clearCache(`profile-${user?.id}`)
    }
  }

  const fetchUserProfile = async (userId?: string) => {
    const currentUserId = userId || user?.id
    if (!currentUserId) {
      console.log('没有用户ID，跳过获取 Profile')
      return
    }

    const requestKey = `profile-${currentUserId}`
    
    try {
      const data = await requestManager.request(
        requestKey,
        async () => {
          console.log(`获取用户 Profile: ${currentUserId}`)
          const response = await fetch('/api/profile')
          if (!response.ok) {
            throw new Error('获取 Profile 失败')
          }
          const result = await response.json()
          return result.user
        },
        true // 使用缓存
      )
      
      setUserProfile(data)
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
    const initAuth = async () => {
      setIsLoading(true)
      try {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        
        // 只在初始化时调用一次
        if (!initialFetchDone.current) {
          await updateUser(supabaseUser)
          initialFetchDone.current = true
        }
      } catch (error) {
        console.error('初始化认证失败:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('认证状态变化:', event, { hasUser: !!session?.user })
      
      // 只在真正的状态变化时更新（避免初始化时的重复）
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        try {
          // 如果是登出，清除缓存
          if (event === 'SIGNED_OUT') {
            requestManager.clearCache()
          }
          
          await updateUser(session?.user || null)
        } catch (error) {
          console.error('处理认证状态变化失败:', error)
        } finally {
          setIsLoading(false)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setUserProfile(null)
      requestManager.clearCache()
      initialFetchDone.current = false
    } catch (error) {
      console.error('退出登录失败:', error)
    }
  }
  
  // 强制刷新 Profile（清除缓存并重新获取）
  const forceRefreshProfile = async () => {
    const currentUserId = user?.id
    if (!currentUserId) return
    
    const requestKey = `profile-${currentUserId}`
    try {
      const data = await requestManager.refresh(
        requestKey,
        async () => {
          console.log(`强制刷新用户 Profile: ${currentUserId}`)
          const response = await fetch('/api/profile')
          if (!response.ok) {
            throw new Error('获取 Profile 失败')
          }
          const result = await response.json()
          return result.user
        }
      )
      
      setUserProfile(data)
    } catch (error) {
      console.error('刷新用户资料失败:', error)
      setUserProfile(null)
    }
  }

  const value: AuthContextType = {
    user,
    userProfile,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    refresh: refreshUser,
    refreshProfile: () => fetchUserProfile(),
    forceRefreshProfile, // 新增：强制刷新
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