import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms and Conditions | ManyMorgan',
  description: 'Terms and Conditions governing the use of ManyMorgan web properties and engagement consultation scoping.',
};

export default function TermsPage() {
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
            <FileText className="w-3.5 h-3.5" />
            <span>Commercial Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Terms and Conditions</h1>
          <p className="text-xs text-slate-500">Last Revised: January 1, 2026</p>
        </div>

        <div className="prose max-w-none text-slate-600 space-y-6 text-sm leading-relaxed border-t border-slate-200 pt-8">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the website operated by ManyMorgan (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;), or by submitting project information through our forms, you agree to be bound by these Terms and Conditions and our Privacy Policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Scope of Web Services</h2>
            <p>
              The content provided on this website is for informational and consultation scoping purposes regarding ManyMorgan engineering capabilities, including Mobile App Development, Website Development, UI/UX Design, Custom Software Development, AI Integration and Automation, and Website Maintenance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Intellectual Property Rights</h2>
            <p>
              All trademarks, service marks, copy, graphics, and interface code on this website remain the proprietary intellectual property of ManyMorgan.
            </p>
            <p>
              For formal client development projects, intellectual property terms are governed by individual Master Services Agreements (MSAs), wherein 100% of custom developed source code, design files, and technical assets are assigned unconditionally to the client upon settlement of contractual milestones.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. User Submissions & Accuracy</h2>
            <p>
              You warrant that any project materials, RFPs, or technical descriptions submitted through our forms do not infringe upon third-party rights and represent legitimate business enquiries. We reserve the right to decline project proposals at our sole discretion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. Limitation of Liability</h2>
            <p>
              In no event shall ManyMorgan be liable for indirect, incidental, special, consequential, or punitive damages arising from the use of this website or initial scoping estimates prior to execution of a formal commercial contract.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">6. Inquiries</h2>
            <p>
              For inquiries regarding these Terms and Conditions, reach out to ManyMorgan at{' '}
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
