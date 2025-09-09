import { test, expect } from '@playwright/test';

test.describe('基础导航测试', () => {
  test('应该能够访问首页并显示主要元素', async ({ page }) => {
    await page.goto('/');

    // 检查页面标题
    await expect(page).toHaveTitle(/Instagram 下载器/);
    
    // 检查主要导航元素存在
    const navigation = page.getByRole('navigation');
    await expect(navigation).toBeVisible();
    
    // 检查Footer是否存在
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
    
    // 检查Footer中的公司名
    await expect(footer.getByText('Instagram 下载器')).toBeVisible();
  });

  test('Footer链接应该正常工作', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.getByRole('contentinfo');
    
    // 测试隐私政策链接
    const privacyLink = footer.getByText('隐私政策').first();
    await expect(privacyLink).toBeVisible();
    await privacyLink.click();
    await expect(page).toHaveURL(/privacy/);
    
    // 返回首页
    await page.goto('/');
    
    // 测试服务条款链接
    const termsLink = footer.getByText('服务条款').first();
    await expect(termsLink).toBeVisible();
    await termsLink.click();
    await expect(page).toHaveURL(/terms/);
  });

  test('社交媒体链接应该有正确的属性', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.getByRole('contentinfo');
    
    // 检查Twitter链接
    const twitterLink = footer.getByLabel('在 Twitter 上关注我们');
    await expect(twitterLink).toBeVisible();
    await expect(twitterLink).toHaveAttribute('target', '_blank');
    await expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    // 检查Facebook链接
    const facebookLink = footer.getByLabel('在 Facebook 上关注我们');
    await expect(facebookLink).toBeVisible();
    await expect(facebookLink).toHaveAttribute('target', '_blank');
    await expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});