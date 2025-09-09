'use client';

import { motion } from 'framer-motion';
import { 
  ScrollText, 
  Clock, 
  Hash, 
  ChevronRight,
  ArrowUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { type Locale } from '@/lib/i18n/config';

interface TermsClientProps {
  locale: Locale;
  translations: {
    title: string;
    subtitle: string;
    lastUpdated: string;
    version: string;
    tableOfContents: string;
    sections: Record<string, { title: string; content: string[] }>;
    effectiveDate: string;
    acknowledgment: string;
  };
}

export default function TermsClient({ locale: _locale, translations }: TermsClientProps) {
  const [activeSection, setActiveSection] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 章节配置
  const sectionKeys = [
    'serviceDescription',
    'userResponsibilities', 
    'intellectualProperty',
    'disclaimer',
    'serviceChanges',
    'accountTermination',
    'disputeResolution',
    'contact'
  ];

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > 400);

      // 获取当前活跃的章节
      const sections = sectionKeys.map(key => document.getElementById(key));
      const currentSection = sections.find(section => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom > 100;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionKeys]);

  // 滚动到章节
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* 页面头部 */}
      <motion.div 
        className="bg-white/70 backdrop-blur-sm border-b border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full">
                <ScrollText className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {translations.title}
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {translations.subtitle}
            </motion.p>

            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Badge variant="secondary" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {translations.lastUpdated}: 2024年9月9日
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                {translations.version} 1.0
              </Badge>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* 侧边导航 - 目录 */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <div className="sticky top-8">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <ScrollText className="w-5 h-5 text-blue-600" />
                    {translations.tableOfContents}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sectionKeys.map((key) => {
                    const section = translations.sections[key];
                    if (!section) return null;
                    
                    return (
                      <Button
                        key={key}
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start text-left h-auto p-3 transition-all duration-200 ${
                          activeSection === key 
                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                        onClick={() => scrollToSection(key)}
                      >
                        <ChevronRight className={`w-4 h-4 mr-2 transition-transform ${
                          activeSection === key ? 'rotate-90 text-blue-500' : 'text-gray-400'
                        }`} />
                        <span className="text-sm">{section.title}</span>
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* 主要内容 */}
          <motion.div 
            className="lg:col-span-3 space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            {sectionKeys.map((key, index) => {
              const section = translations.sections[key];
              if (!section) return null;

              return (
                <motion.div
                  key={key}
                  id={key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-800 border-l-4 border-blue-500 pl-4">
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {section.content?.map((paragraph: string, pIndex: number) => (
                        <div key={pIndex} className="text-gray-700 leading-relaxed">
                          {paragraph.startsWith('•') ? (
                            <div className="ml-4 flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{paragraph.substring(2)}</span>
                            </div>
                          ) : (
                            <p>{paragraph}</p>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {/* 生效信息 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.2 }}
            >
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="space-y-4">
                    <p className="text-sm text-blue-700 font-medium">
                      {translations.effectiveDate}
                    </p>
                    <p className="text-gray-700 font-semibold">
                      {translations.acknowledgment}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 回到顶部按钮 */}
      {showScrollTop && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            size="lg"
            className="rounded-full w-12 h-12 p-0 bg-blue-600 hover:bg-blue-700 shadow-lg"
            onClick={scrollToTop}
          >
            <ArrowUp className="w-6 h-6" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}