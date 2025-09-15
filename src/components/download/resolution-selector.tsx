'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Image as ImageIcon, 
  Video, 
  // Check, 
  Monitor,
  Smartphone,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DownloadItem, InstagramMedia } from '@/types/instagram';

interface ResolutionSelectorProps {
  media: InstagramMedia;
  downloads: DownloadItem[];
  onDownload: (selectedItems: DownloadItem[]) => void;
  onSingleDownload?: (item: DownloadItem) => void;
  className?: string;
}

export function ResolutionSelector({
  media,
  downloads,
  onDownload,
  onSingleDownload,
  className
}: ResolutionSelectorProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 筛选出属于当前媒体的下载项
  const mediaDownloads = downloads.filter(item => item.mediaId === media.id);
  
  // 按分辨率排序（从高到低）
  const sortedDownloads = mediaDownloads.sort((a, b) => {
    const aMaxPixels = Math.max(...a.resolutions.map(r => r.width * r.height), 0);
    const bMaxPixels = Math.max(...b.resolutions.map(r => r.width * r.height), 0);
    return bMaxPixels - aMaxPixels;
  });

  const toggleSelection = (itemUrl: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemUrl)) {
      newSelection.delete(itemUrl);
    } else {
      newSelection.add(itemUrl);
    }
    setSelectedItems(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === sortedDownloads.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(sortedDownloads.map(item => item.mediaId)));
    }
  };

  const handleDownloadSelected = () => {
    const selected = sortedDownloads.filter(item => selectedItems.has(item.mediaId));
    if (selected.length > 0) {
      onDownload(selected);
    }
  };

  const getDeviceIcon = (width: number, height: number) => {
    const pixels = width * height;
    if (pixels >= 1920 * 1080) return <Monitor className="w-4 h-4" />;
    if (pixels >= 1280 * 720) return <Smartphone className="w-4 h-4 rotate-90" />;
    return <Smartphone className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (sortedDownloads.length === 0) {
    return null;
  }

  // 如果只有一个选项，显示简化版本
  if (sortedDownloads.length === 1) {
    const item = sortedDownloads[0];
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {media.is_video ? (
                <Video className="w-5 h-5 text-purple-500" />
              ) : (
                <ImageIcon className="w-5 h-5 text-blue-500" />
              )}
              <div>
                <p className="font-medium">
                  {item?.resolutions[0]?.width} × {item?.resolutions[0]?.height}
                </p>
                <p className="text-sm text-gray-500">
                  {item?.resolutions[0]?.label} • {formatFileSize(item?.resolutions[0]?.size || 0)}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => item && onSingleDownload?.(item)}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              下载
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            {media.is_video ? (
              <Video className="w-4 h-4 text-purple-500" />
            ) : (
              <ImageIcon className="w-4 h-4 text-blue-500" />
            )}
            <span>选择图片规格</span>
            <Badge variant="secondary" className="text-xs">
              {sortedDownloads.length} 个选项
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {/* 全选/取消全选 */}
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={selectedItems.size === sortedDownloads.length && sortedDownloads.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                  <span className="text-sm font-medium">
                    全选 ({selectedItems.size}/{sortedDownloads.length})
                  </span>
                </label>
                <Button
                  size="sm"
                  disabled={selectedItems.size === 0}
                  onClick={handleDownloadSelected}
                  className="flex items-center gap-1 text-xs"
                >
                  <Download className="w-3 h-3" />
                  下载选中
                </Button>
              </div>

              {/* 分辨率选项列表 */}
              <div className="space-y-2">
                {sortedDownloads.map((item, index) => (
                  <motion.div
                    key={item.mediaId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <Checkbox
                        checked={selectedItems.has(item.mediaId)}
                        onCheckedChange={() => toggleSelection(item.mediaId)}
                      />
                      
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(item.resolutions[0]?.width || 0, item.resolutions[0]?.height || 0)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {item.resolutions[0]?.width} × {item.resolutions[0]?.height}
                            </span>
                            <Badge 
                              variant={index === 0 ? "default" : "secondary"} 
                              className="text-xs"
                            >
                              {item.resolutions[0]?.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FileText className="w-3 h-3" />
                            <span>{formatFileSize(item.resolutions[0]?.size || 0)}</span>
                            <span>•</span>
                            <span>{item.type === 'video' ? '视频' : '图片'}</span>
                          </div>
                        </div>
                      </div>
                    </label>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => item && onSingleDownload?.(item)}
                      className="ml-2"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 折叠状态下的预览 */}
        {!isExpanded && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>最高质量: </span>
              <span className="font-medium">
                {sortedDownloads[0]?.resolutions[0]?.width} × {sortedDownloads[0]?.resolutions[0]?.height}
              </span>
              <Badge variant="secondary" className="text-xs">
                {sortedDownloads[0]?.resolutions[0]?.label}
              </Badge>
            </div>
            <Button
              size="sm"
              onClick={() => sortedDownloads[0] && onSingleDownload?.(sortedDownloads[0])}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-1" />
              下载最佳
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}