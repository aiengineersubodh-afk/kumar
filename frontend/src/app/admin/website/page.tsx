'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Globe,
  Home,
  Layers,
  Info,
  PhoneCall,
  Briefcase,
  Compass,
  FileCode,
  Image as ImageIcon,
  Search,
  Settings,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { adminFetch } from '@/lib/adminAuth';

const MODULES = [
  {
    key: 'home_hero',
    title: '1. Homepage Management',
    description: 'Hero headline, subheadline, video/poster backgrounds, primary/secondary CTAs, ticker, and key metrics.',
    href: '/admin/website/homepage',
    icon: Home,
    liveUrl: '/',
  },
  {
    key: 'services',
    title: '2. Services Management',
    description: '13 technical categories, 78 services, 18 hero images, pricing models, benefits, tech stacks, and FAQs.',
    href: '/admin/website/services',
    icon: Layers,
    liveUrl: '/services',
  },
  {
    key: 'about_overview',
    title: '3. About Us Management',
    description: 'Corporate overview, 4 engineering pillars, mission statement, core values, leadership vision, and stats.',
    href: '/admin/website/about',
    icon: Info,
    liveUrl: '/about',
  },
  {
    key: 'contact_details',
    title: '4. Contact Us Management',
    description: 'Direct communication channels, corporate emails, phone numbers, HQ physical address, and hours.',
    href: '/admin/website/contact',
    icon: PhoneCall,
    liveUrl: '/contact',
  },
  {
    key: 'careers',
    title: '5. Careers Management',
    description: 'Internship & Research technical tracks, global active/inactive intake toggle, closed notice, and openings.',
    href: '/admin/website/careers',
    icon: Briefcase,
    liveUrl: '/careers',
  },
  {
    key: 'navigation_config',
    title: '6. Navigation & Header Management',
    description: 'Public top navigation links, order, visibility, announcement banner bar, and Schedule CTA configuration.',
    href: '/admin/website/navigation',
    icon: Compass,
    liveUrl: '/',
  },
  {
    key: 'footer_config',
    title: '7. Footer Management',
    description: 'Footer brand narrative, quick links, compliance/legal links, social profiles, and copyright statements.',
    href: '/admin/website/footer',
    icon: FileCode,
    liveUrl: '/',
  },
  {
    key: 'media',
    title: '8. Website Media Management',
    description: 'Centralized media library for images, video backgrounds, and logos with drag-and-drop upload and usage tracking.',
    href: '/admin/website/media',
    icon: ImageIcon,
    liveUrl: '/',
  },
  {
    key: 'seo_metadata',
    title: '9. SEO & Metadata Management',
    description: 'Per-page and global meta titles, descriptions, keywords, Open Graph social share cards, and canonicals.',
    href: '/admin/website/seo',
    icon: Search,
    liveUrl: '/',
  },
  {
    key: 'websiteSettings',
    title: '10. Website Settings',
    description: 'Organization identity, legal entity details, primary notification email addresses, currency, and defaults.',
    href: '/admin/website/settings',
    icon: Settings,
    liveUrl: '/',
  },
];

export default function WebsiteManagementHubPage() {
  const [summary, setSummary] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/content/admin/summary');
      if (res.ok) {
        const data = await res.json();
        setSummary(data || {});
      }
    } catch (e) {
      console.error('Failed to load summary:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
              Live Content Management
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Website Management & CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Edit and publish content across every section of the public ManyMorgan website with instant persistence, drafts, and revision rollback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadSummary}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Refresh status"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid of 10 Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          const modState = summary[mod.key] || {};
          const isDirty = modState.isDraftDirty;
          const lastPublished = modState.lastPublishedAt;

          return (
            <div
              key={mod.key}
              className="group bg-slate-900/60 border border-slate-800 hover:border-blue-600/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-0.5"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>

                  {isDirty ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <AlertCircle className="w-3 h-3" />
                      <span>Draft Modified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" />
                      <span>Published</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                    {mod.description}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 truncate">
                  {lastPublished
                    ? `Updated ${new Date(lastPublished).toLocaleDateString()}`
                    : 'System Default Preset'}
                </span>

                <Link
                  href={mod.href}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

