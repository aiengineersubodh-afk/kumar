'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Smartphone,
  Globe,
  Palette,
  Code,
  Bot,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Layers,
  Zap,
  Lock,
  Cpu,
  Terminal,
  Activity,
  Flame,
  Clock,
  Award,
  ChevronRight,
} from 'lucide-react';
import EnquiryForm from '@/components/EnquiryForm';
import HeroVideoBackground from '@/components/HeroVideoBackground';
import { FALLBACK_SERVICES, FALLBACK_FAQS } from '@/lib/api';

const SERVICES = FALLBACK_SERVICES;
const FAQS = FALLBACK_FAQS;

const TICKER_ITEMS = [
  '⚡ Sub-Second Latency Architecture',
  '🔒 100% Client IP & Source Code Ownership',
  '🛡️ Enterprise-Grade Security & SLA Support',
  '☁️ Cloud-Native Microservices (AWS / GCP / K8s)',
  '🤖 Autonomous AI Agents & Enterprise RAG',
  '⏱️ 48-Hour Architecture Scoping Guarantee',
  '🎯 Senior Architectural Pods — Zero Outsourcing',
  '🌐 95+ Core Web Vitals & Production Hardening',
];

const SERVICE_CATEGORIES = [
  'All Disciplines',
  'Artificial Intelligence',
  'Software & Product',
  'Cloud & DevOps',
  'Cybersecurity',
  'Data Engineering',
  'Digital Experience',
  'Enterprise Solutions',
];

const METHODOLOGY_STEPS = [
  {
    step: '01',
    title: 'Discovery & Blueprinting',
    subtitle: 'Architecture & System Specs',
    description:
      'We define system constraints, operational throughput, data models, and cloud security architecture before writing a single line of code.',
    deliverables: ['System Architecture Diagram', 'Database Schema Specification', '48-Hour Delivery Roadmap'],
  },
  {
    step: '02',
    title: 'Interactive Prototyping',
    subtitle: 'Design Systems & UX Flow',
    description:
      'High-fidelity Figma prototypes, conversion-optimized interaction journeys, and comprehensive design tokens aligned with your brand identity.',
    deliverables: ['Clickable Interactive Prototype', 'Design Token System', 'User Journey Mapping'],
  },
  {
    step: '03',
    title: 'Agile Full-Stack Engineering',
    subtitle: 'Two-Week Sprint Cycles',
    description:
      'Test-driven development, automated CI/CD builds, and bi-weekly working software demonstrations with continuous code transparency.',
    deliverables: ['Production TypeScript Codebase', 'Automated Unit & E2E Tests', 'Sprint Review Demos'],
  },
  {
    step: '04',
    title: 'Production Hardening',
    subtitle: 'Security QA & Zero Downtime',
    description:
      'Concurrency stress testing, multi-device cross-browser validation, blue/green deployment orchestration, and compliance audits.',
    deliverables: ['Vulnerability Scan Audit', 'Performance Benchmark Report', 'Zero-Downtime Cutover'],
  },
  {
    step: '05',
    title: 'Telemetry & SLA Hypercare',
    subtitle: '24/7 Monitoring & Evolution',
    description:
      'Real-time APM telemetry, automated incident remediation, monthly security patch cycles, and dedicated architectural support.',
    deliverables: ['24/7 Telemetry Dashboard', 'Guaranteed SLA Resolution', 'Continuous Feature Sprints'],
  },
];

const TECH_CATEGORIES = [
  {
    category: 'Frontend & Web',
    technologies: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'GraphQL', 'WebSockets', 'HTML5/CSS3'],
  },
  {
    category: 'Mobile Engineering',
    technologies: ['iOS (Swift/SwiftUI)', 'Android (Kotlin/Compose)', 'Flutter', 'React Native', 'Offline-First Sync'],
  },
  {
    category: 'Backend & Cloud',
    technologies: ['NestJS', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'GCP'],
  },
  {
    category: 'AI & Data Systems',
    technologies: ['OpenAI API', 'Claude 3.7 Sonnet', 'LangChain', 'pgvector', 'LlamaIndex', 'Python', 'FastAPI'],
  },
  {
    category: 'DevOps & Security',
    technologies: ['GitHub Actions', 'Terraform', 'Datadog', 'Prometheus', 'Cloudflare', 'OWASP Top 10 Hardening'],
  },
];

const ICON_MAP: Record<string, any> = {
  Smartphone,
  Globe,
  Palette,
  Code,
  Bot,
  ShieldCheck,
};

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState('All Disciplines');
  const [activeTechTab, setActiveTechTab] = useState(0);
  const [heroContent, setHeroContent] = useState({
    title: 'Engineering High-Impact Digital Products for Enterprise Market Leaders',
    subtitle:
      'ManyMorgan designs, builds, and scales market-defining mobile applications, modern web platforms, custom cloud architectures, and autonomous AI automation systems that accelerate business velocity.',
    badge: 'Next-Gen Software & Digital Innovation',
    cta1Label: 'Get a Quote',
    cta1Url: '/get-a-quote',
    cta2Label: 'Discuss Your Project',
    cta2Url: '/contact',
    videoSrc: '/videos/manymorgan-hero.mp4',
    posterSrc: '/videos/hero-poster.jpg',
  });

  useEffect(() => {
    import('@/lib/api').then(({ getContent }) => {
      getContent().then((map) => {
        if (map && map['home_hero']) {
          const item = map['home_hero'];
          setHeroContent((prev) => ({
            ...prev,
            title: item.title || prev.title,
            subtitle: item.subtitle || prev.subtitle,
            badge: item.contentPayload?.badge_text || prev.badge,
            cta1Label: item.contentPayload?.primary_cta_label || prev.cta1Label,
            cta1Url: item.contentPayload?.primary_cta_url || prev.cta1Url,
            cta2Label: item.contentPayload?.secondary_cta_label || prev.cta2Label,
            cta2Url: item.contentPayload?.secondary_cta_url || prev.cta2Url,
            videoSrc: item.contentPayload?.video_src || prev.videoSrc,
            posterSrc: item.contentPayload?.poster_src || prev.posterSrc,
          }));
        }
      });
    });
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const filteredServices = SERVICES.filter((service) => {
    if (activeCategory === 'All Disciplines') return true;
    const catLow = activeCategory.toLowerCase();
    return (
      service.heroBadge?.toLowerCase().includes(catLow) ||
      service.title?.toLowerCase().includes(catLow) ||
      service.shortDescription?.toLowerCase().includes(catLow)
    );
  }).slice(0, 6);

  return (
    <div className="relative overflow-hidden bg-white text-slate-900">
      {/* 1. CINEMATIC FULL-SCREEN HERO SECTION (TCS-Inspired Full-Screen Background Video) */}
      <section
        id="hero"
        className="relative w-full min-h-screen min-h-[100svh] h-[100svh] flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6 lg:px-8 -mt-[76px] pt-[76px] bg-slate-950 text-white"
      >
        {/* Ambient Glow for Hero Video Section */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent pointer-events-none blur-3xl z-0" />
        {/* Full-Screen Autoplay Background Video with Fallbacks */}
        <HeroVideoBackground
          videoSrc={heroContent.videoSrc}
          posterSrc={heroContent.posterSrc}
        />

        {/* Hero Interactive Content (Z-10, Pointer Events Auto) */}
        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6 sm:space-y-8 py-8 sm:py-12">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 border border-slate-700/80 text-xs sm:text-sm font-semibold text-slate-100 backdrop-blur-md shadow-xl">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>{heroContent.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            {heroContent.title}
          </h1>

          {/* Supporting description */}
          <p className="text-base sm:text-xl text-slate-100 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] font-medium">
            {heroContent.subtitle}
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 sm:pt-4">
            <Link
              href={heroContent.cta1Url}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{heroContent.cta1Label}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href={heroContent.cta2Url}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-slate-200 hover:text-white bg-slate-900/70 hover:bg-slate-800/90 border border-slate-700/70 backdrop-blur-md transition-all shadow-lg shadow-black/30"
            >
              <span>{heroContent.cta2Label}</span>
            </Link>
          </div>
        </div>

        {/* Scroll Cue Indicator (Centered at bottom) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors pointer-events-auto">
          <a
            href="#capabilities"
            className="flex flex-col items-center gap-1 text-[11px] font-semibold tracking-widest uppercase text-slate-400 hover:text-blue-400 transition-colors"
            aria-label="Scroll to explore capabilities"
          >
            <span>Explore</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-blue-400" />
          </a>
        </div>
      </section>

      {/* WHITE CONTENT SURFACE (TCS-Inspired Clean Enterprise Surface) */}
      <div className="relative bg-white text-slate-900 selection:bg-blue-600 selection:text-white transition-colors duration-300">
        {/* 2. CONTINUOUS CAPABILITY PROOF TICKER */}
        <div id="capabilities" className="w-full border-y border-slate-200 bg-slate-50 py-4 overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee gap-8 items-center text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">
            {TICKER_ITEMS.concat(TICKER_ITEMS).map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs">
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. INTERACTIVE SERVICES SHOWCASE */}
        <section className="py-24 bg-white border-b border-slate-200/80 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="max-w-2xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  Core Engineering Disciplines
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Specialized technical execution across critical digital verticals
                </h2>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>View Services Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Interactive Category Filter Pills */}
            {SERVICES.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
                {SERVICE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Services Grid */}
            {SERVICES.length === 0 ? (
              <div className="p-10 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4">
                <p className="text-slate-700 font-semibold text-base">
                  Services catalog has been cleared and is ready for new service additions.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  <span>Go to Services Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => {
                  const Icon = ICON_MAP[service.iconName] || Code;
                  return (
                    <div
                      key={service.slug}
                      className="group relative p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-500 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/80">
                            {service.heroBadge}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {service.title}
                        </h3>

                        <p className="text-sm text-slate-600 leading-relaxed">
                          {service.shortDescription}
                        </p>

                        <div className="pt-2 space-y-2">
                          {service.benefits.slice(0, 2).map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span>{benefit.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          href={`/services/${service.slug}`}
                          className="text-xs font-bold text-slate-900 group-hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                        >
                          View Service Details
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                          href={`/get-a-quote?service=${encodeURIComponent(service.title)}`}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          Scope Project
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 4. THE MANYMORGAN 5-STEP ENGINEERING METHODOLOGY */}
        <section className="py-24 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Transformation Workflow
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Our 5-stage framework from architecture to scale
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                A battle-tested engineering methodology ensuring architectural precision, security, and transparent sprint cadence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {METHODOLOGY_STEPS.map((step) => (
                <div
                  key={step.step}
                  className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-mono">
                      {step.step}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                    <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                      {step.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Key Deliverables:
                    </span>
                    {step.deliverables.map((d, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="line-clamp-1">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. TECHNOLOGY CAPABILITIES MATRIX */}
        <section className="py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Modern Technology Foundations
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Enterprise engineering stack & frameworks
              </h2>
              <p className="text-sm text-slate-600">
                We engineer with modern, resilient technologies designed for low latency, zero memory leaks, and horizontal scaling.
              </p>
            </div>

            {/* Category Tabs */}
            <div className="flex justify-center gap-2 mb-8 flex-wrap">
              {TECH_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.category}
                  onClick={() => setActiveTechTab(idx)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTechTab === idx
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            {/* Tech Chips */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {TECH_CATEGORIES[activeTechTab].technologies.map((tech) => (
                <div
                  key={tech}
                  className="px-5 py-3 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-800 flex items-center gap-2 hover:border-blue-400 hover:text-blue-600 shadow-xs transition-colors"
                >
                  <Terminal className="w-4 h-4 text-blue-600" />
                  <span>{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. ENTERPRISE CREDENTIALS & GUARANTEES */}
        <section className="py-24 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Why Partner With ManyMorgan
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Built for enterprise durability, speed, and genuine transparency
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                We operate as an elite engineering force, combining technical rigor with consultative commercial alignment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-3 shadow-sm hover:shadow-md hover:border-blue-400 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Senior Architectural Pods</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every engagement is led directly by principal software architects and senior engineers—zero junior handoffs or unvetted contractors.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-3 shadow-sm hover:shadow-md hover:border-blue-400 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">100% Client IP Ownership</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You own all intellectual property, source code, CI/CD pipelines, and design files from sprint one with zero vendor lock-in.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-3 shadow-sm hover:shadow-md hover:border-blue-400 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Rapid Two-Week Sprints</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Predictable, agile delivery cycles with automated test suites and working demonstration check-ins every 14 days.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-3 shadow-sm hover:shadow-md hover:border-blue-400 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Rigorous Security QA</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  256-bit encryption, automated static code analysis, and compliance alignment across SOC2, GDPR, and HIPAA data patterns.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FAQS ACCORDION */}
        <section className="py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Frequently Asked Questions
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Everything you need to know about partnering with ManyMorgan
              </h2>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, index) => (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="text-base font-bold text-slate-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                        activeFaq === index ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {activeFaq === index && (
                    <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-200/80 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. FINAL HIGH-CONVERSION SCOPING SECTION */}
        <section className="py-24 bg-slate-50/90 border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  Direct Project Scoping
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Ready to construct your next digital breakthrough?
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Submit your project objectives or schedule an architectural consultation. Our principal team will review your requirements and provide a structured scope and timeline estimate within 24 to 48 hours.
                </p>
                <div className="space-y-3 pt-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Strict Bilateral Non-Disclosure Agreement (NDA) Protected</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Direct Access to Principal Technical Architects</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Zero Obligation, Confidential Architectural Scoping</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <EnquiryForm sourceTitle="General Project Consultation" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
