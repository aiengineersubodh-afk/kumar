-- ManyMorgan Database Schema Migration
-- Compatible with PostgreSQL and Supabase

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Admin Profiles and Roles
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE, -- references auth.users(id) in Supabase Auth
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Services Table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    icon_name VARCHAR(50) NOT NULL DEFAULT 'Code',
    hero_badge VARCHAR(100) DEFAULT 'Enterprise Solution',
    benefits JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of { title, description, icon }
    process_steps JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of { step, title, description }
    deliverables JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of string
    tech_stack JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of { name, category }
    faqs JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of { question, answer }
    cta_title VARCHAR(200) DEFAULT 'Ready to transform your vision into reality?',
    cta_subtitle TEXT DEFAULT 'Let our engineering team craft the optimal solution for your business.',
    display_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_number VARCHAR(30) NOT NULL UNIQUE, -- e.g. MM-2026-1001
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_country_code VARCHAR(10) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    company_name VARCHAR(200),
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    service_name VARCHAR(200) NOT NULL,
    budget_range VARCHAR(100),
    expected_timeline VARCHAR(100),
    project_description TEXT NOT NULL,
    marketing_consent BOOLEAN NOT NULL DEFAULT false,
    privacy_policy_accepted BOOLEAN NOT NULL DEFAULT true,
    status VARCHAR(50) NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost')),
    priority VARCHAR(30) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    assigned_admin_id UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
    follow_up_date DATE,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    ip_hash VARCHAR(64),
    source_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enquiry Internal Notes (Private to Admin)
CREATE TABLE IF NOT EXISTS enquiry_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id UUID NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
    admin_name VARCHAR(150) NOT NULL,
    note_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Enquiry Status History
CREATE TABLE IF NOT EXISTS enquiry_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id UUID NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
    changed_by UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Follow-up Reminders
CREATE TABLE IF NOT EXISTS follow_up_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id UUID NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
    reminder_date TIMESTAMPTZ NOT NULL,
    notes TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Website Editable Content / Pages CMS
CREATE TABLE IF NOT EXISTS website_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key VARCHAR(100) NOT NULL UNIQUE, -- e.g. 'home_hero', 'about_overview', 'contact_details', 'footer_config', 'seo_metadata'
    title VARCHAR(255),
    subtitle TEXT,
    content_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    last_edited_by UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. General Website FAQs
CREATE TABLE IF NOT EXISTS general_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL DEFAULT 'General',
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Announcements Banner
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    link_label VARCHAR(100),
    link_url TEXT,
    badge_text VARCHAR(50) DEFAULT 'Announcement',
    is_active BOOLEAN NOT NULL DEFAULT false,
    starts_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_by UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. In-App Notifications (for Administrators)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_admin_id UUID REFERENCES admin_profiles(id) ON DELETE CASCADE, -- null means broadcast to all admins
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'enquiry' CHECK (type IN ('enquiry', 'system', 'reminder', 'alert')),
    reference_id UUID,
    reference_type VARCHAR(50),
    is_read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Customer Communication History (Outgoing Emails/Messages)
CREATE TABLE IF NOT EXISTS communication_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id UUID NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
    sent_by UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body_text TEXT NOT NULL,
    message_type VARCHAR(50) NOT NULL DEFAULT 'email' CHECK (message_type IN ('email', 'status_update', 'quote')),
    delivery_status VARCHAR(50) NOT NULL DEFAULT 'sent' CHECK (delivery_status IN ('sent', 'failed', 'delivered', 'pending')),
    external_provider_id VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. File Metadata (Controlled Attachment Storage)
CREATE TABLE IF NOT EXISTS file_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id UUID REFERENCES enquiries(id) ON DELETE CASCADE,
    uploaded_by VARCHAR(50) NOT NULL DEFAULT 'visitor',
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    storage_path TEXT NOT NULL,
    storage_bucket VARCHAR(100) NOT NULL DEFAULT 'attachments',
    is_scanned BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_published ON services(is_published);
CREATE INDEX IF NOT EXISTS idx_enquiries_number ON enquiries(enquiry_number);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_email ON enquiries(email);
CREATE INDEX IF NOT EXISTS idx_enquiry_notes_enquiry ON enquiry_notes(enquiry_id);
CREATE INDEX IF NOT EXISTS idx_notifications_admin ON notifications(recipient_admin_id, is_read);
CREATE INDEX IF NOT EXISTS idx_website_content_key ON website_content(section_key);

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_enquiries_updated_at
BEFORE UPDATE ON enquiries
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_website_content_updated_at
BEFORE UPDATE ON website_content
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Setup
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiry_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiry_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE general_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public Read Policies for Public Content
CREATE POLICY "Public can view published services" ON services
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view published website content" ON website_content
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view published general faqs" ON general_faqs
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view active announcements" ON announcements
    FOR SELECT USING (is_active = true AND (starts_at IS NULL OR starts_at <= NOW()) AND (expires_at IS NULL OR expires_at >= NOW()));

-- Public Insert for Enquiries (Cannot view or update others' enquiries)
CREATE POLICY "Public can submit enquiries" ON enquiries
    FOR INSERT WITH CHECK (true);

-- Admin Full Access Policies (Service Role / Authenticated Admins)
CREATE POLICY "Admins full access to admin_profiles" ON admin_profiles
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to services" ON services
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to enquiries" ON enquiries
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to enquiry_notes" ON enquiry_notes
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to status_history" ON enquiry_status_history
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to reminders" ON follow_up_reminders
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to website_content" ON website_content
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to faqs" ON general_faqs
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to announcements" ON announcements
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to notifications" ON notifications
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to communication_history" ON communication_history
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to file_attachments" ON file_attachments
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to audit_logs" ON audit_logs
    FOR ALL USING (auth.role() = 'authenticated');
