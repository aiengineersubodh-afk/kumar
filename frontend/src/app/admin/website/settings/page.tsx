'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Building,
  Mail,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  Save,
  Loader2,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { adminFetch } from '@/lib/adminAuth';

export default function AdminWebsiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [organizationName, setOrganizationName] = useState('ManyMorgan Engineering & Technology');
  const [legalEntityName, setLegalEntityName] = useState('ManyMorgan Global Technologies LLC');
  const [registrationNumber, setRegistrationNumber] = useState('MM-ENG-2026-US');
  const [notificationEmail, setNotificationEmail] = useState('admin@manymorgan.com');
  const [rfpAlertEmail, setRfpAlertEmail] = useState('projects@manymorgan.com');
  const [careersAlertEmail, setCareersAlertEmail] = useState('careers@manymorgan.com');
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [enableCaptcha, setEnableCaptcha] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    'Our systems are currently undergoing scheduled architectural optimization. We will be back online shortly.'
  );

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/content/admin/settings/all');
      if (res.ok) {
        const data = await res.json();
        if (data) {
          if (data.organizationName) setOrganizationName(data.organizationName);
          if (data.legalEntityName) setLegalEntityName(data.legalEntityName);
          if (data.registrationNumber) setRegistrationNumber(data.registrationNumber);
          if (data.notificationEmail) setNotificationEmail(data.notificationEmail);
          if (data.rfpAlertEmail) setRfpAlertEmail(data.rfpAlertEmail);
          if (data.careersAlertEmail) setCareersAlertEmail(data.careersAlertEmail);
          if (data.defaultCurrency) setDefaultCurrency(data.defaultCurrency);
          if (typeof data.enableCaptcha === 'boolean') setEnableCaptcha(data.enableCaptcha);
          if (typeof data.maintenanceMode === 'boolean') setMaintenanceMode(data.maintenanceMode);
          if (data.maintenanceMessage) setMaintenanceMessage(data.maintenanceMessage);
        }
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const payload = {
        organizationName,
        legalEntityName,
        registrationNumber,
        notificationEmail,
        rfpAlertEmail,
        careersAlertEmail,
        defaultCurrency,
        enableCaptcha,
        maintenanceMode,
        maintenanceMessage,
        updatedAt: new Date().toISOString(),
      };

      const res = await adminFetch('/content/admin/settings/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert('Failed to save settings.');
      }
    } catch (e) {
      alert('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs font-semibold uppercase tracking-wider">Loading Website Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Website Global Settings & Configuration
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage organization identity, primary notification desks, currency formatting, and security controls.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Settings Saved!' : 'Save All Settings'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-950/60 border border-emerald-800/80 p-4 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-semibold animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Website settings successfully saved and persisted to database.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Organization Identity */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building className="w-4 h-4 text-blue-400" />
            <span>Organization & Legal Entity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Brand Name</label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Legal Entity Name</label>
              <input
                type="text"
                value={legalEntityName}
                onChange={(e) => setLegalEntityName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Registration / Tax Reference ID</label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Default Display Currency</label>
              <select
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="USD">USD ($ - United States Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
                <option value="INR">INR (₹ - Indian Rupee)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Primary Notification Routing Desks */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Mail className="w-4 h-4 text-blue-400" />
            <span>Form Submissions & Alerts Routing</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">
                Admin Master Notification Email
              </label>
              <input
                type="email"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">
                Project Consultation & RFP Desk
              </label>
              <input
                type="email"
                value={rfpAlertEmail}
                onChange={(e) => setRfpAlertEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">
                Careers & Research Talent Desk
              </label>
              <input
                type="email"
                value={careersAlertEmail}
                onChange={(e) => setCareersAlertEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Security & Maintenance Controls */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Anti-Spam & System Operations</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
              <div>
                <strong className="text-white block font-semibold">
                  Dynamic Math CAPTCHA Anti-Spam Protection
                </strong>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Requires users to solve a 1–15 randomized mathematical challenge before submitting consultation forms.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableCaptcha}
                  onChange={(e) => setEnableCaptcha(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-white block font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Maintenance Mode</span>
                  </strong>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    When active, public visitors see the maintenance notice. Admin portal remains accessible at /admin/login.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600" />
                </label>
              </div>

              {maintenanceMode && (
                <div className="pt-2 border-t border-slate-800/80">
                  <label className="text-slate-400 font-semibold block mb-1">
                    Custom Maintenance Notice Message
                  </label>
                  <textarea
                    rows={2}
                    value={maintenanceMessage}
                    onChange={(e) => setMaintenanceMessage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

