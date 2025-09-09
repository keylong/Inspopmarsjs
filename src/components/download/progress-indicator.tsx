'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Download,
  Search,
  FileImage,
  Package,
  Timer
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DownloadProgress } from '@/types/instagram';

interface ProgressIndicatorProps {
  progress: DownloadProgress;
  className?: string;
}

const stageConfig = {
  validating: {
    icon: Search,
    title: '验证链接',
    description: '正在检查 Instagram 链接的有效性...',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  fetching: {
    icon: Download,
    title: '获取内容',
    description: '正在从 Instagram 获取内容信息...',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
  },
  processing: {
    icon: FileImage,
    title: '处理媒体',
    description: '正在处理图片和视频文件...',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  downloading: {
    icon: Package,
    title: '下载文件',
    description: '正在下载内容到服务器...',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  completed: {
    icon: CheckCircle,
    title: '下载完成',
    description: '所有文件已成功下载完成！',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  error: {
    icon: AlertCircle,
    title: '下载失败',
    description: '下载过程中遇到了问题',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
};

export function ProgressIndicator({ progress, className }: ProgressIndicatorProps) {
  const config = stageConfig[progress.stage];
  const Icon = config.icon;

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* 状态头部 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${config.bgColor}`}>
                {progress.stage === 'error' ? (
                  <Icon className={`w-5 h-5 ${config.color}`} />
                ) : progress.stage === 'completed' ? (
                  <Icon className={`w-5 h-5 ${config.color}`} />
                ) : (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 className={`w-5 h-5 ${config.color}`} />
                  </motion.div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{config.title}</h3>
                <p className="text-sm text-gray-600">{progress.message || config.description}</p>
              </div>
            </div>
            
            {progress.stage !== 'error' && progress.stage !== 'completed' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Timer className="w-3 h-3" />
                处理中
              </Badge>
            )}
            
            {progress.stage === 'completed' && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                完成
              </Badge>
            )}
            
            {progress.stage === 'error' && (
              <Badge variant="destructive">
                <AlertCircle className="w-3 h-3 mr-1" />
                失败
              </Badge>
            )}
          </div>

          {/* 进度条 */}
          {progress.stage !== 'error' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>进度</span>
                <span>{Math.round(progress.percentage)}%</span>
              </div>
              <Progress 
                value={progress.percentage} 
                className="h-2 bg-gray-100"
              />
            </div>
          )}

          {/* 文件进度信息 */}
          <AnimatePresence>
            {(progress.totalFiles && progress.processedFiles !== undefined) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg text-sm"
              >
                <div>
                  <span className="text-gray-500">文件进度:</span>
                  <div className="font-medium">
                    {progress.processedFiles} / {progress.totalFiles} 个文件
                  </div>
                </div>
                
                {progress.currentFile && (
                  <div>
                    <span className="text-gray-500">当前文件:</span>
                    <div className="font-medium truncate" title={progress.currentFile}>
                      {progress.currentFile}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 阶段指示器 */}
          <div className="flex items-center justify-between pt-2">
            {Object.entries(stageConfig).slice(0, -1).map(([stage, config], index) => {
              const isActive = stage === progress.stage;
              const isCompleted = Object.keys(stageConfig).indexOf(progress.stage) > index;
              
              return (
                <div key={stage} className="flex items-center">
                  <motion.div
                    className={`
                      w-3 h-3 rounded-full border-2 transition-colors
                      ${isActive 
                        ? `border-blue-500 bg-blue-500` 
                        : isCompleted 
                          ? 'border-green-500 bg-green-500' 
                          : 'border-gray-300 bg-white'
                      }
                    `}
                    animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  {index < Object.keys(stageConfig).length - 2 && (
                    <div 
                      className={`
                        w-8 h-0.5 mx-1 transition-colors
                        ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                      `} 
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}