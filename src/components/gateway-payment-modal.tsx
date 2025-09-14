'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import QRCode from 'qrcode'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { QrCode, Check, Loader2, AlertCircle, X, Shield, Timer, BadgeCheck } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { WechatPayIcon, AlipayIcon, WechatSecureIcon, AlipaySecureIcon } from '@/components/payment-icons'

interface GatewayPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess?: () => void // 支付成功回调
  planId: string
  planName: string
  planPrice: number
  paymentMethod: 'alipay' | 'wechat'
  locale?: string
}

export function GatewayPaymentModal({ 
  isOpen, 
  onClose, 
  onPaymentSuccess,
  planId, 
  planName, 
  planPrice, 
  paymentMethod,
  locale = 'zh-CN' 
}: GatewayPaymentModalProps) {
  const [step, setStep] = useState<'loading' | 'qr' | 'success' | 'error'>('loading')
  const [orderData, setOrderData] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [isPolling, setIsPolling] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [isCreating, setIsCreating] = useState(false) // 防重复创建

  // 获取支付方式显示名称
  const getPaymentMethodName = () => {
    return paymentMethod === 'alipay' ? '支付宝' : '微信支付'
  }

  // 获取支付方式图标颜色
  const getPaymentMethodColor = () => {
    return paymentMethod === 'alipay' ? 'text-blue-600' : 'text-green-600'
  }

  // 获取支付图标组件
  const PaymentIcon = paymentMethod === 'alipay' ? AlipayIcon : WechatPayIcon
  const PaymentSecureIcon = paymentMethod === 'alipay' ? AlipaySecureIcon : WechatSecureIcon

  // 获取收款二维码
  const fetchPaymentQRCode = async (orderData: any) => {
    try {
      const response = await fetch(`/api/payment/qr-code?method=${paymentMethod}&orderId=${orderData.gatewayOrderId}`)
      const result = await response.json()
      
      if (result.success && result.qrCodeUrl) {
        setQrCodeUrl(result.qrCodeUrl)
      } else {
        // 如果获取不到真实收款码，生成一个示例二维码
        await generateDemoQRCode(orderData)
      }
    } catch (error) {
      console.error('获取收款码失败:', error)
      await generateDemoQRCode(orderData)
    }
  }

  // 生成演示二维码
  const generateDemoQRCode = async (orderData: any) => {
    try {
      const paymentInfo = {
        type: 'payment_demo',
        orderId: orderData.gatewayOrderId,
        amount: orderData.amount,
        method: paymentMethod,
        timestamp: Date.now(),
        note: '这是演示二维码，实际收款码需要在支付网关后台配置'
      }
      
      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(paymentInfo), {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      setQrCodeUrl(qrCodeDataURL)
    } catch (error) {
      console.error('生成演示二维码失败:', error)
      setQrCodeUrl('')
    }
  }

  // 创建订单
  const createOrder = async () => {
    // 防止重复创建
    if (isCreating) {
      console.log('订单正在创建中，跳过重复请求')
      return
    }
    
    try {
      setIsCreating(true)
      setStep('loading')
      setError('')
      
      // 获取用户session
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      
      const response = await fetch('/api/payment/gateway-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planId,
          paymentMethod
        })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || '创建订单失败')
      }

      setOrderData(result.data)
      
      // 获取收款二维码
      await fetchPaymentQRCode(result.data)
      
      setStep('qr')
      
      // 开始轮询支付状态
      startPolling(result.data.orderId)

    } catch (error) {
      console.error('创建订单失败:', error)
      setError(error instanceof Error ? error.message : '创建订单失败')
      setStep('error')
    } finally {
      setIsCreating(false)
    }
  }

  // 轮询支付状态
  const startPolling = (orderId: string) => {
    if (isPolling) return
    
    setIsPolling(true)
    const pollInterval = setInterval(async () => {
      try {
        // 这里需要调用查询订单状态的API
        const response = await fetch(`/api/payment/order-status/${orderId}`)
        const result = await response.json()

        if (result.success && result.data?.status === 'paid') {
          setStep('success')
          setIsPolling(false)
          clearInterval(pollInterval)
          
          // 调用成功回调
          if (onPaymentSuccess) {
            onPaymentSuccess()
          }
          
          // 3秒后关闭弹窗
          setTimeout(() => {
            onClose()
          }, 3000)
        }
      } catch (error) {
        console.error('轮询支付状态失败:', error)
      }
    }, 2000) // 每2秒查询一次

    // 10分钟后停止轮询
    setTimeout(() => {
      if (isPolling) {
        setIsPolling(false)
        clearInterval(pollInterval)
      }
    }, 10 * 60 * 1000)
  }

  // 当弹窗打开时自动创建订单 - 使用 ref 防止 React Strict Mode 重复执行
  const isInitializedRef = React.useRef(false)
  
  React.useEffect(() => {
    if (isOpen && step === 'loading' && !orderData && !isCreating && !isInitializedRef.current) {
      isInitializedRef.current = true
      createOrder()
    }
    
    // 弹窗关闭时重置初始化标记
    if (!isOpen) {
      isInitializedRef.current = false
    }
  }, [isOpen, step, orderData, isCreating])

  // 当弹窗关闭时重置所有状态
  React.useEffect(() => {
    if (!isOpen) {
      // 延迟重置，确保动画完成
      setTimeout(() => {
        setStep('loading')
        setOrderData(null)
        setError('')
        setIsPolling(false)
        setIsCreating(false)
        setQrCodeUrl('')
        isInitializedRef.current = false // 重置初始化标记
      }, 200)
    }
  }, [isOpen])

  // 关闭弹窗时重置状态
  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PaymentIcon className={`w-6 h-6 ${getPaymentMethodColor()}`} />
              <span>{getPaymentMethodName()}官方支付</span>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">安全认证</span>
            </div>
          </DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <div>
              <span className="font-medium">{planName}</span>
              <span className="ml-2 text-lg font-bold text-gray-900">¥{orderData?.gatewayAmount || planPrice}</span>
              {orderData?.gatewayAmount && orderData.gatewayAmount !== planPrice && (
                <span className="text-orange-600 ml-2 text-sm">
                  (原价: ¥{planPrice})
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Shield className="w-3 h-3" />
              <span>加密保护</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {step === 'loading' && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500 mb-4" />
              <p className="text-gray-600">正在创建订单...</p>
            </div>
          )}

          {step === 'qr' && orderData && (
            <div className="space-y-4">
              {/* 支付提示 */}
              <div className="space-y-3">
                {/* 官方认证提示 */}
                <div className={`flex items-center gap-2 p-3 rounded-lg ${paymentMethod === 'wechat' ? 'bg-green-50' : 'bg-blue-50'}`}>
                  <div className="flex items-center gap-2">
                    {paymentMethod === 'wechat' ? (
                      <>
                        <WechatPayIcon className="h-5 w-5" />
                        <span className="text-sm font-medium text-gray-700">微信支付官方支付</span>
                      </>
                    ) : (
                      <>
                        <AlipayIcon className="h-5 w-5" />
                        <span className="text-sm font-medium text-gray-700">支付宝官方支付</span>
                      </>
                    )}
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600">安全认证</span>
                  </div>
                </div>
                
                {/* 扫码提示 */}
                <Alert className="border border-gray-200">
                  <AlertDescription className="text-sm">
                    请使用{getPaymentMethodName()}扫描下方二维码完成支付
                  </AlertDescription>
                </Alert>
              </div>

              {/* 二维码展示区域 */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 text-center">
                <div className="bg-white rounded-lg p-4 inline-block shadow-lg border-2 border-gray-200">
                  {qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="支付二维码" 
                      className="w-48 h-48 rounded-lg"
                    />
                  ) : (
                    <div className="w-48 h-48 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 font-medium">收款二维码</p>
                        <p className="text-xs text-gray-500 mt-1">请联系管理员配置</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <PaymentIcon className={`w-5 h-5 ${getPaymentMethodColor()}`} />
                      <p className="text-2xl font-bold text-gray-900">¥{orderData.gatewayAmount || orderData.amount}</p>
                    </div>
                    {orderData.gatewayAmount && orderData.gatewayAmount !== orderData.amount && (
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="line-through">套餐价: ¥{orderData.amount}</span>
                        <span className="text-orange-600 font-semibold ml-2">实际支付: ¥{orderData.gatewayAmount}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 text-center">订单号: {orderData.gatewayOrderId}</p>
                </div>
                
                {/* 支付说明 */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium mb-1">💳 支付说明</p>
                  <p className="text-xs text-blue-600">
                    请使用{getPaymentMethodName()}扫描上方二维码，
                    并确保转账金额为 <span className="font-bold text-red-600">¥{orderData.gatewayAmount || orderData.amount}</span>
                  </p>
                  {orderData.gatewayAmount && orderData.gatewayAmount !== orderData.amount && (
                    <p className="text-xs text-orange-600 mt-1 font-medium">
                      ⚠️ 请注意：为避免金额重复，实际支付金额已调整
                    </p>
                  )}
                </div>
              </div>

              {/* 等待支付提示 */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                等待支付完成，请勿关闭此窗口...
              </div>

              {/* 支付说明和保障 */}
              <div className="space-y-3">
                {/* 退款保证 */}
                <div className="flex items-center justify-center gap-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
                  <Shield className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-700 font-medium">当前显示的是演示二维码，实际使用请关闭此窗口</span>
                </div>
                
                <div className="text-xs text-gray-500 bg-gray-50 rounded p-3">
                  <div className="font-medium text-gray-700 mb-2">• 请在15分钟内完成支付</div>
                  <p>• 支付成功后系统会超快自动激活会员权益</p>
                  <p>• 转账时请确保金额准确无误</p>
                  <p>• 如有问题请联系客服</p>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-orange-600 font-medium">
                      • 当前显示的演示二维码，供参考外观和布局，实际使用请在开发者后台配置收款码
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">支付成功！</h3>
              <p className="text-gray-600 text-center">
                恭喜！您的会员权益已激活<br />
                页面即将自动刷新...
              </p>
            </div>
          )}

          {step === 'error' && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2">
                <Button 
                  onClick={createOrder} 
                  className="flex-1"
                  variant="default"
                >
                  重试
                </Button>
                <Button 
                  onClick={handleClose} 
                  variant="outline"
                >
                  取消
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}