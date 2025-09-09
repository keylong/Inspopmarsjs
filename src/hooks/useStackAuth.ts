'use client'

import { useUser } from '@stackframe/stack'

export function useStackAuth() {
  const user = useUser({ or: 'redirect' })

  return {
    user: user ? {
      id: user.id,
      email: user.primaryEmail || user.clientMetadata?.email as string || '',
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