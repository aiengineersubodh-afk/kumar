'use client';

import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Mail,
  Phone,
  Clock,
  MapPin,
  Save,
  Send,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { adminFetch } from '@/lib/adminAuth';
import CmsPublishToolbar, { CmsRevision } from '@/components/admin/CmsPublishToolbar';

export default function AdminContactManagementPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [revisions, setRevisions] = useState<CmsRevision[]>([]);
  const [lastPublishedAt, setLastPublishedAt] = useState<string | undefined>();

  // State
  const [badgeText, setBadgeText] = useState('Global Engineering Operations');
  const [title, setTitle] = useState('Connect with Our Technical Leadership');
  const [subtitle, setSubtitle] = useState(
    'Whether evaluating a ground-up platform build or seeking SLA-backed engineering maintenance, our solutions architects are ready to assist.'
  );
  const [primaryEmail, setPrimaryEmail] = useState('projects@manymorgan.com');
  const [secondaryEmail, setSecondaryEmail] = useState('contact@manymorgan.com');
  const [telephone, setTelephone] = useState('+1 (800) 555-0199');
  const [operatingHours, setOperatingHours] = useState('Monday - Friday, 9:00 AM - 6:00 PM EST');
  const [slaHours, setSlaHours] = useState('Active SLA Clients: 24/7/365 On-Call Synthetic Monitoring');
  const [physicalAddress, setPhysicalAddress] = useState(
    'ManyMorgan Engineering HQ\nGlobal Digital Operations & Solutions Delivery'
  );

  const loadContactData = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/content/admin/contact_details');
      if (res.ok) {
        const data = await res.json();
        const payload = data.draftPayload || data.contentPayload || {};

        if (data.title) setTitle(data.title);
        if (data.subtitle) setSubtitle(data.subtitle);
        if (payload.badge_text) setBadgeText(payload.badge_text);
        if (payload.primary_email) setPrimaryEmail(payload.primary_email);
        if (payload.secondary_email) setSecondaryEmail(payload.secondary_email);
        if (payload.telephone) setTelephone(payload.telephone);
        if (payload.operating_hours) setOperatingHours(payload.operating_hours);
        if (payload.sla_hours) setSlaHours(payload.sla_hours);
        if (payload.physical_address) setPhysicalAddress(payload.physical_address);

        setIsDirty(!!data.isDraftDirty);
        setLastPublishedAt(data.lastPublishedAt);
        setRevisions(data.revisions || []);
      }
    } catch (e) {
      console.error('Failed to load contact info:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContactData();
  }, []);

  const handleFieldChange = () => setIsDirty(true);

  const getPayload = () => ({
    badge_text: badgeText,
    primary_email: primaryEmail,
    secondary_email: secondaryEmail,
    telephone,
    operating_hours: operatingHours,
    sla_hours: slaHours,
    physical_address: physicalAddress,
  });

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const res = await adminFetch('/content/admin/contact_details/draft', {
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
        alert('Contact Us draft saved!');
        loadContactData();
      }
    } catch (e) {
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    const confirm = window.confirm('Publish Contact Us changes live to the website?');
    if (!confirm) return;

    setPublishing(true);
    try {
      const res = await adminFetch('/content/admin/contact_details/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          contentPayload: getPayload(),
          changeSummary: 'Admin updated Contact Us channels and address',
        }),
      });
      if (res.ok) {
        setIsDirty(false);
        alert('Contact Us details published successfully!');
        loadContactData();
      }
    } catch (e) {
      alert('Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  const handleDiscard = async () => {
    try {
      const res = await adminFetch('/content/admin/contact_details/discard', { method: 'POST' });
      if (res.ok) {
        alert('Draft discarded.');
        loadContactData();
      }
    } catch (e) {
      alert('Failed to discard draft');
    }
  };

  const handleRollback = async (revisionId: string) => {
    try {
      const res = await adminFetch(`/content/admin/contact_details/rollback/${revisionId}`, { method: 'POST' });
      if (res.ok) {
        alert('Rolled back contact details successfully.');
        loadContactData();
      }
    } catch (e) {
      alert('Failed to rollback');
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs font-semibold tracking-wider uppercase">Loading Contact CMS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <CmsPublishToolbar
        sectionKey="contact_details"
        sectionTitle="Contact Us Information Management"
        liveUrl="/contact"
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
        {/* Hero Section */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Header & Intro Text
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
              <label className="text-slate-400 font-semibold block mb-1">Page Title (H1)</label>
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
              <label className="text-slate-400 font-semibold block mb-1">Subtitle</label>
              <textarea
                rows={3}
                value={subtitle}
                onChange={(e) => {
                  setSubtitle(e.target.value);
                  handleFieldChange();
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Channels & Operations */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Channels, Hours & Address
          </h3>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Primary Email (RFPs)</label>
                <input
                  type="email"
                  value={primaryEmail}
                  onChange={(e) => {
                    setPrimaryEmail(e.target.value);
                    handleFieldChange();
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">General Inquiries Email</label>
                <input
                  type="email"
                  value={secondaryEmail}
                  onChange={(e) => {
                    setSecondaryEmail(e.target.value);
                    handleFieldChange();
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Direct Telephone</label>
              <input
                type="text"
                value={telephone}
                onChange={(e) => {
                  setTelephone(e.target.value);
                  handleFieldChange();
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Operating Hours</label>
              <input
                type="text"
                value={operatingHours}
                onChange={(e) => {
                  setOperatingHours(e.target.value);
                  handleFieldChange();
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">SLA / Monitoring Schedule</label>
              <input
                type="text"
                value={slaHours}
                onChange={(e) => {
                  setSlaHours(e.target.value);
                  handleFieldChange();
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Headquarters Physical Address</label>
              <textarea
                rows={2}
                value={physicalAddress}
                onChange={(e) => {
                  setPhysicalAddress(e.target.value);
                  handleFieldChange();
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

