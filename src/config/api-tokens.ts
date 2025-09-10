/**
 * API Token配置
 * 用于兼容PHP版本的token鉴权
 */

// 有效的API tokens
export const VALID_API_TOKENS = [
  'bb99a47f206f0c661d3b04de1c2569845143d7dc',
  '8d4d31bf4d5fef0920c4767133953d2c23ae9395',
  'ef16d98d248c5e77a88ef4708791cc5ff640b5a4',
  'aa2cee37be3dadd02014c3c0cbcd74349bce4db8',
  'a84e0a016e09d7bbcfc2877c1afffc753f0e56d6',
  '5397493e4ee0c3c2bc7d1e3f6c67ccb2e892c0ea',
  // 添加一个通用测试token
  'test_token_2025',
  // 生产环境token（需要定期更换）
  process.env.SYSTEM_API_TOKEN || 'default_secure_token_2025'
].filter(Boolean)

/**
 * 验证API token
 */
export function validateApiToken(token: string | null | undefined): boolean {
  if (!token) return false
  return VALID_API_TOKENS.includes(token)
}

/**
 * 生成媒体URL（带token）
 */
export function generateMediaUrl(
  originalUrl: string, 
  type: 'image' | 'video',
  token: string
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ins.popmars.com'
  const encodedUrl = encodeURIComponent(originalUrl)
  return `${baseUrl}/system/stream.php?url=${encodedUrl}&type=${type}&token=${token}`
}

/**
 * 生成下载URL（带token）
 */
export function generateDownloadUrl(
  originalUrl: string,
  type: 'image' | 'video', 
  token: string
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ins.popmars.com'
  const encodedUrl = encodeURIComponent(originalUrl)
  return `${baseUrl}/dl.php?url=${encodedUrl}&type=${type}&token=${token}`
}

/**
 * 生成唯一的媒体token
 */
export function generateMediaToken(url: string): string {
  // 简单的hash函数，实际生产环境应使用更安全的方法
  let hash = 0
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(40, '0')
}