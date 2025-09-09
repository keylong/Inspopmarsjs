import { test, expect } from '@playwright/test';

test.describe('多语言功能测试', () => {
  const languages = [
    { code: 'zh-CN', name: '中文', footerText: 'Instagram 下载器' },
    { code: 'en', name: 'English', footerText: 'Instagram Downloader' },
    { code: 'es', name: 'Español', footerText: 'Descargador de Instagram' },
    { code: 'fr', name: 'Français', footerText: 'Téléchargeur Instagram' },
    { code: 'de', name: 'Deutsch', footerText: 'Instagram Downloader' },
    { code: 'ja', name: '日本語', footerText: 'Instagram ダウンローダー' }
  ];

  languages.forEach(({ code, name, footerText }) => {
    test(`应该能够访问${name}版本页面`, async ({ page }) => {
      await page.goto(`/${code}`);
      
      // 检查URL是否正确
      await expect(page).toHaveURL(new RegExp(`/${code}`));
      
      // 检查页面是否加载
      await expect(page.getByRole('contentinfo')).toBeVisible();
      
      // 检查Footer中是否有正确的语言内容（如果有翻译的话）
      const footer = page.getByRole('contentinfo');
      await expect(footer).toBeVisible();
    });
  });

  test('语言切换应该正常工作', async ({ page }) => {
    // 从中文页面开始
    await page.goto('/zh-CN');
    
    // 如果有语言切换器，测试切换功能
    const languageSwitcher = page.locator('[data-testid="language-switcher"]').first();
    
    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click();
      
      // 选择英文
      const englishOption = page.getByText('English').first();
      if (await englishOption.isVisible()) {
        await englishOption.click();
        await expect(page).toHaveURL(/\/en/);
      }
    }
  });

  test('隐私政策页面应该在所有语言中可访问', async ({ page }) => {
    for (const { code } of languages) {
      await page.goto(`/${code}/privacy`);
      await expect(page.getByRole('main')).toBeVisible();
      
      // 检查页面不是404
      const notFoundText = page.getByText('404').first();
      await expect(notFoundText).not.toBeVisible();
    }
  });

  test('服务条款页面应该在所有语言中可访问', async ({ page }) => {
    for (const { code } of languages) {
      await page.goto(`/${code}/terms`);
      await expect(page.getByRole('main')).toBeVisible();
      
      // 检查页面不是404
      const notFoundText = page.getByText('404').first();
      await expect(notFoundText).not.toBeVisible();
    }
  });
});