'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Copy, MessageCircle, Check } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  locale?: string
}

export function PaymentModal({ isOpen, onClose, locale = 'zh-CN' }: PaymentModalProps) {
  const [copied, setCopied] = useState(false)
  const wechatId = 'popmarscom'

  const handleCopyWechat = async () => {
    try {
      await navigator.clipboard.writeText(wechatId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // 降级处理：使用传统方法
      const textArea = document.createElement('textarea')
      textArea.value = wechatId
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackError) {
        console.error('复制失败:', fallbackError)
      }
      document.body.removeChild(textArea)
    }
  }

  const getContent = () => {
    const content = {
      'zh-CN': {
        title: '购买会员套餐',
        description: '请添加微信联系客服购买会员套餐',
        wechatLabel: '微信号',
        copyButton: copied ? '已复制' : '复制微信号',
        closeButton: '关闭',
        tip: '复制微信号后，请在微信中添加好友',
        benefits: [
          '无限制下载 Instagram 内容',
          '批量下载功能',
          '优先技术支持',
          '更快的下载速度'
        ],
        benefitsTitle: '会员权益：'
      },
      'zh-TW': {
        title: '購買會員套餐',
        description: '請添加微信聯繫客服購買會員套餐',
        wechatLabel: '微信號',
        copyButton: copied ? '已複製' : '複製微信號',
        closeButton: '關閉',
        tip: '複製微信號後，請在微信中添加好友',
        benefits: [
          '無限制下載 Instagram 內容',
          '批量下載功能',
          '優先技術支援',
          '更快的下載速度'
        ],
        benefitsTitle: '會員權益：'
      },
      'en': {
        title: 'Purchase Membership',
        description: 'Please add WeChat to contact customer service for membership purchase',
        wechatLabel: 'WeChat ID',
        copyButton: copied ? 'Copied!' : 'Copy WeChat ID',
        closeButton: 'Close',
        tip: 'After copying the WeChat ID, please add as friend in WeChat',
        benefits: [
          'Unlimited Instagram content downloads',
          'Batch download feature',
          'Priority technical support',
          'Faster download speed'
        ],
        benefitsTitle: 'Member Benefits:'
      }
    }

    return content[locale as keyof typeof content] || content['zh-CN']
  }

  const t = getContent()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            {t.title}
          </DialogTitle>
          <DialogDescription className="pt-2">
            {t.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 会员权益展示 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="font-medium text-sm text-blue-900 mb-2">{t.benefitsTitle}</p>
            <ul className="space-y-1 text-sm text-blue-700">
              {t.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 微信号展示区域 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{t.wechatLabel}</span>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border">
                <MessageCircle className="w-4 h-4 text-green-600" />
                <span className="font-mono font-bold text-lg text-gray-900">{wechatId}</span>
              </div>
            </div>

            <Alert className="mt-3">
              <AlertDescription className="text-sm">
                {t.tip}
              </AlertDescription>
            </Alert>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <Button
              onClick={handleCopyWechat}
              className="flex-1"
              variant={copied ? 'outline' : 'default'}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {t.copyButton}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  {t.copyButton}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose}>
              {t.closeButton}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}