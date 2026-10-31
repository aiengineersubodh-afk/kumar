'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, X } from 'lucide-react';
import { AnnouncementItem, getActiveAnnouncement } from '@/lib/api';

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<AnnouncementItem | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    getActiveAnnouncement().then((data) => {
      if (data && data.isActive) {
        setAnnouncement(data);
      }
    });
  }, []);

  if (!announcement || dismissed) return null;

  return (
    <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white border-b border-blue-900/40 text-xs sm:text-sm py-2.5 px-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-1 justify-center sm:justify-start">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <Sparkles className="w-3 h-3 text-blue-400" />
            {announcement.badgeText || 'Announcement'}
          </span>
          <p className="text-slate-200 line-clamp-1 font-medium">
            {announcement.message}
          </p>
          {announcement.linkLabel && announcement.linkUrl && (
            <Link
              href={announcement.linkUrl}
              className="hidden sm:inline-flex items-center gap-1 font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-2 ml-1"
            >
              {announcement.linkLabel}
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
