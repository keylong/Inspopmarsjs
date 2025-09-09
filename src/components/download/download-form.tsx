'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  Download, 
  LinkIcon, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Settings,
  Image,
  Video,
  Package
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useInstagramDownloader } from '@/lib/hooks/use-download';
import { DownloadFormData, URLValidationResult } from '@/types/instagram';
import { useI18n } from '@/lib/i18n/client';

// 创建表单验证 Schema 函数（支持i18n）
const createDownloadFormSchema = (t: any) => z.object({
  url: z
    .string()
    .min(1, '请输入 Instagram 链接')
    .url('请输入有效的 URL')
    .refine(
      (url) => url.includes('instagram.com'),
      '请输入有效的 Instagram 链接'
    ),
  type: z.enum(['auto', 'post', 'story', 'highlight', 'profile']),
  quality: z.enum(['original', 'hd', 'sd']),
  format: z.enum(['individual', 'zip']),
});

// FormData类型将在组件内部定义

interface DownloadFormProps {
  onDownloadStart?: (data: DownloadFormData) => void;
  onDownloadComplete?: (result: any) => void;
  onDownloadError?: (error: string) => void;
  placeholder?: string;
  acceptedTypes?: string[];
  optimizedFor?: string;
  features?: string[];
  requireAuth?: boolean;
  enableBatch?: boolean;
}

export function DownloadForm({
  onDownloadStart,
  onDownloadComplete,
  onDownloadError,
  placeholder = "https://www.instagram.com/p/...",
  acceptedTypes = ['auto', 'post', 'story', 'reel', 'igtv', 'highlight', 'profile'],
  optimizedFor,
  features = [],
  requireAuth = false,
  enableBatch = false,
}: DownloadFormProps) {
  const [validation, setValidation] = useState<URLValidationResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const t = useI18n();
  
  const downloadFormSchema = createDownloadFormSchema(t);
  type FormData = z.infer<typeof downloadFormSchema>;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(downloadFormSchema),
    defaultValues: {
      type: 'auto',
      quality: 'original',
      format: 'individual',
    },
  });

  const { download, isLoading, error, data } = useInstagramDownloader();
  const watchedUrl = watch('url');

  // URL 自动验证
  const handleURLValidation = async (url: string) => {
    if (!url || !url.includes('instagram.com')) {
      setValidation(null);
      return;
    }

    try {
      const response = await fetch('/api/validate-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      const result = await response.json();
      if (result.success) {
        setValidation(result.data);
        // 自动设置检测到的类型
        if (result.data.type && result.data.type !== 'auto') {
          setValue('type', result.data.type);
        }
      } else {
        setValidation({ isValid: false, error: result.error?.message });
      }
    } catch (err) {
      setValidation({ isValid: false, error: 'URL验证失败' });
    }
  };

  // 表单提交处理
  const onSubmit = async (formData: FormData) => {
    try {
      onDownloadStart?.(formData);
      
      const result = await download(formData);
      
      onDownloadComplete?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '下载失败';
      onDownloadError?.(errorMessage);
    }
  };

  const getContentTypeIcon = (type?: string) => {
    switch (type) {
      case 'post': return <Image className="w-4 h-4" />;
      case 'story': return <Video className="w-4 h-4" />;
      case 'reel': return <Video className="w-4 h-4" />;
      case 'igtv': return <Video className="w-4 h-4" />;
      case 'profile': return <Package className="w-4 h-4" />;
      default: return <LinkIcon className="w-4 h-4" />;
    }
  };

  const getContentTypeLabel = (type?: string) => {
    switch (type) {
      case 'post': return '帖子';
      case 'story': return '故事';
      case 'reel': return 'Reels';
      case 'igtv': return 'IGTV';
      case 'highlight': return '精彩时刻';
      case 'profile': return '个人资料';
      default: return '未知类型';
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Download className="w-6 h-6 text-primary" />
          {optimizedFor ? `${optimizedFor}工具` : 'Instagram 内容下载器'}
        </CardTitle>
        {features.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* URL 输入框 */}
          <div className="space-y-2">
            <Label htmlFor="url">Instagram 链接</Label>
            <div className="relative">
              <Input
                id="url"
                type="url"
                placeholder={placeholder}
                className={`pr-12 ${errors.url ? 'border-red-500' : ''}`}
                {...register('url')}
                onBlur={(e) => handleURLValidation(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {validation?.isValid && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {validation?.isValid === false && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
            
            {errors.url && (
              <p className="text-sm text-red-500">{errors.url.message}</p>
            )}
            
            {validation?.error && (
              <p className="text-sm text-red-500">{validation.error}</p>
            )}
            
            {validation?.isValid && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-green-600"
              >
                {getContentTypeIcon(validation.type)}
                <span>检测到: {getContentTypeLabel(validation.type)}</span>
                {validation.username && (
                  <Badge variant="secondary">@{validation.username}</Badge>
                )}
                {validation.shortcode && (
                  <Badge variant="outline">{validation.shortcode}</Badge>
                )}
              </motion.div>
            )}
          </div>

          {/* 高级选项 */}
          <div className="space-y-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              高级选项
            </Button>

            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg"
              >
                {/* 内容类型 */}
                <div className="space-y-2">
                  <Label htmlFor="type">内容类型</Label>
                  <Select
                    value={watch('type')}
                    onValueChange={(value) => setValue('type', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">自动检测</SelectItem>
                      <SelectItem value="post">帖子</SelectItem>
                      <SelectItem value="story">故事</SelectItem>
                      <SelectItem value="highlight">精彩时刻</SelectItem>
                      <SelectItem value="profile">个人资料</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 画质选择 */}
                <div className="space-y-2">
                  <Label htmlFor="quality">画质</Label>
                  <Select
                    value={watch('quality')}
                    onValueChange={(value) => setValue('quality', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original">原画质</SelectItem>
                      <SelectItem value="hd">高清</SelectItem>
                      <SelectItem value="sd">标清</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 下载格式 */}
                <div className="space-y-2">
                  <Label htmlFor="format">下载格式</Label>
                  <Select
                    value={watch('format')}
                    onValueChange={(value) => setValue('format', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">单独文件</SelectItem>
                      <SelectItem value="zip">ZIP 压缩包</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </div>

          {/* 支持的格式说明 */}
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <p className="font-medium mb-1">支持的内容类型：</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">📷 帖子</Badge>
              <Badge variant="secondary">📹 视频</Badge>
              <Badge variant="secondary">🎬 Reels</Badge>
              <Badge variant="secondary">📺 IGTV</Badge>
              <Badge variant="secondary">⭐ 故事</Badge>
              <Badge variant="secondary">✨ 精彩时刻</Badge>
            </div>
          </div>

          {/* 提交按钮 */}
          <Button
            type="submit"
            disabled={isLoading || !validation?.isValid}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                下载中...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                开始下载
              </>
            )}
          </Button>

          {/* 错误显示 */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">下载失败</span>
              </div>
              <p className="mt-1">{error.message}</p>
            </motion.div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}