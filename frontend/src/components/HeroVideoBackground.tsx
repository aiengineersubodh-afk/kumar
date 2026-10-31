'use client';

import React, { useRef, useEffect, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { VideoOff } from 'lucide-react';

interface HeroVideoBackgroundProps {
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

export default function HeroVideoBackground({
  videoSrc = '/videos/manymorgan-hero.mp4',
  posterSrc = '/videos/hero-poster.jpg',
}: HeroVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Subscribe to browser prefers-reduced-motion without cascading renders
  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Handle automatic muted continuous playback
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
      console.warn('[ManyMorgan Hero Video] Autoplay deferred:', err);
    });
  }, [isReducedMotion, videoSrc]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Static Poster Image (Next.js optimized visual fallback) */}
      <Image
        src={posterSrc}
        alt="ManyMorgan Innovation Hero Background"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center pointer-events-none"
      />

      {/* 2. Full-Screen Cinematic Video Element */}
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

      {/* 3. Balanced Cinematic Overlay: Allows the video to be vividly seen while ensuring text contrast */}
      <div className="absolute inset-0 bg-slate-950/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/90" />

      {/* Reduced motion indicator */}
      {isReducedMotion && (
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 pointer-events-auto">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-slate-400 backdrop-blur-md text-xs font-medium"
            title="Motion reduced per system accessibility settings"
          >
            <VideoOff className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Motion Reduced</span>
          </div>
        </div>
      )}
    </div>
  );
}

