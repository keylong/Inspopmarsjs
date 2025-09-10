import { useMutation, useQuery } from '@tanstack/react-query';
import { DownloadFormData, DownloadResult, URLValidationResult, APIResponse } from '@/types/instagram';

// API 调用函数
async function validateURL(url: string): Promise<URLValidationResult> {
  const response = await fetch('/api/validate-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  const result: APIResponse<URLValidationResult> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error?.message || 'URL validation failed');
  }

  return result.data!;
}

async function downloadInstagramContent(data: DownloadFormData): Promise<any> {
  const response = await fetch('/api/instagram/download', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error?.message || 'Download failed');
  }

  return result;
}

// URL 验证 Hook
export function useURLValidation(url: string) {
  return useQuery({
    queryKey: ['validate-url', url],
    queryFn: () => validateURL(url),
    enabled: false, // 手动触发
    retry: false,
    staleTime: 1000 * 60 * 5, // 5分钟缓存
  });
}

// 下载 Hook
export function useDownload() {
  return useMutation({
    mutationFn: downloadInstagramContent,
    retry: 1,
    retryDelay: 1000,
  });
}

// 组合 Hook，提供完整的下载流程
export function useInstagramDownloader() {
  const downloadMutation = useDownload();
  
  const download = async (formData: DownloadFormData) => {
    try {
      // 1. 验证 URL
      const validation = await validateURL(formData.url);
      
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid URL');
      }

      // 2. 开始下载
      const result = await downloadMutation.mutateAsync({
        ...formData,
        type: formData.type || validation.type || 'auto',
      });

      return {
        validation,
        result,
      };
    } catch (error) {
      throw error;
    }
  };

  return {
    download,
    isLoading: downloadMutation.isPending,
    error: downloadMutation.error,
    data: downloadMutation.data,
    reset: downloadMutation.reset,
  };
}