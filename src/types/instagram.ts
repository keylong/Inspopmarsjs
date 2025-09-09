export interface DisplayResource {
  src: string;
  config_width: number;
  config_height: number;
  label?: string; // "原画质", "高清", "标清"
}

export interface InstagramMedia {
  id: string;
  type: 'image' | 'video' | 'carousel';
  url: string;
  thumbnail?: string;
  width: number;
  height: number;
  filename: string;
  display_resources?: DisplayResource[];
  video_url?: string; // 用于视频文件
  is_video?: boolean;
}

export interface InstagramPost {
  id: string;
  url: string;
  shortcode: string;
  caption?: string;
  username: string;
  timestamp: string;
  media: InstagramMedia[];
  type: 'post' | 'story' | 'highlight' | 'reel' | 'igtv';
  // 轮播相关
  is_carousel?: boolean;
  carousel_media?: InstagramMedia[];
  // 原始API数据结构支持
  edge_sidecar_to_children?: {
    edges: Array<{
      node: {
        id: string;
        display_url: string;
        is_video: boolean;
        display_resources?: DisplayResource[];
        video_url?: string;
        dimensions?: { height: number; width: number };
      };
    }>;
  };
}

export interface DownloadFormData {
  url: string;
  type?: 'auto' | 'post' | 'story' | 'highlight' | 'profile';
  quality?: 'original' | 'hd' | 'sd';
  format?: 'individual' | 'zip';
}

export interface DownloadProgress {
  stage: 'validating' | 'fetching' | 'processing' | 'downloading' | 'completed' | 'error';
  percentage: number;
  message: string;
  currentFile?: string;
  totalFiles?: number;
  processedFiles?: number;
}

export interface DownloadResolution {
  url: string;
  width: number;
  height: number;
  label: string;
  size: number;
}

export interface DownloadItem {
  mediaId: string; // 媒体项的唯一标识
  filename: string; // 基础文件名（不包含分辨率后缀）
  type: 'image' | 'video';
  resolutions: DownloadResolution[]; // 可用的分辨率选项
  thumbnail?: string; // 预览缩略图URL
  defaultResolution?: string; // 默认分辨率标签
}

export interface DownloadResult {
  success: boolean;
  data?: InstagramPost;
  downloads?: DownloadItem[];
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  progress?: DownloadProgress;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

export type ContentType = 'post' | 'story' | 'highlight' | 'reel' | 'igtv' | 'profile';

export interface URLValidationResult {
  isValid: boolean;
  type?: ContentType;
  shortcode?: string;
  username?: string;
  error?: string;
}