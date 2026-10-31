'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Globe,
  Share2,
  Save,
  Send,
  Loader2,
  CheckCircle,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { adminFetch } from '@/lib/adminAuth';
import CmsPublishToolbar, { CmsRevision } from '@/components/admin/CmsPublishToolbar';

type PageKey = 'home' | 'services' | 'about' | 'contact' | 'careers';

interface PageSeo {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;
}

const DEFAULT_SEO: Record<PageKey, PageSeo> = {
  home: {
    title: 'ManyMorgan | Enterprise Software Engineering & Digital Transformation',
    description:
      'ManyMorgan designs, builds, and scales market-defining mobile applications, modern web platforms, custom cloud architectures, and autonomous AI automation systems.',
    keywords: 'enterprise software, cloud architecture, AI solutions, digital transformation, mobile app engineering',
    ogImage: '/images/og-share.jpg',
    canonicalUrl: 'https://manymorgan.com',
  },
  services: {
    title: 'Services & Technical Catalog | ManyMorgan Engineering',
    description:
      'Explore ManyMorgan’s comprehensive technical disciplines: AI & Data, Cloud & DevOps, Full-Stack Engineering, Cybersecurity, and Business Process Automation.',
    keywords: 'software engineering services, cloud devops, enterprise cybersecurity, machine learning consultancy',
    ogImage: '/images/og-services.jpg',
    canonicalUrl: 'https://manymorgan.com/services',
  },
  about: {
    title: 'About ManyMorgan | Engineering Rigor & Philosophy',
    description:
      'Learn about ManyMorgan’s engineering philosophy, mission, core values, and our commitment to architectural excellence in modern digital transformation.',
    keywords: 'about manymorgan, software philosophy, senior engineering pods, clean architecture',
    ogImage: '/images/og-about.jpg',
    canonicalUrl: 'https://manymorgan.com/about',
  },
  contact: {
    title: 'Contact Technical Leadership | ManyMorgan Project Scoping',
    description:
      'Connect directly with ManyMorgan software architects and digital transformation specialists. 48-hour architecture blueprint scoping guarantee.',
    keywords: 'contact manymorgan, project quote, technical leadership, hire software architects',
    ogImage: '/images/og-contact.jpg',
    canonicalUrl: 'https://manymorgan.com/contact',
  },
  careers: {
    title: 'Engineering Careers & Applied Research | ManyMorgan Innovation Labs',
    description:
      'Join ManyMorgan’s senior technical tracks or participate in applied AI and distributed systems research fellowship cohorts.',
    keywords: 'software engineering internships, research fellowship, applied AI research, careers',
    ogImage: '/images/og-careers.jpg',
    canonicalUrl: 'https://manymorgan.com/careers',
  },
};

export default function AdminSeoManagementPage() {
  const [selectedPage, setSelectedPage] = useState<PageKey>('home');
  const [seoData, setSeoData] = useState<Record<PageKey, PageSeo>>(DEFAULT_SEO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [revisions, setRevisions] = useState<CmsRevision[]>([]);
  const [lastPublishedAt, setLastPublishedAt] = useState<string | undefined>();

  const loadSeo = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/content/admin/seo_metadata');
      if (res.ok) {
        const data = await res.json();
        const payload = data.draftPayload || data.contentPayload || {};

        if (payload.pages) {
          setSeoData({ ...DEFAULT_SEO, ...payload.pages });
        }

        setIsDirty(!!data.isDraftDirty);
        setLastPublishedAt(data.lastPublishedAt);
        setRevisions(data.revisions || []);
      }
    } catch (e) {
      console.error('Failed to load SEO data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeo();
  }, []);

  const currentSeo = seoData[selectedPage];

  const handleFieldChange = (field: keyof PageSeo, val: string) => {
    setSeoData({
      ...seoData,
      [selectedPage]: {
        ...currentSeo,
        [field]: val,
      },
    });
    setIsDirty(true);
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const res = await adminFetch('/content/admin/seo_metadata/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'SEO & Metadata Configuration',
          subtitle: 'Per-page and global search engine metadata',
          draftPayload: { pages: seoData },
        }),
      });
      if (res.ok) {
        setIsDirty(true);
        alert('SEO draft saved!');
        loadSeo();
      }
    } catch (e) {
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    const confirm = window.confirm('Publish SEO & Metadata changes live to the website?');
    if (!confirm) return;

    setPublishing(true);
    try {
      const res = await adminFetch('/content/admin/seo_metadata/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'SEO & Metadata Configuration',
          subtitle: 'Per-page and global search engine metadata',
          contentPayload: { pages: seoData },
          changeSummary: 'Admin updated SEO metadata and Open Graph tags',
        }),
      });
      if (res.ok) {
        setIsDirty(false);
        alert('SEO settings successfully published!');
        loadSeo();
      }
    } catch (e) {
      alert('Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  const handleDiscard = async () => {
    try {
      const res = await adminFetch('/content/admin/seo_metadata/discard', { method: 'POST' });
      if (res.ok) {
        alert('Draft discarded.');
        loadSeo();
      }
    } catch (e) {
      alert('Failed to discard');
    }
  };

  const handleRollback = async (revisionId: string) => {
    try {
      const res = await adminFetch(`/content/admin/seo_metadata/rollback/${revisionId}`, { method: 'POST' });
      if (res.ok) {
        alert('SEO configuration rolled back.');
        loadSeo();
      }
    } catch (e) {
      alert('Failed to rollback');
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs font-semibold uppercase tracking-wider">Loading SEO CMS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <CmsPublishToolbar
        sectionKey="seo_metadata"
        sectionTitle="SEO & Metadata Management"
        liveUrl="/"
        isDraftDirty={isDirty}
        isSaving={saving}
        isPublishing={publishing}
        lastPublishedAt={lastPublishedAt}
        revisions={revisions}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onDiscard={handleDiscard}
        onRollback={handleRollback}
      />

      {/* Page Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
        {(['home', 'services', 'about', 'contact', 'careers'] as PageKey[]).map((pk) => (
          <button
            key={pk}
            onClick={() => setSelectedPage(pk)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
              selectedPage === pk
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
            }`}
          >
            {pk === 'home' ? 'Homepage (/)' : `/${pk}`}
          </button>
        ))}
      </div>

      {/* Live SERP & Social Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google SERP Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span>Google Search Snippet Preview</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 font-sans">
            <span className="text-[11px] text-emerald-400 block truncate">
              {currentSeo.canonicalUrl}
            </span>
            <h4 className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer line-clamp-1">
              {currentSeo.title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
              {currentSeo.description}
            </p>
          </div>
        </div>

        {/* Social Card Preview */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Share2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Social Share (Open Graph) Preview</span>
          </div>

          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden font-sans">
            <div className="h-28 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 flex items-center justify-center text-slate-500 text-xs font-mono">
              [OG Image: {currentSeo.ogImage || 'Default Banner'}]
            </div>
            <div className="p-3 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">MANNYMORGAN.COM</span>
              <h5 className="text-xs font-bold text-white line-clamp-1">{currentSeo.title}</h5>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {currentSeo.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Form */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          Metadata Configuration for {selectedPage.toUpperCase()}
        </h3>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 font-semibold">Meta Page Title</label>
              <span className="text-[10px] text-slate-500 font-mono">
                {currentSeo.title.length} / 65 chars recommended
              </span>
            </div>
            <input
              type="text"
              value={currentSeo.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 font-semibold">Meta Description</label>
              <span className="text-[10px] text-slate-500 font-mono">
                {currentSeo.description.length} / 160 chars recommended
              </span>
            </div>
            <textarea
              rows={3}
              value={currentSeo.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Target Keywords</label>
              <input
                type="text"
                value={currentSeo.keywords}
                onChange={(e) => handleFieldChange('keywords', e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Canonical URL</label>
              <input
                type="text"
                value={currentSeo.canonicalUrl}
                onChange={(e) => handleFieldChange('canonicalUrl', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono text-[11px]"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">
              Open Graph Image URL (OG Image)
            </label>
            <input
              type="text"
              value={currentSeo.ogImage}
              onChange={(e) => handleFieldChange('ogImage', e.target.value)}
              placeholder="/images/... or media URL"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

