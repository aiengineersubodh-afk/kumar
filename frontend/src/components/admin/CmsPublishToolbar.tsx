'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Save,
  Send,
  RotateCcw,
  History,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';

export interface CmsRevision {
  id: string;
  revisionNumber: number;
  publishedBy: string;
  publishedAt: string;
  changeSummary?: string;
  isCurrent?: boolean;
}

interface CmsPublishToolbarProps {
  sectionKey: string;
  sectionTitle: string;
  liveUrl?: string;
  isDraftDirty?: boolean;
  isSaving?: boolean;
  isPublishing?: boolean;
  lastPublishedAt?: string;
  revisions?: CmsRevision[];
  onSaveDraft: () => void | Promise<void>;
  onPublish: () => void | Promise<void>;
  onDiscard?: () => void | Promise<void>;
  onRollback?: (revisionId: string) => void | Promise<void>;
}

export default function CmsPublishToolbar({
  sectionKey,
  sectionTitle,
  liveUrl,
  isDraftDirty = false,
  isSaving = false,
  isPublishing = false,
  lastPublishedAt,
  revisions = [],
  onSaveDraft,
  onPublish,
  onDiscard,
  onRollback,
}: CmsPublishToolbarProps) {
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [rollingBackId, setRollingBackId] = useState<string | null>(null);

  const handleRollbackClick = async (id: string) => {
    if (!onRollback) return;
    const confirmRollback = window.confirm(
      'Are you sure you want to rollback to this published version? It will become the live version immediately.'
    );
    if (!confirmRollback) return;

    setRollingBackId(id);
    try {
      await onRollback(id);
      setHistoryModalOpen(false);
    } finally {
      setRollingBackId(null);
    }
  };

  return (
    <>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-4 z-30 shadow-2xl backdrop-blur-md bg-opacity-95">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-bold">
              {sectionKey}
            </span>
            {isDraftDirty ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertCircle className="w-3 h-3" />
                <span>Unsaved / Unpublished Draft</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="w-3 h-3" />
                <span>Published & Synced</span>
              </span>
            )}
          </div>

          <h2 className="text-xl font-black text-white mt-1">{sectionTitle}</h2>
          <p className="text-xs text-slate-400">
            {lastPublishedAt
              ? `Last published: ${new Date(lastPublishedAt).toLocaleString()}`
              : 'Using production default preset'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* History Button */}
          {revisions && revisions.length > 0 && (
            <button
              type="button"
              onClick={() => setHistoryModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              title="View revision history & rollbacks"
            >
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>History ({revisions.length})</span>
            </button>
          )}

          {/* Discard Draft Button */}
          {isDraftDirty && onDiscard && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Discard all unsaved draft changes and revert to live content?')) {
                  onDiscard();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 text-xs font-semibold border border-slate-700/80 transition"
              title="Discard draft changes"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard</span>
            </button>
          )}

          {/* View Live Link */}
          {liveUrl && (
            <Link
              href={liveUrl}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <span>View Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}

          {/* Save Draft */}
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving || isPublishing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-600 transition disabled:opacity-40"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Draft</span>
          </button>

          {/* Publish Live */}
          <button
            type="button"
            onClick={onPublish}
            disabled={isPublishing || isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition disabled:opacity-40"
          >
            {isPublishing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Publish Live</span>
          </button>
        </div>
      </div>

      {/* Revision History Modal */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-400" />
                  <span>Revision History & Rollbacks</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  View previous published iterations of this section. You can roll back anytime with 1 click.
                </p>
              </div>
              <button
                onClick={() => setHistoryModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {revisions.map((rev) => (
                <div
                  key={rev.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    rev.isCurrent
                      ? 'bg-blue-950/40 border-blue-800 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-400">
                          Rev #{rev.revisionNumber}
                        </span>
                        {rev.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            Current Live
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Published by <span className="text-white font-medium">{rev.publishedBy}</span> on{' '}
                        {new Date(rev.publishedAt).toLocaleString()}
                      </p>
                      {rev.changeSummary && (
                        <p className="text-xs text-slate-300 italic mt-1">&ldquo;{rev.changeSummary}&rdquo;</p>
                      )}
                    </div>

                    {!rev.isCurrent && onRollback && (
                      <button
                        onClick={() => handleRollbackClick(rev.id)}
                        disabled={rollingBackId === rev.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-white text-xs font-semibold transition"
                      >
                        {rollingBackId === rev.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <RotateCcw className="w-3.5 h-3.5" />
                        )}
                        <span>Rollback</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

