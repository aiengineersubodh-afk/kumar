'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Save,
  Send,
  Loader2,
  Eye,
  Plus,
  Trash2,
  CheckCircle,
  Megaphone,
  ShieldAlert,
} from 'lucide-react';
import { adminFetch } from '@/lib/adminAuth';
import CmsPublishToolbar, { CmsRevision } from '@/components/admin/CmsPublishToolbar';

interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
  isCustom?: boolean;
}

export default function AdminNavigationManagementPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [revisions, setRevisions] = useState<CmsRevision[]>([]);
  const [lastPublishedAt, setLastPublishedAt] = useState<string | undefined>();

  // State
  const [navItems, setNavItems] = useState<NavLinkItem[]>([
    { id: 'home', label: 'Home', href: '/', enabled: true },
    { id: 'services', label: 'Services', href: '/services', enabled: true },
    { id: 'about', label: 'About Us', href: '/about', enabled: true },
    { id: 'contact', label: 'Contact Us', href: '/contact', enabled: true },
    { id: 'careers', label: 'Careers', href: '/careers', enabled: true },
  ]);

  const [ctaText, setCtaText] = useState('Schedule Free Consultations');
  const [ctaUrl, setCtaUrl] = useState('/get-a-quote');
  const [ctaEnabled, setCtaEnabled] = useState(true);

  // Announcement Banner
  const [bannerEnabled, setBannerEnabled] = useState(false);
  const [bannerText, setBannerText] = useState(
    '🚀 Now accepting applications for the 2026 Engineering & Research Cohorts.'
  );
  const [bannerLinkText, setBannerLinkText] = useState('Learn more & apply');
  const [bannerLinkUrl, setBannerLinkUrl] = useState('/careers');

  const loadNavData = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/content/admin/navigation_config');
      if (res.ok) {
        const data = await res.json();
        const payload = data.draftPayload || data.contentPayload || {};

        if (Array.isArray(payload.navItems)) setNavItems(payload.navItems);
        if (payload.ctaText) setCtaText(payload.ctaText);
        if (payload.ctaUrl) setCtaUrl(payload.ctaUrl);
        if (typeof payload.ctaEnabled === 'boolean') setCtaEnabled(payload.ctaEnabled);
        if (typeof payload.bannerEnabled === 'boolean') setBannerEnabled(payload.bannerEnabled);
        if (payload.bannerText) setBannerText(payload.bannerText);
        if (payload.bannerLinkText) setBannerLinkText(payload.bannerLinkText);
        if (payload.bannerLinkUrl) setBannerLinkUrl(payload.bannerLinkUrl);

        setIsDirty(!!data.isDraftDirty);
        setLastPublishedAt(data.lastPublishedAt);
        setRevisions(data.revisions || []);
      }
    } catch (e) {
      console.error('Failed to load nav config:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNavData();
  }, []);

  const handleFieldChange = () => setIsDirty(true);

  const getPayload = () => ({
    navItems,
    ctaText,
    ctaUrl,
    ctaEnabled,
    bannerEnabled,
    bannerText,
    bannerLinkText,
    bannerLinkUrl,
  });

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const res = await adminFetch('/content/admin/navigation_config/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Navigation & Header Configuration',
          subtitle: 'Top navigation bar, announcement banner, and consultation CTA',
          draftPayload: getPayload(),
        }),
      });
      if (res.ok) {
        setIsDirty(true);
        alert('Navigation draft saved!');
        loadNavData();
      }
    } catch (e) {
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    const confirm = window.confirm('Publish navigation & header changes live to website?');
    if (!confirm) return;

    setPublishing(true);
    try {
      const res = await adminFetch('/content/admin/navigation_config/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Navigation & Header Configuration',
          subtitle: 'Top navigation bar, announcement banner, and consultation CTA',
          contentPayload: getPayload(),
          changeSummary: 'Admin updated navbar items and announcement banner',
        }),
      });
      if (res.ok) {
        setIsDirty(false);
        alert('Navigation settings published successfully!');
        loadNavData();
      }
    } catch (e) {
      alert('Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  const handleDiscard = async () => {
    try {
      const res = await adminFetch('/content/admin/navigation_config/discard', { method: 'POST' });
      if (res.ok) {
        alert('Draft discarded.');
        loadNavData();
      }
    } catch (e) {
      alert('Failed to discard');
    }
  };

  const handleRollback = async (revisionId: string) => {
    try {
      const res = await adminFetch(`/content/admin/navigation_config/rollback/${revisionId}`, { method: 'POST' });
      if (res.ok) {
        alert('Navigation config rolled back.');
        loadNavData();
      }
    } catch (e) {
      alert('Failed to rollback');
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs font-semibold tracking-wider uppercase">Loading Navigation CMS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <CmsPublishToolbar
        sectionKey="navigation_config"
        sectionTitle="Navigation & Header Management"
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

      {/* Security Notice */}
      <div className="bg-blue-950/40 border border-blue-900/60 rounded-2xl p-4 flex items-start gap-3 text-xs text-blue-200">
        <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-white block">Security & Access Policy:</strong>
          <span>
            Admin Portal links are automatically stripped from public navbar and footer for security. The Admin Dashboard is strictly accessed directly via{' '}
            <code className="text-blue-300 font-mono">/admin/login</code>.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nav Items */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Public Navbar Links
          </h3>

          <div className="space-y-2.5 text-xs">
            {navItems.map((item, idx) => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-3"
              >
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const updated = [...navItems];
                      updated[idx].label = e.target.value;
                      setNavItems(updated);
                      handleFieldChange();
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-semibold"
                  />
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => {
                      const updated = [...navItems];
                      updated[idx].href = e.target.value;
                      setNavItems(updated);
                      handleFieldChange();
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 font-mono text-[11px]"
                  />
                </div>

                <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer text-[11px]">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={(e) => {
                      const updated = [...navItems];
                      updated[idx].enabled = e.target.checked;
                      setNavItems(updated);
                      handleFieldChange();
                    }}
                    className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>Show</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Consultation CTA Button */}
        <div className="space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
              Header Action CTA Button
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Button Label</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => {
                    setCtaText(e.target.value);
                    handleFieldChange();
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Destination URL</label>
                <input
                  type="text"
                  value={ctaUrl}
                  onChange={(e) => {
                    setCtaUrl(e.target.value);
                    handleFieldChange();
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ctaEnabled}
                    onChange={(e) => {
                      setCtaEnabled(e.target.checked);
                      handleFieldChange();
                    }}
                    className="rounded bg-slate-900 border-slate-700 text-blue-600"
                  />
                  <span className="text-slate-300 font-medium">
                    Display CTA button in header
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Announcement Banner Bar */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-blue-400" />
                <span>Top Announcement Banner</span>
              </h3>

              <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={bannerEnabled}
                  onChange={(e) => {
                    setBannerEnabled(e.target.checked);
                    handleFieldChange();
                  }}
                  className="rounded bg-slate-900 border-slate-700 text-blue-600"
                />
                <span className="text-slate-300 font-semibold">Active</span>
              </label>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Banner Text Message</label>
                <input
                  type="text"
                  value={bannerText}
                  onChange={(e) => {
                    setBannerText(e.target.value);
                    handleFieldChange();
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Action Link Text</label>
                  <input
                    type="text"
                    value={bannerLinkText}
                    onChange={(e) => {
                      setBannerLinkText(e.target.value);
                      handleFieldChange();
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Action Link URL</label>
                  <input
                    type="text"
                    value={bannerLinkUrl}
                    onChange={(e) => {
                      setBannerLinkUrl(e.target.value);
                      handleFieldChange();
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

