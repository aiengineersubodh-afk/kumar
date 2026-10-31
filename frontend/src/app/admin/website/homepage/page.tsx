'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Home,
  Save,
  Send,
  RotateCcw,
  Plus,
  Trash2,
  Video,
  Image as ImageIcon,
  CheckCircle,
  Eye,
  Loader2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { adminFetch } from '@/lib/adminAuth';
import CmsPublishToolbar, { CmsRevision } from '@/components/admin/CmsPublishToolbar';

export default function AdminHomepageManagementPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [revisions, setRevisions] = useState<CmsRevision[]>([]);
  const [lastPublishedAt, setLastPublishedAt] = useState<string | undefined>();

  // Homepage Form State
  const [badgeText, setBadgeText] = useState('Next-Gen Software & Digital Innovation');
  const [title, setTitle] = useState('Engineering High-Impact Digital Products for Enterprise Market Leaders');
  const [subtitle, setSubtitle] = useState(
    'ManyMorgan designs, builds, and scales market-defining mobile applications, modern web platforms, custom cloud architectures, and autonomous AI automation systems that accelerate business velocity.'
  );
  const [primaryCtaLabel, setPrimaryCtaLabel] = useState('Get a Quote');
  const [primaryCtaUrl, setPrimaryCtaUrl] = useState('/get-a-quote');
  const [secondaryCtaLabel, setSecondaryCtaLabel] = useState('Discuss Your Project');
  const [secondaryCtaUrl, setSecondaryCtaUrl] = useState('/contact');
  const [videoSrc, setVideoSrc] = useState('/videos/manymorgan-hero.mp4');
  const [posterSrc, setPosterSrc] = useState('/videos/hero-poster.jpg');

  const [tickerItems, setTickerItems] = useState<string[]>([
    '⚡ Sub-Second Latency Architecture',
    '🔒 100% Client IP & Source Code Ownership',
    '🛡️ Enterprise-Grade Security & SLA Support',
    '☁️ Cloud-Native Microservices (AWS / GCP / K8s)',
    '🤖 Autonomous AI Agents & Enterprise RAG',
    '⏱️ 48-Hour Architecture Scoping Guarantee',
    '🎯 Senior Architectural Pods — Zero Outsourcing',
    '🌐 95+ Core Web Vitals & Production Hardening',
  ]);

  const [newTickerText, setNewTickerText] = useState('');

  const [stats, setStats] = useState([
    { label: 'Uptime SLA Guarantee', value: '99.99%', description: 'Enterprise high-availability' },
    { label: 'Architecture Turnaround', value: '48h', description: 'From brief to system blueprint' },
    { label: 'Client IP Retained', value: '100%', description: 'Bilateral zero-lock-in rights' },
    { label: 'Production Deployments', value: '120+', description: 'Across enterprise domains' },
  ]);

  const loadHomepageData = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/content/admin/home_hero');
      if (res.ok) {
        const data = await res.json();
        const payload = data.draftPayload || data.contentPayload || {};

        if (data.title) setTitle(data.title);
        if (data.subtitle) setSubtitle(data.subtitle);
        if (payload.badge_text) setBadgeText(payload.badge_text);
        if (payload.primary_cta_label) setPrimaryCtaLabel(payload.primary_cta_label);
        if (payload.primary_cta_url) setPrimaryCtaUrl(payload.primary_cta_url);
        if (payload.secondary_cta_label) setSecondaryCtaLabel(payload.secondary_cta_label);
        if (payload.secondary_cta_url) setSecondaryCtaUrl(payload.secondary_cta_url);
        if (payload.video_src) setVideoSrc(payload.video_src);
        if (payload.poster_src) setPosterSrc(payload.poster_src);
        if (Array.isArray(payload.ticker_items)) setTickerItems(payload.ticker_items);
        if (Array.isArray(payload.stats)) setStats(payload.stats);

        setIsDirty(!!data.isDraftDirty);
        setLastPublishedAt(data.lastPublishedAt);
        setRevisions(data.revisions || []);
      }
    } catch (e) {
      console.error('Failed to load homepage content:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomepageData();
  }, []);

  const handleFieldChange = () => {
    setIsDirty(true);
  };

  const getPayload = () => ({
    badge_text: badgeText,
    primary_cta_label: primaryCtaLabel,
    primary_cta_url: primaryCtaUrl,
    secondary_cta_label: secondaryCtaLabel,
    secondary_cta_url: secondaryCtaUrl,
    video_src: videoSrc,
    poster_src: posterSrc,
    ticker_items: tickerItems,
    stats,
  });

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const res = await adminFetch('/content/admin/home_hero/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          draftPayload: getPayload(),
        }),
      });
      if (res.ok) {
        setIsDirty(true);
        alert('Homepage draft saved successfully!');
        loadHomepageData();
      }
    } catch (e) {
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    const confirmPublish = window.confirm(
      'Publish homepage changes to the public website immediately? This will update the live site.'
    );
    if (!confirmPublish) return;

    setPublishing(true);
    try {
      const res = await adminFetch('/content/admin/home_hero/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          contentPayload: getPayload(),
          changeSummary: 'Admin updated homepage hero and key sections',
        }),
      });
      if (res.ok) {
        setIsDirty(false);
        alert('Homepage successfully published to live website!');
        loadHomepageData();
      }
    } catch (e) {
      alert('Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  const handleDiscard = async () => {
    try {
      const res = await adminFetch('/content/admin/home_hero/discard', {
        method: 'POST',
      });
      if (res.ok) {
        alert('Draft changes discarded. Reverted to currently published content.');
        loadHomepageData();
      }
    } catch (e) {
      alert('Failed to discard draft');
    }
  };

  const handleRollback = async (revisionId: string) => {
    try {
      const res = await adminFetch(`/content/admin/home_hero/rollback/${revisionId}`, {
        method: 'POST',
      });
      if (res.ok) {
        alert('Successfully rolled back to chosen revision!');
        loadHomepageData();
      }
    } catch (e) {
      alert('Failed to rollback');
    }
  };

  const handleAddTicker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTickerText.trim()) return;
    setTickerItems([...tickerItems, newTickerText.trim()]);
    setNewTickerText('');
    setIsDirty(true);
  };

  const handleRemoveTicker = (idx: number) => {
    setTickerItems(tickerItems.filter((_, i) => i !== idx));
    setIsDirty(true);
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs font-semibold tracking-wider uppercase">Loading Homepage CMS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Publishing Toolbar */}
      <CmsPublishToolbar
        sectionKey="home_hero"
        sectionTitle="Homepage Hero & Core Sections"
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

      {/* Live Preview Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Live Preview of Public Hero
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Updates live as you type</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-8 text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-700 text-xs font-medium text-slate-200">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>{badgeText || 'Badge text...'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {title || 'Enter your headline...'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {subtitle || 'Enter your subheadline...'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-lg">
              {primaryCtaLabel} &rarr;
            </span>
            <span className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700">
              {secondaryCtaLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Content Edit Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Hero Text Content */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Hero Headline & Eyebrow Badge</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">
                Eyebrow Badge Text
              </label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => {
                  setBadgeText(e.target.value);
                  handleFieldChange();
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">
                Main Headline (H1)
              </label>
              <textarea
                rows={3}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  handleFieldChange();
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">
                Subheadline / Narrative Paragraph
              </label>
              <textarea
                rows={4}
                value={subtitle}
                onChange={(e) => {
                  setSubtitle(e.target.value);
                  handleFieldChange();
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
              />
            </div>
          </div>
        </div>

        {/* Section 2: CTAs & Background Media */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Video className="w-4 h-4 text-blue-400" />
            <span>CTAs & Background Video Media</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Primary CTA Label</label>
                <input
                  type="text"
                  value={primaryCtaLabel}
                  onChange={(e) => {
                    setPrimaryCtaLabel(e.target.value);
                    handleFieldChange();
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Primary CTA URL</label>
                <input
                  type="text"
                  value={primaryCtaUrl}
                  onChange={(e) => {
                    setPrimaryCtaUrl(e.target.value);
                    handleFieldChange();
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Secondary CTA Label</label>
                <input
                  type="text"
                  value={secondaryCtaLabel}
                  onChange={(e) => {
                    setSecondaryCtaLabel(e.target.value);
                    handleFieldChange();
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Secondary CTA URL</label>
                <input
                  type="text"
                  value={secondaryCtaUrl}
                  onChange={(e) => {
                    setSecondaryCtaUrl(e.target.value);
                    handleFieldChange();
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">
                Background Video Path / URL
              </label>
              <input
                type="text"
                value={videoSrc}
                onChange={(e) => {
                  setVideoSrc(e.target.value);
                  handleFieldChange();
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Default: /videos/manymorgan-hero.mp4 or any video from Media Library
              </span>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">
                Poster Fallback Image Path / URL
              </label>
              <input
                type="text"
                value={posterSrc}
                onChange={(e) => {
                  setPosterSrc(e.target.value);
                  handleFieldChange();
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Default: /videos/hero-poster.jpg or any image from Media Library
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Infinite Ticker Items */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-3">
            <span>Marquee Ticker Items ({tickerItems.length})</span>
            <span className="text-[10px] font-mono text-slate-400">Continuous Loop</span>
          </h3>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {tickerItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-slate-950 border border-slate-800/80 px-3 py-2 rounded-xl text-xs text-slate-200"
              >
                <span className="truncate pr-2">{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTicker(idx)}
                  className="text-slate-500 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddTicker} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newTickerText}
              onChange={(e) => setNewTickerText(e.target.value)}
              placeholder="e.g. ⚡ 99.99% Availability Guarantee..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Section 4: Key Metrics & Stats */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Impact Statistics & Metrics
          </h3>

          <div className="space-y-3 text-xs">
            {stats.map((stat, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div>
                  <label className="text-[10px] text-slate-500 block">Metric Value</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const updated = [...stats];
                      updated[i].value = e.target.value;
                      setStats(updated);
                      handleFieldChange();
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white font-bold"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-500 block">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const updated = [...stats];
                      updated[i].label = e.target.value;
                      setStats(updated);
                      handleFieldChange();
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

