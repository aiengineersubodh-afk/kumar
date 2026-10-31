'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle,
  X,
  Loader2,
  Save,
  Image as ImageIcon,
  HelpCircle,
  Code,
  Sparkles,
} from 'lucide-react';
import { adminFetch } from '@/lib/adminAuth';

const CATEGORIES = [
  'All Categories',
  'Artificial Intelligence & Data',
  'Software & Product Engineering',
  'Cloud & DevOps',
  'Cybersecurity',
  'Data Engineering & Analytics',
  'Digital Experience & Design',
  'Enterprise Solutions',
  'Business Process Automation',
  'IT Consulting & Digital Transformation',
  'Quality Engineering & Testing',
  'Managed IT & Technology Operations',
  'Engineering & Emerging Technologies',
  'Industry-Specific Solutions',
];

export default function AdminServicesManagementPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [search, setSearch] = useState('');
  const [editingService, setEditingService] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/services?all=true');
      if (res.ok) {
        const data = await res.json();
        setServices(data || []);
      }
    } catch (e) {
      console.error('Failed to load services:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const filteredServices = services.filter((s) => {
    const matchesCategory =
      selectedCategory === 'All Categories' ||
      s.categoryTitle === selectedCategory ||
      s.category === selectedCategory;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      s.title?.toLowerCase().includes(q) ||
      s.slug?.toLowerCase().includes(q) ||
      s.shortDescription?.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleEditClick = (service: any) => {
    setEditingService({
      ...service,
      benefits: service.benefits || [],
      techStack: service.techStack || [],
      faqs: service.faqs || [],
    });
  };

  const handleAddNew = () => {
    setEditingService({
      id: '',
      title: '',
      slug: '',
      category: 'Artificial Intelligence & Data',
      categoryTitle: 'Artificial Intelligence & Data',
      heroBadge: 'Enterprise Solutions',
      shortDescription: '',
      longDescription: '',
      backgroundImage: '',
      benefits: [{ title: 'Enterprise Scalability', description: 'Engineered for high-volume workloads.' }],
      techStack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
      faqs: [{ question: 'What is the delivery timeline?', answer: 'Initial architecture blueprint within 48 hours.' }],
      isPublished: true,
    });
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) {
      alert('Title is required');
      return;
    }

    setSaving(true);
    try {
      const isNew = !editingService.id;
      const url = isNew ? '/services' : `/services/${editingService.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService),
      });

      if (res.ok) {
        alert(isNew ? 'Service created successfully!' : 'Service updated successfully!');
        setEditingService(null);
        loadServices();
      } else {
        alert('Failed to save service.');
      }
    } catch (e) {
      alert('Error saving service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await adminFetch(`/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteConfirmId(null);
        loadServices();
      }
    } catch (e) {
      alert('Failed to delete service');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Services & Technical Catalog Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage 13 categories, 78 specialized services, hero visual media, tech stacks, and FAQs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/services"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
          >
            <span>View Public Catalog</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 78 services by title, slug, or keywords..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <span className="text-xs text-slate-400 font-mono whitespace-nowrap">
            Showing {filteredServices.length} / {services.length}
          </span>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
          <p className="text-xs font-semibold tracking-wider uppercase">Loading services catalog...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="py-16 text-center text-slate-400 bg-slate-900/30 border border-slate-800 rounded-2xl">
          <Layers className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <p className="text-sm font-semibold text-white">No services found</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting your search query or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id || service.slug}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-semibold truncate">
                    {service.categoryTitle || service.category || 'Engineering'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      service.isPublished !== false
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {service.isPublished !== false ? 'Live' : 'Draft'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white tracking-tight leading-snug line-clamp-1">
                  {service.title}
                </h3>

                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {service.shortDescription}
                </p>

                {service.heroBadge && (
                  <div className="mt-2.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-medium text-slate-300">
                      {service.heroBadge}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <Link
                  href={`/services/${service.slug}`}
                  target="_blank"
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </Link>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditClick(service)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-xs transition"
                    title="Edit Service"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(service.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white text-xs transition"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Delete Service</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete this service? This action is immediate and will remove it from the catalog.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Edit Modal Drawer */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-3xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-blue-400 font-bold tracking-widest">
                  {editingService.id ? 'Edit Service' : 'Create New Service'}
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {editingService.title || 'Untitled Service'}
                </h2>
              </div>
              <button
                onClick={() => setEditingService(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Parent Category</label>
                  <select
                    value={editingService.categoryTitle || editingService.category}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        categoryTitle: e.target.value,
                        category: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Publication Status</label>
                  <select
                    value={editingService.isPublished ? 'true' : 'false'}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        isPublished: e.target.value === 'true',
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="true">Published (Live on Website)</option>
                    <option value="false">Draft (Internal Only)</option>
                  </select>
                </div>
              </div>

              {/* Title, Slug & Hero Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-slate-400 font-semibold block mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={editingService.title || ''}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        title: e.target.value,
                        slug:
                          editingService.slug ||
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)/g, ''),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Hero Eyebrow Badge</label>
                  <input
                    type="text"
                    value={editingService.heroBadge || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, heroBadge: e.target.value })
                    }
                    placeholder="e.g. ENTERPRISE ENGINEERING"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Slug & Background Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">URL Route Slug *</label>
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-500">
                    <span>/services/</span>
                    <input
                      type="text"
                      required
                      value={editingService.slug || ''}
                      onChange={(e) =>
                        setEditingService({ ...editingService, slug: e.target.value })
                      }
                      className="bg-transparent text-white focus:outline-none flex-1 ml-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Background Image</label>
                  <input
                    type="text"
                    value={editingService.backgroundImage || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, backgroundImage: e.target.value })
                    }
                    placeholder="/images/services/... or media URL"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Short & Long Description */}
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Short Description (Summary)</label>
                <textarea
                  rows={2}
                  value={editingService.shortDescription || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, shortDescription: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Long Description (Detailed Overview)</label>
                <textarea
                  rows={4}
                  value={editingService.longDescription || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, longDescription: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
                />
              </div>

              {/* Tech Stack Tags */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <label className="text-slate-300 font-bold block">
                  Tech Stack Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={
                    Array.isArray(editingService.techStack)
                      ? editingService.techStack.join(', ')
                      : editingService.techStack || ''
                  }
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      techStack: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="e.g. Next.js, TypeScript, PostgreSQL, Docker, AWS"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Service Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

