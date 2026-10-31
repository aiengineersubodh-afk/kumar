import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | ManyMorgan',
  description: 'ManyMorgan Privacy Policy regarding information collection, project scoping confidentiality, and data protection practices.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
            <Shield className="w-3.5 h-3.5" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Privacy Policy</h1>
          <p className="text-xs text-slate-500">Last Revised: January 1, 2026</p>
        </div>

        <div className="prose max-w-none text-slate-600 space-y-6 text-sm leading-relaxed border-t border-slate-200 pt-8">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Introduction</h2>
            <p>
              ManyMorgan (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy and is committed to safeguarding personal and proprietary business data submitted across our web properties, project scoping forms, and customer portals. This Privacy Policy details our data collection, handling, and governance practices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Information We Collect</h2>
            <p>When you interact with our website or submit an enquiry, we may collect:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Contact Information:</strong> Full name, corporate email address, telephone number, and country code.</li>
              <li><strong>Project Scope Details:</strong> Company name, service requirements, budget projections, delivery timelines, and project specifications.</li>
              <li><strong>Voluntary Attachments:</strong> Request-for-proposal (RFP) documentation, technical wireframes, or architecture summaries.</li>
              <li><strong>Technical Identifiers:</strong> IP address hashes, browser client tokens, and telemetry collected purely for security and anti-spam verification.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. How We Use Collected Data</h2>
            <p>
              We process your information exclusively to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Prepare and deliver technical scopes, architectural blueprints, and fee proposals.</li>
              <li>Coordinate consultative meetings and telephone follow-ups.</li>
              <li>Enforce our Non-Disclosure Commitments and safeguard internal systems against fraudulent or abusive requests.</li>
              <li>Transmit periodic technical insights and engineering updates where explicit affirmative consent was granted.</li>
            </ul>
            <p className="text-blue-600 font-medium">
              We never sell, rent, or commercialize your personal or project information to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Confidentiality & Non-Disclosure (NDA)</h2>
            <p>
              All technical specifications, design assets, and business logic shared through ManyMorgan forms are treated as confidential commercial property. Formal bilateral Non-Disclosure Agreements are executed prior to deep architectural discovery.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. Security & Storage</h2>
            <p>
              We implement industry-standard cryptographic protocols, role-based access restrictions (RBAC), and Row Level Security (RLS) on our relational data stores to prevent unauthorized reading or modification.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">6. Contacting ManyMorgan Legal</h2>
            <p>
              For questions regarding this policy or to request data modification or deletion, contact our privacy governance desk at{' '}
              <a href="mailto:contact@manymorgan.com" className="text-blue-600 underline">
                contact@manymorgan.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
