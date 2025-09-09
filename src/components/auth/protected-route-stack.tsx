import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { stackApp } from '@/lib/stack-auth'

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

export async function ProtectedRoute({ 
  children, 
  redirectTo = '/auth/signin' 
}: ProtectedRouteProps) {
  try {
    const user = await stackApp.getUser()
    
    if (!user) {
      redirect(redirectTo)
    }
    
    return <>{children}</>
  } catch (error) {
    redirect(redirectTo)
  }
}