'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { submitEnquiry } from '@/lib/api';

const COUNTRY_CODES = [
  { code: '+91', country: 'India (+91)' },
  { code: '+1', country: 'US / Canada (+1)' },
  { code: '+44', country: 'UK (+44)' },
  { code: '+61', country: 'Australia (+61)' },
  { code: '+49', country: 'Germany (+49)' },
  { code: '+971', country: 'UAE (+971)' },
  { code: '+65', country: 'Singapore (+65)' },
  { code: '+41', country: 'Switzerland (+41)' },
];

const BUDGET_RANGES = [
  'Under $15,000',
  '$15,000 - $35,000',
  '$35,000 - $75,000',
  '$75,000 - $150,000',
  '$150,000+',
  'Flexible / To Be Evaluated',
];

interface ServiceConsultationFormProps {
  serviceTitle: string;
}

export default function ServiceConsultationForm({ serviceTitle }: ServiceConsultationFormProps) {
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  // Math Captcha (Random 1 to 15 generator)
  const [captchaNum1, setCaptchaNum1] = useState(1);
  const [captchaNum2, setCaptchaNum2] = useState(3);
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 15) + 1;
    const n2 = Math.floor(Math.random() * 15) + 1;
    setCaptchaNum1(n1);
    setCaptchaNum2(n2);
    setCaptchaAnswer('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiryNumber, setSubmittedEnquiryNumber] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Please provide your contact phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid work email address.');
      return;
    }
    if (parseInt(captchaAnswer.trim(), 10) !== captchaNum1 + captchaNum2) {
      setErrorMessage(`Security verification incorrect: What is ${captchaNum1} + ${captchaNum2}?`);
      generateCaptcha();
      return;
    }

    setIsSubmitting(true);
    try {
      const finalDesc = projectDescription.trim().length >= 15
        ? projectDescription.trim()
        : `Consultation request and architectural discovery for ${serviceTitle}`;

      const res = await submitEnquiry({
        fullName,
        email,
        phoneCountryCode: countryCode,
        phoneNumber,
        serviceName: serviceTitle,
        budgetRange: budgetRange || 'Flexible / To Be Evaluated',
        expectedTimeline: '1 - 3 Months',
        projectDescription: finalDesc,
        privacyPolicyAccepted: true,
      });

      if (res.success) {
        setSubmittedEnquiryNumber(res.enquiryNumber);
      } else {
        setErrorMessage(res.message || 'Submission failed. Please try again.');
        generateCaptcha();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
      generateCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedEnquiryNumber) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-xl border border-blue-500/40 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-2xl shadow-blue-950/50 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Consultation Request Received
          </span>
          <h3 className="text-2xl font-extrabold text-white">
            Thank You, {fullName.split(' ')[0]}!
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
            Our principal solutions architect for <strong className="text-white">{serviceTitle}</strong> will review your technical requirements and respond within 24-48 hours.
          </p>
        </div>

        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-400 font-mono">
          <span>Reference ID: </span>
          <strong className="text-blue-400">{submittedEnquiryNumber}</strong>
        </div>

        <button
          onClick={() => {
            setSubmittedEnquiryNumber(null);
            setFullName('');
            setPhoneNumber('');
            setEmail('');
            setProjectDescription('');
            generateCaptcha();
          }}
          className="text-xs text-slate-400 hover:text-white underline underline-offset-4 cursor-pointer transition-colors"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="relative bg-slate-900/70 sm:bg-slate-900/75 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 space-y-5 text-white">
      {/* Subtle top interior glow line */}
      <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent pointer-events-none" />

      {/* Card Header */}
      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Let&apos;s Discuss Your Project Vision
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Tell us about your project idea and get expert guidance on the right technology, approach, and next steps for <strong className="text-blue-400 font-semibold">{serviceTitle}</strong>.
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            Name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:bg-slate-950 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            Contact Number <span className="text-red-400">*</span>
          </label>
          <div className="flex rounded-xl overflow-hidden border border-slate-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-slate-950/70">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="bg-slate-900 text-slate-200 text-xs px-3 py-3 border-r border-slate-700 focus:outline-none cursor-pointer"
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code} className="bg-slate-900 text-slate-200">
                  {c.country}
                </option>
              ))}
            </select>
            <input
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter Your Number*"
              className="flex-1 px-4 py-3 bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Work Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            Work Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email Address*"
            className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:bg-slate-950 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Budget Range Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            Budget Range
          </label>
          <select
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-slate-950 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
          >
            <option value="" className="bg-slate-900 text-slate-400">
              Select a Budget Range
            </option>
            {BUDGET_RANGES.map((b) => (
              <option key={b} value={b} className="bg-slate-900 text-white">
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Describe Your Project */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            Describe your project <span className="text-slate-400 font-normal">(Help us come back better prepared)</span>
          </label>
          <textarea
            rows={3}
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Tell us about goals, technical expectations, or current bottlenecks..."
            className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:bg-slate-950 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
          />
        </div>

        {/* Fast 2-Minute Response & NDA Protected Badge */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-300 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Fast 2-minute response, fully <strong className="text-white">NDA-protected</strong>.</span>
        </div>

        {/* Math Captcha Verification + Submit Button Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {/* Captcha */}
          <div className="w-full sm:w-auto flex items-center gap-2 bg-slate-950/70 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-300">
            <span>{captchaNum1} + {captchaNum2} =</span>
            <input
              type="text"
              required
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              placeholder="?"
              className="w-12 px-2 py-1 bg-slate-900 text-white text-center rounded border border-slate-600 focus:outline-none focus:border-blue-500 text-sm font-bold"
            />
          </div>

          {/* Consultation Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Get a Project Consultation</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
