import { render, screen } from '@testing-library/react';
import { Footer } from '../footer';

// Mock the i18n hooks
jest.mock('@/lib/i18n/client', () => ({
  useCurrentLocale: () => 'zh-CN',
  useI18n: () => ({
    footer: {
      company: 'Instagram 下载器',
      copyright: '版权所有',
      allRightsReserved: '保留所有权利',
      links: {
        privacy: '隐私政策',
        terms: '服务条款',
        help: '帮助中心',
        contact: '联系我们',
        about: '关于我们',
      },
      social: {
        title: '关注我们',
        twitter: 'Twitter',
        facebook: 'Facebook',
        instagram: 'Instagram',
        youtube: 'YouTube',
      },
      sections: {
        product: '产品',
        support: '支持',
        company: '公司',
        legal: '法律',
      },
      description: '最好用的 Instagram 内容下载工具，支持图片、视频、Stories、IGTV 和 Reels 下载。',
    },
    nav: {
      home: '首页',
      download: '下载',
      about: '关于',
      help: '帮助',
      contact: '联系我们',
    }
  }),
}));

describe('Footer Component', () => {
  beforeEach(() => {
    // Mock Date to ensure consistent year
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-01'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders footer with company name and description', () => {
    render(<Footer />);
    
    expect(screen.getByText('Instagram 下载器')).toBeInTheDocument();
    expect(screen.getByText('最好用的 Instagram 内容下载工具，支持图片、视频、Stories、IGTV 和 Reels 下载。')).toBeInTheDocument();
  });

  it('displays copyright text with company name', () => {
    render(<Footer />);
    
    // Check for parts of the copyright text since it might be broken up
    expect(screen.getByText(/版权所有/)).toBeInTheDocument();
    expect(screen.getAllByText(/Instagram 下载器/)).toHaveLength(2); // 公司名和版权信息
    expect(screen.getByText(/保留所有权利/)).toBeInTheDocument();
  });

  it('renders all section headings', () => {
    render(<Footer />);
    
    expect(screen.getByText('产品')).toBeInTheDocument();
    expect(screen.getByText('支持')).toBeInTheDocument();
    expect(screen.getByText('法律')).toBeInTheDocument();
    expect(screen.getByText('关注我们')).toBeInTheDocument();
  });

  it('renders product links', () => {
    render(<Footer />);
    
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('下载')).toBeInTheDocument();
  });

  it('renders support links', () => {
    render(<Footer />);
    
    expect(screen.getByText('帮助中心')).toBeInTheDocument();
    expect(screen.getByText('联系我们')).toBeInTheDocument();
    expect(screen.getByText('关于我们')).toBeInTheDocument();
  });

  it('renders legal links', () => {
    render(<Footer />);
    
    expect(screen.getAllByText('隐私政策')).toHaveLength(2); // 出现在法律部分和底部
    expect(screen.getAllByText('服务条款')).toHaveLength(2); // 出现在法律部分和底部
  });

  it('renders social media icons with correct aria labels', () => {
    render(<Footer />);
    
    expect(screen.getByLabelText('在 Twitter 上关注我们')).toBeInTheDocument();
    expect(screen.getByLabelText('在 Facebook 上关注我们')).toBeInTheDocument();
    expect(screen.getByLabelText('在 Instagram 上关注我们')).toBeInTheDocument();
    expect(screen.getByLabelText('在 YouTube 上关注我们')).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveAttribute('aria-label', '网站页脚');
  });

  it('renders links with correct hrefs', () => {
    render(<Footer />);
    
    const homeLink = screen.getByText('首页').closest('a');
    expect(homeLink).toHaveAttribute('href', '/zh-CN');
    
    const downloadLink = screen.getByText('下载').closest('a');
    expect(downloadLink).toHaveAttribute('href', '/zh-CN/download');
  });

  it('renders social links with target="_blank" and rel attributes', () => {
    render(<Footer />);
    
    const twitterLink = screen.getByLabelText('在 Twitter 上关注我们');
    expect(twitterLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});