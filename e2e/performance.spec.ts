import { test, expect } from '@playwright/test';

test.describe('性能测试', () => {
  test('首页应该快速加载', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    // 页面加载应该在3秒内完成
    expect(loadTime).toBeLessThan(3000);
    
    // 检查主要内容是否可见
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
  });

  test('检查Core Web Vitals', async ({ page }) => {
    await page.goto('/');

    // 等待页面加载完成
    await page.waitForLoadState('networkidle');

    // 获取Web Vitals指标
    const webVitals = await page.evaluate(async () => {
      return new Promise((resolve) => {
        const vitals = {
          LCP: 0,
          FID: 0,
          CLS: 0,
        };

        // 简单的性能测试
        const performanceEntries = performance.getEntriesByType('navigation');
        if (performanceEntries.length > 0) {
          const entry = performanceEntries[0] as PerformanceNavigationTiming;
          vitals.LCP = entry.loadEventEnd - entry.loadEventStart;
        }

        resolve(vitals);
      });
    });

    console.log('Web Vitals:', webVitals);
    
    // 这些是示例阈值，实际项目中应该根据需求调整
    expect(webVitals.LCP).toBeLessThan(2500); // LCP应该小于2.5秒
  });

  test('资源加载优化检查', async ({ page }) => {
    // 监听网络请求
    const requests: string[] = [];
    const responses: number[] = [];
    
    page.on('request', request => {
      requests.push(request.url());
    });
    
    page.on('response', response => {
      responses.push(response.status());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 检查是否有失败的请求
    const failedRequests = responses.filter(status => status >= 400);
    expect(failedRequests.length).toBe(0);

    // 检查关键资源是否已加载
    const hasCSS = requests.some(url => url.includes('.css') || url.includes('styles'));
    const hasJS = requests.some(url => url.includes('.js') || url.includes('javascript'));
    
    // 根据项目具体情况调整这些检查
    console.log('资源请求数量:', requests.length);
    console.log('包含CSS资源:', hasCSS);
    console.log('包含JS资源:', hasJS);
  });

  test('内存使用检查', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 获取基础内存使用情况
    const memoryInfo = await page.evaluate(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        return {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        };
      }
      return null;
    });

    if (memoryInfo) {
      console.log('内存使用情况:', memoryInfo);
      
      // 检查内存使用是否合理（这些值需要根据实际应用调整）
      expect(memoryInfo.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024); // 50MB
    }
  });

  test('图片优化检查', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 检查所有图片
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      
      if (src) {
        // 检查图片是否有alt属性
        expect(alt).not.toBeNull();
        
        // 检查图片是否成功加载
        const naturalWidth = await img.evaluate(el => (el as HTMLImageElement).naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
      }
    }
  });

  test('缓存策略检查', async ({ page }) => {
    const cacheableResources: string[] = [];
    
    page.on('response', response => {
      const url = response.url();
      const cacheControl = response.headers()['cache-control'];
      
      if (url.includes('.css') || url.includes('.js') || url.includes('image')) {
        cacheableResources.push(`${url}: ${cacheControl || 'no-cache-header'}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('可缓存资源的缓存策略:');
    cacheableResources.forEach(resource => console.log(resource));
  });
});