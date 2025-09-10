'use client';

import Image from 'next/image';
import { useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function LazyImage({ 
  src, 
  alt, 
  width = 800, 
  height = 600, 
  className = '',
  priority = false 
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        quality={85}
        onLoad={() => setIsLoading(false)}
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </div>
  );
}