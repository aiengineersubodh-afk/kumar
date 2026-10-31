'use client';

import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { adminFetch } from '@/lib/adminAuth';
import { AnnouncementItem } from '@/lib/api';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<AnnouncementItem> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadAnnouncements = async () => {
    setIsLoading(true);
    try {
      const res = await adminFetch('/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleToggleActive = async (ann: AnnouncementItem) => {
    try {
      await adminFetch(`/announcements/${ann.id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !ann.isActive }),
      });
      loadAnnouncements();
    } catch {}
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.message) return;

    setIsSaving(true);
    try {
      if (editingItem.id) {
        await adminFetch(`/announcements/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(editingItem),
        });
      } else {
        await adminFetch('/announcements', {
          method: 'POST',
          body: JSON.stringify(editingItem),
        });
      }
      setEditingItem(null);
      loadAnnouncements();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await adminFetch(`/announcements/${id}`, { method: 'DELETE' });
      loadAnnouncements();
    } catch {}
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Website Announcements
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Broadcast promotional banners, technical launches, or capability updates across the live website
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              title: '',
              message: '',
              linkLabel: 'Learn More',
              linkUrl: '/services',
              badgeText: 'Announcement',
              isActive: true,
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-16 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-500 text-xs">
          No announcements created yet.
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-6 rounded-2xl bg-slate-900 border transition-all space-y-3 ${
                ann.isActive ? 'border-blue-500/40 shadow-lg shadow-blue-500/5' : 'border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    {ann.badgeText}
                  </span>
                  <span className="text-xs font-bold text-white">{ann.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(ann)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${
                      ann.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {ann.isActive ? 'Active on Site' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => setEditingItem({ ...ann })}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{ann.message}</p>

              {ann.linkLabel && ann.linkUrl && (
                <div className="text-[11px] text-blue-400 flex items-center gap-1 font-semibold">
                  <span>Action link:</span>
                  <span className="underline">{ann.linkLabel} &rarr; {ann.linkUrl}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">
                {editingItem.id ? 'Edit Announcement' : 'Create Announcement'}
              </h2>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Badge Text</label>
                <input
                  type="text"
                  value={editingItem.badgeText || 'Announcement'}
                  onChange={(e) => setEditingItem({ ...editingItem, badgeText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. Enterprise AI Suite Launched"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Banner Message</label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.message || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, message: e.target.value })}
                  placeholder="Text displayed directly in the top header banner..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Link Label (Optional)</label>
                  <input
                    type="text"
                    value={editingItem.linkLabel || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, linkLabel: e.target.value })}
                    placeholder="e.g. Explore Now"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Link Destination</label>
                  <input
                    type="text"
                    value={editingItem.linkUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, linkUrl: e.target.value })}
                    placeholder="e.g. /services"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isActive ?? true}
                    onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-950"
                  />
                  <span className="text-white font-medium">Activate Banner on Live Website</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 rounded-xl text-slate-400 bg-slate-950"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    {isSaving ? 'Saving...' : 'Deploy Banner'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
