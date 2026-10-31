-- ManyMorgan Database Seed Data
-- Initial services, content, faqs, announcements, and default admin

-- 1. Insert Initial Services
INSERT INTO services (slug, title, short_description, full_description, icon_name, hero_badge, benefits, process_steps, deliverables, tech_stack, faqs, cta_title, cta_subtitle, display_order, is_published)
VALUES
(
    'mobile-app-development',
    'Mobile App Development',
    'High-performance iOS, Android, and cross-platform apps engineered for scale, responsiveness, and fluid user delight.',
    'ManyMorgan delivers enterprise-grade mobile engineering from conceptual architecture to multi-platform deployment. Our specialized engineers construct native iOS (Swift), Android (Kotlin), and cross-platform (Flutter, React Native) mobile applications characterized by sub-second latency, offline-first synchronization, bank-grade encryption, and intuitive gesture navigation.',
    'Smartphone',
    'Native & Cross-Platform Excellence',
    '[
        {"title": "Zero-Lag Performance", "description": "Engineered with optimized memory management, GPU-accelerated rendering, and low battery consumption.", "icon": "Zap"},
        {"title": "Offline-First Sync", "description": "Seamless local data caching with automatic bidirectional conflict resolution when connectivity resumes.", "icon": "Database"},
        {"title": "Biometric & End-to-End Security", "description": "Hardware-backed keystore integration, biometrics (FaceID/Fingerprint), and encrypted network transports.", "icon": "ShieldCheck"},
        {"title": "Scalable Cloud Backends", "description": "Microservice-ready API contracts capable of processing millions of concurrent user sessions effortlessly.", "icon": "Cloud"}
    ]'::jsonb,
    '[
        {"step": "01", "title": "Architecture & Prototyping", "description": "We establish system constraints, user journey maps, and high-fidelity interactive wireframes."},
        {"step": "02", "title": "Agile Sprint Engineering", "description": "Two-week test-driven development cycles with continuous automated builds and regression checking."},
        {"step": "03", "title": "Security & Device Matrix QA", "description": "Rigorous automated testing across 50+ real physical phone and tablet hardware form factors."},
        {"step": "04", "title": "App Store & Play Store Launch", "description": "Complete submission handling, metadata optimization, and production telemetry monitoring."}
    ]'::jsonb,
    '["Full Source Code & Git Repository", "Production iOS & Android Release Binaries", "Comprehensive Architecture & API Documentation", "Automated CI/CD Deployment Pipeline", "30-Day Post-Launch Hypercare Support"]'::jsonb,
    '[
        {"name": "Swift", "category": "iOS"},
        {"name": "Kotlin", "category": "Android"},
        {"name": "Flutter", "category": "Cross-Platform"},
        {"name": "React Native", "category": "Cross-Platform"},
        {"name": "GraphQL / REST", "category": "Networking"}
    ]'::jsonb,
    '[
        {"question": "Do you support publishing to both Apple App Store and Google Play?", "answer": "Yes. Our team manages the end-to-end publishing lifecycle including certificate signing, store listing optimization, guideline compliance, and review resolution."},
        {"question": "How do you choose between React Native, Flutter, and Pure Native?", "answer": "We evaluate your computing intensity, hardware access needs, time-to-market, and long-term roadmap to provide an objective, data-backed architectural recommendation."}
    ]'::jsonb,
    'Ready to build a category-defining mobile application?',
    'Partner with ManyMorgan to turn your mobile vision into a market-ready asset.',
    1,
    true
),
(
    'website-development',
    'Website Development',
    'Modern, ultra-fast web applications built on Next.js, React, and cloud architectures designed for search visibility and conversion.',
    'ManyMorgan constructs mission-critical digital flagships and high-throughput web applications. We blend modular component architectures, headless CMS integrations, micro-frontends, and edge-rendered delivery to produce lightning-speed load times, pristine accessibility scores, and frictionless user flows.',
    'Globe',
    'Modern Web Engineering',
    '[
        {"title": "Edge Rendering & Core Web Vitals", "description": "Guaranteed sub-second Largest Contentful Paint (LCP) and 95+ Google Lighthouse ratings.", "icon": "Gauge"},
        {"title": "Headless & API-First CMS", "description": "Decoupled architecture empowering marketing teams to publish content instantly without engineering bottlenecks.", "icon": "Layers"},
        {"title": "SEO & Structural Metadata", "description": "Automated Open Graph, Schema.org JSON-LD, semantic markup, and dynamic XML sitemaps.", "icon": "Search"},
        {"title": "Responsive Across All Viewports", "description": "Fluid responsive typography and adaptive layouts that feel bespoke on mobile, tablet, and ultra-wide displays.", "icon": "Monitor"}
    ]'::jsonb,
    '[
        {"step": "01", "title": "Discovery & Technical Scoping", "description": "Deep audit of brand goals, user intent, content taxonomy, and conversion milestones."},
        {"step": "02", "title": "Design System Implementation", "description": "Translating Figma design tokens into modular, tokenized CSS and accessible component libraries."},
        {"step": "03", "title": "Full-Stack Web Construction", "description": "Developing SSR/SSG web pages, integrating backend services, and securing authentication."},
        {"step": "04", "title": "Performance Optimization & Launch", "description": "Global CDN edge propagation, asset minification, caching headers, and DNS cutover."}
    ]'::jsonb,
    '["Production-Ready Web Application", "Design System & Component Library", "Content Management System (CMS) Integration", "Google Lighthouse 90+ Audit Certification", "Analytics & Conversion Tracking Setup"]'::jsonb,
    '[
        {"name": "Next.js", "category": "Framework"},
        {"name": "TypeScript", "category": "Language"},
        {"name": "Tailwind CSS", "category": "Styling"},
        {"name": "Node.js / NestJS", "category": "Backend"},
        {"name": "PostgreSQL", "category": "Database"}
    ]'::jsonb,
    '[
        {"question": "Can our internal marketing team update copy and images easily?", "answer": "Absolutely. We integrate visual headless CMS and admin dashboards allowing full editorial control without touching code."},
        {"question": "How do you ensure search engine indexing and high rankings?", "answer": "We enforce strict semantic HTML5, server-side edge rendering, structured data schemas, canonical tags, and lightning-fast loading speeds."}
    ]'::jsonb,
    'Empower your company with a flagship web presence',
    'Speak with our senior software architects to map your web roadmap today.',
    2,
    true
),
(
    'ui-ux-design',
    'UI/UX Design',
    'Human-centered design systems, interactive prototypes, and conversion-optimized digital interfaces crafted with exacting craft.',
    'At ManyMorgan, design is an exact science as much as an art. We conduct empirical user research, establish comprehensive Figma design systems, construct intuitive information hierarchies, and engineer interactive prototypes that solve complex user problems with effortless visual elegance.',
    'Palette',
    'Human-Centered Digital Craft',
    '[
        {"title": "Comprehensive Design Systems", "description": "Scalable tokenized libraries covering typography, color systems, component variants, and interactive states.", "icon": "Layout"},
        {"title": "User Journey & Wireframing", "description": "Eliminating friction points through rigorous user task analysis and rapid low-fidelity feedback loops.", "icon": "Compass"},
        {"title": "Interactive Motion & Micro-Interactions", "description": "Delightful kinetic feedback that guides visitor attention, communicates status, and elevates perceived quality.", "icon": "Sparkles"},
        {"title": "Accessibility First (WCAG AA)", "description": "Ensuring inclusive readability, color contrast compliance, keyboard navigation, and screen reader friendliness.", "icon": "Eye"}
    ]'::jsonb,
    '[
        {"step": "01", "title": "User & Market Discovery", "description": "Stakeholder interviews, user personas, competitor benchmarking, and heuristic audits."},
        {"step": "02", "title": "Information Architecture", "description": "User journey mapping, wireframe schematics, and card sorting exercises."},
        {"step": "03", "title": "Visual Design & Systemization", "description": "Crafting high-fidelity UI screens, interactive Figma prototypes, and complete token libraries."},
        {"step": "04", "title": "Design System Handoff", "description": "Detailed developer handoff specs, asset export bundles, and design QA during sprint builds."}
    ]'::jsonb,
    '["Complete Figma Design Files & Interactive Prototype", "Design Token System (Colors, Typography, Spacing)", "Component Library with Auto-Layout States", "User Journey Maps & Heuristic Documentation", "Developer Handoff Specification Guidelines"]'::jsonb,
    '[
        {"name": "Figma", "category": "Design Tool"},
        {"name": "FigJam", "category": "Ideation"},
        {"name": "Storybook", "category": "Component Testing"},
        {"name": "WCAG 2.1 AA", "category": "Standard"}
    ]'::jsonb,
    '[
        {"question": "Do we receive full editable Figma files?", "answer": "Yes, you own 100% of the intellectual property, including all organized Figma files, components, variables, and prototypes."},
        {"question": "How do you validate that users understand the interface?", "answer": "We run moderated and unmoderated usability tests on clickable prototypes to validate assumptions before engineering begins."}
    ]'::jsonb,
    'Elevate your brand with award-worthy product design',
    'Let our senior designers engineer an interface your customers will love.',
    3,
    true
),
(
    'custom-software-development',
    'Custom Software Development',
    'Tailored enterprise software, automated ERP systems, resilient API integrations, and robust cloud data pipelines.',
    'Off-the-shelf software inevitably limits growth. ManyMorgan crafts bespoke digital products and cloud-native backend engines tailored specifically to your operational workflows, compliance requirements, and proprietary competitive advantages.',
    'Code',
    'Bespoke Enterprise Systems',
    '[
        {"title": "Modular Microservice Architecture", "description": "Decoupled services that can be scaled, deployed, and updated independently without cascading downtime.", "icon": "Server"},
        {"title": "Mission-Critical Fault Tolerance", "description": "Circuit breakers, automated health checks, graceful retries, and comprehensive error telemetry.", "icon": "Cpu"},
        {"title": "Third-Party & Legacy Integration", "description": "Robust ETL bridges connecting ERPs, CRMs, payment gateways, and proprietary legacy databases.", "icon": "GitBranch"},
        {"title": "Strict Data Governance", "description": "SOC2, HIPAA, and GDPR-aligned architectural patterns with immutable audit logging and granular RBAC.", "icon": "Lock"}
    ]'::jsonb,
    '[
        {"step": "01", "title": "Architectural Blueprinting", "description": "Domain-driven design, data modeling, security threat modeling, and throughput forecasting."},
        {"step": "02", "title": "Foundational API & Database Setup", "description": "Setting up relational schema, caching layers, message queues, and authentication boundaries."},
        {"step": "03", "title": "Feature Engineering & Integrations", "description": "Iterative delivery of core business logic, third-party hooks, and operational consoles."},
        {"step": "04", "title": "Load Testing & Container Deployment", "description": "Stress-testing under high concurrency, Dockerization, and Kubernetes cluster orchestration."}
    ]'::jsonb,
    '["Full Source Code with Enterprise Commercial License", "Kubernetes / Docker Compose Manifests", "OpenAPI / Swagger Interactive Documentation", "Comprehensive Automated Test Suites (Unit, Integration, E2E)", "Disaster Recovery & Operational Runbooks"]'::jsonb,
    '[
        {"name": "NestJS / Node.js", "category": "Backend"},
        {"name": "PostgreSQL", "category": "Relational DB"},
        {"name": "Redis", "category": "Cache & Queues"},
        {"name": "Docker & K8s", "category": "Infrastructure"},
        {"name": "AWS / GCP", "category": "Cloud"}
    ]'::jsonb,
    '[
        {"question": "How do you handle migrations from legacy software?", "answer": "We design phased strangler-fig migration paths ensuring zero downtime and continuous parallel data consistency."},
        {"question": "Can this system integrate with our existing ERP or CRM?", "answer": "Yes. We specialize in building secure, idempotent API adaptors for Salesforce, SAP, Oracle, Stripe, and custom internal systems."}
    ]'::jsonb,
    'Build software engineered specifically for your business',
    'Schedule a technical architectural consultation with our principal software engineers.',
    4,
    true
),
(
    'ai-integration-and-automation',
    'AI Integration and Automation',
    'Harness Large Language Models, autonomous agent workflows, predictive intelligence, and conversational AI into your business.',
    'ManyMorgan unlocks tangible operational efficiencies by embedding production-grade AI into your digital ecosystems. From specialized Retrieval-Augmented Generation (RAG) knowledge systems to automated document parsing, lead qualification bots, and workflow choreographies, we operationalize AI safely and profitably.',
    'Bot',
    'Next-Gen AI & Automation',
    '[
        {"title": "Enterprise RAG & Private Knowledge", "description": "Query your proprietary internal documentation with zero hallucination and strict source grounding.", "icon": "BookOpen"},
        {"title": "Autonomous Workflow Pipelines", "description": "Automate multi-step business procedures: data ingestion, validation, synthesis, and routing.", "icon": "GitCommit"},
        {"title": "Intelligent Conversational Agents", "description": "24/7 customer support and sales qualification agents integrated seamlessly with your CRM and scheduling tools.", "icon": "MessageSquare"},
        {"title": "Privacy & Data Sandboxing", "description": "Ensuring corporate data is never utilized for public model training through zero-retention enterprise agreements.", "icon": "ShieldAlert"}
    ]'::jsonb,
    '[
        {"step": "01", "title": "Feasibility & ROI Assessment", "description": "Identifying high-leverage business bottlenecks where AI yields measurable productivity gains."},
        {"step": "02", "title": "Data Pipeline & Vector Indexing", "description": "Cleaning, chunking, embedding, and indexing business assets into high-speed vector databases."},
        {"step": "03", "title": "Agentic Logic & Prompt Engineering", "description": "Building tool-calling workflows, fallback guardrails, and deterministic verification steps."},
        {"step": "04", "title": "Monitoring & Cost Optimization", "description": "Setting up token caching, model fallback hierarchies, and real-time inference observability."}
    ]'::jsonb,
    '["Deployed AI Agent / Pipeline System", "Vector Database Indexing & Maintenance Scripts", "Prompt Engineering Library & Evaluation Benchmarks", "Security Guardrails & Hallucination Mitigation Setup", "Admin Observability Dashboard for Token Usage"]'::jsonb,
    '[
        {"name": "OpenAI / Claude / Gemini APIs", "category": "Foundation Models"},
        {"name": "LangChain / LlamaIndex", "category": "Agent Framework"},
        {"name": "pgvector / Pinecone", "category": "Vector Database"},
        {"name": "Python / TypeScript", "category": "Implementation"},
        {"name": "FastAPI / NestJS", "category": "Service API"}
    ]'::jsonb,
    '[
        {"question": "Will our internal data be used to train third-party AI models?", "answer": "No. We enforce enterprise agreements and local or private VPC endpoints guaranteeing zero data retention and no model training on your intellectual property."},
        {"question": "How do you prevent hallucinations in business-critical processes?", "answer": "We implement strict Retrieval-Augmented Generation (RAG) with citation enforcement, deterministic verification, and automated fallbacks to human review."}
    ]'::jsonb,
    'Modernize your operations with intelligent automation',
    'Discover how ManyMorgan can implement AI that produces measurable ROI.',
    5,
    true
),
(
    'website-maintenance-and-support',
    'Website Maintenance and Support',
    'Proactive 24/7 monitoring, security patching, performance audits, bug resolution, and SLA-backed engineering support.',
    'Your digital assets require continuous vigilance to stay fast, secure, and competitive. ManyMorgan provides dedicated site reliability engineering (SRE), ongoing security vulnerability scans, core framework updates, cloud infrastructure optimization, and rapid-response bug remediation.',
    'ShieldCheck',
    'Continuous Reliability & SLA',
    '[
        {"title": "24/7 Uptime & Health Telemetry", "description": "Real-time synthetic transaction monitoring alerting our standby on-call engineers within 60 seconds.", "icon": "Activity"},
        {"title": "Proactive Security & Dependency Patches", "description": "Regular scanning of CVE databases, automated dependency upgrades, and zero-day threat isolation.", "icon": "Lock"},
        {"title": "Speed & Performance Tuning", "description": "Ongoing database index optimizations, cache invalidation audits, and asset compression reviews.", "icon": "Zap"},
        {"title": "Dedicated Monthly Engineering Hours", "description": "Guaranteed developer capacity for feature iterations, content updates, and design enhancements.", "icon": "Clock"}
    ]'::jsonb,
    '[
        {"step": "01", "title": "System Onboarding & Health Audit", "description": "Comprehensive security, infrastructure, code quality, and telemetry inspection."},
        {"step": "02", "title": "Automated Monitoring Deployment", "description": "Hooking up synthetic pings, APM performance monitors, and error aggregation alerts."},
        {"step": "03", "title": "Continuous Preventive Maintenance", "description": "Scheduled weekly updates, database health checks, and backup integrity verification."},
        {"step": "04", "title": "On-Demand Ticket Resolution", "description": "SLA-governed turnaround for urgent hotfixes and iterative business modifications."}
    ]'::jsonb,
    '["Dedicated SLA Response Guarantee (as fast as 1 hour)", "Monthly Executive Performance & Security Reports", "Automated Daily Encrypted Backups with 30-Day Retention", "Vulnerability Assessment & Penetration Verification", "Monthly Rollover Developer Capacity"]'::jsonb,
    '[
        {"name": "Datadog / Sentry", "category": "Monitoring"},
        {"name": "GitHub Actions", "category": "CI/CD"},
        {"name": "Cloudflare", "category": "Edge & WAF"},
        {"name": "PostgreSQL / Redis", "category": "Data Reliability"}
    ]'::jsonb,
    '[
        {"question": "What is your response time for high-severity outages?", "answer": "Our Tier-1 enterprise maintenance agreements include a guaranteed 30-to-60 minute emergency response window with 24/7 on-call coverage."},
        {"question": "Can unused monthly developer hours roll over?", "answer": "Yes, standard plans include a 30-day rollover allowance for dedicated maintenance hours."}
    ]'::jsonb,
    'Keep your mission-critical applications resilient and secure',
    'Protect your investment with ManyMorgan continuous engineering maintenance.',
    6,
    true
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Initial Website Content (CMS)
INSERT INTO website_content (section_key, title, subtitle, content_payload, is_published)
VALUES
(
    'home_hero',
    'Engineering Transformative Digital Solutions for High-Growth Enterprises',
    'ManyMorgan designs, builds, and scales market-defining mobile applications, modern web platforms, and intelligent automation systems that accelerate business velocity.',
    '{
        "primary_cta_label": "Get a Quote",
        "primary_cta_url": "/get-a-quote",
        "secondary_cta_label": "Discuss Your Project",
        "secondary_cta_url": "/contact",
        "badge_text": "Next-Gen Software & Digital Innovation",
        "highlight_chips": [
            "Full-Lifecycle Engineering",
            "Enterprise-Grade Security",
            "Human-Centered UI/UX",
            "AI-Driven Automation"
        ]
    }'::jsonb,
    true
),
(
    'about_overview',
    'Pioneering Digital Craftsmanship at Scale',
    'ManyMorgan is an elite technology consultancy delivering bespoke digital products, modern cloud architecture, and end-to-end software solutions for ambitious organizations worldwide.',
    '{
        "mission": "To empower visionary companies with resilient, elegant, and commercially impactful technology solutions built on integrity and architectural rigor.",
        "values": [
            {"title": "Architectural Excellence", "description": "We write clean, testable, maintainable code engineered to scale effortlessly from thousands to millions of users."},
            {"title": "Obsessive Design Craft", "description": "Every pixel, animation, and micro-interaction is intentionally crafted to elevate user delight and brand authority."},
            {"title": "Radical Transparency", "description": "No hidden overheads or ambiguous timelines. We operate as your dedicated engineering partner with clear communication."},
            {"title": "Outcome-Driven Velocity", "description": "We prioritize measurable business impact, rapid iteration, and rapid time-to-market without compromising quality."}
        ],
        "stats_highlight": [
            {"label": "Engineering Disciplines", "value": "6 Core Verticals"},
            {"label": "Production Reliability", "value": "99.9% Uptime"},
            {"label": "Delivery Standards", "value": "Enterprise Grade"},
            {"label": "Client Engagement", "value": "Direct Partner Access"}
        ]
    }'::jsonb,
    true
),
(
    'contact_details',
    'Connect with Our Engineering Leadership',
    'Have a project in mind or need an architectural consultation? Reach out and our principal team will respond within 24 business hours.',
    '{
        "business_email": "contact@manymorgan.com",
        "sales_email": "projects@manymorgan.com",
        "phone_number": "+1 (800) 555-0199",
        "office_address": "ManyMorgan Engineering HQ, Global Digital Operations",
        "operating_hours": "Monday - Friday: 9:00 AM - 6:00 PM EST",
        "emergency_support": "24/7 Active Monitoring for SLA Clients"
    }'::jsonb,
    true
),
(
    'footer_config',
    'ManyMorgan',
    'Architecting the future of software, cloud systems, and intelligent digital experiences.',
    '{
        "copyright_text": "© 2026 ManyMorgan. All rights reserved.",
        "quick_links": [
            {"label": "Home", "url": "/"},
            {"label": "Services", "url": "/services"},
            {"label": "About Us", "url": "/about"},
            {"label": "Contact Us", "url": "/contact"},
            {"label": "Get a Quote", "url": "/get-a-quote"}
        ],
        "legal_links": [
            {"label": "Privacy Policy", "url": "/privacy"},
            {"label": "Terms and Conditions", "url": "/terms"}
        ],
        "social_links": [
            {"platform": "LinkedIn", "url": "https://linkedin.com"},
            {"platform": "Twitter", "url": "https://twitter.com"},
            {"platform": "GitHub", "url": "https://github.com"}
        ]
    }'::jsonb,
    true
),
(
    'seo_metadata',
    'ManyMorgan | Premier Software Engineering & Digital Transformation Consultancy',
    'ManyMorgan engineers high-performance mobile apps, modern web platforms, custom enterprise software, UI/UX systems, and AI automation for forward-thinking enterprises.',
    '{
        "canonical_base": "https://manymorgan.com",
        "keywords": ["software engineering", "mobile app development", "web development", "custom software", "AI automation", "UI/UX design", "enterprise digital transformation"],
        "og_image": "/images/og-manymorgan.png"
    }'::jsonb,
    true
)
ON CONFLICT (section_key) DO NOTHING;

-- 3. Insert General Website FAQs
INSERT INTO general_faqs (category, question, answer, display_order, is_published)
VALUES
(
    'General',
    'What types of clients does ManyMorgan collaborate with?',
    'We partner with high-growth technology startups, mid-market enterprises, and industry leaders looking to engineer robust web, mobile, custom software, or AI-driven systems.',
    1,
    true
),
(
    'Engagement',
    'How do we initiate a project with ManyMorgan?',
    'You can submit our project enquiry form or schedule an architectural consultation. Our team will review your objectives, establish scope boundaries, and provide an initial technical proposal within 48 hours.',
    2,
    true
),
(
    'Development',
    'Who owns the intellectual property and source code?',
    'Upon project completion and milestone settlement, you own 100% of all intellectual property, source code, designs, and architectural documentation with no proprietary vendor lock-in.',
    3,
    true
),
(
    'Security',
    'How does ManyMorgan safeguard confidential project data?',
    'We enforce standard bilateral Non-Disclosure Agreements (NDAs) prior to detailed discovery, enforce encrypted communication, and implement role-based access restrictions across all project repositories.',
    4,
    true
),
(
    'Delivery',
    'What methodology do you utilize during software development?',
    'We utilize an agile two-week sprint methodology featuring continuous integration, staging preview environments, bi-weekly demo check-ins, and transparent progress tracking.',
    5,
    true
)
ON CONFLICT DO NOTHING;

-- 4. Insert Initial Announcement
INSERT INTO announcements (title, message, link_label, link_url, badge_text, is_active)
VALUES
(
    'New Engineering Capabilities',
    'ManyMorgan has launched dedicated Enterprise AI & Autonomous Workflow integrations for 2026. Explore our updated capabilities.',
    'Explore AI Services',
    '/services/ai-integration-and-automation',
    'What’s New',
    true
)
ON CONFLICT DO NOTHING;

-- 5. Seed Super Admin Profile
INSERT INTO admin_profiles (email, full_name, role, is_active)
VALUES
(
    'admin@manymorgan.com',
    'ManyMorgan Lead Administrator',
    'super_admin',
    true
)
ON CONFLICT (email) DO NOTHING;
