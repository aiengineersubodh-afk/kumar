'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  FileText,
  Calendar,
  X,
  Send,
  ExternalLink,
  Briefcase,
  Layers,
  Phone,
  Mail,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
} from 'lucide-react';
import { adminFetch } from '@/lib/adminAuth';

type TabKey =
  | 'all'
  | 'service_enquiries'
  | 'quote'
  | 'contact'
  | 'internship'
  | 'research'
  | 'careers_interest';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All Submissions' },
  { key: 'service_enquiries', label: 'Service Enquiries' },
  { key: 'quote', label: 'Get a Quote' },
  { key: 'contact', label: 'Contact Enquiries' },
  { key: 'internship', label: 'Internship Applications' },
  { key: 'research', label: 'Research Applications' },
  { key: 'careers_interest', label: 'Careers Interest' },
];

const STATUS_VARIANTS: Record<string, string> = {
  New: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  PENDING_REVIEW: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Contacted: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  SHORTLISTED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  UNDER_REVIEW: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Meeting Scheduled': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'Proposal Sent': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  INTERVIEW_SCHEDULED: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Won: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  OFFERED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  ACCEPTED: 'bg-green-500/10 text-green-400 border-green-500/20',
  Lost: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  REJECTED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Archived: 'bg-slate-700/30 text-slate-400 border-slate-700/40',
};

export default function SubmissionsInboxPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isLoading, setIsLoading] = useState(true);

  // Drawer / Detail state
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);

  const loadSubmissions = async () => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams({
        tab: activeTab,
        page: page.toString(),
        limit: limit.toString(),
        sort: sortOrder,
      });
      if (search.trim()) q.append('search', search.trim());
      if (statusFilter && statusFilter !== 'All') q.append('status', statusFilter);
      if (startDate) q.append('startDate', startDate);
      if (endDate) q.append('endDate', endDate);

      const res = await adminFetch(`/submissions?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.items || []);
        setTotal(data.total || 0);
        if (data.counts) {
          setCounts(data.counts);
        }
      }
    } catch (e) {
      console.error('Error fetching submissions:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [activeTab, page, statusFilter, startDate, endDate, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadSubmissions();
  };

  const openDetailDrawer = async (item: any) => {
    setSelectedSubmission(item);
    setNewStatus(item.status);
    setStatusComment('');
    setNewNoteText('');
    setDetailLoading(true);

    try {
      const res = await adminFetch(`/submissions/${item.id}`);
      if (res.ok) {
        const full = await res.json();
        setSelectedSubmission(full);
        setNewStatus(full.status);
      }
    } catch (e) {
      console.error('Failed to load detail:', e);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedSubmission || !newStatus) return;
    setStatusUpdating(true);
    try {
      const res = await adminFetch(`/submissions/${selectedSubmission.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, comment: statusComment }),
      });
      if (res.ok) {
        // Refresh detail
        const updatedRes = await adminFetch(`/submissions/${selectedSubmission.id}`);
        if (updatedRes.ok) {
          const updated = await updatedRes.json();
          setSelectedSubmission(updated);
        }
        setStatusComment('');
        loadSubmissions();
      }
    } catch (e) {
      alert('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission || !newNoteText.trim()) return;
    setNoteSubmitting(true);
    try {
      const res = await adminFetch(`/submissions/${selectedSubmission.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteText: newNoteText }),
      });
      if (res.ok) {
        const updatedRes = await adminFetch(`/submissions/${selectedSubmission.id}`);
        if (updatedRes.ok) {
          const updated = await updatedRes.json();
          setSelectedSubmission(updated);
        }
        setNewNoteText('');
      }
    } catch (e) {
      alert('Failed to add note');
    } finally {
      setNoteSubmitting(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const q = new URLSearchParams({
        tab: activeTab,
        status: statusFilter,
      });
      if (search.trim()) q.append('search', search.trim());
      const res = await adminFetch(`/submissions/export/csv?${q.toString()}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `manymorgan-${activeTab}-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (e) {
      alert('Failed to export CSV');
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Enquiries & Applications Inbox
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Centralized management for client consultations, quote requests, general enquiries, and career applications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadSubmissions()}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-blue-600/20 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800/80">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = counts[tab.key] ?? 0;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setPage(1);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, reference ID, or track..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="New">New / Pending</option>
              <option value="Contacted">Contacted</option>
              <option value="Meeting Scheduled">Meeting Scheduled</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
              <option value="OFFERED">Offer Extended</option>
              <option value="Won">Won / Accepted</option>
              <option value="Lost">Lost / Rejected</option>
              <option value="Archived">Archived</option>
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              title="Start Date"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              title="End Date"
            />

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Submissions Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
            <p className="text-xs uppercase tracking-wider font-semibold">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto text-slate-600 mb-3" />
            <h3 className="text-base font-bold text-white">No submissions found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              There are no submissions matching your selected filter or tab.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Ref & Type</th>
                  <th className="py-3.5 px-4">Applicant / Client</th>
                  <th className="py-3.5 px-4">Service / Track</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Resume</th>
                  <th className="py-3.5 px-4">Submitted</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {submissions.map((sub) => {
                  const statusStyle =
                    STATUS_VARIANTS[sub.status] || 'bg-slate-700/20 text-slate-300 border-slate-700/30';
                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                      onClick={() => openDetailDrawer(sub)}
                    >
                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-blue-400 block">{sub.referenceNumber}</span>
                        <span className="text-[10px] text-slate-400">{sub.typeLabel}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-white block">{sub.fullName}</span>
                        <span className="text-slate-400 block text-[11px] truncate max-w-[200px]">
                          {sub.email}
                        </span>
                        {sub.phoneNumber && (
                          <span className="text-slate-500 text-[10px] block">
                            {sub.phoneNumber}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-slate-200 font-medium block truncate max-w-[220px]">
                          {sub.serviceOrDomain || '—'}
                        </span>
                        {sub.budgetRange && (
                          <span className="text-[10px] text-emerald-400 block">
                            {sub.budgetRange}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle}`}
                        >
                          {sub.status}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {sub.resumeFileName ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400">
                            <FileText className="w-3.5 h-3.5" />
                            <span>CV Attached</span>
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {new Date(sub.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openDetailDrawer(sub)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="bg-slate-950/80 border-t border-slate-800 p-3.5 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <span className="font-semibold text-white">{submissions.length}</span> of{' '}
            <span className="font-semibold text-white">{total}</span> total
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-white">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Drawer Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end transition-opacity">
          <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-widest">
                  {selectedSubmission.typeLabel}
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {selectedSubmission.referenceNumber}
                </h2>
                <p className="text-xs text-slate-400">
                  Received on {new Date(selectedSubmission.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Applicant / Client Info Card */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Full Name</span>
                  <span className="font-semibold text-white text-sm">
                    {selectedSubmission.fullName}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Email Address</span>
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="font-semibold text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    <span>{selectedSubmission.email}</span>
                  </a>
                </div>

                {selectedSubmission.phoneNumber && (
                  <div>
                    <span className="text-slate-500 block">Phone</span>
                    <a
                      href={`tel:${selectedSubmission.phoneNumber}`}
                      className="font-semibold text-slate-200 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{selectedSubmission.phoneNumber}</span>
                    </a>
                  </div>
                )}

                {selectedSubmission.companyName && (
                  <div>
                    <span className="text-slate-500 block">Company / Org</span>
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span>{selectedSubmission.companyName}</span>
                    </span>
                  </div>
                )}

                {selectedSubmission.presentAddress && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block">Present Address / Location</span>
                    <span className="text-slate-200">{selectedSubmission.presentAddress}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Scope / Request Details */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Submission Specifics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Service / Track Domain</span>
                  <span className="font-semibold text-white">
                    {selectedSubmission.serviceOrDomain}
                  </span>
                </div>

                {selectedSubmission.budgetRange && (
                  <div>
                    <span className="text-slate-500 block">Budget Range</span>
                    <span className="font-semibold text-emerald-400">
                      {selectedSubmission.budgetRange}
                    </span>
                  </div>
                )}

                {selectedSubmission.expectedTimeline && (
                  <div>
                    <span className="text-slate-500 block">Expected Timeline</span>
                    <span className="font-semibold text-indigo-300">
                      {selectedSubmission.expectedTimeline}
                    </span>
                  </div>
                )}

                {/* Portfolio / Links */}
                {(selectedSubmission.linkedInUrl ||
                  selectedSubmission.githubUrl ||
                  selectedSubmission.portfolioUrl) && (
                  <div className="sm:col-span-2 flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                    {selectedSubmission.linkedInUrl && (
                      <a
                        href={selectedSubmission.linkedInUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-medium flex items-center gap-1"
                      >
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {selectedSubmission.githubUrl && (
                      <a
                        href={selectedSubmission.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-medium flex items-center gap-1"
                      >
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {selectedSubmission.portfolioUrl && (
                      <a
                        href={selectedSubmission.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 text-xs font-medium flex items-center gap-1"
                      >
                        <span>Portfolio / Site</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {selectedSubmission.projectDescription && (
                <div className="pt-3 border-t border-slate-800 text-xs">
                  <span className="text-slate-500 block mb-1">
                    Project Description / Cover Note:
                  </span>
                  <div className="bg-slate-900 p-3 rounded-lg text-slate-300 whitespace-pre-line border border-slate-800/60 leading-relaxed font-sans">
                    {selectedSubmission.projectDescription}
                  </div>
                </div>
              )}
            </div>

            {/* Resume Download Section */}
            {selectedSubmission.resumeFileName && (
              <div className="bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-900/40 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {selectedSubmission.resumeOriginalName || selectedSubmission.resumeFileName}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {selectedSubmission.resumeSizeBytes
                        ? `${(selectedSubmission.resumeSizeBytes / (1024 * 1024)).toFixed(2)} MB`
                        : 'PDF Document'}
                    </p>
                  </div>
                </div>

                <a
                  href={`/api/careers/resumes/${selectedSubmission.resumeFileName}`}
                  target="_blank"
                  download
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-md shadow-blue-600/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CV</span>
                </a>
              </div>
            )}

            {/* Status Management */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Update Status
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 flex-1"
                >
                  <option value="New">New / Unread</option>
                  <option value="PENDING_REVIEW">Pending Review</option>
                  <option value="Contacted">Contacted</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="Meeting Scheduled">Meeting Scheduled</option>
                  <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="OFFERED">Offer Extended</option>
                  <option value="Won">Won</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="Lost">Lost</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="Archived">Archived</option>
                </select>

                <button
                  onClick={handleUpdateStatus}
                  disabled={statusUpdating || newStatus === selectedSubmission.status}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  {statusUpdating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>Save Status</span>
                </button>
              </div>

              <input
                type="text"
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
                placeholder="Optional audit comment (e.g. Completed initial screening call)..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Internal Admin Notes */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Internal Admin Notes ({selectedSubmission.notes?.length || 0})
              </h3>

              {selectedSubmission.notes && selectedSubmission.notes.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedSubmission.notes.map((note: any) => (
                    <div
                      key={note.id}
                      className="p-2.5 bg-slate-900/80 border border-slate-800/60 rounded-lg text-xs"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                        <span className="font-semibold text-slate-300">{note.adminName}</span>
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-300 font-sans">{note.noteText}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No internal notes added yet.</p>
              )}

              <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add internal note for team..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={noteSubmitting || !newNoteText.trim()}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold disabled:opacity-40 transition flex items-center gap-1"
                >
                  {noteSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Post</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

