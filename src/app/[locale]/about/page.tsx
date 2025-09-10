'use client';


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n/client';

export default function AboutPage() {
  const t = useI18n();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          {t('about.title')}
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('about.features.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <li key={index}>• {(t as any)(`about.features.items.${index}`)}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('about.contentTypes.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <li key={index}>• {(t as any)(`about.contentTypes.items.${index}`)}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t('about.instructions.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm">
                <li>
                  <strong>1. {t('about.instructions.steps.step1.title')}：</strong>
                  {t('about.instructions.steps.step1.description')}
                </li>
                <li>
                  <strong>2. {t('about.instructions.steps.step2.title')}：</strong>
                  {t('about.instructions.steps.step2.description')}
                </li>
                <li>
                  <strong>3. {t('about.instructions.steps.step3.title')}：</strong>
                  {t('about.instructions.steps.step3.description')}
                </li>
                <li>
                  <strong>4. {t('about.instructions.steps.step4.title')}：</strong>
                  {t('about.instructions.steps.step4.description')}
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}