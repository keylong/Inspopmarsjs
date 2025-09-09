import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSwitcher } from '../language-switcher';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/zh-CN/privacy',
}));

// Mock i18n hooks
jest.mock('@/lib/i18n/client', () => ({
  useCurrentLocale: () => 'zh-CN',
  useI18n: () => ({
    language: {
      switch: '切换语言',
      current: '当前语言',
    }
  }),
}));

// Mock i18n config
jest.mock('@/lib/i18n/config', () => ({
  locales: ['zh-CN', 'en', 'es', 'fr', 'de', 'ja'],
  localeNames: {
    'zh-CN': '中文',
    'en': 'English',
    'es': 'Español',
    'fr': 'Français',
    'de': 'Deutsch',
    'ja': '日本語',
  },
  localeFlags: {
    'zh-CN': '🇨🇳',
    'en': '🇺🇸',
    'es': '🇪🇸',
    'fr': '🇫🇷',
    'de': '🇩🇪',
    'ja': '🇯🇵',
  },
}));

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders with default dropdown variant', () => {
    render(<LanguageSwitcher />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('🇨🇳')).toBeInTheDocument();
    expect(screen.getByText('中文')).toBeInTheDocument();
  });

  it('renders with compact variant', () => {
    render(<LanguageSwitcher variant="compact" />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('🇨🇳')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    // 检查所有语言选项是否显示
    await waitFor(() => {
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('Español')).toBeInTheDocument();
      expect(screen.getByText('Français')).toBeInTheDocument();
      expect(screen.getByText('Deutsch')).toBeInTheDocument();
      expect(screen.getByText('日本語')).toBeInTheDocument();
    });
  });

  it('closes dropdown when clicked outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <LanguageSwitcher />
        <button data-testid="outside-button">Outside</button>
      </div>
    );
    
    // 打开下拉菜单
    const button = screen.getByRole('button');
    await user.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('English')).toBeInTheDocument();
    });
    
    // 点击外部元素
    const outsideButton = screen.getByTestId('outside-button');
    await user.click(outsideButton);
    
    // 下拉菜单应该关闭
    await waitFor(() => {
      expect(screen.queryByText('English')).not.toBeInTheDocument();
    });
  });

  it('changes language when option is selected', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);
    
    // 打开下拉菜单
    const button = screen.getByRole('button');
    await user.click(button);
    
    // 选择英文
    await waitFor(() => {
      expect(screen.getByText('English')).toBeInTheDocument();
    });
    
    const englishOption = screen.getByText('English');
    await user.click(englishOption);
    
    // 检查是否调用了路由器的push方法
    expect(mockPush).toHaveBeenCalledWith('/en/privacy');
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button');
    
    // 使用Tab键聚焦到按钮
    await user.tab();
    expect(button).toHaveFocus();
    
    // 使用Enter键打开下拉菜单
    await user.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(screen.getByText('English')).toBeInTheDocument();
    });
    
    // 使用Escape键关闭下拉菜单
    await user.keyboard('{Escape}');
    
    await waitFor(() => {
      expect(screen.queryByText('English')).not.toBeInTheDocument();
    });
  });

  it('shows current language with check mark', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    await waitFor(() => {
      const currentLanguageOption = screen.getByText('中文').closest('button');
      expect(currentLanguageOption).toHaveAttribute('aria-pressed', 'true');
    });
  });

  it('has proper accessibility attributes', () => {
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-haspopup', 'listbox');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('updates accessibility attributes when opened', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });

  it('applies custom className', () => {
    const customClass = 'custom-language-switcher';
    render(<LanguageSwitcher className={customClass} />);
    
    const container = screen.getByRole('button').parentElement;
    expect(container).toHaveClass(customClass);
  });

  it('handles path without language code correctly', async () => {
    // Mock pathname without language code
    jest.mocked(require('next/navigation').usePathname).mockReturnValueOnce('/');
    
    const user = userEvent.setup();
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('English')).toBeInTheDocument();
    });
    
    const englishOption = screen.getByText('English');
    await user.click(englishOption);
    
    expect(mockPush).toHaveBeenCalledWith('/en');
  });
});