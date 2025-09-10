import { NextRequest, NextResponse } from 'next/server';
import { InstagramDownloader } from '@/lib/api/instagram';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { userAdmin } from '@/lib/supabase-admin';

// 画质过滤辅助函数
function filterMediaQuality(data: any, allowedQuality: string) {
  if (!data || allowedQuality === 'original') return data;
  
  // 如果是单个媒体对象
  if (data.display_resources) {
    const filteredResources = filterDisplayResources(data.display_resources, allowedQuality);
    return {
      ...data,
      display_resources: filteredResources,
      display_url: filteredResources[0]?.src || data.display_url
    };
  }
  
  // 如果是包含多个媒体的轮播
  if (data.edge_sidecar_to_children?.edges) {
    const filteredEdges = data.edge_sidecar_to_children.edges.map((edge: any) => ({
      ...edge,
      node: filterMediaQuality(edge.node, allowedQuality)
    }));
    
    return {
      ...data,
      edge_sidecar_to_children: {
        ...data.edge_sidecar_to_children,
        edges: filteredEdges
      }
    };
  }
  
  return data;
}

function filterDownloadQuality(downloads: any[], allowedQuality: string) {
  if (!downloads || allowedQuality === 'original') return downloads;
  
  return downloads.map(download => {
    if (download.resolutions) {
      const filteredResolutions = filterDisplayResources(download.resolutions, allowedQuality);
      return {
        ...download,
        resolutions: filteredResolutions,
        url: filteredResolutions[0]?.src || download.url
      };
    }
    return download;
  });
}

function filterDisplayResources(resources: any[], allowedQuality: string) {
  if (!resources || allowedQuality === 'original') return resources;
  
  // 按分辨率排序（从高到低）
  const sortedResources = [...resources].sort((a, b) => 
    (b.config_width * b.config_height) - (a.config_width * a.config_height)
  );
  
  let filteredResources;
  
  if (allowedQuality === 'hd') {
    // 高清：过滤掉最高分辨率，保留其余
    filteredResources = sortedResources.slice(1);
  } else if (allowedQuality === 'sd') {
    // 标清：只保留最低分辨率
    filteredResources = sortedResources.slice(-1);
  } else {
    filteredResources = sortedResources;
  }
  
  // 为未登录用户更新标签
  return filteredResources.map((resource, index) => ({
    ...resource,
    label: allowedQuality === 'original' ? resource.label : 
           index === 0 ? '中等质量' : 
           index === 1 ? '低质量' : 
           resource.label || `${resource.config_width}×${resource.config_height}`
  }));
}

/**
 * POST /api/instagram/download
 * 核心下载端点 - 解析Instagram URL并获取下载信息
 */
export async function POST(request: NextRequest) {
  let url = 'unknown';
  try {
    const cookieStore = await cookies();
    const body = await request.json();
    ({ url } = body);
    const { quality } = body; // 获取请求的画质

    // 验证输入
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: '请提供有效的Instagram URL' },
        { status: 400 }
      );
    }

    // 验证是否为Instagram URL
    const instagramRegex = /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/.+/;
    if (!instagramRegex.test(url)) {
      return NextResponse.json(
        { success: false, error: '请提供有效的Instagram URL' },
        { status: 400 }
      );
    }

    // 检查用户认证状态
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll() {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    let userProfile = null;

    // 如果用户已登录，获取用户信息
    if (user?.email) {
      try {
        userProfile = await userAdmin.findByEmail(user.email);
      } catch (error) {
        console.error('获取用户信息错误:', error);
      }
    }

    // 统一权限控制逻辑
    let finalQuality: string;
    let needsAuth = false;
    let usageDeducted = false;

    // 权限判断
    const isAuthenticated = !!user;
    const hasUsage = user && userProfile && userProfile.value > 0;
    const requestedOriginal = quality === 'original';

    if (requestedOriginal) {
      if (!isAuthenticated) {
        // 未登录用户：降级为HD
        finalQuality = 'hd';
        needsAuth = true;
      } else if (!hasUsage) {
        // 登录但无使用次数：降级为HD
        finalQuality = 'hd';
        needsAuth = true;
      } else {
        // 有权限：允许原图，扣除使用次数
        finalQuality = 'original';
        try {
          await userAdmin.decrementUsage(userProfile.id);
          usageDeducted = true;
        } catch (error) {
          console.error('扣除使用次数错误:', error);
          // 扣费失败，降级为HD
          finalQuality = 'hd';
          needsAuth = true;
        }
      }
    } else {
      // 请求非原图：直接使用请求的质量
      finalQuality = quality || 'hd';
    }

    // 调用下载服务
    const result = await InstagramDownloader.parseAndDownload(url);

    if (result.success) {
      // 根据最终确定的权限应用内容过滤
      let processedData = result.data;
      let processedDownloads = (result as any).downloads || [];
      
      // 只有当最终质量不是原图时才进行过滤
      if (finalQuality !== 'original') {
        processedData = filterMediaQuality(processedData, finalQuality);
        processedDownloads = filterDownloadQuality(processedDownloads, finalQuality);
      }

      // 确保返回标准化的响应格式
      const response = {
        success: true,
        data: processedData,
        downloads: processedDownloads,
        meta: {
          mode: result._mode || 'unknown',
          timestamp: new Date().toISOString(),
          url: url,
          actualQuality: finalQuality,
          requestedQuality: quality || 'hd',
          qualityDowngraded: requestedOriginal && finalQuality !== 'original',
          needsAuth: needsAuth,
          userAuthenticated: isAuthenticated,
          remainingUsage: userProfile?.value || 0,
          contentFiltered: finalQuality !== 'original',
          usageDeducted: usageDeducted,
          // 调试信息
          debugInfo: {
            isAuthenticated,
            hasUsage,
            requestedOriginal,
            finalQuality
          }
        }
      };
      
      return NextResponse.json(response, {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        }
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || '下载失败',
          data: null,
          downloads: [],
          meta: {
            timestamp: new Date().toISOString(),
            url: url
          }
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Instagram下载API错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '服务器内部错误',
        data: null,
        downloads: [],
        meta: {
          timestamp: new Date().toISOString(),
          url: url || 'unknown'
        }
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        }
      }
    );
  }
}

/**
 * GET /api/instagram/download?url=xxx
 * 可选的GET方式支持
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { success: false, error: '请提供url参数' },
        { status: 400 }
      );
    }

    // 重用POST逻辑
    return POST(new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({ url }),
    }));
  } catch (error) {
    console.error('Instagram下载GET API错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '服务器内部错误',
        data: null,
        downloads: [],
        meta: {
          timestamp: new Date().toISOString(),
          url: 'unknown'
        }
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        }
      }
    );
  }
}