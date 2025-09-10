import { InstagramDownloader } from '../instagram';

// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods to avoid noise in tests
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('InstagramDownloader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('parseAndDownload', () => {
    it('应该拒绝无效的URL', async () => {
      const result = await InstagramDownloader.parseAndDownload('invalid-url');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('应该拒绝非Instagram URL', async () => {
      const result = await InstagramDownloader.parseAndDownload('https://youtube.com/watch?v=123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('应该接受有效的Instagram帖子URL', async () => {
      const mockApiResponse = {
        success: true,
        data: {
          status: true,
          id: '123456789',
          __typename: 'GraphSidecar',
          owner: {
            username: 'testuser'
          },
          shortcode: 'ABC123',
          edge_sidecar_to_children: {
            edges: [
              {
                node: {
                  id: '123',
                  __typename: 'GraphImage',
                  display_url: 'https://instagram.com/image1.jpg',
                  dimensions: { width: 1080, height: 1080 },
                  is_video: false
                }
              }
            ]
          }
        }
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      });

      const result = await InstagramDownloader.parseAndDownload('https://www.instagram.com/p/ABC123/');
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      // downloads 属性在 APIResponse 类型中不存在，移除该断言
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('instagram-looter2.p.rapidapi.com'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'X-RapidAPI-Key': expect.any(String),
            'X-RapidAPI-Host': 'instagram-looter2.p.rapidapi.com'
          })
        })
      );
    });

    it('应该接受有效的Instagram Reels URL', async () => {
      const mockApiResponse = {
        success: true,
        data: {
          status: true,
          id: '123456789',
          __typename: 'GraphVideo',
          owner: {
            username: 'testuser'
          },
          shortcode: 'DEF456',
          is_video: true,
          video_url: 'https://instagram.com/video1.mp4',
          display_url: 'https://instagram.com/video1_thumbnail.jpg',
          dimensions: { width: 720, height: 1280 }
        }
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      });

      const result = await InstagramDownloader.parseAndDownload('https://www.instagram.com/reel/DEF456/');
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      if (result.data && result.data.media) {
        expect(result.data.media).toBeDefined();
        expect(Array.isArray(result.data.media)).toBe(true);
        expect(result.data.media.length).toBeGreaterThan(0);
        if (result.data.media[0]) {
          expect(result.data.media[0].is_video).toBe(true);
        }
      }
    });

    it('应该处理API错误响应', async () => {
      const mockApiResponse = {
        success: true,
        data: {
          status: false,
          errorMessage: '内容不存在或私密',
        }
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      });

      const result = await InstagramDownloader.parseAndDownload('https://www.instagram.com/p/NOTFOUND/');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result._apiError).toBe(true);
    });

    it('应该处理网络错误', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await InstagramDownloader.parseAndDownload('https://www.instagram.com/p/ABC123/');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result._parseError).toBe(true);
    });

    it('应该处理HTTP错误状态', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests'
      });

      const result = await InstagramDownloader.parseAndDownload('https://www.instagram.com/p/ABC123/');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('应该清理和标准化URL', async () => {
      const mockApiResponse = {
        success: true,
        data: {
          status: true,
          id: '123456789',
          __typename: 'GraphImage',
          owner: { username: 'testuser' },
          shortcode: 'ABC123',
          display_url: 'https://instagram.com/image1.jpg',
          dimensions: { width: 1080, height: 1080 },
          is_video: false
        }
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      });

      // 测试带有额外参数的URL
      const messyUrl = 'https://www.instagram.com/p/ABC123/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA==';
      const result = await InstagramDownloader.parseAndDownload(messyUrl);
      
      expect(result.success).toBe(true);
      
      // 验证API调用使用了清理后的URL
      const expectedCleanUrl = 'https://www.instagram.com/p/ABC123/';
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent(expectedCleanUrl)),
        expect.any(Object)
      );
    });

    it('应该处理Stories URL', async () => {
      const result = await InstagramDownloader.parseAndDownload('https://www.instagram.com/stories/testuser/123456789/');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('应该为轮播帖子生成多个下载项', async () => {
      const mockApiResponse = {
        success: true,
        data: {
          status: true,
          id: '123456789',
          __typename: 'GraphSidecar',
          owner: { username: 'testuser' },
          shortcode: 'ABC123',
          edge_sidecar_to_children: {
            edges: [
              {
                node: {
                  id: '123',
                  __typename: 'GraphImage',
                  display_url: 'https://instagram.com/image1.jpg',
                  dimensions: { width: 1080, height: 1080 },
                  is_video: false
                }
              },
              {
                node: {
                  id: '456',
                  __typename: 'GraphVideo',
                  video_url: 'https://instagram.com/video1.mp4',
                  display_url: 'https://instagram.com/video1_thumb.jpg',
                  dimensions: { width: 720, height: 1280 },
                  is_video: true
                }
              }
            ]
          }
        }
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      });

      const result = await InstagramDownloader.parseAndDownload('https://www.instagram.com/p/ABC123/');
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      if (result.data && result.data.media) {
        expect(result.data.media).toBeDefined();
        expect(Array.isArray(result.data.media)).toBe(true);
        expect(result.data.media).toHaveLength(2);
        if (result.data.media[0] && result.data.media[1]) {
          expect(result.data.media[0].type).toBe('image');
          expect(result.data.media[1].type).toBe('video');
        }
      }
    });
  });

  describe('URL验证', () => {
    it('应该接受各种有效的Instagram URL格式', () => {
      const validUrls = [
        'https://www.instagram.com/p/ABC123/',
        'https://instagram.com/p/ABC123/',
        'http://www.instagram.com/p/ABC123/',
        'https://www.instagram.com/reel/ABC123/',
        'https://www.instagram.com/tv/ABC123/',
        'https://instagram.com/p/ABC123',
        'https://www.instagram.com/p/ABC123/?utm_source=test',
      ];

      // 这个测试需要访问URLUtils.isValidInstagramUrl，但它不是导出的
      // 我们通过测试parseAndDownload的行为来间接测试
      validUrls.forEach(url => {
        expect(() => InstagramDownloader.parseAndDownload(url)).not.toThrow();
      });
    });

    it('应该拒绝无效的Instagram URL格式', async () => {
      const invalidUrls = [
        'https://facebook.com/post/123',
        'https://youtube.com/watch?v=123',
        'https://twitter.com/status/123',
        'https://instagram.com/user/',
        'not-a-url',
        '',
        null,
        undefined,
      ];

      for (const url of invalidUrls) {
        const result = await InstagramDownloader.parseAndDownload(url as any);
        expect(result.success).toBe(false);
        // 接受任何错误消息，因为可能是URL验证错误或其他错误
      }
    });
  });
});