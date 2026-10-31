'use client';

import React, { useRef, useEffect, useSyncExternalStore } from 'react';
import Image from 'next/image';

interface CareersVideoBackgroundProps {
  videoSrc?: string;
  posterSrc?: string;
}

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export default function CareersVideoBackground({
  videoSrc = '/videos/careers_backgound.mp4',
  posterSrc = '/videos/hero-poster.jpg',
}: CareersVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Subscribe to browser prefers-reduced-motion without cascading renders
  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isReducedMotion) {
      video.pause();
      return;
    }

    video.muted = true;
    video.playsInline = true;

    video.play().catch((err) => {
      console.warn('[ManyMorgan Careers Video] Autoplay deferred:', err);
    });
  }, [isReducedMotion, videoSrc]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Static Poster Image (Guarantees visible fallback if video fails, loads slowly, or autoplay is blocked) */}
      <Image
        src={posterSrc}
        alt="ManyMorgan Careers & Innovation"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center pointer-events-none"
      />

      {/* 2. Full-Screen Cinematic Careers Video Element */}
      {!isReducedMotion && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={posterSrc}
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* 3. Balanced Cinematic Overlay matching Home: Allows video to be clearly visible while maintaining text readability */}
      <div className="absolute inset-0 bg-slate-950/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/80" />
    </div>
  );
}
