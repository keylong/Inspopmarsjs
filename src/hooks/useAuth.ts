'use client'

import { useUser } from '@stackframe/stack'

export function useAuth() {
  const user = useUser({ or: 'redirect' })
  
  // 如果设置了 or: 'redirect'，user 永远不会是 null
  // 用户未登录时会自动重定向到登录页面
  return {
    user: user ? {
      id: user.id,
      email: user.primaryEmail || '',
      name: user.displayName || '',
      image: user.profileImageUrl || '',
      emailVerified: user.primaryEmailVerified || false,
    } : null,
    isLoading: false,
    isAuthenticated: !!user,
    signOut: async () => {
      if (user) {
        await user.signOut()
      }
    },
  }
}

// 用于不需要强制登录的场景
export function useOptionalAuth() {
  const user = useUser()
  
  return {
    user: user ? {
      id: user.id,
      email: user.primaryEmail || '',
      name: user.displayName || '',
      image: user.profileImageUrl || '',
      emailVerified: user.primaryEmailVerified || false,
    } : null,
    isLoading: false,
    isAuthenticated: !!user,
    signOut: async () => {
      if (user) {
        await user.signOut()
      }
    },
  }
}