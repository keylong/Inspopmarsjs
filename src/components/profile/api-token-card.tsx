'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Key, Copy, Eye, EyeOff } from 'lucide-react'

interface ApiTokenCardProps {
  token: string | null
  isLoading: boolean
}

export function ApiTokenCard({ token, isLoading }: ApiTokenCardProps) {
  const [showToken, setShowToken] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [displayToken, setDisplayToken] = useState<string | null>(null)
  const [animationStep, setAnimationStep] = useState(0)

  // 逐步显示令牌数据
  useEffect(() => {
    if (!isLoading && token) {
      const timer = setTimeout(() => {
        setDisplayToken(token)
        setAnimationStep(1)
      }, 400)

      return () => clearTimeout(timer)
    }
    return undefined
  }, [token, isLoading])

  // 复制令牌到剪贴板
  const copyTokenToClipboard = async () => {
    if (!displayToken) return
    
    try {
      await navigator.clipboard.writeText(displayToken)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('复制失败:', error)
      // 如果现代API不可用，使用传统方法
      const textArea = document.createElement('textarea')
      textArea.value = displayToken
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (fallbackError) {
        console.error('复制失败:', fallbackError)
      }
      document.body.removeChild(textArea)
    }
  }

  // 切换令牌显示状态
  const toggleTokenVisibility = () => {
    setShowToken(!showToken)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="w-5 h-5 mr-2 text-purple-500" />
          API 令牌
        </CardTitle>
        <CardDescription>
          用于API访问的用户令牌，请妥善保管
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
            <div className="flex items-center flex-1">
              <Key className="w-5 h-5 mr-3 text-purple-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-mono text-sm bg-white px-3 py-2 rounded border min-w-0">
                  {animationStep >= 1 && displayToken ? (
                    showToken ? (
                      <span className="text-gray-700 break-all transition-all duration-300">
                        {displayToken}
                      </span>
                    ) : (
                      <span className="text-gray-400 transition-all duration-300">
                        ••••••••••••••••••••••••••••••••
                      </span>
                    )
                  ) : isLoading || !displayToken ? (
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <span className="text-gray-400">未设置</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">请勿泄露给他人</p>
              </div>
            </div>
          </div>

          {animationStep >= 1 && displayToken && (
            <div className="flex gap-2 animate-fadeIn">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTokenVisibility}
                className="flex items-center gap-2 transition-all duration-200 hover:shadow-sm"
              >
                {showToken ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    隐藏
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    显示
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={copyTokenToClipboard}
                className="flex items-center gap-2 transition-all duration-200 hover:shadow-sm"
                disabled={copySuccess}
              >
                <Copy className="w-4 h-4" />
                {copySuccess ? '已复制!' : '复制'}
              </Button>
            </div>
          )}

          {!displayToken && !isLoading && animationStep >= 1 && (
            <div className="text-center py-4 animate-fadeIn">
              <p className="text-sm text-gray-500 mb-2">尚未生成API令牌</p>
              <Button variant="outline" size="sm" className="transition-all duration-200 hover:shadow-sm">
                生成令牌
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}