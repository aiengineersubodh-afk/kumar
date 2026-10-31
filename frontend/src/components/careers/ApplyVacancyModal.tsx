'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  Clock,
  MapPin,
  Calendar,
  Copy,
  Check,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { submitVacancyApplication } from '@/lib/api';

interface OpportunityData {
  id: string;
  title: string;
  type: 'INTERNSHIP' | 'RESEARCH';
  technicalField: string;
  duration?: string;
  workMode?: string;
  deadline?: string;
}

interface ApplyVacancyModalProps {
  opportunity: OpportunityData | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenInterest?: (type: 'INTERNSHIP' | 'RESEARCH') => void;
}

export default function ApplyVacancyModal({
  opportunity,
  isOpen,
  onClose,
  onOpenInterest,
}: ApplyVacancyModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [presentAddress, setPresentAddress] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInactiveConflict, setIsInactiveConflict] = useState(false);
  const [successReference, setSuccessReference] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !opportunity) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size <= 5 MB (5 * 1024 * 1024)
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds 5 MB. Please upload a smaller document.');
      setSelectedFile(null);
      return;
    }

    // Check extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setFileError('Only PDF and DOCX documents are accepted.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsInactiveConflict(false);

    // Validation
    if (!fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 5) {
      setErrorMessage('Please enter a valid phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!presentAddress.trim()) {
      setErrorMessage('Present address is required.');
      return;
    }
    if (!selectedFile) {
      setErrorMessage('Please upload your CV/resume in PDF or DOCX format (max 5 MB).');
      return;
    }
    if (!consentAccepted) {
      setErrorMessage('Please confirm your consent for recruitment information processing.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('opportunityId', opportunity.id);
      formData.append('fullName', fullName.trim());
      formData.append('phone', phone.trim());
      formData.append('email', email.trim());
      formData.append('presentAddress', presentAddress.trim());
      if (linkedInUrl.trim()) formData.append('linkedInUrl', linkedInUrl.trim());
      if (githubUrl.trim()) formData.append('githubUrl', githubUrl.trim());
      if (portfolioUrl.trim()) formData.append('portfolioUrl', portfolioUrl.trim());
      if (coverNote.trim()) formData.append('coverNote', coverNote.trim());
      formData.append('consentAccepted', 'true');
      formData.append('resume', selectedFile);

      const res = await submitVacancyApplication(formData);
      setSuccessReference(res.referenceNumber);
    } catch (err: any) {
      if (err.status === 409) {
        setIsInactiveConflict(true);
        setErrorMessage(
          'Applications for current roles are closed at this time. You are welcome to submit an expression of interest for future opportunities.'
        );
      } else {
        setErrorMessage(err.message || 'Application submission failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyReference = () => {
    if (successReference) {
      navigator.clipboard.writeText(successReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetAndClose = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setPresentAddress('');
    setLinkedInUrl('');
    setGithubUrl('');
    setPortfolioUrl('');
    setCoverNote('');
    setConsentAccepted(false);
    setSelectedFile(null);
    setFileError(null);
    setErrorMessage(null);
    setIsInactiveConflict(false);
    setSuccessReference(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-blue-950/50 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-slate-800 flex items-start justify-between bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/30">
          <div className="space-y-2 pr-6">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-600/20 text-blue-400 border border-blue-500/30">
                {opportunity.type === 'INTERNSHIP' ? 'Internship Application' : 'Research Application'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {opportunity.technicalField}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Apply to ManyMorgan
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Role: <span className="text-white font-semibold">{opportunity.title}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={resetAndClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-7 max-h-[75vh] overflow-y-auto">
          {successReference ? (
            /* SUCCESS STATE */
            <div className="py-6 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-black text-white">Application Submitted Successfully</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Thank you for your interest in ManyMorgan. Your application has been received. Please keep the reference number below for your records.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl max-w-md mx-auto flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Application Reference
                  </span>
                  <p className="text-lg font-black tracking-wide text-blue-400 font-mono">
                    {successReference}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyReference}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div
                  className={`p-4 rounded-2xl border text-sm flex items-start gap-3 ${
                    isInactiveConflict
                      ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                      : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                  }`}
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="leading-snug">{errorMessage}</p>
                    {isInactiveConflict && onOpenInterest && (
                      <button
                        type="button"
                        onClick={() => {
                          const type = opportunity.type;
                          resetAndClose();
                          onOpenInterest(type);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4"
                      >
                        <span>Register your interest for future opportunities</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Present Address *</label>
                  <input
                    type="text"
                    required
                    value={presentAddress}
                    onChange={(e) => setPresentAddress(e.target.value)}
                    placeholder="City, State / Country"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* CV / Resume Upload */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">CV / Resume Upload *</label>
                  <span className="text-[11px] text-slate-400">PDF, DOCX (Max 5 MB)</span>
                </div>

                {!selectedFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-blue-500/80 rounded-2xl p-5 text-center cursor-pointer transition-all bg-slate-950/40 hover:bg-slate-950/80 group"
                  >
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-400 mx-auto mb-2 transition-colors" />
                    <p className="text-xs sm:text-sm font-semibold text-slate-300">
                      Click to browse or drag and drop your resume
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      File signature verified upon upload
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white truncate max-w-[280px] sm:max-w-md">
                          {selectedFile.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-xs font-semibold text-rose-400 hover:text-rose-300 px-2 py-1 rounded-md hover:bg-rose-950/30"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {fileError && <p className="text-xs text-rose-400 mt-1">{fileError}</p>}
              </div>

              {/* Optional Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">LinkedIn (optional)</label>
                  <input
                    type="url"
                    value={linkedInUrl}
                    onChange={(e) => setLinkedInUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">GitHub (optional)</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">Portfolio (optional)</label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://yourportfolio.dev"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Cover Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Cover Note / Introduction (optional)
                </label>
                <textarea
                  rows={3}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Share a brief introduction or highlight project experiences relevant to this opportunity..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Mandatory Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors">
                  <input
                    type="checkbox"
                    required
                    checked={consentAccepted}
                    onChange={(e) => setConsentAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                  />
                  <span className="text-xs text-slate-400 leading-relaxed">
                    I confirm that I have read the privacy notice and agree to ManyMorgan processing my application details and resume for recruitment and evaluation purposes.
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={resetAndClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-600/30"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <span>Submit Application</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
