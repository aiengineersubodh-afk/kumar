'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Layers,
  ChevronRight,
  Info,
  Building2,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { getCareersStatus } from '@/lib/api';
import RegisterInterestModal from '@/components/careers/RegisterInterestModal';
import CareersVideoBackground from '@/components/careers/CareersVideoBackground';

export default function CareersLandingPage() {
  const [globalStatus, setGlobalStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [isLoading, setIsLoading] = useState(true);
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [interestType, setInterestType] = useState<'INTERNSHIP' | 'RESEARCH'>('INTERNSHIP');

  const checkStatus = async () => {
    try {
      const data = await getCareersStatus();
      if (data && data.globalStatus) {
        setGlobalStatus(data.globalStatus);
      }
    } catch (err) {
      console.error('Failed to load careers status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const openInterestModal = (type: 'INTERNSHIP' | 'RESEARCH') => {
    setInterestType(type);
    setInterestModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Section with Cinematic Background Video */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden border-b border-slate-200">
        {/* Full-Screen Careers Video Background */}
        <CareersVideoBackground
          videoSrc="/videos/careers_backgound.mp4"
          posterSrc="/videos/hero-poster.jpg"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-950/60 border border-white/20 text-blue-300 backdrop-blur-md shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>ManyMorgan Careers & Research</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
              Build Your Future with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">
                ManyMorgan
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-100 leading-relaxed max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              Explore opportunities to develop practical technology skills, contribute to innovative projects, and help shape the future of digital engineering.
            </p>
          </div>
        </div>
      </section>

      {/* Main Experience Body (Clean White Background Matching Home & Services) */}
      <section className="py-16 sm:py-24 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {globalStatus === 'ACTIVE' ? (
            /* ========================================================
               ACTIVE EXPERIENCE: Two Large Primary Cards Side-by-Side
               ======================================================== */
            <div className="space-y-16">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
                  Select Opportunity Track
                </h2>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Two Pathways to Impactful Engineering
                </p>
              </div>

              {/* 2 Primary Cards Side-by-Side on Desktop, Stacked on Mobile */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* CARD A: INTERNSHIP */}
                <div className="group relative rounded-3xl bg-white border border-slate-200/90 hover:border-blue-500/60 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
                  {/* Prominent Image at Top */}
                  <div className="p-4 sm:p-5 pb-0">
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs">
                      <Image
                        src="/images/careers/internship.webp"
                        alt="ManyMorgan Internship Opportunities"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 motion-reduce:transform-none"
                      />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 sm:p-8 pt-6 space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
                            Industry Track
                          </span>
                          <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                            Internship Opportunities
                          </h3>
                        </div>
                      </div>

                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        Gain practical experience, work on real-world technology challenges, and develop your skills with opportunities across software engineering, artificial intelligence, cloud computing, data, and other technology disciplines.
                      </p>

                      {/* Disciplines preview */}
                      <div className="pt-4 border-t border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
                          Technical Focus Areas
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {[
                            'Software & Web Dev',
                            'AI & Machine Learning',
                            'Data Engineering',
                            'Cloud & DevOps',
                            'Cybersecurity',
                            'UI/UX Design',
                            'Quality Engineering',
                            'IT Consulting',
                          ].map((chip) => (
                            <span
                              key={chip}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <Link
                        href="/careers/internships"
                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-600/25 group-hover:translate-x-0.5 motion-reduce:transform-none"
                      >
                        <span>Explore Internships</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* CARD B: RESEARCH */}
                <div className="group relative rounded-3xl bg-white border border-slate-200/90 hover:border-indigo-500/60 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
                  {/* Prominent Image at Top */}
                  <div className="p-4 sm:p-5 pb-0">
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs">
                      <Image
                        src="/images/careers/research.jpg"
                        alt="ManyMorgan Research Opportunities"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 motion-reduce:transform-none"
                      />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 sm:p-8 pt-6 space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                            Innovation Track
                          </span>
                          <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                            Research Opportunities
                          </h3>
                        </div>
                      </div>

                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        Explore emerging technologies, investigate meaningful technical problems, experiment with innovative ideas, and contribute to research-driven engineering projects.
                      </p>

                      {/* Research areas preview */}
                      <div className="pt-4 border-t border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
                          Investigation Verticals
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {[
                            'Generative AI & LLMs',
                            'Autonomous Agents',
                            'Predictive ML',
                            'Intelligent Data',
                            'Distributed Systems',
                            'Privacy Engineering',
                            'HCI & UX Research',
                            'Applied Innovation',
                          ].map((chip) => (
                            <span
                              key={chip}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <Link
                        href="/careers/research"
                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/25 group-hover:translate-x-0.5 motion-reduce:transform-none"
                      >
                        <span>Explore Research</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================
               INACTIVE EXPERIENCE: Roles Closed / General Interest Page
               ======================================================== */
            <div className="space-y-12">
              <div className="p-8 sm:p-10 rounded-3xl bg-amber-50/70 border border-amber-200 shadow-sm relative overflow-hidden">
                <div className="space-y-4 text-center sm:text-left relative z-10 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <Info className="w-3.5 h-3.5" />
                    <span>Application Cycle Status</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Our Current Opportunities Are Closed
                  </h2>

                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    Thank you for your interest in building your future with ManyMorgan. We are not accepting applications for current internship or research positions at this time. We periodically review our opportunities and encourage you to register your interest for future openings.
                  </p>

                  <div className="p-4 rounded-2xl bg-white border border-amber-200/80">
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      Would you like to be considered for a future opportunity? Select a track below to submit your details and area of interest. With your consent, ManyMorgan may contact you if a relevant opportunity becomes available.
                    </p>
                  </div>
                </div>
              </div>

              {/* Two Inactive Opportunity Cards featuring the exact same image assets */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* INACTIVE CARD A: INTERNSHIP */}
                <div className="group relative rounded-3xl bg-white border border-slate-200/90 hover:border-blue-500/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
                  <div className="p-4 sm:p-5 pb-0">
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs">
                      <Image
                        src="/images/careers/internship.webp"
                        alt="ManyMorgan Internship Opportunities"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 motion-reduce:transform-none"
                      />
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 pt-6 space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs shrink-0">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
                            Internship Track
                          </span>
                          <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                            Internship Opportunities
                          </h3>
                        </div>
                      </div>

                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        Express your interest in upcoming practical engineering internships across software development, AI, cloud systems, and data analytics.
                      </p>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                        Applications currently closed. Register below to be notified when positions open.
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => openInterestModal('INTERNSHIP')}
                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-600/25 group-hover:translate-x-0.5 motion-reduce:transform-none cursor-pointer"
                      >
                        <span>Register Your Interest</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* INACTIVE CARD B: RESEARCH */}
                <div className="group relative rounded-3xl bg-white border border-slate-200/90 hover:border-indigo-500/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
                  <div className="p-4 sm:p-5 pb-0">
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs">
                      <Image
                        src="/images/careers/research.jpg"
                        alt="ManyMorgan Research Opportunities"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 motion-reduce:transform-none"
                      />
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 pt-6 space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs shrink-0">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                            Research Track
                          </span>
                          <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                            Research Opportunities
                          </h3>
                        </div>
                      </div>

                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        Express your interest in frontier research collaborations exploring AI agents, advanced neural architectures, and distributed systems.
                      </p>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                        Applications currently closed. Register below to be notified when positions open.
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => openInterestModal('RESEARCH')}
                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/25 group-hover:translate-x-0.5 motion-reduce:transform-none cursor-pointer"
                      >
                        <span>Register Your Interest</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Required Professional Assurance from Section 8 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed italic max-w-4xl mx-auto">
                  &ldquo;Submitting an expression of interest does not constitute an active job or internship application or guarantee an opportunity. If a suitable position becomes available, the ManyMorgan team may contact you using the contact details you provide.&rdquo;
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Engineering Philosophy Section (Clean Light Section Matching Services & Home) */}
      <section className="py-16 border-t border-slate-200 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900">Direct Engineering Craft</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Work directly with principal engineers and architects delivering production software for enterprise environments.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900">Zero Compromise Rigor</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We write clean, testable, maintainable systems that scale reliably from prototype to high-concurrency production.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900">Emerging Technology Focus</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Engage at the frontier of autonomous agent workflows, distributed cloud systems, and privacy-preserving architecture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* General Interest Modal */}
      <RegisterInterestModal
        isOpen={interestModalOpen}
        onClose={() => setInterestModalOpen(false)}
        defaultType={interestType}
      />
    </div>
  );
}
