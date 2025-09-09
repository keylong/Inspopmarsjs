/**
 * 图片代理工具函数
 * 解决Instagram图片CORS限制
 */

/**
 * 将Instagram图片URL转换为代理URL
 * @param originalUrl - Instagram原始图片URL
 * @returns 代理URL
 */
export function getProxyImageUrl(originalUrl: string): string {
  if (!originalUrl) {
    return '/placeholder-image.jpg'; // 返回默认占位图
  }

  // 检查是否已经是代理URL，避免重复代理
  if (originalUrl.startsWith('/api/proxy/image')) {
    return originalUrl;
  }

  // 检查是否为Instagram CDN URL
  const isInstagramUrl = originalUrl.includes('fbcdn.net') || originalUrl.includes('cdninstagram.com');
  
  if (!isInstagramUrl) {
    // 如果不是Instagram URL，直接返回原URL（可能是其他安全的CDN）
    return originalUrl;
  }

  // 编码原始URL并生成代理URL
  const encodedUrl = encodeURIComponent(originalUrl);
  return `/api/proxy/image?url=${encodedUrl}`;
}

/**
 * 批量转换图片URL列表
 * @param urls - 原始URL数组
 * @returns 代理URL数组
 */
export function getProxyImageUrls(urls: string[]): string[] {
  return urls.map(url => getProxyImageUrl(url));
}

/**
 * 为Instagram数据结构中的所有图片URL添加代理
 * @param data - Instagram数据对象
 * @returns 处理后的数据对象
 */
export function addProxyToInstagramData(data: any): any {
  if (!data) return data;

  // 深拷贝避免修改原始数据
  const processedData = JSON.parse(JSON.stringify(data));

  try {
    // 处理主图片URL
    if (processedData.display_url) {
      processedData.display_url = getProxyImageUrl(processedData.display_url);
    }

    if (processedData.thumbnail_src) {
      processedData.thumbnail_src = getProxyImageUrl(processedData.thumbnail_src);
    }

    // 处理不同分辨率的图片资源
    if (processedData.display_resources && Array.isArray(processedData.display_resources)) {
      processedData.display_resources = processedData.display_resources.map((resource: any) => ({
        ...resource,
        src: getProxyImageUrl(resource.src)
      }));
    }

    // 处理轮播图片
    if (processedData.edge_sidecar_to_children?.edges) {
      processedData.edge_sidecar_to_children.edges = processedData.edge_sidecar_to_children.edges.map((edge: any) => ({
        ...edge,
        node: {
          ...edge.node,
          display_url: getProxyImageUrl(edge.node.display_url),
          display_resources: edge.node.display_resources?.map((resource: any) => ({
            ...resource,
            src: getProxyImageUrl(resource.src)
          })) || []
        }
      }));
    }

    // 处理用户头像
    if (processedData.owner?.profile_pic_url) {
      processedData.owner.profile_pic_url = getProxyImageUrl(processedData.owner.profile_pic_url);
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
export function getErrorPlaceholder(width: number = 400, height: number = 400, text: string = '图片加载失败'): string {
  // 使用本地生成的占位图，而不是外部服务
  return `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">
        ${text}
      </text>
    </svg>
  `)}`;
}

export default {
  getProxyImageUrl,
  getProxyImageUrls,
  addProxyToInstagramData,
  getErrorPlaceholder
};