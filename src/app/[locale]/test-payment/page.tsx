'use client'

import { useState } from 'react'
// import { useRouter } from 'next/navigation' // 未使用，暂时注释
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Loader2, CreditCard, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const plans = [
  { id: 'basic-monthly', name: '基础月度套餐', price: '$9.99/月' },
  { id: 'pro-monthly', name: '专业月度套餐', price: '$19.99/月' },
  { id: 'unlimited-monthly', name: '无限月度套餐', price: '$39.99/月' },
  { id: 'yearly-vip', name: '年度VIP会员', price: '$99.99/年' },
]

export default function TestPaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState('basic-monthly')
  const [isLoading, setIsLoading] = useState(false)
  // const router = useRouter() // 未使用，暂时注释
  const { toast } = useToast()

  const handleStripeCheckout = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan,
          paymentMethod: 'stripe',
        }),
      })

      const data = await response.json()

      if (data.success && data.data?.checkoutUrl) {
        // 重定向到Stripe支付页面
        window.location.href = data.data.checkoutUrl
      } else {
        throw new Error(data.error || '创建支付会话失败')
      }
    } catch (error) {
      console.error('支付错误:', error)
      toast({
        title: '支付失败',
        description: error instanceof Error ? error.message : '请稍后重试',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Stripe 支付测试</CardTitle>
            <CardDescription>
              选择一个套餐进行测试支付（测试模式）
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 测试卡号提示 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                测试卡号信息
              </h3>
              <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <p>卡号: 4242 4242 4242 4242</p>
                <p>有效期: 任意未来日期（如 12/34）</p>
                <p>CVC: 任意3位数字（如 123）</p>
                <p>邮编: 任意5位数字（如 12345）</p>
              </div>
            </div>

            {/* 套餐选择 */}
            <div>
              <Label className="text-base font-semibold mb-3 block">
                选择套餐
              </Label>
              <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                {plans.map((plan) => (
                  <div key={plan.id} className="mb-3">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <RadioGroupItem value={plan.id} id={plan.id} />
                      <Label
                        htmlFor={plan.id}
                        className="flex-1 cursor-pointer flex items-center justify-between"
                      >
                        <span>{plan.name}</span>
                        <span className="font-bold text-purple-600 dark:text-purple-400">
                          {plan.price}
                        </span>
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* 支付按钮 */}
            <Button
              onClick={handleStripeCheckout}
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  正在跳转到支付页面...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  使用 Stripe 支付
                </>
              )}
            </Button>

            {/* 功能说明 */}
            <div className="space-y-2 pt-4 border-t">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                测试流程：
              </h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>点击支付按钮后会跳转到 Stripe 支付页面</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>使用上方提供的测试卡号进行支付</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>支付成功后会自动跳转回网站</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>订阅信息会自动更新到用户账户</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}