import { StackProvider, StackTheme } from '@stackframe/stack'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ReactNode } from 'react'
import { stackServerApp } from '@/lib/stack'

interface StackAuthProviderProps {
  children: ReactNode
}

export function StackAuthProvider({ children }: StackAuthProviderProps) {
  return (
    <TooltipProvider>
      <StackProvider app={stackServerApp}>
        <StackTheme>
          {children}
        </StackTheme>
      </StackProvider>
    </TooltipProvider>
  )
}