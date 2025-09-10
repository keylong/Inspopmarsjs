/**
 * 智能媒体代理工具
 * 根据媒体类型自动选择合适的代理端点和处理方式
 */

// 检测视频URL
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.m4v'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerUrl.includes(ext)) || 
         lowerUrl.includes('video') || 
         lowerUrl.includes('/v/') ||
         lowerUrl.includes('dash_baseline') ||
         lowerUrl.includes('progressive');
}

// 检测图片URL
export function isImageUrl(url: string): boolean {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.includes(ext)) || 
         lowerUrl.includes('image') ||
         (!isVideoUrl(url) && (lowerUrl.includes('instagram') || lowerUrl.includes('fbcdn')));
}

// 获取媒体类型
export function getMediaType(url: string): 'video' | 'image' | 'unknown' {
  if (!url) return 'unknown';
  if (isVideoUrl(url)) return 'video';
  if (isImageUrl(url)) return 'image';
  return 'unknown';
}

// 生成代理URL
export function generateProxyUrl(originalUrl: string, mediaType?: 'video' | 'image'): string {
  if (!originalUrl) return '';
  
  // 如果没有指定媒体类型，自动检测
  const detectedType = mediaType || getMediaType(originalUrl);
  
  // 编码原始URL
  const encodedUrl = encodeURIComponent(originalUrl);
  
  // 根据媒体类型选择代理端点
  switch (detectedType) {
    case 'video':
      return `/api/proxy/video?url=${encodedUrl}`;
    case 'image':
      return `/api/proxy/image?url=${encodedUrl}`;
    default:
      // 对于未知类型，默认尝试图片代理
      console.warn('未知媒体类型，默认使用图片代理:', originalUrl.substring(0, 100));
      return `/api/proxy/image?url=${encodedUrl}`;
  }
}

// 为Image组件生成安全的src
export function generateImageSrc(url: string, fallback: string = '/placeholder-image.jpg'): string {
  if (!url) return fallback;
  
  // 如果是视频URL，返回占位符
  if (isVideoUrl(url)) {
    console.warn('尝试将视频URL用作图片，使用占位符:', url.substring(0, 100));
    return fallback;
  }
  
  // 如果是图片URL，生成代理URL
  if (isImageUrl(url)) {
    return generateProxyUrl(url, 'image');
  }
  
  // 未知类型，返回占位符
  return fallback;
}

// 为Video组件生成安全的src
export function generateVideoSrc(url: string): string | null {
  if (!url) return null;
  
  // 只有视频URL才返回代理URL
  if (isVideoUrl(url)) {
    return generateProxyUrl(url, 'video');
  }
  
  console.warn('尝试将非视频URL用作视频源:', url.substring(0, 100));
  return null;
}

// 媒体URL诊断工具
export function diagnoseMediaUrl(url: string): {
  originalUrl: string;
  mediaType: 'video' | 'image' | 'unknown';
  isVideo: boolean;
  isImage: boolean;
  recommendedProxy: string;
  safeForImage: boolean;
  safeForVideo: boolean;
} {
  return {
    originalUrl: url,
    mediaType: getMediaType(url),
    isVideo: isVideoUrl(url),
    isImage: isImageUrl(url),
    recommendedProxy: generateProxyUrl(url),
    safeForImage: !isVideoUrl(url),
    safeForVideo: isVideoUrl(url),
  };
}

// 批量处理媒体URL
export function processMediaUrls(urls: Array<{url: string, type?: 'video' | 'image'}>): Array<{
  original: string;
  proxy: string;
  type: 'video' | 'image' | 'unknown';
  safe: boolean;
}> {
  return urls.map(({url, type}) => {
    const detectedType = type || getMediaType(url);
    return {
      original: url,
      proxy: generateProxyUrl(url, detectedType === 'unknown' ? undefined : detectedType),
      type: detectedType,
      safe: detectedType !== 'unknown'
    };
  });
}

// 创建安全的媒体配置对象
export interface SafeMediaConfig {
  imageSrc: string;
  videoSrc: string | null;
  poster: string | null;
  isVideo: boolean;
  isImage: boolean;
  type: 'video' | 'image' | 'unknown';
}

export function createSafeMediaConfig(
  primaryUrl: string, 
  thumbnailUrl?: string,
  fallbackImage: string = '/placeholder-image.jpg'
): SafeMediaConfig {
  const primaryType = getMediaType(primaryUrl);
  const thumbnailType = thumbnailUrl ? getMediaType(thumbnailUrl) : 'unknown';
  
  return {
    // 图片源：优先使用缩略图（如果是图片），否则使用占位符
    imageSrc: thumbnailUrl && isImageUrl(thumbnailUrl) 
      ? generateImageSrc(thumbnailUrl, fallbackImage)
      : primaryType === 'image' 
        ? generateImageSrc(primaryUrl, fallbackImage)
        : fallbackImage,
    
    // 视频源：只有当主URL是视频时才提供
    videoSrc: primaryType === 'video' ? generateVideoSrc(primaryUrl) : null,
    
    // 海报：如果缩略图是图片则使用，否则为null
    poster: thumbnailUrl && isImageUrl(thumbnailUrl) 
      ? generateImageSrc(thumbnailUrl, fallbackImage) 
      : null,
    
    isVideo: primaryType === 'video',
    isImage: primaryType === 'image',
    type: primaryType
  };
}