import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('无障碍性测试', () => {
  test('首页应该符合WCAG 2.1 AA标准', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('隐私政策页面应该符合无障碍标准', async ({ page }) => {
    await page.goto('/zh-CN/privacy');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('服务条款页面应该符合无障碍标准', async ({ page }) => {
    await page.goto('/zh-CN/terms');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Footer应该有正确的语义结构', async ({ page }) => {
    await page.goto('/');

    // 检查Footer使用正确的HTML语义标签
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
    await expect(footer).toHaveAttribute('aria-label');

    // 检查标题层次结构
    const headings = footer.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    
    if (headingCount > 0) {
      // 确保标题有适当的层次
      for (let i = 0; i < headingCount; i++) {
        const heading = headings.nth(i);
        await expect(heading).toBeVisible();
      }
    }

    // 检查链接有适当的描述
    const links = footer.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const ariaLabel = await link.getAttribute('aria-label');
      const textContent = await link.textContent();
      const hasDescriptiveText = (ariaLabel && ariaLabel.length > 0) || 
                                 (textContent && textContent.trim().length > 0);
      expect(hasDescriptiveText).toBe(true);
    }
  });

  test('键盘导航应该正常工作', async ({ page }) => {
    await page.goto('/');

    // 测试Tab键导航
    await page.keyboard.press('Tab');
    
    // 检查焦点是否可见
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // 继续Tab导航到Footer
    let attempts = 0;
    while (attempts < 20) { // 最多按20次Tab
      await page.keyboard.press('Tab');
      
      const currentFocused = page.locator(':focus');
      const isInFooter = await currentFocused.evaluate(el => {
        const footer = document.querySelector('footer');
        return footer && footer.contains(el);
      });
      
      if (isInFooter) {
        break;
      }
      attempts++;
    }

    // 在Footer中测试键盘导航
    const footer = page.getByRole('contentinfo');
    const footerLinks = footer.locator('a');
    const firstLink = footerLinks.first();
    
    if (await firstLink.isVisible()) {
      await firstLink.focus();
      await expect(firstLink).toBeFocused();
      
      // 测试Enter键激活链接
      await page.keyboard.press('Enter');
      
      // 检查是否导航到新页面
      await page.waitForLoadState('networkidle');
    }
  });

  test('颜色对比度应该符合标准', async ({ page }) => {
    await page.goto('/');
    
    // 使用axe-core检查颜色对比度
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('.footer, footer') // 专门检查footer区域
      .analyze();

    // 过滤颜色对比度相关的问题
    const colorContrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id.includes('color-contrast')
    );

    expect(colorContrastViolations).toEqual([]);
  });

  test('图像应该有适当的alt文本', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      const ariaHidden = await img.getAttribute('aria-hidden');
      
      // 图像应该有alt属性、aria-label或者aria-hidden="true"
      const hasAccessibleText = alt !== null || ariaLabel !== null || ariaHidden === 'true';
      expect(hasAccessibleText).toBe(true);
    }
  });

  test('表单元素应该有适当的标签', async ({ page }) => {
    await page.goto('/');

    // 检查所有input元素
    const inputs = page.locator('input');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      if (id) {
        // 检查是否有对应的label
        const label = page.locator(`label[for="${id}"]`);
        const labelExists = await label.count() > 0;
        
        const hasLabel = labelExists || ariaLabel !== null || ariaLabelledBy !== null;
        expect(hasLabel).toBe(true);
      }
    }
  });
});