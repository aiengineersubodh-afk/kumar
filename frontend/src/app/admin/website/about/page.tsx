'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Info,
  Sparkles,
  Cpu,
  Target,
  ShieldCheck,
  Users,
  CheckCircle,
  Eye,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { adminFetch } from '@/lib/adminAuth';
import CmsPublishToolbar, { CmsRevision } from '@/components/admin/CmsPublishToolbar';

export default function AdminAboutManagementPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [revisions, setRevisions] = useState<CmsRevision[]>([]);
  const [lastPublishedAt, setLastPublishedAt] = useState<string | undefined>();

  // State
  const [badgeText, setBadgeText] = useState('Our Heritage & Philosophy');
  const [title, setTitle] = useState('Pioneering Digital Craftsmanship at Enterprise Scale');
  const [subtitle, setSubtitle] = useState(
    'ManyMorgan was founded on a singular conviction: that modern digital products require an uncompromising union of software engineering rigor and human-centered design craft.'
  );

  const [pillars, setPillars] = useState([
    {
      title: 'Architectural Rigor',
      description: 'We reject brittle shortcuts. Our systems are engineered using domain-driven design, clean architecture, and exhaustive automated test coverage.',
    },
    {
      title: 'Commercial Impact',
      description: 'Technology serves business outcomes. Every sprint and architectural decision is aligned with conversion velocity, operational efficiency, and ROI.',
    },
    {
      title: 'Radical Transparency',
      description: 'No hidden costs or fabricated timelines. You collaborate directly with our engineering architects with real-time sprint boards and direct code access.',
    },
    {
      title: 'Senior Engineering Pods',
      description: 'Every client initiative is powered by dedicated cross-functional pods led by seasoned technology veterans with deep delivery track records.',
    },
  ]);

  const [missionTitle, setMissionTitle] = useState('To empower visionary enterprises with resilient software assets.');
  const [missionDescription, setMissionDescription] = useState(
    'In an era defined by rapid technological obsolescence, ManyMorgan engineers software designed to endure. We bridge the gap between ambitious business ideas and scalable production infrastructure, ensuring your digital flagships continuously evolve alongside market demands.'
  );

  const [values, setValues] = useState([
    { title: 'Zero Vendor Lock-in', description: 'Complete source code and IP ownership transferred with full deployment scripts.' },
    { title: 'Security & Compliance by Default', description: 'Built-in OWASP standards, SOC2 readiness, and multi-tenant isolation protocols.' },
    { title: 'Continuous Architectural Innovation', description: 'Deploying pragmatic advancements in AI, event-driven pipelines, and cloud computing.' },
  ]);

  const loadAboutData = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/content/admin/about_overview');
      if (res.ok) {
        const data = await res.json();
        const payload = data.draftPayload || data.contentPayload || {};

        if (data.title) setTitle(data.title);
        if (data.subtitle) setSubtitle(data.subtitle);
        if (payload.badge_text) setBadgeText(payload.badge_text);
        if (Array.isArray(payload.pillars)) setPillars(payload.pillars);
        if (payload.mission_title) setMissionTitle(payload.mission_title);
        if (payload.mission_description) setMissionDescription(payload.mission_description);
        if (Array.isArray(payload.values)) setValues(payload.values);

        setIsDirty(!!data.isDraftDirty);
        setLastPublishedAt(data.lastPublishedAt);
        setRevisions(data.revisions || []);
      }
    } catch (e) {
      console.error('Failed to load about content:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAboutData();
  }, []);

  const handleFieldChange = () => setIsDirty(true);

  const getPayload = () => ({
    badge_text: badgeText,
    pillars,
    mission_title: missionTitle,
    mission_description: missionDescription,
    values,
  });

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const res = await adminFetch('/content/admin/about_overview/draft', {
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
        alert('About Us draft saved!');
        loadAboutData();
      }
    } catch (e) {
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    const confirm = window.confirm('Publish About Us changes live to the website?');
    if (!confirm) return;

    setPublishing(true);
    try {
      const res = await adminFetch('/content/admin/about_overview/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          contentPayload: getPayload(),
          changeSummary: 'Admin updated About Us narrative and pillars',
        }),
      });
      if (res.ok) {
        setIsDirty(false);
        alert('About Us successfully published!');
        loadAboutData();
      }
    } catch (e) {
      alert('Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  const handleDiscard = async () => {
    try {
      const res = await adminFetch('/content/admin/about_overview/discard', { method: 'POST' });
      if (res.ok) {
        alert('Draft discarded.');
        loadAboutData();
      }
    } catch (e) {
      alert('Failed to discard draft');
    }
  };

  const handleRollback = async (revisionId: string) => {
    try {
      const res = await adminFetch(`/content/admin/about_overview/rollback/${revisionId}`, { method: 'POST' });
      if (res.ok) {
        alert('Rolled back successfully.');
        loadAboutData();
      }
    } catch (e) {
      alert('Failed to rollback');
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs font-semibold tracking-wider uppercase">Loading About CMS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <CmsPublishToolbar
        sectionKey="about_overview"
        sectionTitle="About Us Page Management"
        liveUrl="/about"
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

      {/* Hero & Intro */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          Hero Section & Brand Narrative
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Eyebrow Badge</label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => {
                setBadgeText(e.target.value);
                handleFieldChange();
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Main Page Headline (H1)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                handleFieldChange();
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Narrative Intro Paragraph</label>
            <textarea
              rows={3}
              value={subtitle}
              onChange={(e) => {
                setSubtitle(e.target.value);
                handleFieldChange();
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* 4 Engineering Pillars */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          Four Core Engineering Pillars
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {pillars.map((pillar, i) => (
            <div key={i} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <label className="text-blue-400 font-bold block">Pillar {i + 1} Title</label>
              <input
                type="text"
                value={pillar.title}
                onChange={(e) => {
                  const updated = [...pillars];
                  updated[i].title = e.target.value;
                  setPillars(updated);
                  handleFieldChange();
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-semibold"
              />
              <label className="text-slate-500 block pt-1">Description</label>
              <textarea
                rows={3}
                value={pillar.description}
                onChange={(e) => {
                  const updated = [...pillars];
                  updated[i].description = e.target.value;
                  setPillars(updated);
                  handleFieldChange();
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 leading-relaxed font-sans"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mission & Core Values */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          Mission & Core Values
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Mission Headline</label>
            <input
              type="text"
              value={missionTitle}
              onChange={(e) => {
                setMissionTitle(e.target.value);
                handleFieldChange();
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Mission Statement</label>
            <textarea
              rows={3}
              value={missionDescription}
              onChange={(e) => {
                setMissionDescription(e.target.value);
                handleFieldChange();
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-3">
            <span className="text-slate-300 font-bold block">Key Value Propositions</span>
            {values.map((val, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-2">
                <input
                  type="text"
                  value={val.title}
                  onChange={(e) => {
                    const updated = [...values];
                    updated[idx].title = e.target.value;
                    setValues(updated);
                    handleFieldChange();
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-semibold"
                />
                <textarea
                  rows={2}
                  value={val.description}
                  onChange={(e) => {
                    const updated = [...values];
                    updated[idx].description = e.target.value;
                    setValues(updated);
                    handleFieldChange();
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 font-sans"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

