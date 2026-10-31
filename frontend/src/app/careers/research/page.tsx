'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Brain,
  Bot,
  TrendingUp,
  Network,
  Cpu,
  Lock,
  Eye,
  Layers,
  ArrowRight,
  Search,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  Loader2,
  ChevronRight,
  Inbox,
} from 'lucide-react';
import { getCareersStatus, getPublicOpportunities } from '@/lib/api';
import { RESEARCH_AREAS, TrackItem } from '@/lib/careersCatalog';
import ApplyVacancyModal from '@/components/careers/ApplyVacancyModal';
import RegisterInterestModal from '@/components/careers/RegisterInterestModal';

const ICON_MAP: Record<string, any> = {
  Brain,
  Bot,
  TrendingUp,
  Network,
  Cpu,
  Lock,
  Eye,
  Layers,
};

export default function ResearchCareersPage() {
  const [globalStatus, setGlobalStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [selectedField, setSelectedField] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [activeOpportunity, setActiveOpportunity] = useState<any | null>(null);
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [interestDefaultDomain, setInterestDefaultDomain] = useState('Generative AI & LLM Research');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, oppsRes] = await Promise.all([
        getCareersStatus(),
        getPublicOpportunities({ type: 'RESEARCH', field: selectedField, search: searchQuery }),
      ]);
      if (statusRes?.globalStatus) setGlobalStatus(statusRes.globalStatus);
      setOpportunities(oppsRes || []);
    } catch (err) {
      console.error('Failed to load research opportunities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedField]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const openApply = (opp: any) => {
    setActiveOpportunity(opp);
    setApplyModalOpen(true);
  };

  const openInterestForArea = (areaTitle: string) => {
    setInterestDefaultDomain(areaTitle);
    setInterestModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Page Header */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-slate-200 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/careers" className="hover:text-indigo-600 transition-colors">
              Careers
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-indigo-600 font-bold">Research</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Applied Research & Innovation</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Research Opportunities
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Explore emerging technologies, investigate meaningful technical problems, experiment with innovative ideas, and contribute to research-driven engineering projects.
            </p>
          </div>
        </div>
      </section>

      {/* Global Status Alert when Inactive */}
      {globalStatus === 'INACTIVE' && (
        <div className="bg-amber-50 border-b border-amber-200 py-4 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-amber-900">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Applications for current roles are closed. You can register your interest to be considered for future openings.
              </span>
            </div>
            <button
              onClick={() => openInterestForArea('Generative AI & LLM Research')}
              className="px-4 py-1.5 rounded-lg font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shrink-0"
            >
              Register Your Interest
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* 8 Research Areas Grid */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Research Areas & Investigation Verticals
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Our core investigative domains targeting applied innovation and computer science frontiers
                </p>
              </div>

              {/* Area filter pill */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setSelectedField('All')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedField === 'All'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  All Areas ({opportunities.length} active)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {RESEARCH_AREAS.map((area) => {
                const Icon = ICON_MAP[area.icon] || Sparkles;
                const isFiltered = selectedField === area.title;
                const areaOpps = opportunities.filter((o) => o.technicalField === area.title);

                return (
                  <div
                    key={area.id}
                    className={`rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between ${
                      isFiltered
                        ? 'bg-indigo-50/70 border-indigo-500 shadow-md'
                        : 'bg-slate-50 border-slate-200/90 hover:border-indigo-400 hover:shadow-sm'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        {areaOpps.length > 0 && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 border border-emerald-300 text-emerald-800">
                            {areaOpps.length} {areaOpps.length === 1 ? 'Project' : 'Projects'}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-slate-900 tracking-tight">
                          {area.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {area.shortDescription}
                        </p>
                      </div>

                      {/* Skills Tags */}
                      <div className="pt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                          Research Focus
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {area.skills.slice(0, 4).map((topic) => (
                            <span
                              key={topic}
                              className="px-2 py-0.5 rounded text-[11px] bg-white border border-slate-200 text-slate-700 font-medium"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => openInterestForArea(area.title)}
                        className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Apply Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Published Opportunities Section */}
          <div className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Available Published Research Projects
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {selectedField === 'All'
                    ? 'All active research roles currently accepting proposals and applications'
                    : `Active projects in ${selectedField}`}
                </p>
              </div>

              {/* Search */}
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 w-56 shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>

            {isLoading ? (
              <div className="py-16 text-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-600 mt-2">Loading research opportunities...</p>
              </div>
            ) : opportunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {opportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 space-y-5 hover:border-indigo-400 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {opp.technicalField}
                        </span>

                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          {opp.workMode && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {opp.workMode}
                            </span>
                          )}
                          {opp.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {opp.duration}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-900">{opp.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {opp.description}
                        </p>
                      </div>

                      {/* Skills */}
                      {opp.skills && opp.skills.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Required Domain Competencies
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {opp.skills.map((skill: string) => (
                              <span
                                key={skill}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Eligibility Criteria (if provided) */}
                      {opp.eligibility && (
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                          <span className="font-bold text-slate-800">Eligibility Criteria:</span>
                          <p className="text-slate-600 leading-relaxed">{opp.eligibility}</p>
                        </div>
                      )}

                      {/* Responsibilities (if provided) */}
                      {opp.responsibilities && opp.responsibilities.length > 0 && (
                        <div className="space-y-1 text-xs">
                          <span className="font-bold text-slate-800">Research Focus & Responsibilities:</span>
                          <ul className="space-y-1 text-slate-600 list-disc list-inside">
                            {opp.responsibilities.slice(0, 3).map((resp: string, idx: number) => (
                              <li key={idx}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Deadline (if provided) */}
                      {opp.deadline && (
                        <div className="flex items-center gap-2 text-xs text-amber-700 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            Deadline: {new Date(opp.deadline).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                      {globalStatus === 'ACTIVE' ? (
                        <button
                          type="button"
                          onClick={() => openApply(opp)}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/25 hover:scale-[1.02]"
                        >
                          <span>Apply Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openInterestForArea(opp.technicalField)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                          <span>Register Interest</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => openInterestForArea(opp.technicalField)}
                        className="text-xs text-slate-500 hover:text-slate-800"
                      >
                        Register for Future Research
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="p-10 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-5 max-w-xl mx-auto shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <Inbox className="w-7 h-7" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    No Research Projects Currently Published
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    There are no research projects currently open for application in this vertical. You can submit an expression of interest to be considered for upcoming research initiatives.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => openInterestForArea(selectedField === 'All' ? 'Generative AI & LLM Research' : selectedField)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/25"
                  >
                    <span>Register Your Interest</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Apply Vacancy Modal */}
      <ApplyVacancyModal
        opportunity={activeOpportunity}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        onOpenInterest={(type) => openInterestForArea('Generative AI & LLM Research')}
      />

      {/* Register Interest Modal */}
      <RegisterInterestModal
        isOpen={interestModalOpen}
        onClose={() => setInterestModalOpen(false)}
        defaultType="RESEARCH"
        defaultDomain={interestDefaultDomain}
      />
    </div>
  );
}
