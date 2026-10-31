'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Sparkles } from 'lucide-react';
import EnquiryForm from '@/components/EnquiryForm';
import { getContent } from '@/lib/api';

export default function ContactPage() {
  const [contactData, setContactData] = useState({
    badge: 'Global Engineering Operations',
    title: 'Connect with Our Technical Leadership',
    subtitle:
      'Whether evaluating a ground-up platform build or seeking SLA-backed engineering maintenance, our solutions architects are ready to assist.',
    primaryEmail: 'projects@manymorgan.com',
    secondaryEmail: 'contact@manymorgan.com',
    telephone: '+1 (800) 555-0199',
    operatingHours: 'Monday - Friday, 9:00 AM - 6:00 PM EST',
    slaHours: 'Active SLA Clients: 24/7/365 On-Call Synthetic Monitoring',
    physicalAddress: 'ManyMorgan Engineering HQ\nGlobal Digital Operations & Solutions Delivery',
  });

  useEffect(() => {
    getContent().then((map) => {
      if (map && map['contact_details']) {
        const item = map['contact_details'];
        const payload = item.contentPayload || {};
        setContactData((prev) => ({
          badge: payload.badge_text || prev.badge,
          title: item.title || prev.title,
          subtitle: item.subtitle || prev.subtitle,
          primaryEmail: payload.primary_email || prev.primaryEmail,
          secondaryEmail: payload.secondary_email || prev.secondaryEmail,
          telephone: payload.telephone || prev.telephone,
          operatingHours: payload.operating_hours || prev.operatingHours,
          slaHours: payload.sla_hours || prev.slaHours,
          physicalAddress: payload.physical_address || prev.physicalAddress,
        }));
      }
    });
  }, []);

  return (
    <div className="bg-white text-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            {contactData.badge}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {contactData.title}
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            {contactData.subtitle}
          </p>
        </div>

        {/* Contact Cards & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Project Enquiries & RFPs</h3>
              <p className="text-xs text-slate-600">
                Direct channel to our technical scoping and solutions design desk:
              </p>
              <a
                href={`mailto:${contactData.primaryEmail}`}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 block"
              >
                {contactData.primaryEmail}
              </a>
              {contactData.secondaryEmail && (
                <a
                  href={`mailto:${contactData.secondaryEmail}`}
                  className="text-xs text-slate-500 hover:text-slate-700 block"
                >
                  {contactData.secondaryEmail}
                </a>
              )}
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Direct Telephone Consultation</h3>
              <p className="text-xs text-slate-600">
                Speak directly with an engagement coordinator:
              </p>
              <a
                href={`tel:${contactData.telephone.replace(/[^0-9+]/g, '')}`}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 block"
              >
                {contactData.telephone}
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Operating Schedule & SLAs</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                Consultation Hours: {contactData.operatingHours}
                {'\n'}
                {contactData.slaHours}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Global Digital Headquarters</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {contactData.physicalAddress}
              </p>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            <EnquiryForm sourceTitle="Direct Leadership Contact" />
          </div>
        </div>
      </div>
    </div>
  );
}
