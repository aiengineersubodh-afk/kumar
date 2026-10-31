// Common domain types for ManyMorgan Backend

export interface AdminProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'admin' | 'editor';
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceBenefit {
  title: string;
  description: string;
  icon: string;
}

export interface ServiceProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ServiceTechStackItem {
  name: string;
  category: string;
}

export interface ServiceCategoryItem {
  id: string;
  slug: string;
  title: string;
  iconName?: string;
  shortDescription?: string;
  displayOrder?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  heroBadge: string;
  categoryTitle?: string;
  categorySlug?: string;
  backgroundImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  benefits: ServiceBenefit[];
  processSteps: ServiceProcessStep[];
  deliverables: string[];
  techStack: ServiceTechStackItem[];
  faqs: ServiceFAQ[];
  ctaTitle: string;
  ctaSubtitle: string;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost';
export type EnquiryPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface EnquiryNote {
  id: string;
  enquiryId: string;
  adminId?: string;
  adminName: string;
  noteText: string;
  createdAt: string;
}

export interface EnquiryStatusHistoryItem {
  id: string;
  enquiryId: string;
  changedBy?: string;
  adminName?: string;
  oldStatus?: EnquiryStatus;
  newStatus: EnquiryStatus;
  comment?: string;
  createdAt: string;
}

export interface CommunicationRecord {
  id: string;
  enquiryId: string;
  sentBy?: string;
  adminName: string;
  recipientEmail: string;
  subject: string;
  bodyText: string;
  messageType: 'email' | 'status_update' | 'quote';
  deliveryStatus: 'sent' | 'failed' | 'delivered' | 'pending';
  createdAt: string;
}

export interface EnquiryItem {
  id: string;
  enquiryNumber: string; // e.g. MM-2026-1001
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  companyName?: string;
  serviceId?: string;
  serviceName: string;
  sourceTitle?: string;
  submissionType?: string;
  budgetRange?: string;
  expectedTimeline?: string;
  projectDescription: string;
  fileAttachmentUrl?: string;
  marketingConsent: boolean;
  privacyPolicyAccepted: boolean;
  status: EnquiryStatus;
  priority: EnquiryPriority;
  assignedAdminId?: string;
  assignedAdminName?: string;
  followUpDate?: string;
  isArchived: boolean;
  ipHash?: string;
  sourceUrl?: string;
  notes: EnquiryNote[];
  statusHistory: EnquiryStatusHistoryItem[];
  communications: CommunicationRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface ContentRevision {
  revisionId: string;
  publishedAt: string;
  publishedBy: string;
  payload: Record<string, any>;
  title?: string;
  subtitle?: string;
}

export interface WebsiteContentItem {
  id: string;
  sectionKey: string;
  title: string;
  subtitle: string;
  contentPayload: Record<string, any>;
  draftPayload?: Record<string, any>;
  hasDraft?: boolean;
  revisions?: ContentRevision[];
  isPublished: boolean;
  publishedAt?: string;
  publishedBy?: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  fileType: 'image' | 'video' | 'document';
  usedIn: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GeneralFaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  linkLabel?: string;
  linkUrl?: string;
  badgeText: string;
  isActive: boolean;
  startsAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  recipientAdminId?: string;
  title: string;
  message: string;
  type: 'enquiry' | 'system' | 'reminder' | 'alert' | 'career';
  referenceId?: string;
  referenceType?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export type CareersGlobalStatus = 'ACTIVE' | 'INACTIVE';
export type OpportunityType = 'INTERNSHIP' | 'RESEARCH';
export type OpportunityStatus = 'OPEN' | 'CLOSED' | 'ARCHIVED';
export type ApplicationStatus =
  | 'New'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Rejected'
  | 'Withdrawn';

export type InterestRegistrationStatus = 'New' | 'Reviewed' | 'Contacted' | 'Archived';

export interface CareersSettings {
  globalStatus: CareersGlobalStatus;
  updatedAt: string;
  updatedBy?: string;
}

export interface OpportunityItem {
  id: string;
  title: string;
  type: OpportunityType;
  technicalField: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  eligibility?: string;
  duration?: string;
  workMode?: string;
  openingsCount?: number;
  deadline?: string;
  isPublished: boolean;
  status: OpportunityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationAdminNote {
  id: string;
  adminName: string;
  noteText: string;
  createdAt: string;
}

export interface VacancyApplicationItem {
  id: string;
  referenceNumber: string;
  opportunityId: string;
  opportunityTitle: string;
  opportunityType: OpportunityType;
  technicalField: string;
  fullName: string;
  phone: string;
  email: string;
  presentAddress: string;
  resumeFileName: string;
  resumeOriginalName: string;
  resumeMimeType: string;
  resumeSizeBytes: number;
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  coverNote?: string;
  consentAccepted: boolean;
  consentTimestamp: string;
  consentVersion: string;
  status: ApplicationStatus;
  adminNotes: ApplicationAdminNote[];
  createdAt: string;
  updatedAt: string;
}

export interface InterestRegistrationItem {
  id: string;
  referenceNumber: string;
  fullName: string;
  phone: string;
  email: string;
  presentAddress: string;
  preferredType: OpportunityType;
  domain: string;
  customDomain?: string;
  resumeFileName: string;
  resumeOriginalName: string;
  resumeMimeType: string;
  resumeSizeBytes: number;
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  introduction?: string;
  consentAccepted: boolean;
  consentTimestamp: string;
  consentVersion: string;
  status: InterestRegistrationStatus;
  adminNotes: ApplicationAdminNote[];
  createdAt: string;
  updatedAt: string;
}

