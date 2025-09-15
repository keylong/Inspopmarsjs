/**
 * Instagram 数据转换工具
 * 统一处理不同API响应格式，标准化数据结构
 */

import { InstagramPost, InstagramMedia, DisplayResource, DownloadItem, DownloadResolution } from '../../types/instagram';
import { getMediaType } from './media-proxy';

// Raw data types from Instagram API
interface RawInstagramMedia {
  id?: string;
  shortcode?: string;
  display_url?: string;
  url?: string;
  thumbnail_src?: string;
  thumbnail?: string;
  is_video?: boolean;
  type?: string;
  video_url?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  config_width?: number;
  config_height?: number;
  display_resources?: Array<{
    src: string;
    config_width: number;
    config_height: number;
  }>;
  media_type?: number;
  carousel_media?: RawInstagramMedia[];
}

interface RawInstagramPost extends RawInstagramMedia {
  permalink?: string;
  caption?: string;
  username?: string;
  taken_at_timestamp?: number;
  timestamp?: string;
  edge_sidecar_to_children?: {
    edges: Array<{ node: RawInstagramMedia }>;
  };
  carousel_media?: RawInstagramMedia[];
  edge_media_to_caption?: {
    edges: Array<{
      node: {
        text: string;
      };
    }>;
  };
  owner?: {
    username: string;
  };
  __typename?: string;
  story_type?: string;
  is_reel?: boolean;
  is_igtv?: boolean;
  igtv_type?: string;
  highlight_reel_type?: string;
  type?: 'post' | 'story' | 'highlight' | 'reel' | 'igtv';
}

/**
 * 标准化Instagram媒体数据
 */
export function standardizeMediaData(rawMedia: RawInstagramMedia): InstagramMedia {
  // 处理display_resources数组，生成多分辨率选项
  const displayResources: DisplayResource[] = [];
  
  if (rawMedia.display_resources && Array.isArray(rawMedia.display_resources)) {
    rawMedia.display_resources.forEach((resource) => {
      displayResources.push({
        src: resource.src,
        config_width: resource.config_width,
        config_height: resource.config_height,
        label: getResolutionLabel(resource.config_width, resource.config_height)
      });
    });
    
    // 按分辨率从高到低排序，确保第一个是最高质量（原图）
    displayResources.sort((a, b) => 
      (b.config_width * b.config_height) - (a.config_width * a.config_height)
    );
  }
  
  // 如果没有display_resources，基于主图片URL创建
  if (displayResources.length === 0 && rawMedia.display_url) {
    displayResources.push({
      src: rawMedia.display_url,
      config_width: rawMedia.dimensions?.width || 1080,
      config_height: rawMedia.dimensions?.height || 1080,
      label: '原图'
    });
  }

  // 对于视频，需要特殊处理缩略图
  const isVideo = rawMedia.is_video || rawMedia.type === 'video' || rawMedia.video_url;
  let thumbnailUrl = '';
  const mainUrl = rawMedia.display_url || rawMedia.url || '';
  
  if (isVideo) {
    // 对于视频，thumbnail 字段通常是缩略图
    // display_url 对于视频可能也是缩略图，但我们优先使用 thumbnail 字段
    thumbnailUrl = rawMedia.thumbnail_src || rawMedia.thumbnail || rawMedia.display_url || '';
  } else {
    // 对于图片，使用 display_url 作为缩略图
    thumbnailUrl = rawMedia.display_url || rawMedia.thumbnail || '';
  }

  const media: InstagramMedia = {
    id: rawMedia.id || rawMedia.shortcode || generateRandomId(),
    type: determineMediaType(rawMedia),
    url: mainUrl,
    thumbnail: thumbnailUrl,
    width: rawMedia.dimensions?.width || rawMedia.config_width || 1080,
    height: rawMedia.dimensions?.height || rawMedia.config_height || 1080,
    filename: '', // 临时占位符，下面会更新
    display_resources: displayResources,
    video_url: rawMedia.video_url,
    is_video: Boolean(isVideo)
  };
  
  // 生成文件名
  media.filename = generateFilename(media);
  
  return media;
}

/**
 * 标准化Instagram帖子数据
 */
export function standardizePostData(rawPost: RawInstagramPost): InstagramPost {
  let allMedia: InstagramMedia[] = [];
  
  // 优先处理轮播媒体（edge_sidecar_to_children）
  if (rawPost.edge_sidecar_to_children?.edges) {
    const carouselMedia = rawPost.edge_sidecar_to_children.edges.map((edge) => 
      standardizeMediaData(edge.node)
    );
    allMedia = allMedia.concat(carouselMedia);
  }
  // 处理carousel_media数组（备用格式）
  else if (rawPost.carousel_media && Array.isArray(rawPost.carousel_media)) {
    const carouselMedia = rawPost.carousel_media.map((media) => 
      standardizeMediaData(media)
    );
    allMedia = allMedia.concat(carouselMedia);
  }
  // 只有在没有轮播媒体时才处理单媒体帖子
  else if (rawPost.display_url || rawPost.url) {
    allMedia.push(standardizeMediaData(rawPost));
  }

  return {
    id: rawPost.id || rawPost.shortcode || generateRandomId(),
    url: rawPost.permalink || rawPost.url || `https://instagram.com/p/${rawPost.shortcode}/`,
    shortcode: rawPost.shortcode || '',
    caption: rawPost.edge_media_to_caption?.edges?.[0]?.node?.text || rawPost.caption || '',
    username: rawPost.owner?.username || rawPost.username || 'unknown',
    timestamp: rawPost.taken_at_timestamp 
      ? new Date(rawPost.taken_at_timestamp * 1000).toISOString()
      : rawPost.timestamp || new Date().toISOString(),
    media: allMedia,
    type: (rawPost.type || determinePostType(rawPost)) as InstagramPost['type'],
    is_carousel: allMedia.length > 1,
    carousel_media: allMedia.length > 1 ? allMedia : [],
    edge_sidecar_to_children: rawPost.edge_sidecar_to_children as InstagramPost['edge_sidecar_to_children']
  };
}

/**
 * 为图片URL添加图片代理前缀
 */
export function addProxyToImageUrl(imageUrl: string): string {
  // 如果URL为空，返回空字符串而不是占位符
  if (!imageUrl) {
    return '';
  }
  
  // 如果已经是代理URL或data URL，直接返回
  if (imageUrl.startsWith('/api/proxy/') || imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // 如果是本地路径（如 /placeholder-image.jpg），直接返回
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  // 检查是否为Instagram CDN URL
  const instagramDomains = ['fbcdn.net', 'cdninstagram.com', 'instagram.com'];
  const isInstagramUrl = instagramDomains.some(domain => imageUrl.includes(domain));
  
  if (isInstagramUrl) {
    // 直接构建代理URL，而不是调用generateImageSrc（避免返回占位符）
    return `/api/proxy/image?url=${encodeURIComponent(imageUrl)}`;
  }
  
  return imageUrl;
}

/**
 * 为视频URL添加视频代理前缀
 */
export function addProxyToVideoUrl(videoUrl: string): string {
  // 如果URL为空，返回空字符串
  if (!videoUrl) {
    return '';
  }
  
  // 如果已经是代理URL或data URL，直接返回
  if (videoUrl.startsWith('/api/proxy/') || videoUrl.startsWith('data:')) {
    return videoUrl;
  }
  
  // 如果是本地路径，直接返回
  if (videoUrl.startsWith('/')) {
    return videoUrl;
  }
  
  // 检查是否为Instagram CDN URL
  const instagramDomains = ['fbcdn.net', 'cdninstagram.com', 'instagram.com'];
  const isInstagramUrl = instagramDomains.some(domain => videoUrl.includes(domain));
  
  if (isInstagramUrl) {
    // 直接构建视频代理URL
    return `/api/proxy/video?url=${encodeURIComponent(videoUrl)}`;
  }
  
  return videoUrl;
}

/**
 * 批量处理Instagram数据中的图片/视频URL，添加代理
 */
export function addProxyToInstagramData(post: InstagramPost): InstagramPost {
  const processedPost = { ...post };
  
  // 处理media数组中的URL
  processedPost.media = post.media.map(media => {
    const processedMedia: InstagramMedia = {
      ...media,
      // 对于视频，url字段通常是缩略图，应该使用图片代理
      url: media.is_video ? addProxyToImageUrl(media.url) : addProxyToImageUrl(media.url),
      // thumbnail始终是图片，使用图片代理
      thumbnail: addProxyToImageUrl(media.thumbnail || ''),
      // display_resources通常是不同分辨率的缩略图，使用图片代理
      display_resources: media.display_resources?.map(resource => ({
        ...resource,
        src: addProxyToImageUrl(resource.src)
      })) || []
    };
    
    // 只有当video_url存在时才添加，且使用视频代理
    if (media.video_url) {
      processedMedia.video_url = addProxyToVideoUrl(media.video_url);
    }
    
    return processedMedia;
  });
  
  return processedPost;
}

/**
 * 生成下载项目列表 - 同一媒体的不同分辨率合并为一个选项
 */
export function generateDownloadItems(post: InstagramPost): DownloadItem[] {
  const downloadItems: DownloadItem[] = [];
  
  post.media.forEach((media, mediaIndex) => {
    const resolutions: DownloadResolution[] = [];
    
    // 如果是视频，优先使用video_url
    if (media.is_video && media.video_url) {
      resolutions.push({
        url: extractOriginalUrl(media.video_url),
        width: media.width,
        height: media.height,
        label: '视频原始质量',
        size: estimateFileSize(media.width, media.height, true)
      });
    }
    
    // 收集所有可用分辨率
    if (media.display_resources && media.display_resources.length > 0) {
      // 按分辨率从高到低排序
      const sortedResources = [...media.display_resources].sort((a, b) => 
        (b.config_width * b.config_height) - (a.config_width * a.config_height)
      );
      
      sortedResources.forEach((resource) => {
        // 对于视频，display_resources通常是预览图
        const isVideoThumbnail = media.is_video;
        const label = isVideoThumbnail 
          ? `视频预览 - ${getResolutionLabel(resource.config_width, resource.config_height)}`
          : resource.label || getResolutionLabel(resource.config_width, resource.config_height);
          
        resolutions.push({
          url: extractOriginalUrl(resource.src),
          width: resource.config_width,
          height: resource.config_height,
          label: label,
          size: estimateFileSize(resource.config_width, resource.config_height, false) // 预览图按图片计算
        });
      });
    } else if (!media.is_video || !media.video_url) {
      // 没有多分辨率时，且不是视频，使用主URL作为单一选项
      resolutions.push({
        url: extractOriginalUrl(media.url),
        width: media.width,
        height: media.height,
        label: media.is_video ? '视频' : '原图',
        size: estimateFileSize(media.width, media.height, media.is_video || false)
      });
    }
    
    // 生成基础文件名（不包含分辨率后缀）
    const baseFilename = generateBaseFilename(media, mediaIndex);
    
    // 确定默认分辨率（通常选择最高质量）
    const defaultResolution = resolutions.length > 0 ? (resolutions[0]?.label || '原图') : '原图';
    
    // 创建下载项
    downloadItems.push({
      mediaId: media.id,
      filename: baseFilename,
      type: media.is_video ? 'video' : 'image',
      resolutions: resolutions,
      thumbnail: media.thumbnail || media.url,
      defaultResolution: defaultResolution
    });
  });
  
  return downloadItems;
}

// 辅助函数

function determineMediaType(rawMedia: RawInstagramMedia): 'image' | 'video' | 'carousel' {
  if (rawMedia.is_video || rawMedia.video_url || rawMedia.type === 'video') {
    return 'video';
  }
  if (rawMedia.media_type === 8 || (rawMedia.carousel_media && rawMedia.carousel_media.length > 0)) {
    return 'carousel';
  }
  return 'image';
}

function determinePostType(rawPost: RawInstagramPost): 'post' | 'story' | 'highlight' | 'reel' | 'igtv' {
  if (rawPost.__typename === 'GraphStory' || rawPost.story_type) return 'story';
  if (rawPost.__typename === 'GraphVideo' || rawPost.is_reel) return 'reel';
  if (rawPost.is_igtv || rawPost.igtv_type) return 'igtv';
  if (rawPost.highlight_reel_type) return 'highlight';
  return 'post';
}

function getResolutionLabel(width: number, height: number): string {
  const pixels = width * height;
  if (pixels >= 1920 * 1080) return '高清 (1080p+)';
  if (pixels >= 1280 * 720) return '标清 (720p)';
  if (pixels >= 640 * 640) return '中等质量';
  return '低质量';
}

/**
 * 生成基础文件名（不包含分辨率后缀）
 */
function generateBaseFilename(media: InstagramMedia, index?: number): string {
  const timestamp = Date.now();
  const indexSuffix = typeof index === 'number' && index >= 0 ? `_${index + 1}` : '';
  
  // 验证media对象
  if (!media || typeof media !== 'object') {
    return `instagram_unknown_${timestamp}${indexSuffix}`;
  }
  
  if (media.is_video || media.video_url || media.type === 'video') {
    return `instagram_video_${timestamp}${indexSuffix}`;
  }
  return `instagram_image_${timestamp}${indexSuffix}`;
}

/**
 * 生成包含分辨率信息的完整文件名
 */
function generateFilename(media: InstagramMedia, label?: string, index?: number): string {
  if (!media || typeof media !== 'object') {
    const timestamp = Date.now();
    return `instagram_unknown_${timestamp}.jpg`;
  }
  
  const baseFilename = generateBaseFilename(media, index);
  const cleanLabel = label && typeof label === 'string' && label !== '原始质量' 
    ? `_${label.replace(/[\s\W]+/g, '_').replace(/^_+|_+$/g, '')}` 
    : '';
  
  const extension = (media.is_video || media.video_url || media.type === 'video') ? '.mp4' : '.jpg';
  
  return `${baseFilename}${cleanLabel}${extension}`;
}

/**
 * 为媒体代理创建 POST 请求的工具函数
 * 自动根据媒体类型选择正确的代理端点
 */
export async function createImageProxyPostRequest(imageUrl: string): Promise<string> {
  if (!imageUrl || typeof imageUrl !== 'string') {
    throw new Error('无效的媒体URL');
  }
  
  try {
    // 检测媒体类型并选择正确的端点
    const mediaType = getMediaType(imageUrl);
    const endpoint = mediaType === 'video' ? '/api/proxy/video' : '/api/proxy/image';
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: imageUrl.trim() }),
      // 添加超时控制，视频需要更长时间
      signal: AbortSignal.timeout(mediaType === 'video' ? 45000 : 30000),
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
    }
    
    const blob = await response.blob();
    
    // 验证blob类型
    if (!blob.type.startsWith('image/')) {
      throw new Error(`接收到非图片类型: ${blob.type}`);
    }
    
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('图片代理POST请求失败:', error);
    throw error;
  }
}

/**
 * 检查 URL 是否需要使用 POST 方式代理
 */
export function shouldUsePostProxy(imageUrl: string): boolean {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return false;
  }
  
  try {
    const encodedUrl = encodeURIComponent(imageUrl);
    // 如果编码后的 URL 超过 1500 字符，建议使用 POST
    // 同时检查URL的复杂度
    const hasComplexParams = imageUrl.includes('?') && imageUrl.split('&').length > 5;
    return encodedUrl.length > 1500 || hasComplexParams;
  } catch (error) {
    console.warn('URL编码检查失败:', error);
    return false;
  }
}

/**
 * 从代理URL中提取原始URL
 * 支持图片和视频代理端点
 */
function extractOriginalUrl(proxyUrl: string): string {
  // 检查是否为图片代理URL
  if (proxyUrl.startsWith('/api/proxy/image?url=')) {
    try {
      const urlParam = proxyUrl.substring('/api/proxy/image?url='.length);
      return decodeURIComponent(urlParam);
    } catch (error) {
      console.warn('无法解码图片代理URL:', proxyUrl, error);
      return proxyUrl;
    }
  }
  
  // 检查是否为视频代理URL
  if (proxyUrl.startsWith('/api/proxy/video?url=')) {
    try {
      const urlParam = proxyUrl.substring('/api/proxy/video?url='.length);
      return decodeURIComponent(urlParam);
    } catch (error) {
      console.warn('无法解码视频代理URL:', proxyUrl, error);
      return proxyUrl;
    }
  }
  
  return proxyUrl;
}

function estimateFileSize(width: number, height: number, isVideo: boolean): number {
  // 输入验证
  const validWidth = typeof width === 'number' && width > 0 ? width : 1080;
  const validHeight = typeof height === 'number' && height > 0 ? height : 1080;
  
  const pixels = validWidth * validHeight;
  
  if (isVideo) {
    // 视频估算：根据分辨率调整码率
    // 1080p: ~2MB/s, 720p: ~1MB/s, 480p: ~0.5MB/s
    let bitrateMultiplier = 1;
    if (pixels >= 1920 * 1080) {
      bitrateMultiplier = 2;
    } else if (pixels >= 1280 * 720) {
      bitrateMultiplier = 1;
    } else {
      bitrateMultiplier = 0.5;
    }
    
    // 假设15秒视频
    return Math.floor(bitrateMultiplier * 15 * 1024 * 1024);
  }
  
  // 图片估算：高质量JPEG压缩
  // 根据分辨率调整压缩比例
  let compressionRatio = 0.3; // 默认0.3字节每像素
  if (pixels >= 1920 * 1080) {
    compressionRatio = 0.4; // 高分辨率图片压缩比略低
  } else if (pixels <= 640 * 640) {
    compressionRatio = 0.2; // 低分辨率图片压缩比更高
  }
  
  return Math.floor(pixels * compressionRatio);
}

function generateRandomId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 9);
  return `${timestamp}_${randomPart}`;
}