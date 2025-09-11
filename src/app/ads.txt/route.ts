/**
 * ads.txt 路由处理
 * 确保 Google AdSense 能正确验证网站
 */

export async function GET() {
  const adsContent = 'google.com, pub-3999079713100649, DIRECT, f08c47fec0942fa0';
  
  return new Response(adsContent, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}