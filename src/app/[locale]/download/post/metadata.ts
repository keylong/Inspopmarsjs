import { Metadata } from 'next';
import { generateSEOMetadata } from '@/components/seo/seo-metadata';

export async function generatePostDownloadMetadata(locale: string): Promise<Metadata> {
  return generateSEOMetadata('post', locale);
}