'use client'

import { useUser } from '@stackframe/stack'

export function useStackAuth() {
  const user = useUser()

  return {
    user: user ? {
      id: user.id,
      email: user.primaryEmail,
      name: user.displayName,
      image: user.profileImageUrl,
      emailVerified: user.primaryEmailVerified,
    } : null,
    isLoading: false, // Stack Auth 自动处理加载状态
    isAuthenticated: !!user,
    signOut: async () => {
      // Stack Auth 会自动处理登出
      await user?.signOut()
    },
  }
}