import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  Database,
  Lock,
  Activity,
  Bot,
  Code,
  Palette,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { getAllSubServices, getSubServiceBySlug } from '@/lib/servicesCatalog';
import { getServiceHeroImage } from '@/lib/serviceHeroImages';
import ServiceConsultationForm from '@/components/ServiceConsultationForm';

const ICON_MAP: Record<string, any> = {
  ShieldCheck,
  Zap,
  CheckCircle2,
  Cpu,
  Layers,
  Database,
  Lock,
  Activity,
  Bot,
  Code,
  Palette,
};

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const all = getAllSubServices();
  return all.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = getSubServiceBySlug(slug);
  if (!service) return { title: 'Service Not Found | ManyMorgan' };

  return {
    title: `${service.title} | ManyMorgan Engineering`,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = getSubServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const heroImage = getServiceHeroImage(service.slug, service.categoryTitle, service.title);

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* 1. MODERN SPLIT-HERO WITH FULL BACKGROUND IMAGE & VISIBLE ATMOSPHERIC GRADIENTS */}
      <section className="relative overflow-hidden min-h-[660px] flex items-center bg-slate-950 border-b border-slate-800">
        {/* Layer 1: High-Resolution Service Background Image (Cover & Centered, Unoptimized Direct Asset) */}
        {heroImage.hasCustomImage && heroImage.src && (
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-center pointer-events-none"
            />
          </div>
        )}

        {/* Fallback Ambient Mesh for categories without images yet */}
        {!heroImage.hasCustomImage && (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-[#0b1222] to-slate-900" />
        )}

        {/* Layer 2: Translucent Split-Hero Directional Atmosphere
            - Left: Translucent dark tone (70% opacity) ensuring strong text contrast without hiding the vibrant artwork.
            - Center: Highly translucent (30% opacity) allowing the actual artwork to remain clearly recognizable and vivid.
            - Right: Rich slate-blue atmosphere extending naturally behind and around the consultation form. */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-950/75 via-slate-950/30 via-45% to-[#080e1e]/85 pointer-events-none" />

        {/* Layer 3: Ambient blue glow orb behind right-side form container to create a unified lighting environment */}
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none z-[2]" />

        {/* Layer 4: Bottom subtle gradient fade into following content section */}
        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-slate-950/50 to-transparent pointer-events-none z-[2]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10 w-full space-y-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-300 flex-wrap drop-shadow-sm">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/services" className="hover:text-white transition-colors">
              Services
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-200 font-semibold">{service.categoryTitle}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-blue-400 font-semibold truncate max-w-[200px] sm:max-w-none">
              {service.title}
            </span>
          </nav>

          {/* 2-Column Split Hero Layout: Left Value Proposition, Right Glass Consultation Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Headline, Description & Trust Badges */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>{service.heroBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
                {service.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-400">Company</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-100 leading-relaxed max-w-2xl font-normal drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
                {service.fullDescription}
              </p>

              {/* Trust Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-700/80 backdrop-blur-xs">
                <div className="space-y-1">
                  <div className="text-xl sm:text-2xl font-black text-white flex items-center gap-1.5 drop-shadow-sm">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <span>Sub-Second</span>
                  </div>
                  <p className="text-xs text-slate-300 drop-shadow-xs">Latency &amp; High Throughput</p>
                </div>

                <div className="space-y-1">
                  <div className="text-xl sm:text-2xl font-black text-white flex items-center gap-1.5 drop-shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>100% Client IP</span>
                  </div>
                  <p className="text-xs text-slate-300 drop-shadow-xs">Zero Proprietary Lock-In</p>
                </div>

                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <div className="text-xl sm:text-2xl font-black text-white flex items-center gap-1.5 drop-shadow-sm">
                    <Lock className="w-5 h-5 text-blue-400" />
                    <span>NDA Protected</span>
                  </div>
                  <p className="text-xs text-slate-300 drop-shadow-xs">Bilateral Enterprise Terms</p>
                </div>
              </div>
            </div>

            {/* Right Column: Lead Capture Consultation Form within the Atmospheric Extension */}
            <div className="lg:col-span-5 relative">
              <ServiceConsultationForm serviceTitle={service.title} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STRATEGIC BENEFITS & CAPABILITIES */}
      <section className="py-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Technical Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Partner with ManyMorgan for {service.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Our specialized engineering pods combine deep domain expertise, rigorous security compliance, and proven architectural standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.benefits.map((b, idx) => {
              const Icon = ICON_MAP[b.icon] || CheckCircle2;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 hover:border-blue-400 hover:bg-white hover:shadow-lg transition-all duration-300 space-y-3 shadow-xs"
                >
                  <div className="p-3 rounded-2xl bg-blue-100 text-blue-600 w-fit">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{b.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. 4-STAGE ARCHITECTURAL LIFECYCLE */}
      <section className="py-20 border-b border-slate-200 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Engineering Cadence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Our 4-Stage Delivery Framework
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              From architectural blueprinting to automated deployment and hypercare monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.processSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400 transition-all space-y-4 shadow-xs hover:shadow-md"
              >
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-mono">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DELIVERABLES & TECHNOLOGY STACK */}
      <section className="py-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Key Deliverables */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Tangible Outcomes
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Key Technical Deliverables
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every client engagement produces verified, production-ready assets backed by full documentation and commercial intellectual property ownership.
              </p>

              <div className="space-y-3">
                {service.deliverables.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-sm font-semibold text-slate-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies & Frameworks */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Modern Tools
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Technology Stack &amp; Frameworks
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                We select proven, modern software frameworks that guarantee high performance, security, and developer ecosystem support.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.techStack.map((tech, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      {tech.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{tech.name}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-20 border-b border-slate-200 bg-slate-50/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Frequently Asked Questions
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Everything You Need to Know
              </h2>
            </div>

            <div className="space-y-4">
              {service.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2"
                >
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed pl-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. BOTTOM CALLOUT BANNER */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 text-center space-y-6 shadow-xs">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {service.ctaTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            {service.ctaSubtitle}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/get-a-quote"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-500/20"
            >
              <span>Schedule Free Consultations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-xs"
            >
              <span>Browse All Services</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
