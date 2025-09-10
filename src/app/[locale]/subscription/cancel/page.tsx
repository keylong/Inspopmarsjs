'use client'

// 强制动态渲染，避免预渲染错误
export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'
import { useI18n } from '@/lib/i18n/client'

export default function SubscriptionCancelPage() {
  const t = useI18n()
  const router = useRouter()

  return (
    <div className="container mx-auto py-16">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-600">
            {t('subscription.paymentCanceled')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            {t('subscription.paymentCanceledMessage')}
          </p>
          
          <div className="space-y-2">
            <Button
              onClick={() => router.push('/subscription')}
              className="w-full"
            >
              {t('subscription.retrySelectPlan')}
            </Button>
            
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full"
            >
              {t('subscription.returnHome')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}