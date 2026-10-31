'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Bot,
  Code,
  Server,
  ShieldCheck,
  Database,
  Palette,
  Building,
  Cpu,
  Compass,
  CheckCircle2,
  Building2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { SERVICE_CATEGORIES, ServiceCategory } from '@/lib/servicesCatalog';

const ICON_MAP: Record<string, any> = {
  Bot,
  Code,
  Server,
  ShieldCheck,
  Database,
  Palette,
  Building,
  Cpu,
  Compass,
  CheckCircle2,
  Building2,
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [expandedCatId, setExpandedCatId] = useState<string | null>('ai-data');
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setServicesDropdown(false);
  }, [pathname]);

  const isNavActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const toggleCategory = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCatId((prev) => (prev === catId ? null : catId));
  };

  // Divide 13 categories into 2 columns matching the wireframe:
  // Column 1 (Odd: 1, 3, 5, 7, 9, 11, 13)
  const col1 = [
    SERVICE_CATEGORIES[0], // 1. Artificial Intelligence & Data
    SERVICE_CATEGORIES[2], // 3. Cloud & DevOps
    SERVICE_CATEGORIES[4], // 5. Data Engineering & Analytics
    SERVICE_CATEGORIES[6], // 7. Enterprise Solutions
    SERVICE_CATEGORIES[8], // 9. IT Consulting & Digital Transformation
    SERVICE_CATEGORIES[10], // 11. Managed IT & Technology Operations
    SERVICE_CATEGORIES[12], // 13. Industry-Specific Solutions
  ];

  // Column 2 (Even: 2, 4, 6, 8, 10, 12)
  const col2 = [
    SERVICE_CATEGORIES[1], // 2. Software & Product Engineering
    SERVICE_CATEGORIES[3], // 4. Cybersecurity
    SERVICE_CATEGORIES[5], // 6. Digital Experience & Design
    SERVICE_CATEGORIES[7], // 8. Business Process Automation
    SERVICE_CATEGORIES[9], // 10. Quality Engineering & Testing
    SERVICE_CATEGORIES[11], // 12. Engineering & Emerging Technologies
  ];

  const renderCategoryCard = (cat: ServiceCategory) => {
    const isExpanded = expandedCatId === cat.id;
    const Icon = ICON_MAP[cat.iconName] || Code;

    return (
      <div
        key={cat.id}
        className="rounded-2xl border border-neutral-200 bg-white overflow-hidden transition-all shadow-sm hover:border-blue-400"
      >
        {/* Category Header Button */}
        <div
          onClick={(e) => toggleCategory(cat.id, e)}
          className={`flex items-center justify-between p-3.5 cursor-pointer transition-colors ${
            isExpanded
              ? 'bg-blue-50 text-blue-700'
              : 'hover:bg-neutral-50 text-neutral-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${isExpanded ? 'bg-blue-600 text-white' : 'bg-neutral-100 text-neutral-700'}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-tight">{cat.title}</span>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
              isExpanded ? 'rotate-180 text-blue-600' : ''
            }`}
          />
        </div>

        {/* Expandable Sub-Services Accordion */}
        {isExpanded && (
          <div className="p-3 bg-neutral-50/80 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-1.5 animate-in fade-in duration-150">
            {cat.subServices.map((sub) => (
              <Link
                key={sub.slug}
                href={`/services/${sub.slug}`}
                onClick={() => setServicesDropdown(false)}
                className="flex items-center justify-between p-2 rounded-xl text-xs font-medium text-neutral-700 hover:text-blue-600 hover:bg-white border border-transparent hover:border-neutral-200 transition-all group shadow-none hover:shadow-xs"
              >
                <span className="truncate pr-1">{sub.title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#3F3F3F]/98 border-b border-[#525252] shadow-md backdrop-blur-xl'
          : 'bg-[#3F3F3F]/95 border-b border-[#4f4f4f] shadow-sm backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[76px]">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#3F3F3F] rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 to-indigo-300 text-lg tracking-wider">
                  M
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-tight text-xl text-white group-hover:text-blue-400 transition-colors">
                MANYMORGAN
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">
                Engineering & Tech
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                isNavActive('/')
                  ? 'text-white font-bold shadow-[inset_0_-2px_#3b82f6]'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Home
            </Link>

            {/* SERVICES DROPDOWN (Matches User Wireframe) */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <button
                type="button"
                onClick={() => setServicesDropdown(!servicesDropdown)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  servicesDropdown || isNavActive('/services')
                    ? 'text-white font-bold shadow-[inset_0_-2px_#3b82f6]'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    servicesDropdown ? 'rotate-180 text-blue-400' : 'text-slate-300'
                  }`}
                />
              </button>

              {/* Mega Dropdown Overlay (2 Columns of Category Buttons as drawn) */}
              {servicesDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full -left-[280px] w-[1080px] bg-neutral-100 text-neutral-900 rounded-3xl shadow-2xl border border-neutral-300 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 p-6 space-y-4"
                  style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}
                >
                  {/* Top Bar Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Select a Service Discipline to Inspect Fields
                      </span>
                    </div>

                    <Link
                      href="/services"
                      onClick={() => setServicesDropdown(false)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                    >
                      <span>View Complete Directory</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* 2-Column Grid as shown in handwritten wireframe */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Column 1 */}
                    <div className="space-y-3">
                      {col1.map((cat) => renderCategoryCard(cat))}
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-3">
                      {col2.map((cat) => renderCategoryCard(cat))}
                    </div>
                  </div>

                  {/* Bottom Strip Callout */}
                  <div className="p-3.5 bg-white border border-neutral-200 rounded-2xl flex items-center justify-between">
                    <p className="text-xs font-medium text-neutral-600">
                      Need a customized engineering solution? Speak directly with our solution architects.
                    </p>
                    <Link
                      href="/get-a-quote"
                      onClick={() => setServicesDropdown(false)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
                    >
                      <span>Free Architectural Scoping</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                isNavActive('/about')
                  ? 'text-white font-bold shadow-[inset_0_-2px_#3b82f6]'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              About Us
            </Link>

            <Link
              href="/contact"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                isNavActive('/contact')
                  ? 'text-white font-bold shadow-[inset_0_-2px_#3b82f6]'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Contact Us
            </Link>

            <Link
              href="/careers"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                isNavActive('/careers')
                  ? 'text-white font-bold shadow-[inset_0_-2px_#3b82f6]'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Careers
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/get-a-quote"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#1163fb] hover:bg-blue-600 transition-all shadow-md shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Schedule Free Consultations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#3F3F3F] border-b border-[#525252] px-4 pt-3 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto shadow-xl">
          <div className="space-y-1">
            <Link
              href="/"
              className={`block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                isNavActive('/') ? 'bg-white/15 text-white font-bold' : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              Home
            </Link>

            {/* Mobile Services Accordions */}
            <div className="border border-neutral-700 rounded-xl overflow-hidden bg-neutral-800/80">
              <div className="p-3 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between">
                <span className="text-sm font-bold text-white">Services Directory</span>
                <Link href="/services" className="text-xs text-blue-400 font-bold hover:underline">
                  View All
                </Link>
              </div>

              <div className="p-2 space-y-2">
                {SERVICE_CATEGORIES.map((cat) => {
                  const isExpanded = expandedCatId === cat.id;
                  return (
                    <div key={cat.id} className="rounded-xl border border-neutral-700 bg-[#3F3F3F] overflow-hidden shadow-xs">
                      <div
                        onClick={(e) => toggleCategory(cat.id, e)}
                        className="flex items-center justify-between p-3 text-xs font-bold text-white cursor-pointer hover:bg-white/5 transition-colors"
                      >
                        <span>{cat.title}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180 text-blue-400' : 'text-slate-400'}`} />
                      </div>

                      {isExpanded && (
                        <div className="p-2.5 bg-neutral-800 border-t border-neutral-700 space-y-1">
                          {cat.subServices.map((sub) => (
                            <Link
                              key={sub.slug}
                              href={`/services/${sub.slug}`}
                              className="block p-2 text-xs font-medium text-slate-200 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-colors"
                            >
                              • {sub.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <Link
              href="/about"
              className={`block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                isNavActive('/about') ? 'bg-white/15 text-white font-bold' : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              About Us
            </Link>

            <Link
              href="/contact"
              className={`block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                isNavActive('/contact') ? 'bg-white/15 text-white font-bold' : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              Contact Us
            </Link>

            <Link
              href="/careers"
              className={`block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                isNavActive('/careers') ? 'bg-white/15 text-white font-bold' : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              Careers
            </Link>
          </div>

          <div className="pt-4 border-t border-[#525252]">
            <Link
              href="/get-a-quote"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white bg-[#1163fb] hover:bg-blue-600 shadow-md shadow-blue-600/30 transition-colors"
            >
              <span>Schedule Free Consultations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
