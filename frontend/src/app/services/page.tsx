'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  ChevronDown,
  ArrowRight,
  Bot,
  Code,
  Server,
  ShieldCheck,
  Database,
  Palette,
  Building,
  Cpu,
  Compass,
  CheckCircle2,
  Building2,
  Layers,
} from 'lucide-react';
import { SERVICE_CATEGORIES, ServiceCategory } from '@/lib/servicesCatalog';

const ICON_MAP: Record<string, any> = {
  Bot,
  Code,
  Server,
  ShieldCheck,
  Database,
  Palette,
  Building,
  Cpu,
  Compass,
  CheckCircle2,
  Building2,
};

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCatId, setExpandedCatId] = useState<string | null>('ai-data');

  const toggleCategory = (catId: string) => {
    setExpandedCatId((prev) => (prev === catId ? null : catId));
  };

  // Filter categories and sub-services based on search query
  const filteredCategories = SERVICE_CATEGORIES.map((cat) => {
    if (!searchQuery.trim()) return cat;
    const matchCat = cat.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchedSubs = cat.subServices.filter((s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matchCat) return cat;
    if (matchedSubs.length > 0) {
      return { ...cat, subServices: matchedSubs };
    }
    return null;
  }).filter(Boolean) as ServiceCategory[];

  // Column 1 and Column 2 split (matching user's drawing)
  const col1 = filteredCategories.filter((_, idx) => idx % 2 === 0);
  const col2 = filteredCategories.filter((_, idx) => idx % 2 === 1);

  const renderCategoryBox = (cat: ServiceCategory) => {
    const isExpanded = expandedCatId === cat.id || searchQuery.trim().length > 0;
    const Icon = ICON_MAP[cat.iconName] || Code;

    return (
      <div
        key={cat.id}
        className="rounded-3xl border border-slate-200/90 bg-white overflow-hidden transition-all duration-200 hover:border-blue-400 shadow-xs hover:shadow-md"
      >
        {/* Category Header Card */}
        <div
          onClick={() => toggleCategory(cat.id)}
          className={`flex items-center justify-between p-6 cursor-pointer transition-colors ${
            isExpanded ? 'bg-blue-50/70 text-slate-900' : 'hover:bg-slate-50/80 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`p-3 rounded-2xl ${isExpanded ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {cat.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                {cat.subServices.length} Specialized Disciplines
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs font-semibold text-blue-600">
              {isExpanded ? 'Collapse' : 'Explore'}
            </span>
            <div className={`p-1.5 rounded-full bg-slate-100 text-slate-600 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-blue-600' : ''}`}>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Expandable Sub-Services Grid */}
        {isExpanded && (
          <div className="p-6 bg-slate-50/70 border-t border-slate-200 space-y-3 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cat.subServices.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/services/${sub.slug}`}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                      {sub.heroBadge}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {sub.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {sub.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500 group-hover:text-blue-600">
                    <span>View Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            Core Disciplines &amp; Specializations
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Enterprise Services Directory
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Click any discipline category below to reveal all associated specialized service fields, or select a sub-service to inspect detailed specifications and schedule an architectural consultation.
          </p>

          {/* Quick Search */}
          <div className="max-w-md mx-auto relative pt-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all 78 specialized disciplines..."
              className="w-full pl-10 pr-4 py-3 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* 2-Column Category Grid Matching User Handwritten Wireframe */}
        {filteredCategories.length === 0 ? (
          <div className="text-center p-12 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
            <Layers className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No matching services found</h3>
            <p className="text-xs text-slate-500">Try a different keyword or reset search.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Clear search query
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Column 1 */}
            <div className="space-y-6">
              {col1.map((cat) => renderCategoryBox(cat))}
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              {col2.map((cat) => renderCategoryBox(cat))}
            </div>
          </div>
        )}

        {/* Bottom Consultation Strip */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-extrabold text-slate-900">
              Need a Custom Multi-Disciplinary Architecture?
            </h3>
            <p className="text-sm text-slate-600 max-w-xl">
              ManyMorgan constructs custom hybrid delivery teams combining AI, Cloud, Software, and Security into a cohesive sprint framework.
            </p>
          </div>

          <Link
            href="/get-a-quote"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap"
          >
            <span>Request Enterprise Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
