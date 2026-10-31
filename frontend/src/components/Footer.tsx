'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { getContent } from '@/lib/api';

export default function Footer() {
  const [footerData, setFooterData] = useState({
    brandDescription:
      'ManyMorgan is an enterprise software engineering and digital transformation consultancy. We architect, build, and support category-defining mobile applications, resilient cloud backends, modern web flagships, and intelligent autonomous workflows.',
    badge1: 'Enterprise Security Standards',
    badge2: '100% Client IP Ownership',
    copyright: `© ${new Date().getFullYear()} ManyMorgan. All rights reserved.`,
  });

  useEffect(() => {
    getContent().then((map) => {
      if (map && map['footer_config']) {
        const payload = map['footer_config'].contentPayload || {};
        setFooterData((prev) => ({
          brandDescription: payload.brand_description || prev.brandDescription,
          badge1: payload.badge1 || prev.badge1,
          badge2: payload.badge2 || prev.badge2,
          copyright: payload.copyright_text || prev.copyright,
        }));
      }
    });
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-slate-800/60">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 to-indigo-300 text-lg">
                    M
                  </span>
                </div>
              </div>
              <span className="font-black tracking-tight text-xl text-white">
                MANYMORGAN
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {footerData.brandDescription}
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                {footerData.badge1}
              </span>
              <span>{footerData.badge2}</span>
            </div>
          </div>

          {/* Core Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Engineering Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/services"
                  className="hover:text-blue-400 transition-colors"
                >
                  All Services Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/get-a-quote"
                  className="hover:text-blue-400 transition-colors"
                >
                  Request Project Quote
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-400 transition-colors"
                >
                  Schedule Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-400 transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  About ManyMorgan
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-blue-400 transition-colors">
                  Careers & Research
                </Link>
              </li>
              <li>
                <Link href="/get-a-quote" className="hover:text-blue-400 transition-colors">
                  Get a Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-slate-400">
                <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <a
                  href="mailto:projects@manymorgan.com"
                  className="hover:text-white transition-colors"
                >
                  projects@manymorgan.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-slate-400">
                <Phone className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <a href="tel:+18005550199" className="hover:text-white transition-colors">
                  +1 (800) 555-0199
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>ManyMorgan Engineering HQ, Global Digital Operations</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/get-a-quote"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                Start an Enquiry <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{footerData.copyright}</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
