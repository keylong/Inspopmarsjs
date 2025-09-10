'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Download,
  Link as LinkIcon,
  Loader2,
  Instagram,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useI18n, useCurrentLocale } from '@/lib/i18n/client';
import { useRouter } from 'next/navigation';

interface DownloadFormProps {
  variant?: 'default' | 'compact';
  showTitle?: boolean;
  className?: string;
}

export function DownloadForm({ 
  variant = 'default', 
  showTitle = true,
  className = '' 
}: DownloadFormProps) {
  const t = useI18n();
  const router = useRouter();
  const currentLocale = useCurrentLocale();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError(t('download.form.urlRequired'));
      return;
    }

    // Instagram URL 基本验证
    const instagramRegex = /^(https?:\/\/)?(www\.)?(instagram\.com|instagr\.am)\/.+/i;
    if (!instagramRegex.test(url)) {
      setError(t('download.form.invalidUrl'));
      return;
    }

    setLoading(true);
    setError(null);

    // 直接跳转到下载页面，不在首页进行API调用
    router.push(`/${currentLocale}/download/post?url=${encodeURIComponent(url.trim())}`);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError(null);
    } catch (error) {
      console.error('粘贴失败:', error);
    }
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={`w-full ${className}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <Input
              ref={inputRef}
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              placeholder={t('download.form.placeholder')}
              className="pl-10 pr-16 sm:pr-20 h-11 sm:h-12 text-sm sm:text-base"
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handlePaste}
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 text-xs px-2 sm:px-3"
              disabled={loading}
            >
              {t('download.form.paste')}
            </Button>
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            size="lg"
            className="h-11 sm:h-12 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <>
                <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                {t('download.form.analyze')}
              </>
            )}
          </Button>
        </div>
        {error && (
          <Alert variant="destructive" className="mt-3">
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}
      </form>
    );
  }

  return (
    <motion.div 
      className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {showTitle && (
        <div className="text-center mb-4 sm:mb-6">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
              <Instagram className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            {t('download.form.title')}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {t('download.form.subtitle')}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="relative">
          <LinkIcon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <Input
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            placeholder={t('download.form.placeholder')}
            className="pl-10 sm:pl-12 pr-16 sm:pr-24 h-12 sm:h-14 text-sm sm:text-base border-2 focus:border-purple-500 transition-colors"
            disabled={loading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePaste}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm px-2 sm:px-3"
            disabled={loading}
          >
            {t('download.form.paste')}
          </Button>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          size="lg"
          className="w-full h-12 sm:h-14 text-base sm:text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
              {t('download.form.analyzing')}
            </>
          ) : (
            <>
              <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:animate-bounce" />
              {t('download.form.analyze')}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}
      </form>

      <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500">
        <p>{t('download.form.supportedContent')}</p>
        <p className="mt-1 font-medium text-gray-700">
          {t('download.form.contentTypes')}
        </p>
      </div>
    </motion.div>
  );
}