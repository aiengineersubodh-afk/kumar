'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  Layers,
  FileEdit,
  HelpCircle,
  Megaphone,
  Bell,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
  Globe,
  ChevronDown,
  ChevronRight,
  Home,
  Info,
  PhoneCall,
  Briefcase,
  Compass,
  FileCode,
  Image as ImageIcon,
  Search,
  Settings,
} from 'lucide-react';
import { getAdminToken, getAdminUser, clearAdminSession, adminFetch } from '@/lib/adminAuth';

const WEBSITE_SUBMODULES = [
  { label: 'Overview Hub', href: '/admin/website', icon: Globe },
  { label: '1. Homepage', href: '/admin/website/homepage', icon: Home },
  { label: '2. Services', href: '/admin/website/services', icon: Layers },
  { label: '3. About Us', href: '/admin/website/about', icon: Info },
  { label: '4. Contact Us', href: '/admin/website/contact', icon: PhoneCall },
  { label: '5. Careers', href: '/admin/website/careers', icon: Briefcase },
  { label: '6. Navigation & Header', href: '/admin/website/navigation', icon: Compass },
  { label: '7. Footer', href: '/admin/website/footer', icon: FileCode },
  { label: '8. Media Library', href: '/admin/website/media', icon: ImageIcon },
  { label: '9. SEO & Metadata', href: '/admin/website/seo', icon: Search },
  { label: '10. Website Settings', href: '/admin/website/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [submissionCount, setSubmissionCount] = useState<number | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [websiteMenuOpen, setWebsiteMenuOpen] = useState(true);

  const isLoginPage = pathname === '/admin/login';
  const isWebsiteSection = pathname.startsWith('/admin/website');

  useEffect(() => {
    if (isLoginPage) return;

    const token = getAdminToken();
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const user = getAdminUser();
    setAdminUser(user);

    // Fetch unread notifications count
    adminFetch('/notifications')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.unreadCount === 'number') {
          setUnreadNotifications(data.unreadCount);
        }
      })
      .catch(() => {});

    // Fetch submissions count
    adminFetch('/submissions?limit=1')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.total === 'number') {
          setSubmissionCount(data.total);
        }
      })
      .catch(() => {});
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await adminFetch('/auth/logout', { method: 'POST' });
    } catch {}
    clearAdminSession();
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
            M
          </div>
          <span className="font-extrabold text-white text-sm">MANYMORGAN ADMIN</span>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between p-4 z-40 transition-transform duration-200 overflow-y-auto lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-4">
          {/* Brand */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="font-bold text-blue-400 text-sm">M</span>
                </div>
              </div>
              <div className="truncate">
                <span className="font-black text-white text-sm tracking-tight block">MANYMORGAN</span>
                <span className="text-[10px] uppercase font-bold text-blue-400">Admin CMS & Control</span>
              </div>
            </Link>
          </div>

          {/* Links */}
          <nav className="space-y-1.5">
            {/* Overview */}
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileSidebarOpen(false)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                pathname === '/admin/dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Dashboard Overview</span>
              </div>
            </Link>

            {/* Centralized Inbox */}
            <Link
              href="/admin/submissions"
              onClick={() => setMobileSidebarOpen(false)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                pathname.startsWith('/admin/submissions') || pathname.startsWith('/admin/enquiries')
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Inbox className="w-4 h-4 shrink-0" />
                <span>Enquiries & Apps</span>
              </div>
              {submissionCount !== null && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {submissionCount}
                </span>
              )}
            </Link>

            {/* Website Management (Expandable) */}
            <div className="pt-2">
              <div
                onClick={() => setWebsiteMenuOpen(!websiteMenuOpen)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors ${
                  isWebsiteSection
                    ? 'text-white bg-slate-800/90 border border-slate-700/60'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Website Management</span>
                </div>
                {websiteMenuOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {websiteMenuOpen && (
                <div className="mt-1 ml-3 pl-3 border-l border-slate-800 space-y-1">
                  {WEBSITE_SUBMODULES.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive =
                      sub.href === '/admin/website'
                        ? pathname === '/admin/website'
                        : pathname.startsWith(sub.href);
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isSubActive
                            ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                        }`}
                      >
                        <SubIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Other Existing Admin Modules */}
            <div className="pt-2 border-t border-slate-800/60 space-y-1">
              <Link
                href="/admin/announcements"
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  pathname.startsWith('/admin/announcements')
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Megaphone className="w-4 h-4 shrink-0" />
                  <span>Announcements</span>
                </div>
              </Link>

              <Link
                href="/admin/notifications"
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  pathname.startsWith('/admin/notifications')
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 shrink-0" />
                  <span>Notifications</span>
                </div>
                {unreadNotifications > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                    {unreadNotifications}
                  </span>
                )}
              </Link>
            </div>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 mt-4 border-t border-slate-800 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center justify-between bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {adminUser?.fullName || 'Administrator'}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {adminUser?.email || 'admin@manymorgan.com'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
