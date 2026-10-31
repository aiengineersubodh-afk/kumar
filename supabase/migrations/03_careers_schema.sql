-- ==============================================================================
-- ManyMorgan Careers & Research Management System Schema
-- Migration: 03_careers_schema.sql
-- ==============================================================================

-- 1. Careers Global Settings Table
CREATE TABLE IF NOT EXISTS public.careers_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    global_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (global_status IN ('ACTIVE', 'INACTIVE')),
    updated_by VARCHAR(150) DEFAULT 'Administrator',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed initial authoritative status
INSERT INTO public.careers_settings (global_status, updated_by)
SELECT 'ACTIVE', 'System Initializer'
WHERE NOT EXISTS (SELECT 1 FROM public.careers_settings);

-- 2. Opportunities Table (Internships and Research Tracks)
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('INTERNSHIP', 'RESEARCH')),
    technical_field VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    responsibilities JSONB DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    eligibility TEXT,
    duration VARCHAR(100),
    work_mode VARCHAR(100),
    openings_count INT,
    deadline TIMESTAMPTZ,
    is_published BOOLEAN NOT NULL DEFAULT true,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'ARCHIVED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for public queries
CREATE INDEX IF NOT EXISTS idx_opportunities_type_status ON public.opportunities (type, status, is_published);

-- 3. Vacancy Applications Table
CREATE TABLE IF NOT EXISTS public.vacancy_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number VARCHAR(50) UNIQUE NOT NULL,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
    opportunity_title VARCHAR(255) NOT NULL,
    opportunity_type VARCHAR(30) NOT NULL,
    technical_field VARCHAR(150) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    present_address TEXT NOT NULL,
    resume_file_name VARCHAR(255) NOT NULL,
    resume_original_name VARCHAR(255) NOT NULL,
    resume_mime_type VARCHAR(100) NOT NULL,
    resume_size_bytes BIGINT NOT NULL,
    linkedin_url VARCHAR(300),
    github_url VARCHAR(300),
    portfolio_url VARCHAR(300),
    cover_note TEXT,
    consent_accepted BOOLEAN NOT NULL DEFAULT true,
    consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    consent_version VARCHAR(50) NOT NULL DEFAULT 'v1.0-2026',
    status VARCHAR(50) NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected', 'Withdrawn')),
    admin_notes JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_vacancy_apps_status ON public.vacancy_applications (status);
CREATE INDEX IF NOT EXISTS idx_vacancy_apps_opportunity ON public.vacancy_applications (opportunity_id);

-- 4. General Interest Registrations Table (Used when Careers is Inactive or general expressions)
CREATE TABLE IF NOT EXISTS public.interest_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    present_address TEXT NOT NULL,
    preferred_type VARCHAR(30) NOT NULL CHECK (preferred_type IN ('INTERNSHIP', 'RESEARCH')),
    domain VARCHAR(150) NOT NULL,
    custom_domain VARCHAR(150),
    resume_file_name VARCHAR(255) NOT NULL,
    resume_original_name VARCHAR(255) NOT NULL,
    resume_mime_type VARCHAR(100) NOT NULL,
    resume_size_bytes BIGINT NOT NULL,
    linkedin_url VARCHAR(300),
    github_url VARCHAR(300),
    portfolio_url VARCHAR(300),
    introduction TEXT,
    consent_accepted BOOLEAN NOT NULL DEFAULT true,
    consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    consent_version VARCHAR(50) NOT NULL DEFAULT 'v1.0-2026',
    status VARCHAR(50) NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Reviewed', 'Contacted', 'Archived')),
    admin_notes JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_interest_regs_status ON public.interest_registrations (status);
CREATE INDEX IF NOT EXISTS idx_interest_regs_domain ON public.interest_registrations (domain);

-- 5. Row Level Security Policies
ALTER TABLE public.careers_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacancy_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interest_registrations ENABLE ROW LEVEL SECURITY;

-- Public can read active settings and published open opportunities
CREATE POLICY "Public can view careers status" ON public.careers_settings FOR SELECT USING (true);
CREATE POLICY "Public can view published opportunities" ON public.opportunities FOR SELECT USING (is_published = true AND status = 'OPEN');

-- Public can insert vacancy applications and interest registrations
CREATE POLICY "Public can insert applications" ON public.vacancy_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert interest registrations" ON public.interest_registrations FOR INSERT WITH CHECK (true);

-- Service role / Authenticated admins have full management access
CREATE POLICY "Admins full access to careers_settings" ON public.careers_settings FOR ALL TO service_role USING (true);
CREATE POLICY "Admins full access to opportunities" ON public.opportunities FOR ALL TO service_role USING (true);
CREATE POLICY "Admins full access to applications" ON public.vacancy_applications FOR ALL TO service_role USING (true);
CREATE POLICY "Admins full access to interest registrations" ON public.interest_registrations FOR ALL TO service_role USING (true);
