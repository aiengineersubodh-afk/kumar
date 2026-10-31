'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Upload,
  Send,
  Building,
  User,
  Mail,
  Phone,
  FileText,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { submitEnquiry } from '@/lib/api';

const COUNTRY_CODES = [
  { code: '+1', country: 'US / Canada (+1)' },
  { code: '+44', country: 'United Kingdom (+44)' },
  { code: '+91', country: 'India (+91)' },
  { code: '+61', country: 'Australia (+61)' },
  { code: '+49', country: 'Germany (+49)' },
  { code: '+33', country: 'France (+33)' },
  { code: '+971', country: 'United Arab Emirates (+971)' },
  { code: '+65', country: 'Singapore (+65)' },
  { code: '+81', country: 'Japan (+81)' },
  { code: '+41', country: 'Switzerland (+41)' },
];

const SERVICES_OPTIONS = [
  'Artificial Intelligence & Data',
  'Software & Product Engineering',
  'Cloud & DevOps',
  'Cybersecurity',
  'Data Engineering & Analytics',
  'Digital Experience & Design',
  'Enterprise Solutions',
  'Business Process Automation',
  'IT Consulting & Digital Transformation',
  'Quality Engineering & Testing',
  'Managed IT & Technology Operations',
  'Engineering & Emerging Technologies',
  'Industry-Specific Solutions',
  'Multiple Engineering Services',
];

const BUDGET_OPTIONS = [
  'Under $15,000',
  '$15,000 - $35,000',
  '$35,000 - $75,000',
  '$75,000 - $150,000',
  '$150,000+',
  'Flexible / To Be Evaluated',
];

const TIMELINE_OPTIONS = [
  'Immediate (< 1 Month)',
  '1 - 3 Months',
  '3 - 6 Months',
  '6+ Months',
  'Flexible',
];

interface EnquiryFormProps {
  defaultService?: string;
  sourceTitle?: string;
}

export default function EnquiryForm({ defaultService, sourceTitle }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneCountryCode: '+1',
    phoneNumber: '',
    companyName: '',
    serviceName: defaultService || 'Website Development',
    budgetRange: '$35,000 - $75,000',
    expectedTimeline: '1 - 3 Months',
    projectDescription: '',
    marketingConsent: false,
    privacyPolicyAccepted: false,
    website_hp: '', // Anti-spam honeypot
  });

  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    enquiryNumber: string;
    message: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid work or personal email address.';
    }

    if (!formData.phoneNumber.trim() || formData.phoneNumber.trim().length < 6) {
      newErrors.phoneNumber = 'Please enter a valid telephone contact number.';
    }

    if (!formData.serviceName) {
      newErrors.serviceName = 'Please choose a primary service vertical.';
    }

    if (!formData.projectDescription.trim() || formData.projectDescription.trim().length < 15) {
      newErrors.projectDescription = 'Please provide at least 15 characters detailing your goals or scope.';
    }

    if (!formData.privacyPolicyAccepted) {
      newErrors.privacyPolicyAccepted = 'You must acknowledge the Privacy Policy to proceed.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await submitEnquiry({
        ...formData,
        fileAttachmentUrl: attachedFileName ? `uploaded://attachments/${attachedFileName}` : undefined,
      });

      if (response && response.success) {
        setSubmissionSuccess({
          enquiryNumber: response.enquiryNumber,
          message: response.message,
        });
      }
    } catch (err: any) {
      setErrors({ form: err.message || 'Submission failed. Please try again or email us directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, file: 'File exceeds maximum 10MB limit.' }));
        return;
      }
      setAttachedFileName(file.name);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.file;
        return next;
      });
    }
  };

  const handleCopyId = () => {
    if (submissionSuccess?.enquiryNumber) {
      navigator.clipboard.writeText(submissionSuccess.enquiryNumber);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phoneCountryCode: '+1',
      phoneNumber: '',
      companyName: '',
      serviceName: defaultService || 'Website Development',
      budgetRange: '$35,000 - $75,000',
      expectedTimeline: '1 - 3 Months',
      projectDescription: '',
      marketingConsent: false,
      privacyPolicyAccepted: false,
      website_hp: '',
    });
    setAttachedFileName(null);
    setSubmissionSuccess(null);
    setErrors({});
  };

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 relative">
      {/* Success Modal / State */}
      {submissionSuccess ? (
        <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5" />
              Submission Confirmed
            </span>
            <h3 className="text-2xl font-bold text-slate-900">Project Enquiry Registered</h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
              {submissionSuccess.message}
            </p>
          </div>

          {/* Reference ID Chip */}
          <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl">
            <div className="text-left">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Unique Enquiry ID
              </span>
              <span className="text-base font-mono font-bold text-blue-600">
                {submissionSuccess.enquiryNumber}
              </span>
            </div>
            <button
              onClick={handleCopyId}
              className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
              title="Copy Enquiry Reference"
            >
              {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="border-t border-slate-200 pt-6 max-w-md mx-auto text-left space-y-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-800">What will happen next:</p>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>Our principal technical director evaluates your project specifications.</li>
              <li>You will receive an automated confirmation email with our scope assessment schedule.</li>
              <li>We will propose a dedicated 30-minute architectural consultation call.</li>
            </ol>
          </div>

          <div className="pt-4">
            <button
              onClick={resetForm}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
            >
              Submit Another Project Scope
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {sourceTitle && (
            <div className="border-b border-slate-200 pb-4 mb-6">
              <h3 className="text-xl font-bold text-slate-900">Start Your Project Scope</h3>
              <p className="text-sm text-slate-500 mt-1">
                Engineering consultation for: <span className="text-blue-600 font-semibold">{sourceTitle}</span>
              </p>
            </div>
          )}

          {errors.form && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Honeypot field (hidden from genuine users) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website_hp">Do not fill this field</label>
            <input
              type="text"
              id="website_hp"
              name="website_hp"
              value={formData.website_hp}
              onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Row 1: Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full bg-slate-50 border ${
                    errors.fullName ? 'border-red-400' : 'border-slate-200'
                  } rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all`}
                />
              </div>
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                Work Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="s.jenkins@enterprise.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full bg-slate-50 border ${
                    errors.email ? 'border-red-400' : 'border-slate-200'
                  } rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Row 2: Phone with Country Code & Company Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.phoneCountryCode}
                  onChange={(e) => setFormData({ ...formData, phoneCountryCode: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shrink-0"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.country} value={c.code} className="bg-white text-slate-900">
                      {c.code}
                    </option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    placeholder="(555) 019-2834"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className={`w-full bg-slate-50 border ${
                      errors.phoneNumber ? 'border-red-400' : 'border-slate-200'
                    } rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all`}
                  />
                </div>
              </div>
              {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                Company Name <span className="text-slate-400">(Optional)</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Apex Ventures / Organization"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Service Required */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
              Service Required <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.serviceName}
              onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
            >
              {SERVICES_OPTIONS.map((srv) => (
                <option key={srv} value={srv} className="bg-white text-slate-900">
                  {srv}
                </option>
              ))}
            </select>
          </div>

          {/* Row 4: Budget Range & Timeline Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                Estimated Project Budget <span className="text-slate-400">(Optional)</span>
              </label>
              <select
                value={formData.budgetRange}
                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              >
                {BUDGET_OPTIONS.map((b) => (
                  <option key={b} value={b} className="bg-white text-slate-900">
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                Expected Timeline <span className="text-slate-400">(Optional)</span>
              </label>
              <select
                value={formData.expectedTimeline}
                onChange={(e) => setFormData({ ...formData, expectedTimeline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              >
                {TIMELINE_OPTIONS.map((t) => (
                  <option key={t} value={t} className="bg-white text-slate-900">
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5: Project Description */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Project Description & Scope <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Min. 15 characters</span>
            </div>
            <textarea
              rows={4}
              placeholder="Outline your application goals, target audience, technical requirements, or existing system architecture..."
              value={formData.projectDescription}
              onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
              className={`w-full bg-slate-50 border ${
                errors.projectDescription ? 'border-red-400' : 'border-slate-200'
              } rounded-xl p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all resize-none`}
            />
            {errors.projectDescription && (
              <p className="text-xs text-red-500 mt-1">{errors.projectDescription}</p>
            )}
          </div>

          {/* Row 6: File Attachment (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
              Project Specification or RFP File <span className="text-slate-400">(Optional, Max 10MB)</span>
            </label>
            <div className="relative border border-dashed border-slate-300 rounded-xl p-4 hover:border-blue-400 transition-colors flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <Upload className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-slate-600">
                  {attachedFileName ? (
                    <span className="font-semibold text-blue-600 flex items-center gap-1.5">
                      <FileText className="w-4 h-4" /> {attachedFileName}
                    </span>
                  ) : (
                    'Attach PDF, Word document, or archive (Optional)'
                  )}
                </span>
              </div>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-700 bg-slate-200/80 px-3 py-1.5 rounded-lg pointer-events-none">
                Browse
              </span>
            </div>
            {errors.file && <p className="text-xs text-red-500 mt-1">{errors.file}</p>}
          </div>

          {/* Row 7: Consents & Acknowledgements */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.privacyPolicyAccepted}
                onChange={(e) =>
                  setFormData({ ...formData, privacyPolicyAccepted: e.target.checked })
                }
                className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white cursor-pointer"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                I acknowledge and accept ManyMorgan&apos;s{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline underline-offset-2" target="_blank">
                  Privacy Policy
                </Link>{' '}
                and consent to processing my project details for consultative scoping.{' '}
                <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.privacyPolicyAccepted && (
              <p className="text-xs text-red-500 ml-7">{errors.privacyPolicyAccepted}</p>
            )}

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.marketingConsent}
                onChange={(e) =>
                  setFormData({ ...formData, marketingConsent: e.target.checked })
                }
                className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white cursor-pointer"
              />
              <span className="text-xs text-slate-500 leading-relaxed">
                Send me occasional technical research, whitepapers, and engineering updates from ManyMorgan (Optional).
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 shadow-xl shadow-blue-600/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Encrypting & Registering Scope...</span>
                </>
              ) : (
                <>
                  <span>Submit Project Scope</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-3 flex items-center justify-center gap-1.5">
              <span>🔒 256-Bit Encrypted Submission</span>
              <span>&bull;</span>
              <span>Bilateral NDA Standard Guaranteed</span>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
