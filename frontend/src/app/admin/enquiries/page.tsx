'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Archive,
  RefreshCw,
} from 'lucide-react';
import { adminFetch } from '@/lib/adminAuth';

const STATUS_OPTIONS = ['All', 'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
const PRIORITY_OPTIONS = ['All', 'Low', 'Medium', 'High', 'Urgent'];

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status,
        priority,
        search,
      });

      const res = await adminFetch(`/enquiries?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.items || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, status, priority]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const handleExportCsv = async () => {
    try {
      const res = await adminFetch('/enquiries/export/csv');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `manymorgan-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
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
      {/* Centralized Inbox Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-blue-950/40 border border-blue-800/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0">
            <Archive className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Centralized Enquiries & Applications Inbox</h4>
            <p className="text-xs text-slate-300">
              View all service consultations, quotes, contacts, and careers applications in one unified interface.
            </p>
          </div>
        </div>
        <Link
          href="/admin/submissions"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold whitespace-nowrap shadow-md transition"
        >
          Open Centralized Inbox &rarr;
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Client Enquiries & Scoping
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Total {total} enquiries recorded in ManyMorgan registry
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white transition-colors"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by client name, email, company, or ID (e.g. MM-2026-1001)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </form>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-slate-900">
                Status: {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="md:col-span-3">
          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-slate-900">
                Priority: {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : enquiries.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs space-y-2">
            <p className="font-semibold text-slate-400">No enquiries match your search criteria</p>
            <p>Try resetting the search terms or filters above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Client & Company</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Service Required</th>
                  <th className="p-4">Budget & Timeline</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-400">
                      {enquiry.enquiryNumber}
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-white">{enquiry.fullName}</p>
                      <p className="text-slate-400 text-[11px]">{enquiry.companyName || 'Individual'}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-slate-300">{enquiry.email}</p>
                      <p className="text-slate-500 text-[11px]">
                        {enquiry.phoneCountryCode} {enquiry.phoneNumber}
                      </p>
                    </td>
                    <td className="p-4 text-slate-300">{enquiry.serviceName}</td>
                    <td className="p-4">
                      <p className="text-slate-300">{enquiry.budgetRange || 'Not specified'}</p>
                      <p className="text-slate-500 text-[11px]">{enquiry.expectedTimeline || 'Flexible'}</p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          enquiry.status === 'New'
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                            : enquiry.status === 'Won'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : enquiry.status === 'Lost'
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          enquiry.priority === 'Urgent'
                            ? 'bg-red-500/20 text-red-400'
                            : enquiry.priority === 'High'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {enquiry.priority}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/enquiries/${enquiry.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white font-semibold text-[11px] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Page {page} of {totalPages} ({total} items)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-lg bg-slate-950 border border-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 rounded-lg bg-slate-950 border border-slate-800 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
