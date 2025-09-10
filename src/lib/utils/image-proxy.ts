/**
 * 智能媒体代理工具函数
 * 解决Instagram图片/视频CORS限制，自动选择正确的代理端点
 */

import { generateImageSrc, generateVideoSrc, generateProxyUrl, getMediaType } from './media-proxy';

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

/**
 * 为Instagram数据结构中的所有媒体URL添加智能代理
 * 自动处理图片和视频URL，选择正确的代理端点
 * @param data - Instagram数据对象
 * @returns 处理后的数据对象
 */
export function addProxyToInstagramData(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  try {
    // 深拷贝避免修改原始数据
    const processedData = JSON.parse(JSON.stringify(data));

    // 智能处理函数：根据媒体类型选择正确的处理方式
    const processUrl = (url: string, forceImage: boolean = false): string => {
      if (!url) return '';
      if (forceImage) {
        // 强制作为图片处理（如缩略图）
        return generateImageSrc(url, '/placeholder-image.jpg');
      }
      // 自动检测媒体类型
      return generateProxyUrl(url);
    };

    // 处理主URL（可能是图片或视频）
    if (processedData.display_url) {
      processedData.display_url = processUrl(processedData.display_url);
    }

    // 处理缩略图（强制作为图片）
    if (processedData.thumbnail_src) {
      processedData.thumbnail_src = processUrl(processedData.thumbnail_src, true);
    }
    
    if (processedData.thumbnail) {
      processedData.thumbnail = processUrl(processedData.thumbnail, true);
    }

    // 处理视频URL
    if (processedData.video_url) {
      processedData.video_url = generateVideoSrc(processedData.video_url) || processedData.video_url;
    }

    // 处理不同分辨率的资源
    if (processedData.display_resources && Array.isArray(processedData.display_resources)) {
      processedData.display_resources = processedData.display_resources
        .filter((resource: any) => resource && typeof resource === 'object')
        .map((resource: any) => ({
          ...resource,
          src: processUrl(resource.src)
        }));
    }

    // 处理轮播媒体
    if (processedData.edge_sidecar_to_children?.edges && Array.isArray(processedData.edge_sidecar_to_children.edges)) {
      processedData.edge_sidecar_to_children.edges = processedData.edge_sidecar_to_children.edges
        .filter((edge: any) => edge?.node)
        .map((edge: any) => ({
          ...edge,
          node: {
            ...edge.node,
            display_url: processUrl(edge.node.display_url),
            video_url: edge.node.video_url ? (generateVideoSrc(edge.node.video_url) || edge.node.video_url) : undefined,
            display_resources: Array.isArray(edge.node.display_resources) 
              ? edge.node.display_resources
                  .filter((resource: any) => resource && typeof resource === 'object')
                  .map((resource: any) => ({
                    ...resource,
                    src: processUrl(resource.src)
                  }))
              : []
          }
        }));
    }
    
    // 处理carousel_media数组
    if (processedData.carousel_media && Array.isArray(processedData.carousel_media)) {
      processedData.carousel_media = processedData.carousel_media
        .filter((media: any) => media && typeof media === 'object')
        .map((media: any) => ({
          ...media,
          display_url: processUrl(media.display_url),
          thumbnail: processUrl(media.thumbnail, true),
          video_url: media.video_url ? (generateVideoSrc(media.video_url) || media.video_url) : undefined,
        }));
    }

    // 处理用户头像
    if (processedData.owner?.profile_pic_url) {
      processedData.owner.profile_pic_url = processUrl(processedData.owner.profile_pic_url, true);
    }
    
    // 处理media数组（标准化后的数据结构）
    if (processedData.media && Array.isArray(processedData.media)) {
      processedData.media = processedData.media
        .filter((media: any) => media && typeof media === 'object')
        .map((media: any) => ({
          ...media,
          url: processUrl(media.url),
          thumbnail: processUrl(media.thumbnail, true),
          video_url: media.video_url ? (generateVideoSrc(media.video_url) || media.video_url) : undefined,
          display_resources: Array.isArray(media.display_resources)
            ? media.display_resources
                .filter((resource: any) => resource && typeof resource === 'object')
                .map((resource: any) => ({
                  ...resource,
                  src: processUrl(resource.src)
                }))
            : []
        }));
    }

    return processedData;
  } catch (error) {
    console.error('处理Instagram数据代理时出错:', error);
    return data; // 出错时返回原始数据
  }
}

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
    
    return `data:image/svg+xml;base64,${btoa(svgContent)}`;
  } catch (error) {
    console.error('生成占位图失败:', error);
    // 备用简单占位图
    return `data:image/svg+xml;base64,${btoa(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b7280">加载失败</text></svg>'
    )}`;
  }
}

export default {
  getProxyImageUrl,
  getProxyImageUrls,
  addProxyToInstagramData,
  getErrorPlaceholder
};