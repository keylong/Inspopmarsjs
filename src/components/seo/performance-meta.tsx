export function PerformanceMeta() {
  return (
    <>
      {/* DNS 预获取 */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//cdninstagram.com" />
      <link rel="dns-prefetch" href="//fbcdn.net" />
      
      {/* 预连接关键域名 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      
      {/* 预加载关键字体 */}
      <link
        rel="preload"
        href="/fonts/inter-var.woff2"
        as="font"
        type="font/woff2"
        crossOrigin=""
      />
      
      {/* 预获取关键API */}
      <link rel="prefetch" href="/api/download" />
      
      {/* 启用资源提示 */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
    </>
  );
}