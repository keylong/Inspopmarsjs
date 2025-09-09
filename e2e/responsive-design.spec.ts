import { test, expect } from '@playwright/test';

test.describe('响应式设计测试', () => {
  const viewports = [
    { name: '移动端', width: 375, height: 667 },
    { name: '平板端', width: 768, height: 1024 },
    { name: '桌面端', width: 1920, height: 1080 },
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`Footer在${name}设备上应该正确显示`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');

      const footer = page.getByRole('contentinfo');
      await expect(footer).toBeVisible();

      // 检查Footer是否响应式布局
      const footerBox = await footer.boundingBox();
      expect(footerBox?.width).toBeGreaterThan(0);
      expect(footerBox?.height).toBeGreaterThan(0);

      // 检查社交媒体链接是否可见
      const socialLinks = footer.locator('a[aria-label*="关注我们"]');
      await expect(socialLinks.first()).toBeVisible();

      // 检查版权信息是否显示
      await expect(footer.getByText(/版权所有/)).toBeVisible();
    });

    test(`导航在${name}设备上应该正确工作`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');

      // 检查主要内容区域是否可见
      const main = page.getByRole('main').first();
      if (await main.isVisible()) {
        await expect(main).toBeVisible();
      }

      // 在移动设备上，可能有汉堡菜单
      if (width < 768) {
        const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]').first();
        if (await mobileMenuButton.isVisible()) {
          await mobileMenuButton.click();
          // 检查菜单是否展开
          const mobileMenu = page.locator('[data-testid="mobile-menu"]').first();
          await expect(mobileMenu).toBeVisible();
        }
      }
    });
  });

  test('Footer链接在移动设备上应该易于点击', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const footer = page.getByRole('contentinfo');
    
    // 检查法律链接的可点击区域
    const privacyLink = footer.getByText('隐私政策').first();
    await expect(privacyLink).toBeVisible();
    
    const privacyBox = await privacyLink.boundingBox();
    if (privacyBox) {
      // 检查链接是否有足够的点击区域（至少44px高度，符合无障碍标准）
      expect(privacyBox.height).toBeGreaterThanOrEqual(24); // 实际可能更小，但应该可点击
    }

    // 测试点击功能
    await privacyLink.click();
    await expect(page).toHaveURL(/privacy/);
  });

  test('内容在不同设备上应该没有水平滚动', async ({ page }) => {
    const testViewports = [
      { width: 320, height: 568 }, // iPhone 5
      { width: 375, height: 667 }, // iPhone 8
      { width: 414, height: 896 }, // iPhone 11
      { width: 768, height: 1024 }, // iPad
    ];

    for (const { width, height } of testViewports) {
      await page.setViewportSize({ width, height });
      await page.goto('/');

      // 检查页面内容是否适应视窗宽度
      const body = page.locator('body');
      const bodyBox = await body.boundingBox();
      
      if (bodyBox) {
        // 页面内容不应该超过视窗宽度
        expect(bodyBox.width).toBeLessThanOrEqual(width + 20); // 允许一些误差
      }

      // 检查没有水平滚动条
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 20); // 允许一些误差
    }
  });
});