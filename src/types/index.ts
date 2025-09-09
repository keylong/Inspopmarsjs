// 基础类型定义
export * from './auth'

export interface InstagramMedia {
  id: string;
  type: 'image' | 'video' | 'carousel';
  url: string;
  thumbnail?: string;
  caption?: string;
  timestamp: string;
  downloadUrl?: string;
}

export interface InstagramPost {
  id: string;
  shortcode: string;
  media: InstagramMedia[];
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  owner: {
    username: string;
    fullName?: string;
    profilePic?: string;
  };
}

export interface DownloadRequest {
  url: string;
  type: 'post' | 'story' | 'highlights' | 'profile';
  quality?: 'high' | 'medium' | 'low';
}

export interface DownloadResponse {
  success: boolean;
  data?: InstagramPost | InstagramMedia[];
  error?: string;
  message?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}