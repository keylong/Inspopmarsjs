/**
 * Instagram Looter API 集成服务
 * 基于 RapidAPI Instagram Looter 接口
 */

import { 
  standardizePostData, 
  addProxyToInstagramData,
  generateDownloadItems 
} from '../utils/instagram-data-transformer';
import { InstagramPost } from '@/types/instagram';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
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
  try {
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

    console.log('API 请求URL:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: API_CONFIG.headers,
    });

    if (!response.ok) {
      // 增加更详细的错误信息
      let errorMessage = `API 请求失败: ${response.status} ${response.statusText}`;
      try {
        const errorBody = await response.text();
        if (errorBody) {
          errorMessage += ` - ${errorBody}`;
        }
      } catch (e) {
        // 忽略读取错误体的错误
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('API 响应成功');
    
    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('Instagram API 错误:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
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
  static async getUserInfo(username: string, version: 'v1' | 'v2' = 'v2'): Promise<ApiResponse> {
    const endpoint = version === 'v2' ? '/user/info-v2' : '/user/info';
    return apiRequest(endpoint, { username });
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
    // 判断输入是URL还是ID
    const isUrl = input.startsWith('http');
    if (isUrl) {
      return apiRequest('/post-dl', { url: input });
    } else {
      return apiRequest('/media/download-link', { media_id: input });
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
  static async parseAndDownload(url: string): Promise<ApiResponse> {
    try {
      // 验证和清理URL
      if (!URLUtils.isValidInstagramUrl(url)) {
        return {
          success: false,
          error: '请输入有效的Instagram链接'
        };
      }

      const cleanUrl = URLUtils.cleanInstagramUrl(url);
      console.log('🔗 清理后的URL:', cleanUrl);
      console.log('🚀 调用Instagram Looter2 API...');

      // 调用真实Instagram Looter2 API
      const mediaInfo = await MediaService.getMediaInfoByUrl(cleanUrl);
      
      if (!mediaInfo.success) {
        console.error('❌ Instagram API调用失败:', mediaInfo.error);
        return {
          success: false,
          error: `Instagram API调用失败: ${mediaInfo.error}`,
          _apiError: true
        };
      }

      // 处理和标准化响应数据
      const responseData = mediaInfo.data;
      console.log('📊 收到API响应，状态:', responseData?.status);
      console.log('📊 API响应数据摘要:', {
        status: responseData?.status,
        hasUsername: !!responseData?.owner?.username,
        mediaType: responseData?.__typename,
        hasCarousel: !!responseData?.edge_sidecar_to_children,
        mediaId: responseData?.id
      });

      // 检查API返回的状态
      if (responseData.status === false) {
        const errorMessage = responseData.errorMessage || responseData.message || 'Instagram内容获取失败';
        console.error('🚫 Instagram Looter2 API返回错误状态:', errorMessage);
        return {
          success: false,
          error: `Instagram内容不存在或无法访问：${errorMessage}`,
          data: responseData,
          _apiError: true
        };
      }

      // API返回成功状态，使用数据转换工具处理
      console.log('✅ API返回成功状态，开始处理Instagram数据');

      // 使用数据转换工具
      const standardizedPost = standardizePostData(responseData);
      const proxiedPost = addProxyToInstagramData(standardizedPost);

      console.log('✅ 数据处理完成，媒体数量:', proxiedPost.media?.length || 0);

      return {
        success: true,
        data: proxiedPost,
        downloads: generateDownloadItems(proxiedPost),
        status: 200,
        _mode: 'real-api-only'
      };

    } catch (error) {
      console.error('💥 Instagram下载解析错误:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '下载解析失败',
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

    // Instagram Looter2 API 的实际响应结构处理
    const mapped = {
      status: apiResponse.status !== false, // 保持API原始状态
      display_url: apiResponse.display_url || apiResponse.thumbnail_src,
      display_resources: apiResponse.display_resources || [],
      is_video: apiResponse.is_video || false,
      video_url: apiResponse.video_url,
      owner: apiResponse.owner ? {
        username: apiResponse.owner.username,
        full_name: apiResponse.owner.full_name,
        profile_pic_url: apiResponse.owner.profile_pic_url
      } : null,
      edge_sidecar_to_children: apiResponse.edge_sidecar_to_children || null,
      timestamp: new Date().toISOString(),
      shortcode: apiResponse.shortcode,
      id: apiResponse.id,
      __typename: apiResponse.__typename,
      taken_at_timestamp: apiResponse.taken_at_timestamp,
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
        edges: apiResponse.children.map((child: any, index: number) => ({
          node: {
            display_url: child.display_url || child.thumbnail_url,
            is_video: child.is_video || false,
            video_url: child.video_url
          }
        }))
      };
    }

    // 处理不同分辨率的图片资源
    if (apiResponse.images && Array.isArray(apiResponse.images)) {
      mapped.display_resources = apiResponse.images.map((img: any) => ({
        src: img.url || img.src,
        config_width: img.width || 0,
        config_height: img.height || 0
      }));
    }

    console.log('映射后的数据:', JSON.stringify(mapped, null, 2));
    return mapped;
  }

  /**
   * 通过用户名获取用户所有媒体的下载信息
   */
  static async getUserAllMedia(username: string): Promise<ApiResponse> {
    try {
      // 1. 获取用户ID
      const userIdResult = await IdentityUtils.getUserIdFromUsername(username);
      if (!userIdResult.success) {
        return userIdResult;
      }

      const userId = userIdResult.data?.user_id;
      if (!userId) {
        return { success: false, error: '无法获取用户ID' };
      }

      // 2. 获取用户信息
      const userInfo = await UserService.getUserInfoById(userId);

      // 3. 获取媒体列表
      const mediaList = await UserService.getUserMedia(userId);

      // 4. 获取Reels
      const reelsList = await UserService.getUserReels(userId);

      return {
        success: true,
        data: {
          user: userInfo.data,
          posts: mediaList.data,
          reels: reelsList.data,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取用户媒体失败',
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