import { NextRequest, NextResponse } from 'next/server';
import { InstagramDownloader } from '@/lib/api/instagram';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { userAdmin } from '@/lib/supabase-admin';
import { ipLimiter, getClientIP } from '@/lib/ip-limiter';
import { checkMembershipPermission } from '@/lib/membership';

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
  
  // 为未注册用户更新标签
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

    // 获取客户端IP地址
    const clientIP = getClientIP(request);
    console.log('客户端IP:', clientIP, '用户状态:', user ? '已登录' : '未登录');

    // 统一权限控制逻辑
    let finalQuality: string;
    let needsAuth = false;
    let usageDeducted = false;

    // 权限判断
    const isAuthenticated = !!user;
    const membershipCheck = checkMembershipPermission(userProfile);
    const requestedOriginal = quality === 'original';

    console.log('会员状态检查:', {
      isAuthenticated,
      hasPermission: membershipCheck.hasPermission,
      membershipStatus: membershipCheck.status,
      hasUsage: membershipCheck.hasUsage,
      userProfile: userProfile ? {
        buytype: userProfile.buytype,
        buydate: userProfile.buydate,
        value: userProfile.value
      } : null
    });

    // 首先检查是否为登录用户且有有效会员权限
    if (!isAuthenticated) {
      // 未注册用户：检查IP限制
      const ipCheck = ipLimiter.canDownload(clientIP);
      
      if (!ipCheck.allowed) {
        const resetTime = new Date(ipCheck.resetTime!);
        const remainingHours = Math.ceil((ipCheck.resetTime! - Date.now()) / (60 * 60 * 1000));
        
        return NextResponse.json(
          { 
            success: false, 
            error: `未注册用户今日下载次数已用完（1次），请 ${remainingHours} 小时后再试，或立即注册获得更多下载次数`,
            needsAuth: true,
            ipLimited: true,
            data: null,
            downloads: [],
            meta: {
              timestamp: new Date().toISOString(),
              url: url,
              remainingDownloads: 0,
              resetTime: resetTime.toISOString(),
              userAuthenticated: false,
              clientIP: clientIP
            }
          },
          { status: 429 } // Too Many Requests
        );
      }
      
      // 未注册用户：限制为HD质量，需要注册提示
      finalQuality = requestedOriginal ? 'hd' : (quality || 'hd');
      needsAuth = true;
    } else if (!membershipCheck.hasPermission) {
      // 登录但无有效会员权限：根据具体情况给出提示
      let errorMessage = '下载失败';
      const needsUpgrade = true;
      
      if (!membershipCheck.hasUsage) {
        errorMessage = '下载次数不足，请购买VIP会员';
      } else if (!membershipCheck.status.isActive) {
        if (membershipCheck.status.type === 'expired') {
          errorMessage = `${membershipCheck.status.typeName}已过期，请续费后继续使用`;
        } else {
          errorMessage = '请购买VIP会员后使用';
        }
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage,
          needsUpgrade: needsUpgrade,
          membershipStatus: membershipCheck.status,
          data: null,
          downloads: [],
          meta: {
            timestamp: new Date().toISOString(),
            url: url,
            remainingUsage: userProfile?.value || 0,
            userAuthenticated: isAuthenticated,
            membershipExpired: membershipCheck.status.type === 'expired'
          }
        },
        { status: 403 }
      );
    } else {
      // 登录用户有有效会员权限：先不扣除，等解析成功后再扣除
      finalQuality = requestedOriginal ? 'original' : (quality || 'hd');
    }

    // 对未注册用户添加6秒延迟
    if (!isAuthenticated) {
      console.log(`未注册用户 ${clientIP} 开始6秒延迟...`);
      await new Promise(resolve => setTimeout(resolve, 6000)); // 6秒延迟
      console.log(`未注册用户 ${clientIP} 延迟结束，开始解析...`);
    }

    // 调用下载服务
    const result = await InstagramDownloader.parseAndDownload(url);

    if (result.success) {
      // 解析成功！现在记录下载
      if (isAuthenticated && membershipCheck.hasPermission) {
        // 登录用户有有效权限：扣除下载次数
        try {
          await userAdmin.decrementUsage(userProfile.id);
          usageDeducted = true;
          console.log(`用户 ${user.email} 解析成功，扣除1次下载次数，剩余: ${(userProfile.value - 1)} 次`);
        } catch (error) {
          console.error('扣除使用次数错误:', error);
        }
      } else if (!isAuthenticated) {
        // 未注册用户：记录IP下载次数
        ipLimiter.recordDownload(clientIP);
        const ipStatus = ipLimiter.getIPStatus(clientIP);
        console.log(`未注册用户 ${clientIP} 解析成功，剩余IP下载次数: ${ipStatus.remainingDownloads}`);
      }
    
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
          remainingUsage: usageDeducted ? (userProfile?.value - 1) : (userProfile?.value || 0),
          // 为未注册用户添加IP限制信息
          ipDownloads: !isAuthenticated ? ipLimiter.getIPStatus(clientIP) : undefined,
          contentFiltered: finalQuality !== 'original',
          usageDeducted: usageDeducted,
          // 调试信息
          debugInfo: {
            isAuthenticated,
            hasPermission: membershipCheck.hasPermission,
            membershipStatus: membershipCheck.status,
            hasUsage: membershipCheck.hasUsage,
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