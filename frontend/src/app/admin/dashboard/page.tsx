'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
  Loader2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { adminFetch } from '@/lib/adminAuth';

interface DashboardMetrics {
  totalEnquiries: number;
  newEnquiries: number;
  awaitingFollowUp: number;
  wonEnquiries: number;
  lostEnquiries: number;
  serviceBreakdown: Record<string, number>;
  statusBreakdown: Record<string, number>;
  recentSubmissions: any[];
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminFetch('/dashboard/metrics')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setMetrics(data);
      })
      .catch((err) => console.error('Dashboard metrics error:', err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const m = metrics || {
    totalEnquiries: 0,
    newEnquiries: 0,
    awaitingFollowUp: 0,
    wonEnquiries: 0,
    lostEnquiries: 0,
    serviceBreakdown: {},
    statusBreakdown: {},
    recentSubmissions: [],
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Executive Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time pipeline metrics and client enquiry activity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            <span>Manage All Enquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Enquiries</span>
            <Inbox className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-white">{m.totalEnquiries}</p>
          <span className="text-[11px] text-slate-500">Database recorded</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">New Incoming</span>
            <Sparkles className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-3xl font-black text-sky-400">{m.newEnquiries}</p>
          <span className="text-[11px] text-slate-500">Awaiting initial triage</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Awaiting Follow-up</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400">{m.awaitingFollowUp}</p>
          <span className="text-[11px] text-slate-500">Contacted / In Progress</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Won Enquiries</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">{m.wonEnquiries}</p>
          <span className="text-[11px] text-slate-500">Closed & Contracted</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Lost / Declined</span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-3xl font-black text-slate-400">{m.lostEnquiries}</p>
          <span className="text-[11px] text-slate-500">Archived or closed</span>
        </div>
      </div>

      {/* Middle Grid: Services Breakdown & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Service Distribution */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Enquiries Grouped by Engineering Vertical</span>
            </h2>
          </div>

          {Object.keys(m.serviceBreakdown).length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No enquiry submissions recorded yet. Once clients submit the enquiry form, distribution will be shown here.
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {Object.entries(m.serviceBreakdown).map(([service, count]) => {
                const percentage = m.totalEnquiries > 0 ? Math.round((count / m.totalEnquiries) * 100) : 0;
                return (
                  <div key={service} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-200">{service}</span>
                      <span className="text-slate-400">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Management Shortcuts */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white">Console Quick Links</h2>
          <div className="space-y-2.5">
            <Link
              href="/admin/services"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors group"
            >
              <div>
                <p className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Services Catalog CMS
                </p>
                <p className="text-[11px] text-slate-500">Edit titles, benefits, deliverables</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/admin/content"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors group"
            >
              <div>
                <p className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Website Content & Hero
                </p>
                <p className="text-[11px] text-slate-500">Update headlines, CTAs, SEO titles</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/admin/announcements"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors group"
            >
              <div>
                <p className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Public Banner Announcements
                </p>
                <p className="text-[11px] text-slate-500">Broadcast updates to public site</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Recent Client Submissions</h2>
            <p className="text-xs text-slate-400">Latest enquiries logged into ManyMorgan pipeline</p>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300"
          >
            View All &rarr;
          </Link>
        </div>

        {m.recentSubmissions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No submissions registered yet. Submit a test enquiry on the public website to see live pipeline records.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Budget</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Received</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {m.recentSubmissions.map((enquiry: any) => (
                  <tr key={enquiry.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-400">
                      {enquiry.enquiryNumber}
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-white">{enquiry.fullName}</p>
                      <p className="text-slate-400 text-[11px]">{enquiry.email}</p>
                    </td>
                    <td className="p-4 text-slate-300">{enquiry.serviceName}</td>
                    <td className="p-4 text-slate-400">{enquiry.budgetRange || 'Not specified'}</td>
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
                    <td className="p-4 text-slate-400">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/enquiries/${enquiry.id}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] transition-colors"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
