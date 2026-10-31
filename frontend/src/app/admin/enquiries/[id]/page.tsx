'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Clock,
  Shield,
  Send,
  MessageSquare,
  FileText,
  User,
  Mail,
  Phone,
  Building,
  Tag,
  Calendar,
  Archive,
  Save,
} from 'lucide-react';
import { adminFetch } from '@/lib/adminAuth';

const STATUS_LIST = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
const PRIORITY_LIST = ['Low', 'Medium', 'High', 'Urgent'];

export default function SingleEnquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [enquiry, setEnquiry] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Note form state
  const [noteText, setNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Send message form state
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  const loadEnquiry = async () => {
    try {
      const res = await adminFetch(`/enquiries/${id}`);
      if (res.ok) {
        const data = await res.json();
        setEnquiry(data);
        setNewStatus(data.status);
      } else {
        router.push('/admin/enquiries');
      }
    } catch {
      router.push('/admin/enquiries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadEnquiry();
  }, [id]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus || newStatus === enquiry.status) return;

    setIsUpdatingStatus(true);
    try {
      const res = await adminFetch(`/enquiries/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus, comment: statusComment }),
      });
      if (res.ok) {
        setStatusComment('');
        loadEnquiry();
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handlePriorityUpdate = async (priority: string) => {
    try {
      const res = await adminFetch(`/enquiries/${id}/priority`, {
        method: 'PATCH',
        body: JSON.stringify({ priority }),
      });
      if (res.ok) loadEnquiry();
    } catch {}
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setIsAddingNote(true);
    try {
      const res = await adminFetch(`/enquiries/${id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ noteText }),
      });
      if (res.ok) {
        setNoteText('');
        loadEnquiry();
      }
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgBody.trim()) return;

    setIsSendingMsg(true);
    try {
      const res = await adminFetch(`/enquiries/${id}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          subject: msgSubject || `Update on your ManyMorgan enquiry [${enquiry.enquiryNumber}]`,
          message: msgBody,
        }),
      });
      if (res.ok) {
        setMsgSubject('');
        setMsgBody('');
        loadEnquiry();
      }
    } finally {
      setIsSendingMsg(false);
    }
  };

  const handleToggleArchive = async () => {
    try {
      const res = await adminFetch(`/enquiries/${id}/archive`, {
        method: 'PATCH',
      });
      if (res.ok) loadEnquiry();
    } catch {}
  };

  if (isLoading || !enquiry) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/enquiries"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-mono font-extrabold text-blue-400">
                {enquiry.enquiryNumber}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
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
              {enquiry.isArchived && (
                <span className="px-2 py-0.5 rounded bg-red-900/40 text-red-300 text-xs font-semibold">
                  Archived
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Received on {new Date(enquiry.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleArchive}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
          >
            <Archive className="w-4 h-4" />
            <span>{enquiry.isArchived ? 'Unarchive' : 'Archive'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Details Left, Actions/Notes Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Scope & Client Information */}
        <div className="lg:col-span-7 space-y-6">
          {/* Client Info Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Client & Enterprise Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block">Full Name</span>
                  <span className="text-white font-semibold text-sm">{enquiry.fullName}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block">Work Email</span>
                  <a href={`mailto:${enquiry.email}`} className="text-blue-400 font-semibold hover:underline">
                    {enquiry.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block">Phone</span>
                  <span className="text-slate-200 font-semibold">
                    {enquiry.phoneCountryCode} {enquiry.phoneNumber}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Building className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block">Company</span>
                  <span className="text-slate-200 font-semibold">
                    {enquiry.companyName || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Scope Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Project Scope Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block">Requested Service</span>
                <span className="text-blue-400 font-bold">{enquiry.serviceName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Budget Band</span>
                <span className="text-white font-semibold">{enquiry.budgetRange || 'Not Specified'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Target Timeline</span>
                <span className="text-white font-semibold">{enquiry.expectedTimeline || 'Flexible'}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">
                Project Description & Objectives
              </span>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
                {enquiry.projectDescription}
              </div>
            </div>

            {enquiry.fileAttachmentUrl && (
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">
                  Attached Specification File
                </span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>{enquiry.fileAttachmentUrl}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded">
                    Scanned & Verified
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Status Audit History */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Audit & Transition History
            </h2>
            <div className="space-y-3">
              {enquiry.statusHistory?.map((hist: any) => (
                <div key={hist.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-400">
                      Status: {hist.newStatus}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(hist.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-300">{hist.comment}</p>
                  {hist.adminName && (
                    <p className="text-[10px] text-slate-500">By: {hist.adminName}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Actions, Private Notes, Customer Communication */}
        <div className="lg:col-span-5 space-y-6">
          {/* Status & Priority Controller */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Triage & Workflow Control
            </h2>

            {/* Status changer */}
            <form onSubmit={handleStatusUpdate} className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                Update Pipeline Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {STATUS_LIST.map((s) => (
                  <option key={s} value={s} className="bg-slate-900">
                    {s}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Reason or transition notes (optional)..."
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />

              <button
                type="submit"
                disabled={isUpdatingStatus || newStatus === enquiry.status}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
              >
                {isUpdatingStatus ? 'Applying Change...' : 'Update Status'}
              </button>
            </form>

            {/* Priority Picker */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Assigned Priority
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRIORITY_LIST.map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePriorityUpdate(p)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors ${
                      enquiry.priority === p
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Internal Private Notes (Never visible to client) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Internal Notes
              </h2>
              <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/60 border border-amber-900/40 px-2 py-0.5 rounded">
                Admin Eyes Only
              </span>
            </div>

            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={3}
                placeholder="Add confidential scoping note, qualification details, or team follow-up thoughts..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
              <button
                type="submit"
                disabled={isAddingNote || !noteText.trim()}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors disabled:opacity-50"
              >
                {isAddingNote ? 'Saving Note...' : 'Add Internal Note'}
              </button>
            </form>

            <div className="space-y-2.5 pt-2">
              {enquiry.notes?.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No internal notes added yet.</p>
              ) : (
                enquiry.notes?.map((n: any) => (
                  <div key={n.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                    <p className="text-slate-200">{n.noteText}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                      <span>{n.adminName}</span>
                      <span>{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Customer Direct Message / Communication Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Send Message to Customer
            </h2>
            <form onSubmit={handleSendMessage} className="space-y-2.5">
              <input
                type="text"
                placeholder="Email Subject Line..."
                value={msgSubject}
                onChange={(e) => setMsgSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <textarea
                rows={3}
                placeholder="Write message to send to client's registered email address..."
                value={msgBody}
                onChange={(e) => setMsgBody(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
              <button
                type="submit"
                disabled={isSendingMsg || !msgBody.trim()}
                className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingMsg ? 'Sending...' : 'Transmit Email'}</span>
              </button>
            </form>

            {enquiry.communications && enquiry.communications.length > 0 && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 block">Outbound Message Log</span>
                {enquiry.communications.map((comm: any) => (
                  <div key={comm.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <p className="font-semibold text-blue-400">{comm.subject}</p>
                    <p className="text-slate-300 text-[11px] line-clamp-2">{comm.bodyText}</p>
                    <span className="text-[10px] text-slate-500 block">
                      Sent by {comm.adminName} &bull; {new Date(comm.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
