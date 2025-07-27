'use client'

import { useState } from 'react'
import Image from 'next/image'

interface PortfolioImageProps {
  src?: string
  alt: string
  fallbackText?: string
}

export function PortfolioImage({ src, alt, fallbackText }: PortfolioImageProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  // Show fallback if no src or if image failed to load
  if (hasError || !src) {
    const fallbackInitial = fallbackText ? fallbackText.charAt(0).toUpperCase() : '?';
    return (
      <div className="w-32 h-32 rounded-full bg-slate-700 border-4 border-slate-600 shadow-lg flex items-center justify-center">
        <span className="text-2xl font-bold text-slate-300">{fallbackInitial}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={128}
      height={128}
      className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 shadow-lg"
      onError={handleError}
      priority
      unoptimized // Add this if you're using external URLs that Next.js can't optimize
    />
  );
}