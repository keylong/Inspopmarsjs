'use client'

import { useUser } from '@stackframe/stack'

export function useAuth() {
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