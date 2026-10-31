import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  AdminProfile,
  AnnouncementItem,
  EnquiryItem,
  EnquiryNote,
  EnquiryStatus,
  EnquiryPriority,
  GeneralFaqItem,
  NotificationItem,
  ServiceItem,
  WebsiteContentItem,
  CareersGlobalStatus,
  CareersSettings,
  OpportunityType,
  OpportunityStatus,
  OpportunityItem,
  ApplicationStatus,
  ApplicationAdminNote,
  VacancyApplicationItem,
  InterestRegistrationStatus,
  InterestRegistrationItem,
  MediaItem,
  ContentRevision,
  ServiceCategoryItem,
} from './types.js';

interface DatabaseSchema {
  services: ServiceItem[];
  serviceCategories?: ServiceCategoryItem[];
  enquiries: EnquiryItem[];
  content: WebsiteContentItem[];
  faqs: GeneralFaqItem[];
  announcements: AnnouncementItem[];
  notifications: NotificationItem[];
  admins: AdminProfile[];
  careersSettings?: CareersSettings;
  opportunities?: OpportunityItem[];
  vacancyApplications?: VacancyApplicationItem[];
  interestRegistrations?: InterestRegistrationItem[];
  media?: MediaItem[];
  websiteSettings?: Record<string, any>;
}

@Injectable()
export class StoreService implements OnModuleInit {
  private readonly logger = new Logger(StoreService.name);
  private supabase: SupabaseClient | null = null;
  private isSupabaseConfigured = false;
  private localDbPath: string;
  private memoryStore: DatabaseSchema;

  constructor(private readonly configService: ConfigService) {
    this.localDbPath = path.resolve(process.cwd(), 'data', 'db.json');
  }

  async onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey =
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') ||
      this.configService.get<string>('SUPABASE_ANON_KEY');

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
      try {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.isSupabaseConfigured = true;
        this.logger.log('Connected to Supabase PostgreSQL Database.');
      } catch (err) {
        this.logger.warn(`Failed to connect to Supabase: ${err}. Falling back to local data store.`);
        this.isSupabaseConfigured = false;
      }
    } else {
      this.logger.log('Supabase credentials not configured. Using high-fidelity local database store.');
      this.isSupabaseConfigured = false;
    }

    this.initLocalStore();
  }

  private initLocalStore() {
    const dataDir = path.dirname(this.localDbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (fs.existsSync(this.localDbPath)) {
      try {
        const raw = fs.readFileSync(this.localDbPath, 'utf-8');
        this.memoryStore = JSON.parse(raw);
        let mutated = false;
        if (!this.memoryStore.careersSettings) {
          this.memoryStore.careersSettings = {
            globalStatus: 'ACTIVE',
            updatedAt: new Date().toISOString(),
            updatedBy: 'System Seed',
          };
          mutated = true;
        }
        if (!Array.isArray(this.memoryStore.opportunities)) {
          this.memoryStore.opportunities = [];
          mutated = true;
        }
        if (!Array.isArray(this.memoryStore.vacancyApplications)) {
          this.memoryStore.vacancyApplications = [];
          mutated = true;
        }
        if (!Array.isArray(this.memoryStore.interestRegistrations)) {
          this.memoryStore.interestRegistrations = [];
          mutated = true;
        }
        if (!Array.isArray(this.memoryStore.media)) {
          this.memoryStore.media = this.getDefaultMediaSeed();
          mutated = true;
        }
        if (!this.memoryStore.websiteSettings) {
          this.memoryStore.websiteSettings = this.getDefaultWebsiteSettings();
          mutated = true;
        }
        if (!Array.isArray(this.memoryStore.serviceCategories) || this.memoryStore.serviceCategories.length === 0) {
          this.memoryStore.serviceCategories = this.getDefaultCategoriesSeed();
          mutated = true;
        }
        if (mutated) {
          this.persistLocalStore();
        }
        this.logger.log('Loaded local persistent database store successfully with Careers schema.');
        return;
      } catch (e) {
        this.logger.warn(`Corrupted local db, re-seeding: ${e}`);
      }
    }

    this.memoryStore = this.getDefaultSeedData();
    this.persistLocalStore();
    this.logger.log('Seeded local database store with ManyMorgan production data.');
  }

  private persistLocalStore() {
    try {
      fs.writeFileSync(this.localDbPath, JSON.stringify(this.memoryStore, null, 2), 'utf-8');
    } catch (e) {
      this.logger.error(`Failed to persist local store: ${e}`);
    }
  }

  getSupabaseClient(): SupabaseClient | null {
    return this.supabase;
  }

  isUsingSupabase(): boolean {
    return this.isSupabaseConfigured;
  }

  // --- Services Operations ---
  async getServices(includeUnpublished = false): Promise<ServiceItem[]> {
    if (this.isSupabaseConfigured && this.supabase) {
      let query = this.supabase.from('services').select('*').order('display_order', { ascending: true });
      if (!includeUnpublished) query = query.eq('is_published', true);
      const { data, error } = await query;
      if (!error && data) return data.map(this.mapSupabaseService);
    }
    return this.memoryStore.services
      .filter((s) => includeUnpublished || s.isPublished)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getServiceBySlug(slug: string): Promise<ServiceItem | null> {
    if (this.isSupabaseConfigured && this.supabase) {
      const { data, error } = await this.supabase.from('services').select('*').eq('slug', slug).single();
      if (!error && data) return this.mapSupabaseService(data);
    }
    return this.memoryStore.services.find((s) => s.slug === slug) || null;
  }

  async createService(item: Partial<ServiceItem>): Promise<ServiceItem> {
    const newService: ServiceItem = {
      id: item.id || uuidv4(),
      slug: item.slug || (item.title || 'new-service').toLowerCase().replace(/\s+/g, '-'),
      title: item.title || 'Untitled Service',
      shortDescription: item.shortDescription || '',
      fullDescription: item.fullDescription || '',
      iconName: item.iconName || 'Code',
      heroBadge: item.heroBadge || 'Enterprise Solution',
      categoryTitle: item.categoryTitle || (item as any).category || 'Artificial Intelligence & Data',
      categorySlug: item.categorySlug || ((item.categoryTitle || (item as any).category || 'artificial-intelligence-and-data').toLowerCase().replace(/[^a-z0-9]+/g, '-')),
      backgroundImage: item.backgroundImage || '',
      seoTitle: item.seoTitle || '',
      seoDescription: item.seoDescription || '',
      benefits: item.benefits || [],
      processSteps: item.processSteps || [],
      deliverables: item.deliverables || [],
      techStack: item.techStack || [],
      faqs: item.faqs || [],
      ctaTitle: item.ctaTitle || 'Ready to start your project?',
      ctaSubtitle: item.ctaSubtitle || 'Speak with our engineering leaders.',
      displayOrder: item.displayOrder ?? this.memoryStore.services.length + 1,
      isPublished: item.isPublished ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (this.isSupabaseConfigured && this.supabase) {
      await this.supabase.from('services').insert({
        id: newService.id,
        slug: newService.slug,
        title: newService.title,
        short_description: newService.shortDescription,
        full_description: newService.fullDescription,
        icon_name: newService.iconName,
        hero_badge: newService.heroBadge,
        benefits: newService.benefits,
        process_steps: newService.processSteps,
        deliverables: newService.deliverables,
        tech_stack: newService.techStack,
        faqs: newService.faqs,
        cta_title: newService.ctaTitle,
        cta_subtitle: newService.ctaSubtitle,
        display_order: newService.displayOrder,
        is_published: newService.isPublished,
      });
    }

    this.memoryStore.services.push(newService);
    this.persistLocalStore();
    return newService;
  }

  async updateService(id: string, updates: Partial<ServiceItem>): Promise<ServiceItem | null> {
    const idx = this.memoryStore.services.findIndex((s) => s.id === id);
    if (idx === -1) return null;

    const updated = {
      ...this.memoryStore.services[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.memoryStore.services[idx] = updated;
    this.persistLocalStore();

    if (this.isSupabaseConfigured && this.supabase) {
      await this.supabase
        .from('services')
        .update({
          title: updated.title,
          slug: updated.slug,
          short_description: updated.shortDescription,
          full_description: updated.fullDescription,
          icon_name: updated.iconName,
          hero_badge: updated.heroBadge,
          benefits: updated.benefits,
          process_steps: updated.processSteps,
          deliverables: updated.deliverables,
          tech_stack: updated.techStack,
          faqs: updated.faqs,
          cta_title: updated.ctaTitle,
          cta_subtitle: updated.ctaSubtitle,
          display_order: updated.displayOrder,
          is_published: updated.isPublished,
        })
        .eq('id', id);
    }

    return updated;
  }

  async deleteService(id: string): Promise<boolean> {
    const idx = this.memoryStore.services.findIndex((s) => s.id === id);
    if (idx === -1) return false;

    this.memoryStore.services.splice(idx, 1);
    this.persistLocalStore();

    if (this.isSupabaseConfigured && this.supabase) {
      await this.supabase.from('services').delete().eq('id', id);
    }
    return true;
  }

  // --- Enquiries Operations ---
  async getEnquiries(params: {
    status?: string;
    service?: string;
    priority?: string;
    search?: string;
    includeArchived?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ items: EnquiryItem[]; total: number; page: number; limit: number }> {
    let list = [...this.memoryStore.enquiries];

    if (!params.includeArchived) {
      list = list.filter((e) => !e.isArchived);
    }

    if (params.status && params.status !== 'All') {
      list = list.filter((e) => e.status.toLowerCase() === params.status?.toLowerCase());
    }

    if (params.service && params.service !== 'All') {
      list = list.filter((e) => e.serviceName.toLowerCase() === params.service?.toLowerCase());
    }

    if (params.priority && params.priority !== 'All') {
      list = list.filter((e) => e.priority.toLowerCase() === params.priority?.toLowerCase());
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          (e.companyName && e.companyName.toLowerCase().includes(q)) ||
          e.enquiryNumber.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = list.length;
    const page = params.page || 1;
    const limit = params.limit || 15;
    const startIndex = (page - 1) * limit;
    const items = list.slice(startIndex, startIndex + limit);

    return { items, total, page, limit };
  }

  async getEnquiryById(id: string): Promise<EnquiryItem | null> {
    return this.memoryStore.enquiries.find((e) => e.id === id || e.enquiryNumber === id) || null;
  }

  async createEnquiry(payload: Partial<EnquiryItem>): Promise<EnquiryItem> {
    const count = this.memoryStore.enquiries.length + 1001;
    const year = new Date().getFullYear();
    const enquiryNumber = `MM-${year}-${count}`;

    const newEnquiry: EnquiryItem = {
      id: uuidv4(),
      enquiryNumber,
      fullName: payload.fullName || 'Anonymous',
      email: payload.email || '',
      phoneCountryCode: payload.phoneCountryCode || '+1',
      phoneNumber: payload.phoneNumber || '',
      companyName: payload.companyName || '',
      serviceId: payload.serviceId,
      serviceName: payload.serviceName || 'General Enquiry',
      budgetRange: payload.budgetRange || 'Not Specified',
      expectedTimeline: payload.expectedTimeline || 'Flexible',
      projectDescription: payload.projectDescription || '',
      fileAttachmentUrl: payload.fileAttachmentUrl,
      marketingConsent: !!payload.marketingConsent,
      privacyPolicyAccepted: true,
      status: 'New',
      priority: 'Medium',
      followUpDate: undefined,
      isArchived: false,
      ipHash: payload.ipHash,
      sourceUrl: payload.sourceUrl,
      notes: [],
      statusHistory: [
        {
          id: uuidv4(),
          enquiryId: '',
          newStatus: 'New',
          comment: 'Enquiry submitted through ManyMorgan public portal.',
          createdAt: new Date().toISOString(),
        },
      ],
      communications: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    newEnquiry.statusHistory[0].enquiryId = newEnquiry.id;

    this.memoryStore.enquiries.unshift(newEnquiry);

    // Auto-create in-app notification for admin
    const notification: NotificationItem = {
      id: uuidv4(),
      title: `New Project Enquiry: ${newEnquiry.enquiryNumber}`,
      message: `${newEnquiry.fullName} (${newEnquiry.companyName || 'Individual'}) requested ${newEnquiry.serviceName}.`,
      type: 'enquiry',
      referenceId: newEnquiry.id,
      referenceType: 'enquiry',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.memoryStore.notifications.unshift(notification);

    this.persistLocalStore();
    return newEnquiry;
  }

  async updateEnquiryStatus(
    id: string,
    newStatus: EnquiryStatus,
    adminName: string,
    comment?: string
  ): Promise<EnquiryItem | null> {
    const enquiry = this.memoryStore.enquiries.find((e) => e.id === id);
    if (!enquiry) return null;

    const oldStatus = enquiry.status;
    enquiry.status = newStatus;
    enquiry.updatedAt = new Date().toISOString();

    enquiry.statusHistory.unshift({
      id: uuidv4(),
      enquiryId: enquiry.id,
      adminName,
      oldStatus,
      newStatus,
      comment: comment || `Status updated to ${newStatus}`,
      createdAt: new Date().toISOString(),
    });

    this.persistLocalStore();
    return enquiry;
  }

  async updateEnquiryPriority(id: string, priority: EnquiryPriority): Promise<EnquiryItem | null> {
    const enquiry = this.memoryStore.enquiries.find((e) => e.id === id);
    if (!enquiry) return null;

    enquiry.priority = priority;
    enquiry.updatedAt = new Date().toISOString();
    this.persistLocalStore();
    return enquiry;
  }

  async addEnquiryNote(id: string, adminName: string, noteText: string): Promise<EnquiryNote | null> {
    const enquiry = this.memoryStore.enquiries.find((e) => e.id === id);
    if (!enquiry) return null;

    const note: EnquiryNote = {
      id: uuidv4(),
      enquiryId: enquiry.id,
      adminName,
      noteText,
      createdAt: new Date().toISOString(),
    };

    enquiry.notes.unshift(note);
    enquiry.updatedAt = new Date().toISOString();
    this.persistLocalStore();
    return note;
  }

  async addCommunication(id: string, comm: Partial<any>): Promise<any> {
    const enquiry = this.memoryStore.enquiries.find((e) => e.id === id);
    if (!enquiry) return null;

    const record = {
      id: uuidv4(),
      enquiryId: enquiry.id,
      adminName: comm.adminName || 'Admin Team',
      recipientEmail: comm.recipientEmail || enquiry.email,
      subject: comm.subject || 'Update regarding your project enquiry',
      bodyText: comm.bodyText || '',
      messageType: comm.messageType || 'email',
      deliveryStatus: comm.deliveryStatus || 'sent',
      createdAt: new Date().toISOString(),
    };

    enquiry.communications.unshift(record);
    enquiry.updatedAt = new Date().toISOString();
    this.persistLocalStore();
    return record;
  }

  async toggleArchiveEnquiry(id: string): Promise<EnquiryItem | null> {
    const enquiry = this.memoryStore.enquiries.find((e) => e.id === id);
    if (!enquiry) return null;

    enquiry.isArchived = !enquiry.isArchived;
    enquiry.updatedAt = new Date().toISOString();
    this.persistLocalStore();
    return enquiry;
  }

  // --- Content CMS Operations ---
  async getContent(): Promise<WebsiteContentItem[]> {
    return this.memoryStore.content;
  }

  async getContentSection(sectionKey: string): Promise<WebsiteContentItem | null> {
    return this.memoryStore.content.find((c) => c.sectionKey === sectionKey) || null;
  }

  async updateContentSection(
    sectionKey: string,
    updates: { title?: string; subtitle?: string; contentPayload?: Record<string, any>; isPublished?: boolean }
  ): Promise<WebsiteContentItem> {
    let section = this.memoryStore.content.find((c) => c.sectionKey === sectionKey);
    if (!section) {
      section = {
        id: uuidv4(),
        sectionKey,
        title: updates.title || '',
        subtitle: updates.subtitle || '',
        contentPayload: updates.contentPayload || {},
        isPublished: updates.isPublished ?? true,
        updatedAt: new Date().toISOString(),
      };
      this.memoryStore.content.push(section);
    } else {
      if (updates.title !== undefined) section.title = updates.title;
      if (updates.subtitle !== undefined) section.subtitle = updates.subtitle;
      if (updates.contentPayload !== undefined) section.contentPayload = { ...section.contentPayload, ...updates.contentPayload };
      if (updates.isPublished !== undefined) section.isPublished = updates.isPublished;
      section.updatedAt = new Date().toISOString();
    }

    this.persistLocalStore();
    return section;
  }

  // --- Enhanced CMS Draft / Publish / Revision Operations ---
  async saveContentDraft(
    sectionKey: string,
    draftPayload: Record<string, any>,
    title?: string,
    subtitle?: string
  ): Promise<WebsiteContentItem> {
    let section = this.memoryStore.content.find((c) => c.sectionKey === sectionKey);
    if (!section) {
      section = {
        id: uuidv4(),
        sectionKey,
        title: title || '',
        subtitle: subtitle || '',
        contentPayload: {},
        draftPayload,
        hasDraft: true,
        revisions: [],
        isPublished: true,
        updatedAt: new Date().toISOString(),
      };
      this.memoryStore.content.push(section);
    } else {
      if (title !== undefined) section.title = title;
      if (subtitle !== undefined) section.subtitle = subtitle;
      section.draftPayload = { ...(section.draftPayload || section.contentPayload || {}), ...draftPayload };
      section.hasDraft = true;
      section.updatedAt = new Date().toISOString();
    }
    this.persistLocalStore();
    return section;
  }

  async publishContentSection(sectionKey: string, adminName = 'Administrator'): Promise<WebsiteContentItem> {
    let section = this.memoryStore.content.find((c) => c.sectionKey === sectionKey);
    if (!section) {
      throw new Error(`Section ${sectionKey} not found to publish`);
    }

    if (!Array.isArray(section.revisions)) {
      section.revisions = [];
    }

    if (section.contentPayload && Object.keys(section.contentPayload).length > 0) {
      section.revisions.unshift({
        revisionId: uuidv4(),
        publishedAt: section.publishedAt || section.updatedAt || new Date().toISOString(),
        publishedBy: section.publishedBy || 'System',
        payload: JSON.parse(JSON.stringify(section.contentPayload)),
        title: section.title,
        subtitle: section.subtitle,
      });
      if (section.revisions.length > 20) {
        section.revisions = section.revisions.slice(0, 20);
      }
    }

    if (section.draftPayload) {
      section.contentPayload = JSON.parse(JSON.stringify(section.draftPayload));
    }
    section.hasDraft = false;
    section.isPublished = true;
    section.publishedAt = new Date().toISOString();
    section.publishedBy = adminName;
    section.updatedAt = new Date().toISOString();

    this.persistLocalStore();
    return section;
  }

  async discardContentDraft(sectionKey: string): Promise<WebsiteContentItem> {
    const section = this.memoryStore.content.find((c) => c.sectionKey === sectionKey);
    if (!section) {
      throw new Error(`Section ${sectionKey} not found`);
    }
    section.draftPayload = JSON.parse(JSON.stringify(section.contentPayload || {}));
    section.hasDraft = false;
    section.updatedAt = new Date().toISOString();
    this.persistLocalStore();
    return section;
  }

  async rollbackContentRevision(sectionKey: string, revisionId: string, adminName = 'Administrator'): Promise<WebsiteContentItem> {
    const section = this.memoryStore.content.find((c) => c.sectionKey === sectionKey);
    if (!section || !Array.isArray(section.revisions)) {
      throw new Error(`Section or revisions not found for ${sectionKey}`);
    }
    const rev = section.revisions.find((r) => r.revisionId === revisionId);
    if (!rev) {
      throw new Error(`Revision ${revisionId} not found`);
    }

    section.revisions.unshift({
      revisionId: uuidv4(),
      publishedAt: section.publishedAt || new Date().toISOString(),
      publishedBy: section.publishedBy || 'System',
      payload: JSON.parse(JSON.stringify(section.contentPayload)),
      title: section.title,
      subtitle: section.subtitle,
    });

    section.contentPayload = JSON.parse(JSON.stringify(rev.payload));
    section.draftPayload = JSON.parse(JSON.stringify(rev.payload));
    if (rev.title) section.title = rev.title;
    if (rev.subtitle) section.subtitle = rev.subtitle;
    section.hasDraft = false;
    section.isPublished = true;
    section.publishedAt = new Date().toISOString();
    section.publishedBy = `Rollback by ${adminName}`;
    section.updatedAt = new Date().toISOString();

    this.persistLocalStore();
    return section;
  }

  // --- Media Library Operations ---
  async getMediaItems(type?: string): Promise<MediaItem[]> {
    if (!Array.isArray(this.memoryStore.media)) {
      this.memoryStore.media = this.getDefaultMediaSeed();
      this.persistLocalStore();
    }
    let list = this.memoryStore.media;
    if (type && type !== 'all') {
      list = list.filter((m) => m.fileType === type);
    }
    return list.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getMediaItemById(id: string): Promise<MediaItem | null> {
    if (!Array.isArray(this.memoryStore.media)) return null;
    return this.memoryStore.media.find((m) => m.id === id) || null;
  }

  async createMediaItem(item: Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MediaItem> {
    if (!Array.isArray(this.memoryStore.media)) {
      this.memoryStore.media = [];
    }
    const newItem: MediaItem = {
      id: uuidv4(),
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memoryStore.media.unshift(newItem);
    this.persistLocalStore();
    return newItem;
  }

  async updateMediaItem(id: string, updates: Partial<MediaItem>): Promise<MediaItem | null> {
    if (!Array.isArray(this.memoryStore.media)) return null;
    const item = this.memoryStore.media.find((m) => m.id === id);
    if (!item) return null;
    Object.assign(item, updates, { updatedAt: new Date().toISOString() });
    this.persistLocalStore();
    return item;
  }

  async deleteMediaItem(id: string): Promise<boolean> {
    if (!Array.isArray(this.memoryStore.media)) return false;
    const idx = this.memoryStore.media.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    this.memoryStore.media.splice(idx, 1);
    this.persistLocalStore();
    return true;
  }

  // --- Website Settings Operations ---
  async getWebsiteSettings(): Promise<Record<string, any>> {
    if (!this.memoryStore.websiteSettings) {
      this.memoryStore.websiteSettings = this.getDefaultWebsiteSettings();
      this.persistLocalStore();
    }
    return this.memoryStore.websiteSettings;
  }

  async updateWebsiteSettings(updates: Record<string, any>): Promise<Record<string, any>> {
    this.memoryStore.websiteSettings = {
      ...(this.memoryStore.websiteSettings || this.getDefaultWebsiteSettings()),
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persistLocalStore();
    return this.memoryStore.websiteSettings;
  }

  // --- FAQs Operations ---
  async getFaqs(includeUnpublished = false): Promise<GeneralFaqItem[]> {
    return this.memoryStore.faqs
      .filter((f) => includeUnpublished || f.isPublished)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async createFaq(faq: Partial<GeneralFaqItem>): Promise<GeneralFaqItem> {
    const newItem: GeneralFaqItem = {
      id: uuidv4(),
      category: faq.category || 'General',
      question: faq.question || '',
      answer: faq.answer || '',
      displayOrder: faq.displayOrder ?? this.memoryStore.faqs.length + 1,
      isPublished: faq.isPublished ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memoryStore.faqs.push(newItem);
    this.persistLocalStore();
    return newItem;
  }

  async updateFaq(id: string, updates: Partial<GeneralFaqItem>): Promise<GeneralFaqItem | null> {
    const idx = this.memoryStore.faqs.findIndex((f) => f.id === id);
    if (idx === -1) return null;

    this.memoryStore.faqs[idx] = {
      ...this.memoryStore.faqs[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persistLocalStore();
    return this.memoryStore.faqs[idx];
  }

  async deleteFaq(id: string): Promise<boolean> {
    const idx = this.memoryStore.faqs.findIndex((f) => f.id === id);
    if (idx === -1) return false;

    this.memoryStore.faqs.splice(idx, 1);
    this.persistLocalStore();
    return true;
  }

  // --- Announcements Operations ---
  async getActiveAnnouncement(): Promise<AnnouncementItem | null> {
    const now = new Date().getTime();
    return (
      this.memoryStore.announcements.find((a) => {
        if (!a.isActive) return false;
        if (a.startsAt && new Date(a.startsAt).getTime() > now) return false;
        if (a.expiresAt && new Date(a.expiresAt).getTime() < now) return false;
        return true;
      }) || null
    );
  }

  async getAllAnnouncements(): Promise<AnnouncementItem[]> {
    return this.memoryStore.announcements;
  }

  async createAnnouncement(announcement: Partial<AnnouncementItem>): Promise<AnnouncementItem> {
    const newItem: AnnouncementItem = {
      id: uuidv4(),
      title: announcement.title || '',
      message: announcement.message || '',
      linkLabel: announcement.linkLabel,
      linkUrl: announcement.linkUrl,
      badgeText: announcement.badgeText || 'Announcement',
      isActive: announcement.isActive ?? true,
      startsAt: announcement.startsAt,
      expiresAt: announcement.expiresAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memoryStore.announcements.unshift(newItem);
    this.persistLocalStore();
    return newItem;
  }

  async updateAnnouncement(id: string, updates: Partial<AnnouncementItem>): Promise<AnnouncementItem | null> {
    const idx = this.memoryStore.announcements.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    this.memoryStore.announcements[idx] = {
      ...this.memoryStore.announcements[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persistLocalStore();
    return this.memoryStore.announcements[idx];
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    const idx = this.memoryStore.announcements.findIndex((a) => a.id === id);
    if (idx === -1) return false;

    this.memoryStore.announcements.splice(idx, 1);
    this.persistLocalStore();
    return true;
  }

  // --- Notifications Operations ---
  async getNotifications(): Promise<{ items: NotificationItem[]; unreadCount: number }> {
    const items = this.memoryStore.notifications;
    const unreadCount = items.filter((n) => !n.isRead).length;
    return { items, unreadCount };
  }

  async markNotificationRead(id: string): Promise<boolean> {
    const notification = this.memoryStore.notifications.find((n) => n.id === id);
    if (!notification) return false;

    notification.isRead = true;
    notification.readAt = new Date().toISOString();
    this.persistLocalStore();
    return true;
  }

  async markAllNotificationsRead(): Promise<boolean> {
    const now = new Date().toISOString();
    this.memoryStore.notifications.forEach((n) => {
      n.isRead = true;
      n.readAt = now;
    });
    this.persistLocalStore();
    return true;
  }

  // --- Dashboard Real Metrics ---
  async getDashboardMetrics(): Promise<{
    totalEnquiries: number;
    newEnquiries: number;
    awaitingFollowUp: number;
    wonEnquiries: number;
    lostEnquiries: number;
    serviceBreakdown: Record<string, number>;
    statusBreakdown: Record<string, number>;
    recentSubmissions: EnquiryItem[];
  }> {
    const nonArchived = this.memoryStore.enquiries.filter((e) => !e.isArchived);
    const totalEnquiries = nonArchived.length;
    const newEnquiries = nonArchived.filter((e) => e.status === 'New').length;
    const awaitingFollowUp = nonArchived.filter(
      (e) => e.status === 'Contacted' || e.status === 'Meeting Scheduled' || e.status === 'Proposal Sent'
    ).length;
    const wonEnquiries = nonArchived.filter((e) => e.status === 'Won').length;
    const lostEnquiries = nonArchived.filter((e) => e.status === 'Lost').length;

    const serviceBreakdown: Record<string, number> = {};
    const statusBreakdown: Record<string, number> = {};

    nonArchived.forEach((e) => {
      serviceBreakdown[e.serviceName] = (serviceBreakdown[e.serviceName] || 0) + 1;
      statusBreakdown[e.status] = (statusBreakdown[e.status] || 0) + 1;
    });

    const recentSubmissions = nonArchived.slice(0, 5);

    return {
      totalEnquiries,
      newEnquiries,
      awaitingFollowUp,
      wonEnquiries,
      lostEnquiries,
      serviceBreakdown,
      statusBreakdown,
      recentSubmissions,
    };
  }

  // --- Admin Profile & Validation ---
  async getAdminByEmail(email: string): Promise<AdminProfile | null> {
    return this.memoryStore.admins.find((a) => a.email.toLowerCase() === email.toLowerCase()) || null;
  }

  // Mapping helper for Supabase // 1792530556402
  private mapSupabaseService(row: any): ServiceItem {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      shortDescription: row.short_description,
      fullDescription: row.full_description,
      iconName: row.icon_name,
      heroBadge: row.hero_badge,
      benefits: row.benefits || [],
      processSteps: row.process_steps || [],
      deliverables: row.deliverables || [],
      techStack: row.tech_stack || [],
      faqs: row.faqs || [],
      ctaTitle: row.cta_title,
      ctaSubtitle: row.cta_subtitle,
      displayOrder: row.display_order,
      isPublished: row.is_published,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Default seed database matching 02_seed_data.sql exactly
  private getDefaultSeedData(): DatabaseSchema {
    return {
      admins: [
        {
          id: 'admin-001',
          email: 'admin@manymorgan.com',
          fullName: 'ManyMorgan Lead Administrator',
          role: 'super_admin',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      serviceCategories: this.getDefaultCategoriesSeed(),
      services: [],
      enquiries: [],
      content: [
        {
          id: 'cnt-001',
          sectionKey: 'home_hero',
          title: 'Engineering Transformative Digital Solutions for High-Growth Enterprises',
          subtitle:
            'ManyMorgan designs, builds, and scales market-defining mobile applications, modern web platforms, and intelligent automation systems that accelerate business velocity.',
          contentPayload: {
            primary_cta_label: 'Get a Quote',
            primary_cta_url: '/get-a-quote',
            secondary_cta_label: 'Discuss Your Project',
            secondary_cta_url: '/contact',
            badge_text: 'Next-Gen Software & Digital Innovation',
            highlight_chips: [
              'Full-Lifecycle Engineering',
              'Enterprise-Grade Security',
              'Human-Centered UI/UX',
              'AI-Driven Automation',
            ],
          },
          isPublished: true,
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'cnt-002',
          sectionKey: 'about_overview',
          title: 'Pioneering Digital Craftsmanship at Scale',
          subtitle:
            'ManyMorgan is an elite technology consultancy delivering bespoke digital products, modern cloud architecture, and end-to-end software solutions for ambitious organizations worldwide.',
          contentPayload: {
            mission:
              'To empower visionary companies with resilient, elegant, and commercially impactful technology solutions built on integrity and architectural rigor.',
            values: [
              {
                title: 'Architectural Excellence',
                description: 'We write clean, testable, maintainable code engineered to scale effortlessly from thousands to millions of users.',
              },
              {
                title: 'Obsessive Design Craft',
                description: 'Every pixel, animation, and micro-interaction is intentionally crafted to elevate user delight and brand authority.',
              },
              {
                title: 'Radical Transparency',
                description: 'No hidden overheads or ambiguous timelines. We operate as your dedicated engineering partner with clear communication.',
              },
              {
                title: 'Outcome-Driven Velocity',
                description: 'We prioritize measurable business impact, rapid iteration, and rapid time-to-market without compromising quality.',
              },
            ],
            stats_highlight: [
              { label: 'Engineering Disciplines', value: '6 Core Verticals' },
              { label: 'Production Reliability', value: '99.9% Uptime' },
              { label: 'Delivery Standards', value: 'Enterprise Grade' },
              { label: 'Client Engagement', value: 'Direct Partner Access' },
            ],
          },
          isPublished: true,
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'cnt-003',
          sectionKey: 'contact_details',
          title: 'Connect with Our Engineering Leadership',
          subtitle:
            'Have a project in mind or need an architectural consultation? Reach out and our principal team will respond within 24 business hours.',
          contentPayload: {
            business_email: 'contact@manymorgan.com',
            sales_email: 'projects@manymorgan.com',
            phone_number: '+1 (800) 555-0199',
            office_address: 'ManyMorgan Engineering HQ, Global Digital Operations',
            operating_hours: 'Monday - Friday: 9:00 AM - 6:00 PM EST',
            emergency_support: '24/7 Active Monitoring for SLA Clients',
          },
          isPublished: true,
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'cnt-004',
          sectionKey: 'footer_config',
          title: 'ManyMorgan',
          subtitle: 'Architecting the future of software, cloud systems, and intelligent digital experiences.',
          contentPayload: {
            copyright_text: '© 2026 ManyMorgan. All rights reserved.',
            quick_links: [
              { label: 'Home', url: '/' },
              { label: 'Services', url: '/services' },
              { label: 'About Us', url: '/about' },
              { label: 'Contact Us', url: '/contact' },
              { label: 'Get a Quote', url: '/get-a-quote' },
            ],
            legal_links: [
              { label: 'Privacy Policy', url: '/privacy' },
              { label: 'Terms and Conditions', url: '/terms' },
            ],
            social_links: [
              { platform: 'LinkedIn', url: 'https://linkedin.com' },
              { platform: 'Twitter', url: 'https://twitter.com' },
              { platform: 'GitHub', url: 'https://github.com' },
            ],
          },
          isPublished: true,
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'cnt-005',
          sectionKey: 'seo_metadata',
          title: 'ManyMorgan | Premier Software Engineering & Digital Transformation Consultancy',
          subtitle:
            'ManyMorgan engineers high-performance mobile apps, modern web platforms, custom enterprise software, UI/UX systems, and AI automation for forward-thinking enterprises.',
          contentPayload: {
            canonical_base: 'https://manymorgan.com',
            keywords: [
              'software engineering',
              'mobile app development',
              'web development',
              'custom software',
              'AI automation',
              'UI/UX design',
              'enterprise digital transformation',
            ],
            og_image: '/images/og-manymorgan.png',
          },
          isPublished: true,
          updatedAt: new Date().toISOString(),
        },
      ],
      faqs: [
        {
          id: 'faq-001',
          category: 'General',
          question: 'What types of clients does ManyMorgan collaborate with?',
          answer:
            'We partner with high-growth technology startups, mid-market enterprises, and industry leaders looking to engineer robust web, mobile, custom software, or AI-driven systems.',
          displayOrder: 1,
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'faq-002',
          category: 'Engagement',
          question: 'How do we initiate a project with ManyMorgan?',
          answer:
            'You can submit our project enquiry form or schedule an architectural consultation. Our team will review your objectives, establish scope boundaries, and provide an initial technical proposal within 48 hours.',
          displayOrder: 2,
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'faq-003',
          category: 'Development',
          question: 'Who owns the intellectual property and source code?',
          answer:
            'Upon project completion and milestone settlement, you own 100% of all intellectual property, source code, designs, and architectural documentation with no proprietary vendor lock-in.',
          displayOrder: 3,
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'faq-004',
          category: 'Security',
          question: 'How does ManyMorgan safeguard confidential project data?',
          answer:
            'We enforce standard bilateral Non-Disclosure Agreements (NDAs) prior to detailed discovery, enforce encrypted communication, and implement role-based access restrictions across all project repositories.',
          displayOrder: 4,
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'faq-005',
          category: 'Delivery',
          question: 'What methodology do you utilize during software development?',
          answer:
            'We utilize an agile two-week sprint methodology featuring continuous integration, staging preview environments, bi-weekly demo check-ins, and transparent progress tracking.',
          displayOrder: 5,
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      announcements: [
        {
          id: 'ann-001',
          title: 'New Engineering Capabilities',
          message:
            'ManyMorgan has launched dedicated Enterprise AI & Autonomous Workflow integrations for 2026. Explore our updated capabilities.',
          linkLabel: 'Explore AI Services',
          linkUrl: '/services/ai-integration-and-automation',
          badgeText: 'What’s New',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      notifications: [],
      careersSettings: {
        globalStatus: 'ACTIVE',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System Seed',
      },
      opportunities: [],
      vacancyApplications: [],
      interestRegistrations: [],
    };
  }

  // --- Careers System Operations ---
  async getCareersSettings(): Promise<CareersSettings> {
    if (!this.memoryStore.careersSettings) {
      this.memoryStore.careersSettings = {
        globalStatus: 'ACTIVE',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System Initializer',
      };
      this.persistLocalStore();
    }
    return this.memoryStore.careersSettings;
  }

  async updateCareersStatus(status: CareersGlobalStatus, adminName?: string): Promise<CareersSettings> {
    const updated: CareersSettings = {
      globalStatus: status,
      updatedAt: new Date().toISOString(),
      updatedBy: adminName || 'Administrator',
    };
    this.memoryStore.careersSettings = updated;

    // In-app audit notification
    this.memoryStore.notifications.unshift({
      id: uuidv4(),
      title: `Careers System ${status === 'ACTIVE' ? 'Activated' : 'Deactivated'}`,
      message: `Global Careers status was set to ${status} by ${updated.updatedBy}.`,
      type: 'career',
      referenceId: 'careers-status',
      referenceType: 'career',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    this.persistLocalStore();
    return updated;
  }

  async getOpportunities(params?: {
    type?: OpportunityType | string;
    field?: string;
    status?: OpportunityStatus | string;
    includeUnpublished?: boolean;
    search?: string;
  }): Promise<OpportunityItem[]> {
    let list = this.memoryStore.opportunities || [];

    if (!params?.includeUnpublished) {
      list = list.filter((o) => o.isPublished);
    }

    if (params?.type && params.type !== 'All') {
      list = list.filter((o) => o.type === params.type);
    }

    if (params?.field && params.field !== 'All') {
      list = list.filter((o) => o.technicalField.toLowerCase() === params.field?.toLowerCase());
    }

    if (params?.status && (params.status as string) !== 'All') {
      list = list.filter((o) => o.status === params.status);
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.technicalField.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getOpportunityById(id: string): Promise<OpportunityItem | null> {
    const list = this.memoryStore.opportunities || [];
    return list.find((o) => o.id === id) || null;
  }

  async createOpportunity(payload: Partial<OpportunityItem>): Promise<OpportunityItem> {
    if (!this.memoryStore.opportunities) {
      this.memoryStore.opportunities = [];
    }

    const newOpp: OpportunityItem = {
      id: uuidv4(),
      title: payload.title || 'Untitled Opportunity',
      type: payload.type || 'INTERNSHIP',
      technicalField: payload.technicalField || 'General Engineering',
      description: payload.description || '',
      responsibilities: payload.responsibilities || [],
      skills: payload.skills || [],
      eligibility: payload.eligibility,
      duration: payload.duration,
      workMode: payload.workMode,
      openingsCount: payload.openingsCount,
      deadline: payload.deadline,
      isPublished: payload.isPublished ?? true,
      status: payload.status || 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.memoryStore.opportunities.unshift(newOpp);
    this.persistLocalStore();
    return newOpp;
  }

  async updateOpportunity(id: string, updates: Partial<OpportunityItem>): Promise<OpportunityItem | null> {
    if (!this.memoryStore.opportunities) return null;
    const idx = this.memoryStore.opportunities.findIndex((o) => o.id === id);
    if (idx === -1) return null;

    const updated: OpportunityItem = {
      ...this.memoryStore.opportunities[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.memoryStore.opportunities[idx] = updated;
    this.persistLocalStore();
    return updated;
  }

  async deleteOpportunity(id: string): Promise<boolean> {
    if (!this.memoryStore.opportunities) return false;
    const idx = this.memoryStore.opportunities.findIndex((o) => o.id === id);
    if (idx === -1) return false;

    this.memoryStore.opportunities.splice(idx, 1);
    this.persistLocalStore();
    return true;
  }

  // --- Vacancy Applications Operations ---
  async getVacancyApplications(params?: {
    type?: OpportunityType | string;
    field?: string;
    opportunityId?: string;
    status?: ApplicationStatus | string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: VacancyApplicationItem[]; total: number; page: number; limit: number }> {
    let list = this.memoryStore.vacancyApplications || [];

    if (params?.type && params.type !== 'All') {
      list = list.filter((a) => a.opportunityType === params.type);
    }

    if (params?.field && params.field !== 'All') {
      list = list.filter((a) => a.technicalField.toLowerCase() === params.field?.toLowerCase());
    }

    if (params?.opportunityId) {
      list = list.filter((a) => a.opportunityId === params.opportunityId);
    }

    if (params?.status && (params.status as string) !== 'All') {
      list = list.filter((a) => a.status.toLowerCase() === (params.status as string).toLowerCase());
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.fullName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.referenceNumber.toLowerCase().includes(q) ||
          a.opportunityTitle.toLowerCase().includes(q)
      );
    }

    list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = list.length;
    const page = params?.page || 1;
    const limit = params?.limit || 15;
    const startIndex = (page - 1) * limit;
    const items = list.slice(startIndex, startIndex + limit);

    return { items, total, page, limit };
  }

  async getVacancyApplicationById(id: string): Promise<VacancyApplicationItem | null> {
    const list = this.memoryStore.vacancyApplications || [];
    return list.find((a) => a.id === id || a.referenceNumber === id) || null;
  }

  async createVacancyApplication(payload: Partial<VacancyApplicationItem>): Promise<VacancyApplicationItem> {
    if (!this.memoryStore.vacancyApplications) {
      this.memoryStore.vacancyApplications = [];
    }

    const year = new Date().getFullYear();
    const count = this.memoryStore.vacancyApplications.length + 1001;
    const referenceNumber = `MM-APP-${year}-${count}`;

    const newApp: VacancyApplicationItem = {
      id: uuidv4(),
      referenceNumber,
      opportunityId: payload.opportunityId || '',
      opportunityTitle: payload.opportunityTitle || 'Opportunity',
      opportunityType: payload.opportunityType || 'INTERNSHIP',
      technicalField: payload.technicalField || 'General',
      fullName: payload.fullName || '',
      phone: payload.phone || '',
      email: payload.email || '',
      presentAddress: payload.presentAddress || '',
      resumeFileName: payload.resumeFileName || '',
      resumeOriginalName: payload.resumeOriginalName || 'resume.pdf',
      resumeMimeType: payload.resumeMimeType || 'application/pdf',
      resumeSizeBytes: payload.resumeSizeBytes || 0,
      linkedInUrl: payload.linkedInUrl,
      githubUrl: payload.githubUrl,
      portfolioUrl: payload.portfolioUrl,
      coverNote: payload.coverNote,
      consentAccepted: payload.consentAccepted ?? true,
      consentTimestamp: payload.consentTimestamp || new Date().toISOString(),
      consentVersion: payload.consentVersion || 'v1.0-2026',
      status: 'New',
      adminNotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.memoryStore.vacancyApplications.unshift(newApp);

    // Create in-app admin notification
    this.memoryStore.notifications.unshift({
      id: uuidv4(),
      title: `New ${newApp.opportunityType === 'INTERNSHIP' ? 'Internship' : 'Research'} Application: ${referenceNumber}`,
      message: `${newApp.fullName} applied for ${newApp.opportunityTitle} (${newApp.technicalField}).`,
      type: 'career',
      referenceId: newApp.id,
      referenceType: 'application',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    this.persistLocalStore();
    return newApp;
  }

  async updateVacancyApplicationStatus(
    id: string,
    status: ApplicationStatus,
    adminName?: string
  ): Promise<VacancyApplicationItem | null> {
    if (!this.memoryStore.vacancyApplications) return null;
    const app = this.memoryStore.vacancyApplications.find((a) => a.id === id);
    if (!app) return null;

    app.status = status;
    app.updatedAt = new Date().toISOString();

    if (adminName) {
      app.adminNotes.unshift({
        id: uuidv4(),
        adminName,
        noteText: `Status transitioned to ${status}`,
        createdAt: new Date().toISOString(),
      });
    }

    this.persistLocalStore();
    return app;
  }

  async addVacancyApplicationNote(
    id: string,
    adminName: string,
    noteText: string
  ): Promise<ApplicationAdminNote | null> {
    if (!this.memoryStore.vacancyApplications) return null;
    const app = this.memoryStore.vacancyApplications.find((a) => a.id === id);
    if (!app) return null;

    const note: ApplicationAdminNote = {
      id: uuidv4(),
      adminName,
      noteText,
      createdAt: new Date().toISOString(),
    };

    app.adminNotes.unshift(note);
    app.updatedAt = new Date().toISOString();
    this.persistLocalStore();
    return note;
  }

  // --- Interest Registrations Operations ---
  async getInterestRegistrations(params?: {
    preferredType?: OpportunityType | string;
    domain?: string;
    status?: InterestRegistrationStatus | string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: InterestRegistrationItem[]; total: number; page: number; limit: number }> {
    let list = this.memoryStore.interestRegistrations || [];

    if (params?.preferredType && params.preferredType !== 'All') {
      list = list.filter((i) => i.preferredType === params.preferredType);
    }

    if (params?.domain && params.domain !== 'All') {
      list = list.filter((i) => i.domain.toLowerCase() === params.domain?.toLowerCase());
    }

    if (params?.status && (params.status as string) !== 'All') {
      list = list.filter((i) => i.status.toLowerCase() === (params.status as string).toLowerCase());
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (i) =>
          i.fullName.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          i.referenceNumber.toLowerCase().includes(q) ||
          i.domain.toLowerCase().includes(q) ||
          (i.customDomain && i.customDomain.toLowerCase().includes(q))
      );
    }

    list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = list.length;
    const page = params?.page || 1;
    const limit = params?.limit || 15;
    const startIndex = (page - 1) * limit;
    const items = list.slice(startIndex, startIndex + limit);

    return { items, total, page, limit };
  }

  async getInterestRegistrationById(id: string): Promise<InterestRegistrationItem | null> {
    const list = this.memoryStore.interestRegistrations || [];
    return list.find((i) => i.id === id || i.referenceNumber === id) || null;
  }

  async createInterestRegistration(payload: Partial<InterestRegistrationItem>): Promise<InterestRegistrationItem> {
    if (!this.memoryStore.interestRegistrations) {
      this.memoryStore.interestRegistrations = [];
    }

    const year = new Date().getFullYear();
    const count = this.memoryStore.interestRegistrations.length + 2001;
    const referenceNumber = `MM-INT-${year}-${count}`;

    const newReg: InterestRegistrationItem = {
      id: uuidv4(),
      referenceNumber,
      fullName: payload.fullName || '',
      phone: payload.phone || '',
      email: payload.email || '',
      presentAddress: payload.presentAddress || '',
      preferredType: payload.preferredType || 'INTERNSHIP',
      domain: payload.domain || 'Software & Web Development',
      customDomain: payload.customDomain,
      resumeFileName: payload.resumeFileName || '',
      resumeOriginalName: payload.resumeOriginalName || 'resume.pdf',
      resumeMimeType: payload.resumeMimeType || 'application/pdf',
      resumeSizeBytes: payload.resumeSizeBytes || 0,
      linkedInUrl: payload.linkedInUrl,
      githubUrl: payload.githubUrl,
      portfolioUrl: payload.portfolioUrl,
      introduction: payload.introduction,
      consentAccepted: payload.consentAccepted ?? true,
      consentTimestamp: payload.consentTimestamp || new Date().toISOString(),
      consentVersion: payload.consentVersion || 'v1.0-2026',
      status: 'New',
      adminNotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.memoryStore.interestRegistrations.unshift(newReg);

    // Create in-app admin notification
    this.memoryStore.notifications.unshift({
      id: uuidv4(),
      title: `General Interest Registered: ${referenceNumber}`,
      message: `${newReg.fullName} registered future interest in ${newReg.preferredType} (${newReg.domain}).`,
      type: 'career',
      referenceId: newReg.id,
      referenceType: 'interest',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    this.persistLocalStore();
    return newReg;
  }

  async updateInterestRegistrationStatus(
    id: string,
    status: InterestRegistrationStatus,
    adminName?: string
  ): Promise<InterestRegistrationItem | null> {
    if (!this.memoryStore.interestRegistrations) return null;
    const reg = this.memoryStore.interestRegistrations.find((i) => i.id === id);
    if (!reg) return null;

    reg.status = status;
    reg.updatedAt = new Date().toISOString();

    if (adminName) {
      reg.adminNotes.unshift({
        id: uuidv4(),
        adminName,
        noteText: `Status updated to ${status}`,
        createdAt: new Date().toISOString(),
      });
    }

    this.persistLocalStore();
    return reg;
  }

  async addInterestRegistrationNote(
    id: string,
    adminName: string,
    noteText: string
  ): Promise<ApplicationAdminNote | null> {
    if (!this.memoryStore.interestRegistrations) return null;
    const reg = this.memoryStore.interestRegistrations.find((i) => i.id === id);
    if (!reg) return null;

    const note: ApplicationAdminNote = {
      id: uuidv4(),
      adminName,
      noteText,
      createdAt: new Date().toISOString(),
    };

    reg.adminNotes.unshift(note);
    reg.updatedAt = new Date().toISOString();
    this.persistLocalStore();
    return note;
  }

  // --- Careers Overview Stats ---
  async getCareersStats() {
    const opps = this.memoryStore.opportunities || [];
    const apps = this.memoryStore.vacancyApplications || [];
    const interests = this.memoryStore.interestRegistrations || [];
    const settings = await this.getCareersSettings();

    const totalOpportunities = opps.length;
    const activeOpportunities = opps.filter((o) => o.isPublished && o.status === 'OPEN').length;
    const totalApplications = apps.length;
    const newApplications = apps.filter((a) => a.status === 'New').length;
    const totalInterest = interests.length;
    const newInterest = interests.filter((i) => i.status === 'New').length;

    return {
      globalStatus: settings.globalStatus,
      updatedAt: settings.updatedAt,
      updatedBy: settings.updatedBy,
      totalOpportunities,
      activeOpportunities,
      totalApplications,
      newApplications,
      totalInterest,
      newInterest,
      recentApplications: apps.slice(0, 5),
      recentInterest: interests.slice(0, 5),
    };
  }

  private getDefaultMediaSeed(): MediaItem[] {
    const now = new Date().toISOString();
    return [
      {
        id: 'med-001',
        fileName: 'manymorgan-hero.mp4',
        originalName: 'manymorgan-hero.mp4',
        mimeType: 'video/mp4',
        sizeBytes: 15420000,
        url: '/videos/manymorgan-hero.mp4',
        fileType: 'video',
        usedIn: ['Homepage Hero Background'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'med-002',
        fileName: 'hero-poster.jpg',
        originalName: 'hero-poster.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 420000,
        url: '/videos/hero-poster.jpg',
        fileType: 'image',
        usedIn: ['Homepage Hero Poster', 'Careers Hero Poster'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'med-003',
        fileName: 'careers_backgound.mp4',
        originalName: 'careers_backgound.mp4',
        mimeType: 'video/mp4',
        sizeBytes: 18200000,
        url: '/videos/careers_backgound.mp4',
        fileType: 'video',
        usedIn: ['Careers Hero Background'],
        createdAt: now,
        updatedAt: now,
      },
    ];
  }

  private getDefaultWebsiteSettings(): Record<string, any> {
    return {
      organizationName: 'ManyMorgan Engineering & Tech',
      legalEntityName: 'ManyMorgan Technology Consultancy LLC',
      brandTagline: 'Engineering Transformative Digital Solutions',
      primaryDomain: 'https://manymorgan.com',
      contactEmail: 'contact@manymorgan.com',
      scopingEmail: 'projects@manymorgan.com',
      phoneNumber: '+1 (800) 555-0199',
      defaultCurrency: 'USD ($)',
      defaultTimezone: 'America/New_York (EST)',
      adminNotificationEmail: 'admin@manymorgan.com',
      notifyOnServiceEnquiry: true,
      notifyOnQuoteRequest: true,
      notifyOnApplication: true,
      analyticsId: '',
      tagManagerId: '',
      updatedAt: new Date().toISOString(),
    };
  }

  getDefaultCategoriesSeed(): ServiceCategoryItem[] {
    return [
      {
        id: 'cat-01',
        slug: 'artificial-intelligence-and-data',
        title: 'Artificial Intelligence & Data',
        iconName: 'Bot',
        shortDescription: 'Enterprise generative AI, intelligent autonomous agents, machine learning, and high-throughput data intelligence.',
        displayOrder: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cat-02',
        slug: 'software-and-product-engineering',
        title: 'Software & Product Engineering',
        iconName: 'Code',
        shortDescription: 'End-to-end full-stack software, mobile iOS/Android applications, SaaS platforms, and enterprise microservices.',
        displayOrder: 2,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cat-03',
        slug: 'cloud-and-devops',
        title: 'Cloud & DevOps',
        iconName: 'Server',
        shortDescription: 'Multi-cloud architectures, Kubernetes orchestration, CI/CD automation pipelines, and infrastructure as code.',
        displayOrder: 3,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cat-04',
        slug: 'cybersecurity',
        title: 'Cybersecurity',
        iconName: 'ShieldCheck',
        shortDescription: 'Zero-trust security postures, penetration testing, compliance governance (SOC2, GDPR, HIPAA), and cryptographic security.',
        displayOrder: 4,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cat-05',
        slug: 'data-engineering-and-analytics',
        title: 'Data Engineering & Analytics',
        iconName: 'Database',
        shortDescription: 'Real-time ETL data pipelines, modern lakehouse architectures, distributed data warehousing, and business intelligence.',
        displayOrder: 5,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cat-06',
        slug: 'digital-experience-and-design',
        title: 'Digital Experience & Design',
        iconName: 'Palette',
        shortDescription: 'Conversion-engineered UI/UX design systems, responsive web flagships, interactive prototyping, and brand digital transformation.',
        displayOrder: 6,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cat-07',
        slug: 'enterprise-solutions',
        title: 'Enterprise Solutions',
        iconName: 'Building',
        shortDescription: 'Scalable ERP integrations, CRM enterprise orchestration, legacy modernization, and distributed enterprise backbones.',
        displayOrder: 7,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cat-08',
        slug: 'business-process-automation',
        title: 'Business Process Automation',
        iconName: 'Cpu',
        shortDescription: 'Intelligent document processing, robotic process automation (RPA), workflow orchestration, and operational telemetry.',
        displayOrder: 8,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cat-09',
        slug: 'it-consulting-and-digital-transformation',
        title: 'IT Consulting & Digital Transformation',
        iconName: 'Compass',
        shortDescription: 'Technology roadmap blueprinting, cloud migration strategies, architectural feasibility audits, and vendor evaluation.',
        displayOrder: 9,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cat-10',
        slug: 'quality-engineering-and-testing',
        title: 'Quality Engineering & Testing',
        iconName: 'CheckCircle2',
        shortDescription: 'Automated test suites, concurrency stress benchmarking, end-to-end regression pipelines, and QA automation.',
        displayOrder: 10,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cat-11',
        slug: 'managed-it-and-technology-operations',
        title: 'Managed IT & Technology Operations',
        iconName: 'Building2',
        shortDescription: '24/7/365 site reliability engineering (SRE), APM synthetic monitoring, incident remediation, and SLA-backed maintenance.',
        displayOrder: 11,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cat-12',
        slug: 'engineering-and-emerging-technologies',
        title: 'Engineering & Emerging Technologies',
        iconName: 'Cpu',
        shortDescription: 'Edge computing, IoT distributed telemetry, blockchain/smart contracts, and hardware-software embedded systems.',
        displayOrder: 12,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cat-13',
        slug: 'industry-specific-solutions',
        title: 'Industry-Specific Solutions',
        iconName: 'Building',
        shortDescription: 'Domain-tailored technology platforms engineered for FinTech, Healthcare, Logistics, Retail, and Industrial operations.',
        displayOrder: 13,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  async getServiceCategories(): Promise<ServiceCategoryItem[]> {
    if (!this.memoryStore.serviceCategories || this.memoryStore.serviceCategories.length === 0) {
      this.memoryStore.serviceCategories = this.getDefaultCategoriesSeed();
      this.persistLocalStore();
    }
    return [...this.memoryStore.serviceCategories].sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
  }

  async createServiceCategory(data: Partial<ServiceCategoryItem>): Promise<ServiceCategoryItem> {
    if (!this.memoryStore.serviceCategories) {
      this.memoryStore.serviceCategories = this.getDefaultCategoriesSeed();
    }
    const title = (data.title || 'New Category').trim();
    const slug = data.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat: ServiceCategoryItem = {
      id: data.id || `cat-${uuidv4().slice(0, 8)}`,
      slug,
      title,
      iconName: data.iconName || 'Layers',
      shortDescription: data.shortDescription || '',
      displayOrder: data.displayOrder ?? this.memoryStore.serviceCategories.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memoryStore.serviceCategories.push(newCat);
    this.persistLocalStore();
    return newCat;
  }

  async updateServiceCategory(id: string, updates: Partial<ServiceCategoryItem>): Promise<ServiceCategoryItem | null> {
    if (!this.memoryStore.serviceCategories) return null;
    const idx = this.memoryStore.serviceCategories.findIndex((c) => c.id === id || c.slug === id);
    if (idx === -1) return null;

    const oldTitle = this.memoryStore.serviceCategories[idx].title;
    const updated = {
      ...this.memoryStore.serviceCategories[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.memoryStore.serviceCategories[idx] = updated;

    if (updates.title && updates.title !== oldTitle) {
      this.memoryStore.services.forEach((s) => {
        if (s.categoryTitle === oldTitle) {
          s.categoryTitle = updates.title;
        }
      });
    }

    this.persistLocalStore();
    return updated;
  }

  async deleteServiceCategory(id: string): Promise<boolean> {
    if (!this.memoryStore.serviceCategories) return false;
    const initialLen = this.memoryStore.serviceCategories.length;
    this.memoryStore.serviceCategories = this.memoryStore.serviceCategories.filter(
      (c) => c.id !== id && c.slug !== id
    );
    if (this.memoryStore.serviceCategories.length !== initialLen) {
      this.persistLocalStore();
      return true;
    }
    return false;
  }
}

