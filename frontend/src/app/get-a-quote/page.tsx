import React from 'react';
import { Sparkles, Clock, Award, Lock } from 'lucide-react';
import EnquiryForm from '@/components/EnquiryForm';

export const metadata = {
  title: 'Get a Quote | Discuss Your Project | ManyMorgan',
  description:
    'Submit your project details for an architectural evaluation, timeline estimation, and comprehensive technical proposal from ManyMorgan.',
};

export default function GetAQuotePage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            Confidential Project Scoping
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Discuss Your Project with ManyMorgan
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Fill out the project scope details below. Our principal software engineering leadership will review your goals and deliver an architectural roadmap and scoping estimate within 24 to 48 hours.
          </p>
        </div>

        {/* Form and Scoping Assurances */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs space-y-5">
              <h2 className="text-xl font-bold text-slate-900">Our Scoping Commitment</h2>
              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block text-sm">256-Bit Encrypted & NDA Protected</strong>
                    <span>Your technical diagrams, proprietary ideas, and business specifications remain strictly confidential.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block text-sm">Guaranteed 48-Hour Turnaround</strong>
                    <span>Receive a structured proposal containing architecture recommendations, milestone schedules, and budget bands.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block text-sm">Direct Architect Collaboration</strong>
                    <span>You engage directly with our principal engineers and system architects—not sales reps or commission intermediaries.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">Preferred engagement models:</p>
                <p>&bull; Dedicated Engineering Pod (Retainer)</p>
                <p>&bull; Fixed-Milestone Product Build</p>
                <p>&bull; 24/7 SLA Site Reliability & Maintenance</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <EnquiryForm sourceTitle="Enterprise Project Scoping" />
          </div>
        </div>
      </div>
    </div>
  );
}
