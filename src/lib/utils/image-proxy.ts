/**
 * 智能媒体代理工具函数
 * 解决Instagram图片/视频CORS限制，自动选择正确的代理端点
 */

import { generateImageSrc } from './media-proxy';

/**
 * 将Instagram媒体URL转换为安全的代理URL
 * 自动检测媒体类型并选择正确的代理端点
 * @param originalUrl - Instagram原始媒体URL
 * @returns 安全的代理URL（图片）或占位符
 */
export function getProxyImageUrl(originalUrl: string): string {
  return generateImageSrc(originalUrl, '/placeholder-image.jpg');
}

/**
 * 批量转换图片URL列表
 * @param urls - 原始URL数组
 * @returns 安全的代理URL数组
 */
export function getProxyImageUrls(urls: string[]): string[] {
  return urls.map(url => generateImageSrc(url, '/placeholder-image.jpg'));
}

// 注意：addProxyToInstagramData 函数已移动到 instagram-data-transformer.ts 中
// 避免重复处理和双重编码问题

/**
 * 获取错误占位图URL
 * @param width - 宽度
 * @param height - 高度
 * @param text - 占位文本
 * @returns 占位图URL
 */
export function getErrorPlaceholder(
  width: number = 400, 
  height: number = 400, 
  text: string = '图片加载失败'
): string {
  try {
    // 输入验证和清理
    const validWidth = typeof width === 'number' && width > 0 && width <= 2000 ? width : 400;
    const validHeight = typeof height === 'number' && height > 0 && height <= 2000 ? height : 400;
    const cleanText = typeof text === 'string' ? text.substring(0, 50) : '图片加载失败';
    
    // 转义HTML特殊字符
    const escapedText = cleanText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    
    // 计算字体大小
    const fontSize = Math.max(12, Math.min(24, Math.floor(validWidth / 20)));
    
    // 使用本地生成的占位图，而不是外部服务
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${validWidth}" height="${validHeight}" viewBox="0 0 ${validWidth} ${validHeight}">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#f9fafb"/>
        <rect width="100%" height="100%" fill="url(#grid)"/>
        <rect x="10" y="10" width="${validWidth - 20}" height="${validHeight - 20}" 
              fill="none" stroke="#d1d5db" stroke-width="2" stroke-dasharray="5,5"/>
        <text x="50%" y="50%" 
              font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
              font-size="${fontSize}" fill="#6b7280" 
              text-anchor="middle" dominant-baseline="central">
          ${escapedText}
        </text>
      </svg>
    `.trim();
    
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
  } catch (error) {
    console.error('生成占位图失败:', error);
    // 备用简单占位图
    const fallbackSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b7280">加载失败</text></svg>';
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(fallbackSvg)}`;
  }
}

const imageProxyUtils = {
  getProxyImageUrl,
  getProxyImageUrls,
  getErrorPlaceholder
};

export default imageProxyUtils;