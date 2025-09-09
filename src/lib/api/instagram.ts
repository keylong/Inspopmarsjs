/**
 * Instagram Looter API 集成服务
 * 基于 RapidAPI Instagram Looter 接口
 */

import { 
  standardizePostData, 
  addProxyToInstagramData,
  generateDownloadItems 
} from '../utils/instagram-data-transformer';
import { InstagramPost, APIResponse } from '@/types/instagram';

// 使用统一的API响应类型
interface ApiResponse<T = any> extends APIResponse<T> {
  status?: number;
  _apiError?: boolean;
  _parseError?: boolean;
  _mode?: string;
}

// 统一错误类型
interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// API 配置
const API_CONFIG = {
  baseUrl: 'https://instagram-looter2.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
    'X-RapidAPI-Host': 'instagram-looter2.p.rapidapi.com',
    'Content-Type': 'application/json',
  },
};

/**
 * 通用 API 请求处理器
 */
async function apiRequest<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    if (!API_CONFIG.headers['X-RapidAPI-Key']) {
      throw new Error('Missing RAPIDAPI_KEY environment variable');
    }

    const url = new URL(endpoint, API_CONFIG.baseUrl);
    
    // 添加查询参数 - 避免双重URL编码
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // 直接使用字符串值，让URLSearchParams自动处理编码
          url.searchParams.append(key, String(value));
        }
      });
    }

    console.log(`[${requestId}] API 请求URL:`, url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        ...API_CONFIG.headers,
        'X-Request-ID': requestId,
      },
    });

    if (!response.ok) {
      // 增加更详细的错误信息
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorDetails: any = { status: response.status, statusText: response.statusText };
      
      try {
        const errorBody = await response.text();
        if (errorBody) {
          try {
            const parsedError = JSON.parse(errorBody);
            errorDetails = { ...errorDetails, body: parsedError };
            errorMessage = parsedError.message || parsedError.error || errorMessage;
          } catch {
            errorDetails = { ...errorDetails, body: errorBody };
          }
        }
      } catch (e) {
        console.warn(`[${requestId}] 无法读取错误响应体`);
      }
      
      console.error(`[${requestId}] API 请求失败:`, errorDetails);
      
      return {
        success: false,
        error: {
          code: `HTTP_${response.status}`,
          message: errorMessage,
          details: errorDetails
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId
        },
        status: response.status,
        _apiError: true
      };
    }

    const data = await response.json();
    console.log(`[${requestId}] API 响应成功, 状态:`, response.status);
    
    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId
      },
      status: response.status,
    };
  } catch (error) {
    console.error(`[${requestId}] Instagram API 错误:`, error);
    
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : '网络请求失败',
        details: { error: String(error) }
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId
      },
      _parseError: true
    };
  }
}

/**
 * 🧩 身份转换工具
 */
export class IdentityUtils {
  /**
   * 通过用户ID获取用户名
   */
  static async getUsernameFromUserId(userId: string): Promise<ApiResponse<{ username: string }>> {
    return apiRequest('/user/username-by-id', { user_id: userId });
  }

  /**
   * 通过用户名获取用户ID
   */
  static async getUserIdFromUsername(username: string): Promise<ApiResponse<{ user_id: string }>> {
    return apiRequest('/user/id-by-username', { username });
  }

  /**
   * 通过媒体ID获取短代码
   */
  static async getMediaShortcode(mediaId: string): Promise<ApiResponse<{ shortcode: string }>> {
    return apiRequest('/media/shortcode-by-id', { media_id: mediaId });
  }

  /**
   * 通过媒体URL获取媒体ID
   */
  static async getMediaIdFromUrl(url: string): Promise<ApiResponse<{ media_id: string }>> {
    return apiRequest('/media/id-by-url', { url });
  }
}

/**
 * 👤 用户信息服务
 */
export class UserService {
  /**
   * 通过用户名获取用户信息
   */
  static async getUserInfo(username: string, version: 'v1' | 'v2' = 'v2'): Promise<ApiResponse<any>> {
    if (!username?.trim()) {
      return {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '用户名不能为空',
          details: { username }
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: `val_${Date.now()}`
        }
      };
    }
    
    const endpoint = version === 'v2' ? '/user/info-v2' : '/user/info';
    return apiRequest(endpoint, { username: username.trim() });
  }

  /**
   * 通过用户ID获取用户信息
   */
  static async getUserInfoById(userId: string, version: 'v1' | 'v2' = 'v2'): Promise<ApiResponse> {
    const endpoint = version === 'v2' ? '/user/info-by-id-v2' : '/user/info-by-id';
    return apiRequest(endpoint, { user_id: userId });
  }

  /**
   * 获取用户的媒体列表
   */
  static async getUserMedia(userId: string, version: 'v1' | 'v2' = 'v2'): Promise<ApiResponse> {
    const endpoint = version === 'v2' ? '/user/media-list-v2' : '/user/media-list';
    return apiRequest(endpoint, { user_id: userId });
  }

  /**
   * 获取用户的Reels
   */
  static async getUserReels(userId: string): Promise<ApiResponse> {
    return apiRequest('/user/reels', { user_id: userId });
  }

  /**
   * 获取用户被标记的媒体
   */
  static async getTaggedMedia(userId: string): Promise<ApiResponse> {
    return apiRequest('/user/tagged-media', { user_id: userId });
  }

  /**
   * 获取相关用户档案
   */
  static async getRelatedProfiles(userId: string): Promise<ApiResponse> {
    return apiRequest('/user/related-profiles', { user_id: userId });
  }

  /**
   * 获取网页档案信息
   */
  static async getWebProfile(username: string): Promise<ApiResponse> {
    return apiRequest('/user/web-info', { username });
  }
}

/**
 * 📸 媒体信息服务
 */
export class MediaService {
  /**
   * 通过URL获取媒体信息 - 使用正确的 /post 端点
   */
  static async getMediaInfoByUrl(url: string): Promise<ApiResponse> {
    return apiRequest('/post', { url });
  }

  /**
   * 通过ID获取媒体信息
   */
  static async getMediaInfoById(mediaId: string): Promise<ApiResponse> {
    return apiRequest('/media/info-by-id', { media_id: mediaId });
  }

  /**
   * 获取媒体下载链接 ⭐ 核心功能 - 使用 /post-dl 端点
   */
  static async getDownloadLink(input: string): Promise<ApiResponse<{ download_url: string }>> {
    if (!input?.trim()) {
      return {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '输入不能为空',
          details: { input }
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: `val_${Date.now()}`
        }
      };
    }
    
    const trimmedInput = input.trim();
    
    // 判断输入是URL还是ID
    const isUrl = trimmedInput.startsWith('http');
    if (isUrl) {
      if (!URLUtils.isValidInstagramUrl(trimmedInput)) {
        return {
          success: false,
          error: {
            code: 'INVALID_URL',
            message: '无效的Instagram URL',
            details: { url: trimmedInput }
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId: `val_${Date.now()}`
          }
        };
      }
      
      const cleanUrl = URLUtils.cleanInstagramUrl(trimmedInput);
      return apiRequest('/post-dl', { url: cleanUrl });
    } else {
      return apiRequest('/media/download-link', { media_id: trimmedInput });
    }
  }

  /**
   * 获取音乐信息
   */
  static async getMusicInfo(musicId: string): Promise<ApiResponse> {
    return apiRequest('/media/music-info', { music_id: musicId });
  }
}

/**
 * 🔍 搜索服务
 */
export class SearchService {
  /**
   * 全局关键词搜索
   */
  static async globalSearch(keyword: string): Promise<ApiResponse> {
    return apiRequest('/search/global', { keyword });
  }

  /**
   * 搜索用户
   */
  static async searchUsers(keyword: string): Promise<ApiResponse> {
    return apiRequest('/search/users', { keyword });
  }

  /**
   * 搜索标签
   */
  static async searchHashtags(keyword: string): Promise<ApiResponse> {
    return apiRequest('/search/hashtags', { keyword });
  }

  /**
   * 通过标签获取媒体
   */
  static async getMediaByHashtag(hashtag: string): Promise<ApiResponse> {
    return apiRequest('/hashtag/media', { hashtag });
  }

  /**
   * 搜索位置
   */
  static async searchLocations(keyword: string): Promise<ApiResponse> {
    return apiRequest('/location/search', { keyword });
  }
}

/**
 * 🗺️ 位置服务
 */
export class LocationService {
  /**
   * 获取位置信息
   */
  static async getLocationInfo(locationId: string): Promise<ApiResponse> {
    return apiRequest('/location/info', { location_id: locationId });
  }

  /**
   * 通过位置ID获取媒体
   */
  static async getMediaByLocation(locationId: string): Promise<ApiResponse> {
    return apiRequest('/location/media', { location_id: locationId });
  }

  /**
   * 通过国家代码获取城市
   */
  static async getCitiesByCountry(countryCode: string): Promise<ApiResponse> {
    return apiRequest('/location/cities', { country_code: countryCode });
  }

  /**
   * 通过城市ID获取位置
   */
  static async getLocationsByCity(cityId: string): Promise<ApiResponse> {
    return apiRequest('/location/by-city', { city_id: cityId });
  }
}

/**
 * 🔍 探索服务
 */
export class ExploreService {
  /**
   * 获取探索分区列表
   */
  static async getExploreSections(): Promise<ApiResponse> {
    return apiRequest('/explore/sections');
  }

  /**
   * 通过分区ID获取媒体
   */
  static async getMediaBySection(sectionId: string): Promise<ApiResponse> {
    return apiRequest('/explore/media', { section_id: sectionId });
  }
}

/**
 * 🛠️ URL 工具函数
 */
class URLUtils {
  /**
   * 清理 Instagram URL，移除查询参数
   */
  static cleanInstagramUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // 保留协议和主机，但移除查询参数
      return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
    } catch (error) {
      return url; // 如果URL格式错误，返回原始URL
    }
  }

  /**
   * 验证Instagram URL格式
   */
  static isValidInstagramUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const validDomains = ['instagram.com', 'www.instagram.com', 'instagr.am'];
      return validDomains.includes(urlObj.hostname);
    } catch {
      return false;
    }
  }
}

/**
 * 🎯 统一下载服务 - 主要业务逻辑
 */
export class InstagramDownloader {

  /**
   * 解析 Instagram URL 并获取下载信息 - 仅使用真实API响应
   */
  static async parseAndDownload(url: string): Promise<ApiResponse<InstagramPost>> {
    const requestId = `parse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // 输入验证
      if (!url?.trim()) {
        return {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: '请输入Instagram链接',
            details: { url }
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId
          }
        };
      }

      const trimmedUrl = url.trim();
      
      // 验证和清理URL
      if (!URLUtils.isValidInstagramUrl(trimmedUrl)) {
        return {
          success: false,
          error: {
            code: 'INVALID_URL',
            message: '请输入有效的Instagram链接',
            details: { url: trimmedUrl }
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId
          }
        };
      }

      const cleanUrl = URLUtils.cleanInstagramUrl(trimmedUrl);
      console.log(`[${requestId}] 🔗 清理后的URL:`, cleanUrl);
      console.log(`[${requestId}] 🚀 调用Instagram Looter2 API...`);

      // 调用真实Instagram Looter2 API
      const mediaInfo = await MediaService.getMediaInfoByUrl(cleanUrl);
      
      if (!mediaInfo.success) {
        console.error(`[${requestId}] ❌ Instagram API调用失败:`, mediaInfo.error);
        return {
          success: false,
          error: {
            code: 'API_CALL_FAILED',
            message: 'Instagram API调用失败',
            details: mediaInfo.error
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId
          },
          _apiError: true
        };
      }

      // 处理和标准化响应数据
      const responseData = mediaInfo.data;
      console.log(`[${requestId}] 📊 收到API响应，状态:`, responseData?.status);
      
      // 检查API返回的状态
      if (responseData?.status === false) {
        const errorMessage = responseData.errorMessage || responseData.message || 'Instagram内容获取失败';
        console.error(`[${requestId}] 🚫 Instagram Looter2 API返回错误状态:`, errorMessage);
        return {
          success: false,
          error: {
            code: 'CONTENT_NOT_FOUND',
            message: `Instagram内容不存在或无法访问：${errorMessage}`,
            details: { responseData }
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId
          },
          _apiError: true
        };
      }

      // API返回成功状态，使用数据转换工具处理
      console.log(`[${requestId}] ✅ API返回成功状态，开始处理Instagram数据`);

      // 使用数据转换工具
      const standardizedPost = standardizePostData(responseData);
      const proxiedPost = addProxyToInstagramData(standardizedPost);
      const downloadItems = generateDownloadItems(proxiedPost);

      console.log(`[${requestId}] ✅ 数据处理完成，媒体数量:`, proxiedPost.media?.length || 0);

      return {
        success: true,
        data: proxiedPost,
        meta: {
          timestamp: new Date().toISOString(),
          requestId
        },
        status: 200,
        downloads: downloadItems,
        _mode: 'real-api-only'
      };

    } catch (error) {
      console.error(`[${requestId}] 💥 Instagram下载解析错误:`, error);
      return {
        success: false,
        error: {
          code: 'PARSE_ERROR',
          message: '下载解析失败',
          details: { error: String(error) }
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId
        },
        _parseError: true
      };
    }
  }

  /**
   * 将API响应映射到前端期望的格式
   */
  private static mapApiResponseToFrontendFormat(apiResponse: any): any {
    if (!apiResponse) {
      return null;
    }

    try {
      // Instagram Looter2 API 的实际响应结构处理
      const mapped = {
        status: apiResponse.status !== false, // 保持API原始状态
        display_url: apiResponse.display_url || apiResponse.thumbnail_src || '',
        display_resources: Array.isArray(apiResponse.display_resources) ? apiResponse.display_resources : [],
        is_video: Boolean(apiResponse.is_video),
        video_url: apiResponse.video_url || undefined,
        owner: apiResponse.owner ? {
          username: apiResponse.owner.username || '',
          full_name: apiResponse.owner.full_name || '',
          profile_pic_url: apiResponse.owner.profile_pic_url || ''
        } : null,
        edge_sidecar_to_children: apiResponse.edge_sidecar_to_children || null,
        timestamp: new Date().toISOString(),
        shortcode: apiResponse.shortcode || '',
        id: apiResponse.id || '',
        __typename: apiResponse.__typename || 'GraphImage',
        taken_at_timestamp: apiResponse.taken_at_timestamp || Math.floor(Date.now() / 1000),
        edge_media_to_caption: apiResponse.edge_media_to_caption || { edges: [] },
        edge_media_preview_like: apiResponse.edge_media_preview_like || { count: 0 },
        edge_media_to_comment: apiResponse.edge_media_to_comment || { count: 0 },
        // 保留原始数据供调试使用
        _original: apiResponse,
        _mode: 'real-api'
      };

      // 处理不同格式的多媒体数组
      if (apiResponse.children && Array.isArray(apiResponse.children)) {
        mapped.edge_sidecar_to_children = {
          edges: apiResponse.children.map((child: any) => ({
            node: {
              display_url: child.display_url || child.thumbnail_url || '',
              is_video: Boolean(child.is_video),
              video_url: child.video_url || undefined,
              id: child.id || '',
              dimensions: child.dimensions || { width: 1080, height: 1080 }
            }
          }))
        };
      }

      // 处理不同分辨率的图片资源
      if (apiResponse.images && Array.isArray(apiResponse.images)) {
        mapped.display_resources = apiResponse.images.map((img: any) => ({
          src: img.url || img.src || '',
          config_width: Number(img.width) || 0,
          config_height: Number(img.height) || 0
        }));
      }

      console.log('映射后的数据结构摘要:', {
        hasDisplayUrl: !!mapped.display_url,
        resourcesCount: mapped.display_resources.length,
        isVideo: mapped.is_video,
        hasOwner: !!mapped.owner,
        hasCarousel: !!mapped.edge_sidecar_to_children
      });
      
      return mapped;
    } catch (error) {
      console.error('API响应映射失败:', error);
      return apiResponse; // 映射失败时返回原始数据
    }
  }

  /**
   * 通过用户名获取用户所有媒体的下载信息
   */
  static async getUserAllMedia(username: string): Promise<ApiResponse<any>> {
    const requestId = `user_media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      if (!username?.trim()) {
        return {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: '用户名不能为空',
            details: { username }
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId
          }
        };
      }

      const trimmedUsername = username.trim();
      console.log(`[${requestId}] 开始获取用户媒体:`, trimmedUsername);
      
      // 1. 获取用户ID
      const userIdResult = await IdentityUtils.getUserIdFromUsername(trimmedUsername);
      if (!userIdResult.success) {
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: '无法找到该用户',
            details: userIdResult.error
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId
          }
        };
      }

      const userId = userIdResult.data?.user_id;
      if (!userId) {
        return {
          success: false,
          error: {
            code: 'INVALID_USER_ID',
            message: '无法获取用户ID',
            details: { userIdResult }
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId
          }
        };
      }

      // 并行获取用户数据
      const [userInfo, mediaList, reelsList] = await Promise.allSettled([
        UserService.getUserInfoById(userId),
        UserService.getUserMedia(userId),
        UserService.getUserReels(userId)
      ]);

      return {
        success: true,
        data: {
          user: userInfo.status === 'fulfilled' ? userInfo.value.data : null,
          posts: mediaList.status === 'fulfilled' ? mediaList.value.data : null,
          reels: reelsList.status === 'fulfilled' ? reelsList.value.data : null,
          username: trimmedUsername,
          userId,
          timestamp: new Date().toISOString(),
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId
        }
      };
    } catch (error) {
      console.error(`[${requestId}] 获取用户媒体失败:`, error);
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: '获取用户媒体失败',
          details: { error: String(error) }
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId
        }
      };
    }
  }
}

// 默认导出主要服务
export default {
  IdentityUtils,
  UserService,
  MediaService,
  SearchService,
  LocationService,
  ExploreService,
  InstagramDownloader,
};