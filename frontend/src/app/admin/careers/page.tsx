'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Calendar,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  MessageSquare,
  Shield,
  Layers,
  ChevronRight,
  Loader2,
  RefreshCw,
  Power,
  Inbox,
  Send,
} from 'lucide-react';
import { adminFetch } from '@/lib/adminAuth';
import { INTERNSHIP_TRACKS, RESEARCH_AREAS, TECHNICAL_DOMAINS } from '@/lib/careersCatalog';

type TabKey = 'overview' | 'internships' | 'research' | 'applications' | 'interest' | 'settings';

export default function AdminCareersPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [stats, setStats] = useState<any>(null);
  const [globalStatus, setGlobalStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [updatedBy, setUpdatedBy] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Status Confirmation Dialog state
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    action: 'ACTIVATE' | 'DEACTIVATE';
    isProcessing: boolean;
  }>({
    open: false,
    action: 'ACTIVATE',
    isProcessing: false,
  });

  // Opportunities state
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [oppModalOpen, setOppModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<any | null>(null);
  const [oppFormData, setOppFormData] = useState({
    title: '',
    type: 'INTERNSHIP' as 'INTERNSHIP' | 'RESEARCH',
    technicalField: 'Software & Web Development',
    description: '',
    responsibilities: '',
    skills: '',
    eligibility: '',
    duration: '3 Months',
    workMode: 'Remote',
    openingsCount: 2,
    deadline: '',
    isPublished: true,
    status: 'OPEN' as 'OPEN' | 'CLOSED' | 'ARCHIVED',
  });
  const [isOppSaving, setIsOppSaving] = useState(false);

  // Applications state
  const [applications, setApplications] = useState<any[]>([]);
  const [appsTotal, setAppsTotal] = useState(0);
  const [appsPage, setAppsPage] = useState(1);
  const [appsStatusFilter, setAppsStatusFilter] = useState('All');
  const [appsTypeFilter, setAppsTypeFilter] = useState('All');
  const [appsSearch, setAppsSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [newAppNote, setNewAppNote] = useState('');
  const [isAddingAppNote, setIsAddingAppNote] = useState(false);

  // Interest Registrations state
  const [interestRegistrations, setInterestRegistrations] = useState<any[]>([]);
  const [interestTotal, setInterestTotal] = useState(0);
  const [interestPage, setInterestPage] = useState(1);
  const [interestStatusFilter, setInterestStatusFilter] = useState('All');
  const [interestTypeFilter, setInterestTypeFilter] = useState('All');
  const [interestSearch, setInterestSearch] = useState('');
  const [selectedInterest, setSelectedInterest] = useState<any | null>(null);
  const [newInterestNote, setNewInterestNote] = useState('');
  const [isAddingInterestNote, setIsAddingInterestNote] = useState(false);

  // --- Load Careers Stats & Status ---
  const loadStatsAndSettings = async () => {
    try {
      const res = await adminFetch('/careers/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setGlobalStatus(data.globalStatus || 'ACTIVE');
        setUpdatedAt(data.updatedAt || '');
        setUpdatedBy(data.updatedBy || 'Administrator');
      }
    } catch (err) {
      console.error('Failed to load careers stats:', err);
    }
  };

  // --- Load Opportunities ---
  const loadOpportunities = async () => {
    try {
      const res = await adminFetch('/careers/admin/opportunities');
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data || []);
      }
    } catch (err) {
      console.error('Failed to load opportunities:', err);
    }
  };

  // --- Load Applications ---
  const loadApplications = async () => {
    try {
      const params = new URLSearchParams({
        page: appsPage.toString(),
        limit: '15',
        type: appsTypeFilter !== 'All' ? appsTypeFilter : '',
        status: appsStatusFilter !== 'All' ? appsStatusFilter : '',
        search: appsSearch,
      });
      const res = await adminFetch(`/careers/admin/applications?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.items || []);
        setAppsTotal(data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  };

  // --- Load Interest Registrations ---
  const loadInterestRegistrations = async () => {
    try {
      const params = new URLSearchParams({
        page: interestPage.toString(),
        limit: '15',
        preferredType: interestTypeFilter !== 'All' ? interestTypeFilter : '',
        status: interestStatusFilter !== 'All' ? interestStatusFilter : '',
        search: interestSearch,
      });
      const res = await adminFetch(`/careers/admin/interest?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setInterestRegistrations(data.items || []);
        setInterestTotal(data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load interest registrations:', err);
    }
  };

  const refreshAll = async () => {
    setIsLoading(true);
    await Promise.all([
      loadStatsAndSettings(),
      loadOpportunities(),
      loadApplications(),
      loadInterestRegistrations(),
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  useEffect(() => {
    if (activeTab === 'applications') loadApplications();
    if (activeTab === 'interest') loadInterestRegistrations();
  }, [appsPage, appsStatusFilter, appsTypeFilter, interestPage, interestStatusFilter, interestTypeFilter]);

  // --- Toggle Global Careers Status (Section 7) ---
  const handleConfirmStatusChange = async () => {
    setConfirmModal((prev) => ({ ...prev, isProcessing: true }));
    try {
      const endpoint =
        confirmModal.action === 'ACTIVATE'
          ? '/careers/admin/activate'
          : '/careers/admin/deactivate';

      const res = await adminFetch(endpoint, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setGlobalStatus(data.status);
        setUpdatedAt(data.updatedAt);
        setUpdatedBy(data.updatedBy);
        setConfirmModal({ open: false, action: 'ACTIVATE', isProcessing: false });
        await loadStatsAndSettings();
      } else {
        alert('Failed to update status on server.');
      }
    } catch (err) {
      console.error('Status change error:', err);
      alert('Error updating global careers status');
    } finally {
      setConfirmModal((prev) => ({ ...prev, isProcessing: false }));
    }
  };

  // --- Opportunity CRUD ---
  const openCreateOpp = (defaultType: 'INTERNSHIP' | 'RESEARCH' = 'INTERNSHIP') => {
    setEditingOpp(null);
    setOppFormData({
      title: '',
      type: defaultType,
      technicalField:
        defaultType === 'INTERNSHIP'
          ? INTERNSHIP_TRACKS[0].title
          : RESEARCH_AREAS[0].title,
      description: '',
      responsibilities: '',
      skills: '',
      eligibility: '',
      duration: '3 Months',
      workMode: 'Remote',
      openingsCount: 2,
      deadline: '',
      isPublished: true,
      status: 'OPEN',
    });
    setOppModalOpen(true);
  };

  const openEditOpp = (opp: any) => {
    setEditingOpp(opp);
    setOppFormData({
      title: opp.title,
      type: opp.type,
      technicalField: opp.technicalField,
      description: opp.description,
      responsibilities: Array.isArray(opp.responsibilities) ? opp.responsibilities.join('\n') : '',
      skills: Array.isArray(opp.skills) ? opp.skills.join(', ') : '',
      eligibility: opp.eligibility || '',
      duration: opp.duration || '',
      workMode: opp.workMode || 'Remote',
      openingsCount: opp.openingsCount || 1,
      deadline: opp.deadline ? opp.deadline.slice(0, 10) : '',
      isPublished: opp.isPublished ?? true,
      status: opp.status || 'OPEN',
    });
    setOppModalOpen(true);
  };

  const handleSaveOpp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOppSaving(true);

    const payload = {
      title: oppFormData.title.trim(),
      type: oppFormData.type,
      technicalField: oppFormData.technicalField,
      description: oppFormData.description.trim(),
      responsibilities: oppFormData.responsibilities
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      skills: oppFormData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      eligibility: oppFormData.eligibility.trim() || undefined,
      duration: oppFormData.duration.trim() || undefined,
      workMode: oppFormData.workMode.trim() || undefined,
      openingsCount: Number(oppFormData.openingsCount) || undefined,
      deadline: oppFormData.deadline ? new Date(oppFormData.deadline).toISOString() : undefined,
      isPublished: oppFormData.isPublished,
      status: oppFormData.status,
    };

    try {
      if (editingOpp) {
        const res = await adminFetch(`/careers/admin/opportunities/${editingOpp.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setOppModalOpen(false);
          await loadOpportunities();
          await loadStatsAndSettings();
        }
      } else {
        const res = await adminFetch('/careers/admin/opportunities', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setOppModalOpen(false);
          await loadOpportunities();
          await loadStatsAndSettings();
        }
      }
    } catch (err) {
      console.error('Failed to save opportunity:', err);
    } finally {
      setIsOppSaving(false);
    }
  };

  const handleDeleteOpp = async (id: string) => {
    if (!confirm('Are you sure you want to delete this opportunity record?')) return;
    try {
      const res = await adminFetch(`/careers/admin/opportunities/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadOpportunities();
        await loadStatsAndSettings();
      }
    } catch (err) {
      console.error('Failed to delete opportunity:', err);
    }
  };

  const handleToggleOppStatus = async (opp: any) => {
    const nextStatus = opp.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      const res = await adminFetch(`/careers/admin/opportunities/${opp.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        await loadOpportunities();
        await loadStatsAndSettings();
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const handleToggleOppPublished = async (opp: any) => {
    try {
      const res = await adminFetch(`/careers/admin/opportunities/${opp.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isPublished: !opp.isPublished }),
      });
      if (res.ok) {
        await loadOpportunities();
        await loadStatsAndSettings();
      }
    } catch (err) {
      console.error('Toggle publish error:', err);
    }
  };

  // --- Application Status & Notes ---
  const handleUpdateAppStatus = async (id: string, status: string) => {
    try {
      const res = await adminFetch(`/careers/admin/applications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
        if (selectedApp?.id === id) setSelectedApp(updated);
        await loadStatsAndSettings();
      }
    } catch (err) {
      console.error('Failed to update app status:', err);
    }
  };

  const handleAddAppNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppNote.trim() || !selectedApp) return;

    setIsAddingAppNote(true);
    try {
      const res = await adminFetch(`/careers/admin/applications/${selectedApp.id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ noteText: newAppNote.trim() }),
      });
      if (res.ok) {
        const note = await res.json();
        setSelectedApp((prev: any) => ({
          ...prev,
          adminNotes: [note, ...(prev?.adminNotes || [])],
        }));
        setNewAppNote('');
        await loadApplications();
      }
    } catch (err) {
      console.error('Failed to add app note:', err);
    } finally {
      setIsAddingAppNote(false);
    }
  };

  // --- Interest Status & Notes ---
  const handleUpdateInterestStatus = async (id: string, status: string) => {
    try {
      const res = await adminFetch(`/careers/admin/interest/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setInterestRegistrations((prev) => prev.map((i) => (i.id === id ? updated : i)));
        if (selectedInterest?.id === id) setSelectedInterest(updated);
        await loadStatsAndSettings();
      }
    } catch (err) {
      console.error('Failed to update interest status:', err);
    }
  };

  const handleAddInterestNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterestNote.trim() || !selectedInterest) return;

    setIsAddingInterestNote(true);
    try {
      const res = await adminFetch(`/careers/admin/interest/${selectedInterest.id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ noteText: newInterestNote.trim() }),
      });
      if (res.ok) {
        const note = await res.json();
        setSelectedInterest((prev: any) => ({
          ...prev,
          adminNotes: [note, ...(prev?.adminNotes || [])],
        }));
        setNewInterestNote('');
        await loadInterestRegistrations();
      }
    } catch (err) {
      console.error('Failed to add interest note:', err);
    } finally {
      setIsAddingInterestNote(false);
    }
  };

  // --- Secure Resume Download ---
  const handleDownloadResume = async (filename: string, originalName: string) => {
    try {
      const res = await adminFetch(`/careers/resumes/${filename}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = originalName || filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to retrieve resume file. Check admin authorization.');
      }
    } catch (err) {
      console.error('Resume download error:', err);
      alert('Error downloading resume');
    }
  };

  // --- CSV Exports ---
  const handleExportApplicationsCsv = async () => {
    try {
      const res = await adminFetch('/careers/admin/applications/export/csv');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `manymorgan-applications-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      alert('Failed to export applications');
    }
  };

  const handleExportInterestCsv = async () => {
    try {
      const res = await adminFetch('/careers/admin/interest/export/csv');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `manymorgan-interest-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      alert('Failed to export interest registrations');
    }
  };

  const internshipOpps = opportunities.filter((o) => o.type === 'INTERNSHIP');
  const researchOpps = opportunities.filter((o) => o.type === 'RESEARCH');

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ========================================================
          TOP HEADER: Title & Global Activate/Deactivate Controls
          ======================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Careers & Research Management
            </h1>
            {/* Visual Status Indicator */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                globalStatus === 'ACTIVE'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50 shadow-emerald-950/60'
                  : 'bg-rose-950 text-rose-300 border border-rose-600/50 shadow-rose-950/60'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  globalStatus === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                }`}
              />
              <span>Careers Status: {globalStatus}</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Authoritative control center for ManyMorgan technical internship tracks, applied research initiatives, vacancy applications, and future talent expressions of interest.
          </p>

          {updatedAt && (
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>
                Last status transition: {new Date(updatedAt).toLocaleString()} by {updatedBy}
              </span>
            </div>
          )}
        </div>

        {/* Global Activate / Deactivate Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {globalStatus === 'INACTIVE' ? (
            <button
              type="button"
              onClick={() => setConfirmModal({ open: true, action: 'ACTIVATE', isProcessing: false })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Power className="w-4 h-4" />
              <span>Activate Careers</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmModal({ open: true, action: 'DEACTIVATE', isProcessing: false })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Power className="w-4 h-4" />
              <span>Deactivate Careers</span>
            </button>
          )}

          <button
            type="button"
            onClick={refreshAll}
            className="p-3 rounded-2xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            title="Refresh All Records"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* ========================================================
          6 TAB NAVIGATION (Section 7D Requirement)
          ======================================================== */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'overview', label: 'Overview', icon: Briefcase },
          { key: 'internships', label: `Internships (${internshipOpps.length})`, icon: GraduationCap },
          { key: 'research', label: `Research (${researchOpps.length})`, icon: Sparkles },
          { key: 'applications', label: `Applications (${appsTotal})`, icon: Inbox },
          { key: 'interest', label: `General Interest (${interestTotal})`, icon: User },
          { key: 'settings', label: 'Careers Settings', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-xl'
                  : 'border-transparent text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          TAB 1: OVERVIEW
          ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Active Opportunities
              </span>
              <p className="text-3xl font-black text-white">
                {stats?.activeOpportunities ?? 0}
              </p>
              <span className="text-[11px] text-slate-500">
                {stats?.totalOpportunities ?? 0} total published
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Vacancy Applications
              </span>
              <p className="text-3xl font-black text-blue-400">
                {stats?.totalApplications ?? 0}
              </p>
              <span className="text-[11px] text-slate-500">Recorded in registry</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                New / Unreviewed
              </span>
              <p className="text-3xl font-black text-amber-400">
                {stats?.newApplications ?? 0}
              </p>
              <span className="text-[11px] text-slate-500">Awaiting recruiter action</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Future-Interest Registrations
              </span>
              <p className="text-3xl font-black text-indigo-400">
                {stats?.totalInterest ?? 0}
              </p>
              <span className="text-[11px] text-slate-500">
                {stats?.newInterest ?? 0} new expressions
              </span>
            </div>
          </div>

          {/* Quick Opportunity Creation Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Publish Internship Vacancy</h3>
                  <p className="text-xs text-slate-400">
                    Add a structured technical opportunity across the 8 internship tracks
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openCreateOpp('INTERNSHIP')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Internship Opening</span>
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Publish Research Project</h3>
                  <p className="text-xs text-slate-400">
                    Create research opportunities in LLMs, agents, privacy, or distributed systems
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openCreateOpp('RESEARCH')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Research Project</span>
              </button>
            </div>
          </div>

          {/* Recent Applications Preview */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Recent Vacancy Applications</h3>
              <button
                onClick={() => setActiveTab('applications')}
                className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View All Applications</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {applications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 font-bold">Reference</th>
                      <th className="py-2.5 font-bold">Candidate</th>
                      <th className="py-2.5 font-bold">Opportunity</th>
                      <th className="py-2.5 font-bold">Status</th>
                      <th className="py-2.5 font-bold">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {applications.slice(0, 5).map((app) => (
                      <tr key={app.id} className="hover:bg-slate-800/30">
                        <td className="py-3 font-mono text-blue-400">{app.referenceNumber}</td>
                        <td className="py-3 font-bold text-white">{app.fullName}</td>
                        <td className="py-3 text-slate-300">{app.opportunityTitle}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-400">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">
                No vacancy applications recorded yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: INTERNSHIP OPPORTUNITIES
          ======================================================== */}
      {activeTab === 'internships' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">Internship Openings</h2>
              <p className="text-xs text-slate-400">
                Manage positions across the 8 initial internship tracks
              </p>
            </div>
            <button
              type="button"
              onClick={() => openCreateOpp('INTERNSHIP')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500"
            >
              <Plus className="w-4 h-4" />
              <span>Create Internship</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {internshipOpps.map((opp) => (
              <div
                key={opp.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      {opp.technicalField}
                    </span>
                    <h3 className="text-base font-bold text-white">{opp.title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleOppStatus(opp)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        opp.status === 'OPEN'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {opp.status}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleOppPublished(opp)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        opp.isPublished
                          ? 'bg-blue-950 text-blue-400 border border-blue-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {opp.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">{opp.description}</p>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  {opp.workMode && <span>{opp.workMode}</span>}
                  {opp.duration && <span>• {opp.duration}</span>}
                  {opp.deadline && <span>• Due: {new Date(opp.deadline).toLocaleDateString()}</span>}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    Created {new Date(opp.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditOpp(opp)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Edit Opportunity"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteOpp(opp.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                      title="Delete Opportunity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {internshipOpps.length === 0 && (
              <div className="col-span-2 py-12 text-center text-slate-500 bg-slate-900/40 border border-slate-800 rounded-2xl">
                No internship opportunities created yet. Click "Create Internship" to publish an opening.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: RESEARCH OPPORTUNITIES
          ======================================================== */}
      {activeTab === 'research' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">Research Openings</h2>
              <p className="text-xs text-slate-400">
                Manage projects across the 8 initial research areas
              </p>
            </div>
            <button
              type="button"
              onClick={() => openCreateOpp('RESEARCH')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
            >
              <Plus className="w-4 h-4" />
              <span>Create Research Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {researchOpps.map((opp) => (
              <div
                key={opp.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      {opp.technicalField}
                    </span>
                    <h3 className="text-base font-bold text-white">{opp.title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleOppStatus(opp)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        opp.status === 'OPEN'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {opp.status}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleOppPublished(opp)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        opp.isPublished
                          ? 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {opp.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">{opp.description}</p>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  {opp.workMode && <span>{opp.workMode}</span>}
                  {opp.duration && <span>• {opp.duration}</span>}
                  {opp.deadline && <span>• Due: {new Date(opp.deadline).toLocaleDateString()}</span>}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    Created {new Date(opp.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditOpp(opp)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Edit Opportunity"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteOpp(opp.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                      title="Delete Opportunity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {researchOpps.length === 0 && (
              <div className="col-span-2 py-12 text-center text-slate-500 bg-slate-900/40 border border-slate-800 rounded-2xl">
                No research projects created yet. Click "Create Research Project" to publish an opening.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: APPLICATIONS MANAGEMENT
          ======================================================== */}
      {activeTab === 'applications' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">Vacancy Applications</h2>
              <p className="text-xs text-slate-400">
                Total {appsTotal} applications submitted for published opportunities
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleExportApplicationsCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Type:</span>
              <select
                value={appsTypeFilter}
                onChange={(e) => {
                  setAppsTypeFilter(e.target.value);
                  setAppsPage(1);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="All">All Types</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="RESEARCH">Research</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Status:</span>
              <select
                value={appsStatusFilter}
                onChange={(e) => {
                  setAppsStatusFilter(e.target.value);
                  setAppsPage(1);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>

            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={appsSearch}
                onChange={(e) => setAppsSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadApplications()}
                placeholder="Search applicant name, email, ref..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          {/* Applications Table */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                    <th className="py-3 px-4 font-bold">Reference</th>
                    <th className="py-3 px-4 font-bold">Candidate</th>
                    <th className="py-3 px-4 font-bold">Target Role</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Resume</th>
                    <th className="py-3 px-4 font-bold">Submitted</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-400">
                        {app.referenceNumber}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-white">{app.fullName}</p>
                        <p className="text-[11px] text-slate-400">{app.email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-200">{app.opportunityTitle}</p>
                        <span className="text-[10px] text-slate-400 uppercase">
                          {app.technicalField}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                          className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-semibold text-white focus:outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview">Interview</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Withdrawn">Withdrawn</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleDownloadResume(app.resumeFileName, app.resumeOriginalName)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-blue-400"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                          title="View Details & Notes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {applications.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        No vacancy applications match your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: GENERAL INTEREST REGISTRATIONS
          ======================================================== */}
      {activeTab === 'interest' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">General Interest Registrations</h2>
              <p className="text-xs text-slate-400">
                Total {interestTotal} future expressions of interest submitted
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleExportInterestCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Type:</span>
              <select
                value={interestTypeFilter}
                onChange={(e) => {
                  setInterestTypeFilter(e.target.value);
                  setInterestPage(1);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="All">All Types</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="RESEARCH">Research</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Status:</span>
              <select
                value={interestStatusFilter}
                onChange={(e) => {
                  setInterestStatusFilter(e.target.value);
                  setInterestPage(1);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Contacted">Contacted</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={interestSearch}
                onChange={(e) => setInterestSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadInterestRegistrations()}
                placeholder="Search applicant name, email, domain..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                    <th className="py-3 px-4 font-bold">Reference</th>
                    <th className="py-3 px-4 font-bold">Candidate</th>
                    <th className="py-3 px-4 font-bold">Preferred Type</th>
                    <th className="py-3 px-4 font-bold">Domain</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Resume</th>
                    <th className="py-3 px-4 font-bold">Submitted</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {interestRegistrations.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                        {item.referenceNumber}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-white">{item.fullName}</p>
                        <p className="text-[11px] text-slate-400">{item.email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200">
                          {item.preferredType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {item.domain === 'Other' && item.customDomain
                          ? item.customDomain
                          : item.domain}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={item.status}
                          onChange={(e) => handleUpdateInterestStatus(item.id, e.target.value)}
                          className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-semibold text-white focus:outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleDownloadResume(item.resumeFileName, item.resumeOriginalName)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-indigo-400"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedInterest(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                          title="View Details & Notes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {interestRegistrations.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        No general interest registrations recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 6: CAREERS SETTINGS
          ======================================================== */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-3xl animate-in fade-in duration-150">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Global Careers Configuration</h3>
              <p className="text-xs text-slate-400">
                Authoritative settings governing whether ManyMorgan is currently accepting active vacancy applications.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-white">Global Careers Status</span>
                <p className="text-xs text-slate-400">
                  {globalStatus === 'ACTIVE'
                    ? 'Website is currently accepting applications for open published roles.'
                    : 'Applications for current vacancies are closed. General expressions of interest remain enabled.'}
                </p>
              </div>

              {globalStatus === 'ACTIVE' ? (
                <button
                  type="button"
                  onClick={() => setConfirmModal({ open: true, action: 'DEACTIVATE', isProcessing: false })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-sm"
                >
                  Deactivate Careers
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmModal({ open: true, action: 'ACTIVATE', isProcessing: false })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm"
                >
                  Activate Careers
                </button>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Security & Data Integrity Policy
              </h4>
              <ul className="space-y-2 text-xs text-slate-400 leading-relaxed list-disc list-inside">
                <li>Uploaded resumes are stored in private server storage with verified document signatures.</li>
                <li>Public downloads and static exposures are strictly prohibited and blocked by authentication guards.</li>
                <li>Deactivating Careers immediately rejects incoming vacancy applications at the backend API layer with HTTP 409 Conflict.</li>
                <li>Deactivation preserves all historical applicant records, notes, and uploaded resumes intact.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CONFIRMATION MODAL: Activate / Deactivate Careers
          ======================================================== */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  confirmModal.action === 'ACTIVATE'
                    ? 'bg-emerald-600/20 text-emerald-400'
                    : 'bg-rose-600/20 text-rose-400'
                }`}
              >
                <Power className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {confirmModal.action === 'ACTIVATE' ? 'Activate Careers System?' : 'Deactivate Careers System?'}
                </h3>
                <span className="text-xs text-slate-400">
                  Global public site state update
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {confirmModal.action === 'ACTIVATE'
                ? 'Activating Careers will allow visitors to browse published internship & research opportunities and submit applications for open positions.'
                : 'Deactivating Careers will immediately stop accepting applications for open positions and display the professional closed-opportunities page. Visitors will only be able to register general interest. No historical records or resumes will be deleted.'}
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={confirmModal.isProcessing}
                onClick={() => setConfirmModal({ open: false, action: 'ACTIVATE', isProcessing: false })}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmModal.isProcessing}
                onClick={handleConfirmStatusChange}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
                  confirmModal.action === 'ACTIVATE'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                }`}
              >
                {confirmModal.isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Updating...</span>
                  </span>
                ) : (
                  <span>Confirm {confirmModal.action === 'ACTIVATE' ? 'Activation' : 'Deactivation'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CREATE / EDIT OPPORTUNITY MODAL
          ======================================================== */}
      {oppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">
                {editingOpp ? 'Edit Opportunity' : 'Create New Opportunity'}
              </h3>
              <button
                type="button"
                onClick={() => setOppModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOpp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Opportunity Type *</label>
                  <select
                    value={oppFormData.type}
                    onChange={(e) => {
                      const newType = e.target.value as 'INTERNSHIP' | 'RESEARCH';
                      setOppFormData({
                        ...oppFormData,
                        type: newType,
                        technicalField:
                          newType === 'INTERNSHIP'
                            ? INTERNSHIP_TRACKS[0].title
                            : RESEARCH_AREAS[0].title,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="INTERNSHIP">Internship</option>
                    <option value="RESEARCH">Research</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Technical Field / Track *</label>
                  <select
                    value={oppFormData.technicalField}
                    onChange={(e) => setOppFormData({ ...oppFormData, technicalField: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    {(oppFormData.type === 'INTERNSHIP' ? INTERNSHIP_TRACKS : RESEARCH_AREAS).map(
                      (item) => (
                        <option key={item.id} value={item.title}>
                          {item.title}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Opportunity Title *</label>
                <input
                  type="text"
                  required
                  value={oppFormData.title}
                  onChange={(e) => setOppFormData({ ...oppFormData, title: e.target.value })}
                  placeholder="e.g. Next.js Full-Stack Engineering Intern"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={oppFormData.description}
                  onChange={(e) => setOppFormData({ ...oppFormData, description: e.target.value })}
                  placeholder="Comprehensive description of the project, role, or investigation..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Required Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={oppFormData.skills}
                    onChange={(e) => setOppFormData({ ...oppFormData, skills: e.target.value })}
                    placeholder="React, TypeScript, Next.js, Node.js"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Eligibility Criteria</label>
                  <input
                    type="text"
                    value={oppFormData.eligibility}
                    onChange={(e) => setOppFormData({ ...oppFormData, eligibility: e.target.value })}
                    placeholder="Pre-final or final year CS/IT students or self-taught engineers"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Duration</label>
                  <input
                    type="text"
                    value={oppFormData.duration}
                    onChange={(e) => setOppFormData({ ...oppFormData, duration: e.target.value })}
                    placeholder="3 Months"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Work Mode</label>
                  <select
                    value={oppFormData.workMode}
                    onChange={(e) => setOppFormData({ ...oppFormData, workMode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Application Deadline</label>
                  <input
                    type="date"
                    value={oppFormData.deadline}
                    onChange={(e) => setOppFormData({ ...oppFormData, deadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Responsibilities (one per line)
                </label>
                <textarea
                  rows={2}
                  value={oppFormData.responsibilities}
                  onChange={(e) => setOppFormData({ ...oppFormData, responsibilities: e.target.value })}
                  placeholder="Architect scalable frontend interfaces&#10;Integrate REST & WebSocket APIs"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={oppFormData.isPublished}
                    onChange={(e) => setOppFormData({ ...oppFormData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 border-slate-700 bg-slate-950"
                  />
                  <span>Published on Website</span>
                </label>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span>Status:</span>
                  <select
                    value={oppFormData.status}
                    onChange={(e) =>
                      setOppFormData({
                        ...oppFormData,
                        status: e.target.value as 'OPEN' | 'CLOSED' | 'ARCHIVED',
                      })
                    }
                    className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setOppModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOppSaving}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20"
                >
                  {isOppSaving ? 'Saving...' : editingOpp ? 'Update Opportunity' : 'Publish Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          APPLICATION DETAILS DRAWER / MODAL
          ======================================================== */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-blue-400">
                    {selectedApp.referenceNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                    {selectedApp.opportunityType}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">{selectedApp.fullName}</h3>
                <p className="text-xs text-slate-400">
                  Applied for: <span className="text-white font-semibold">{selectedApp.opportunityTitle}</span> ({selectedApp.technicalField})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Applicant Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">Contact Email</span>
                <p className="font-semibold text-white">{selectedApp.email}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">Phone Number</span>
                <p className="font-semibold text-white">{selectedApp.phone}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase text-slate-500">Present Address</span>
                <p className="font-semibold text-white">{selectedApp.presentAddress}</p>
              </div>
            </div>

            {/* External Links */}
            {(selectedApp.linkedInUrl || selectedApp.githubUrl || selectedApp.portfolioUrl) && (
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedApp.linkedInUrl && (
                  <a
                    href={selectedApp.linkedInUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-blue-400 text-xs font-semibold hover:bg-slate-700"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {selectedApp.githubUrl && (
                  <a
                    href={selectedApp.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {selectedApp.portfolioUrl && (
                  <a
                    href={selectedApp.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-emerald-400 text-xs font-semibold hover:bg-slate-700"
                  >
                    <span>Portfolio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {/* Resume Download Action */}
            <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-800/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-xs font-bold text-white">{selectedApp.resumeOriginalName}</p>
                  <p className="text-[10px] text-slate-400">
                    {(selectedApp.resumeSizeBytes / (1024 * 1024)).toFixed(2)} MB • Verified document
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDownloadResume(selectedApp.resumeFileName, selectedApp.resumeOriginalName)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Resume</span>
              </button>
            </div>

            {/* Cover Note */}
            {selectedApp.coverNote && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-300">Applicant Cover Note:</span>
                <p className="text-xs text-slate-400 bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedApp.coverNote}
                </p>
              </div>
            )}

            {/* Internal Admin Notes (Never visible to applicant) */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Internal Recruiter Notes (Confidential)
              </span>

              <form onSubmit={handleAddAppNote} className="flex gap-2">
                <input
                  type="text"
                  value={newAppNote}
                  onChange={(e) => setNewAppNote(e.target.value)}
                  placeholder="Add confidential interview or evaluation note..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <button
                  type="submit"
                  disabled={isAddingAppNote}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedApp.adminNotes && selectedApp.adminNotes.length > 0 ? (
                  selectedApp.adminNotes.map((note: any) => (
                    <div
                      key={note.id}
                      className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-bold text-slate-400">{note.adminName}</span>
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-300">{note.noteText}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-500">No internal notes added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          GENERAL INTEREST DETAILS DRAWER / MODAL
          ======================================================== */}
      {selectedInterest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-indigo-400">
                    {selectedInterest.referenceNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                    {selectedInterest.preferredType}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">{selectedInterest.fullName}</h3>
                <p className="text-xs text-slate-400">
                  Domain:{' '}
                  <span className="text-white font-semibold">
                    {selectedInterest.domain === 'Other' && selectedInterest.customDomain
                      ? selectedInterest.customDomain
                      : selectedInterest.domain}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInterest(null)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">Email</span>
                <p className="font-semibold text-white">{selectedInterest.email}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">Phone</span>
                <p className="font-semibold text-white">{selectedInterest.phone}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase text-slate-500">Present Address</span>
                <p className="font-semibold text-white">{selectedInterest.presentAddress}</p>
              </div>
            </div>

            {/* Resume */}
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-800/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-indigo-400" />
                <div>
                  <p className="text-xs font-bold text-white">{selectedInterest.resumeOriginalName}</p>
                  <p className="text-[10px] text-slate-400">
                    {(selectedInterest.resumeSizeBytes / (1024 * 1024)).toFixed(2)} MB • Verified document
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleDownloadResume(selectedInterest.resumeFileName, selectedInterest.resumeOriginalName)
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Resume</span>
              </button>
            </div>

            {/* Introduction */}
            {selectedInterest.introduction && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-300">Candidate Introduction:</span>
                <p className="text-xs text-slate-400 bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedInterest.introduction}
                </p>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Internal Recruiter Notes (Confidential)
              </span>

              <form onSubmit={handleAddInterestNote} className="flex gap-2">
                <input
                  type="text"
                  value={newInterestNote}
                  onChange={(e) => setNewInterestNote(e.target.value)}
                  placeholder="Add confidential review note..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <button
                  type="submit"
                  disabled={isAddingInterestNote}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedInterest.adminNotes && selectedInterest.adminNotes.length > 0 ? (
                  selectedInterest.adminNotes.map((note: any) => (
                    <div
                      key={note.id}
                      className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-bold text-slate-400">{note.adminName}</span>
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-300">{note.noteText}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-500">No internal notes added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
