'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Video,
  Upload,
  Trash2,
  Copy,
  Check,
  Search,
  ExternalLink,
  Play,
  Pause,
  AlertTriangle,
  Loader2,
  FileText,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { adminFetch } from '@/lib/adminAuth';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  type: 'image' | 'video' | 'document';
  title?: string;
  altText?: string;
  usedIn?: string[];
  usageCount?: number;
  createdAt: string;
}

export default function AdminMediaManagementPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Preview Modal
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [deleteWarningItem, setDeleteWarningItem] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/media');
      if (res.ok) {
        const data = await res.json();
        setMediaItems(data || []);
      }
    } catch (e) {
      console.error('Failed to load media:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert('File size exceeds the 100MB limit.');
      return;
    }

    setUploading(true);
    setUploadProgress(`Uploading ${file.name}...`);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);

      const res = await adminFetch('/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('File uploaded successfully to Media Library!');
        loadMedia();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to upload media file.');
      }
    } catch (err) {
      alert('Error during upload.');
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (item: MediaItem) => {
    try {
      const res = await adminFetch(`/media/${item.id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteWarningItem(null);
        setPreviewItem(null);
        loadMedia();
      }
    } catch (e) {
      alert('Failed to delete media');
    }
  };

  const filteredItems = mediaItems.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.originalName.toLowerCase().includes(q) ||
      item.url.toLowerCase().includes(q) ||
      (item.title && item.title.toLowerCase().includes(q));
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Website Media Library
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload, inspect, and organize video backgrounds, high-resolution imagery, and hero assets with usage detection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/mp4,video/webm"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{uploading ? uploadProgress : 'Upload Media (Up to 100MB)'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media files..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'image', 'video'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                filterType === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t === 'all' ? 'All Media' : t === 'image' ? 'Images' : 'Videos'}
            </button>
          ))}
          <span className="text-xs text-slate-400 font-mono ml-2">
            {filteredItems.length} items
          </span>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
          <p className="text-xs font-semibold uppercase tracking-wider">Loading Media Library...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-16 text-center text-slate-400 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <ImageIcon className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <p className="text-sm font-semibold text-white">No media files found</p>
          <p className="text-xs text-slate-500 mt-1">Upload images or videos to populate your website media catalog.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((item) => {
            const isVideo = item.type === 'video';
            const isUsed = item.usageCount && item.usageCount > 0;

            return (
              <div
                key={item.id}
                onClick={() => setPreviewItem(item)}
                className="group bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between transition-all hover:shadow-xl"
              >
                {/* Media Thumbnail */}
                <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                  {isVideo ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                      <video
                        src={item.url}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition"
                      />
                      <div className="absolute w-8 h-8 rounded-full bg-blue-600/80 text-white flex items-center justify-center backdrop-blur-xs">
                        <Play className="w-4 h-4 ml-0.5" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title || item.originalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-slate-950/80 text-[9px] font-mono font-bold text-white uppercase backdrop-blur-xs">
                      {item.type}
                    </span>
                    {isUsed && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950/90 border border-emerald-700/50 text-[9px] font-bold text-emerald-400">
                        In Use ({item.usageCount})
                      </span>
                    )}
                  </div>
                </div>

                {/* Info & Copy */}
                <div className="p-3 space-y-2">
                  <p className="text-xs font-semibold text-white truncate" title={item.originalName}>
                    {item.originalName}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{(item.sizeBytes / (1024 * 1024)).toFixed(1)} MB</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(item);
                      }}
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-blue-400 uppercase font-bold tracking-wider">
                  Media Preview & Usage Inspector
                </span>
                <h3 className="text-base font-bold text-white truncate max-w-md">
                  {previewItem.originalName}
                </h3>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Player */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {previewItem.type === 'video' ? (
                <video
                  src={previewItem.url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={previewItem.url}
                  alt={previewItem.originalName}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Media Details & Usage */}
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block">File Size</span>
                  <span className="font-semibold text-white">
                    {(previewItem.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">MIME Type</span>
                  <span className="font-semibold text-white font-mono">{previewItem.mimeType}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block">Direct URL</span>
                  <span className="font-mono text-blue-400 truncate block">{previewItem.url}</span>
                </div>
              </div>

              {/* Usage Detector */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-white block uppercase tracking-wider text-[11px]">
                  Referenced On Website ({previewItem.usedIn?.length || 0} locations):
                </span>
                {previewItem.usedIn && previewItem.usedIn.length > 0 ? (
                  <ul className="space-y-1">
                    {previewItem.usedIn.map((loc, i) => (
                      <li key={i} className="text-emerald-400 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>{loc}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 italic">Not actively referenced by any live section.</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleCopyUrl(previewItem)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
                >
                  <Copy className="w-3.5 h-3.5 text-blue-400" />
                  <span>Copy Direct URL</span>
                </button>

                <button
                  onClick={() => setDeleteWarningItem(previewItem)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white font-semibold border border-rose-500/20 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Media</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Safe Delete Warning Modal */}
      {deleteWarningItem && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Delete Media Item</h3>
            </div>

            {deleteWarningItem.usageCount && deleteWarningItem.usageCount > 0 ? (
              <p className="text-xs text-amber-300 bg-amber-950/40 border border-amber-800/60 p-3 rounded-xl leading-relaxed">
                Warning: This file is actively in use by {deleteWarningItem.usageCount} sections (e.g.{' '}
                {deleteWarningItem.usedIn?.slice(0, 2).join(', ')}). Deleting it may result in broken images or missing videos on the public site!
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Are you sure you want to delete <strong className="text-white">{deleteWarningItem.originalName}</strong>? This action is permanent.
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteWarningItem(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteWarningItem)}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

