'use client'

import { useSession } from 'next-auth/react'
import { SessionUser } from '@/types/auth'

export function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user as SessionUser | undefined,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
    status,
  }
}