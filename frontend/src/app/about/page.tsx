'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Target,
  ArrowRight,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { getContent } from '@/lib/api';

export default function AboutPage() {
  const [content, setContent] = useState({
    badge: 'Our Heritage & Philosophy',
    title: 'Pioneering Digital Craftsmanship at Enterprise Scale',
    subtitle:
      'ManyMorgan was founded on a singular conviction: that modern digital products require an uncompromising union of software engineering rigor and human-centered design craft.',
    pillars: [
      {
        title: 'Architectural Rigor',
        description:
          'We reject brittle shortcuts. Our systems are engineered using domain-driven design, clean architecture, and exhaustive automated test coverage.',
      },
      {
        title: 'Commercial Impact',
        description:
          'Technology serves business outcomes. Every sprint and architectural decision is aligned with conversion velocity, operational efficiency, and ROI.',
      },
      {
        title: 'Radical Transparency',
        description:
          'No hidden costs or fabricated timelines. You collaborate directly with our engineering architects with real-time sprint boards and direct code access.',
      },
      {
        title: 'Senior Engineering Pods',
        description:
          'Every client initiative is powered by dedicated cross-functional pods led by seasoned technology veterans with deep delivery track records.',
      },
    ],
    missionTitle: 'To empower visionary enterprises with resilient software assets.',
    missionDescription:
      'In an era defined by rapid technological obsolescence, ManyMorgan engineers software designed to endure. We bridge the gap between ambitious business ideas and scalable production infrastructure, ensuring your digital flagships continuously evolve alongside market demands.',
    values: [
      {
        title: 'Zero Vendor Lock-in',
        description: 'You retain 100% intellectual property ownership and direct repository access at all times.',
      },
      {
        title: 'Security & Compliance First',
        description: 'Architectures aligned with SOC2, GDPR, HIPAA, and OWASP Top 10 security standards.',
      },
      {
        title: 'Post-Launch Engineering Hypercare',
        description: 'Continuous site reliability engineering, telemetry monitoring, and proactive updates.',
      },
    ],
  });

  useEffect(() => {
    getContent().then((map) => {
      if (map && map['about_overview']) {
        const item = map['about_overview'];
        const payload = item.contentPayload || {};
        setContent((prev) => ({
          badge: payload.badge_text || prev.badge,
          title: item.title || prev.title,
          subtitle: item.subtitle || prev.subtitle,
          pillars: Array.isArray(payload.pillars) && payload.pillars.length > 0 ? payload.pillars : prev.pillars,
          missionTitle: payload.mission_title || prev.missionTitle,
          missionDescription: payload.mission_description || prev.missionDescription,
          values: Array.isArray(payload.values) && payload.values.length > 0 ? payload.values : prev.values,
        }));
      }
    });
  }, []);

  const pillarIcons = [Cpu, Target, ShieldCheck, Users];

  return (
    <div className="bg-white text-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            {content.badge}
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
            {content.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.pillars.map((pillar, i) => {
            const IconComponent = pillarIcons[i % pillarIcons.length];
            return (
              <div
                key={i}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-400 transition-all space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{pillar.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mission & Values */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Our Core Mission
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              {content.missionTitle}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {content.missionDescription}
            </p>
          </div>

          <div className="lg:col-span-6 space-y-3">
            {content.values.map((val, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-sm text-slate-900 block">{val.title}</strong>
                  <span className="text-xs text-slate-600">{val.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Ready to partner with an elite engineering team?
          </h2>
          <div className="flex justify-center gap-4">
            <Link
              href="/get-a-quote"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25 transition-all"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs transition-colors"
            >
              Contact ManyMorgan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
