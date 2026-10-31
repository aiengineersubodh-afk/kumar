'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCode,
  Save,
  Send,
  Loader2,
  CheckCircle,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { adminFetch } from '@/lib/adminAuth';
import CmsPublishToolbar, { CmsRevision } from '@/components/admin/CmsPublishToolbar';

export default function AdminFooterManagementPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [revisions, setRevisions] = useState<CmsRevision[]>([]);
  const [lastPublishedAt, setLastPublishedAt] = useState<string | undefined>();

  // State
  const [brandDescription, setBrandDescription] = useState(
    'ManyMorgan is an enterprise software engineering and digital transformation consultancy. We architect, build, and support category-defining mobile applications, resilient cloud backends, modern web flagships, and intelligent autonomous workflows.'
  );
  const [badge1, setBadge1] = useState('Enterprise Security Standards');
  const [badge2, setBadge2] = useState('100% Client IP Ownership');
  const [copyrightText, setCopyrightText] = useState('© 2026 ManyMorgan. All rights reserved.');
  const [linkedInUrl, setLinkedInUrl] = useState('https://linkedin.com/company/manymorgan');
  const [twitterUrl, setTwitterUrl] = useState('https://twitter.com/manymorgan');
  const [githubUrl, setGithubUrl] = useState('https://github.com/manymorgan');

  const loadFooterData = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/content/admin/footer_config');
      if (res.ok) {
        const data = await res.json();
        const payload = data.draftPayload || data.contentPayload || {};

        if (payload.brand_description) setBrandDescription(payload.brand_description);
        if (payload.badge1) setBadge1(payload.badge1);
        if (payload.badge2) setBadge2(payload.badge2);
        if (payload.copyright_text) setCopyrightText(payload.copyright_text);
        if (payload.linkedin_url) setLinkedInUrl(payload.linkedin_url);
        if (payload.twitter_url) setTwitterUrl(payload.twitter_url);
        if (payload.github_url) setGithubUrl(payload.github_url);

        setIsDirty(!!data.isDraftDirty);
        setLastPublishedAt(data.lastPublishedAt);
        setRevisions(data.revisions || []);
      }
    } catch (e) {
      console.error('Failed to load footer config:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFooterData();
  }, []);

  const handleFieldChange = () => setIsDirty(true);

  const getPayload = () => ({
    brand_description: brandDescription,
    badge1,
    badge2,
    copyright_text: copyrightText,
    linkedin_url: linkedInUrl,
    twitter_url: twitterUrl,
    github_url: githubUrl,
  });

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const res = await adminFetch('/content/admin/footer_config/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Footer Configuration',
          subtitle: 'Global website footer narrative, social links, and copyright',
          draftPayload: getPayload(),
        }),
      });
      if (res.ok) {
        setIsDirty(true);
        alert('Footer draft saved!');
        loadFooterData();
      }
    } catch (e) {
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    const confirm = window.confirm('Publish footer changes live to website?');
    if (!confirm) return;

    setPublishing(true);
    try {
      const res = await adminFetch('/content/admin/footer_config/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Footer Configuration',
          subtitle: 'Global website footer narrative, social links, and copyright',
          contentPayload: getPayload(),
          changeSummary: 'Admin updated footer narrative and social links',
        }),
      });
      if (res.ok) {
        setIsDirty(false);
        alert('Footer settings published successfully!');
        loadFooterData();
      }
    } catch (e) {
      alert('Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  const handleDiscard = async () => {
    try {
      const res = await adminFetch('/content/admin/footer_config/discard', { method: 'POST' });
      if (res.ok) {
        alert('Draft discarded.');
        loadFooterData();
      }
    } catch (e) {
      alert('Failed to discard');
    }
  };

  const handleRollback = async (revisionId: string) => {
    try {
      const res = await adminFetch(`/content/admin/footer_config/rollback/${revisionId}`, { method: 'POST' });
      if (res.ok) {
        alert('Footer config rolled back.');
        loadFooterData();
      }
    } catch (e) {
      alert('Failed to rollback');
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs font-semibold tracking-wider uppercase">Loading Footer CMS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <CmsPublishToolbar
        sectionKey="footer_config"
        sectionTitle="Website Footer Management"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand Narrative */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Brand Narrative & Trust Badges
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">
                Footer Brand Summary Paragraph
              </label>
              <textarea
                rows={4}
                value={brandDescription}
                onChange={(e) => {
                  setBrandDescription(e.target.value);
                  handleFieldChange();
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Trust Badge 1</label>
                <input
                  type="text"
                  value={badge1}
                  onChange={(e) => {
                    setBadge1(e.target.value);
                    handleFieldChange();
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Trust Badge 2</label>
                <input
                  type="text"
                  value={badge2}
                  onChange={(e) => {
                    setBadge2(e.target.value);
                    handleFieldChange();
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Social Links & Copyright
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">LinkedIn Profile URL</label>
              <input
                type="text"
                value={linkedInUrl}
                onChange={(e) => {
                  setLinkedInUrl(e.target.value);
                  handleFieldChange();
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Twitter / X URL</label>
              <input
                type="text"
                value={twitterUrl}
                onChange={(e) => {
                  setTwitterUrl(e.target.value);
                  handleFieldChange();
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">GitHub Organization URL</label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => {
                  setGithubUrl(e.target.value);
                  handleFieldChange();
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Copyright Line</label>
              <input
                type="text"
                value={copyrightText}
                onChange={(e) => {
                  setCopyrightText(e.target.value);
                  handleFieldChange();
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

