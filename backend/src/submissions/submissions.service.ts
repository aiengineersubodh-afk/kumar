import { Injectable, NotFoundException } from '@nestjs/common';
import { StoreService } from '../common/store.service.js';
import {
  ApplicationStatus,
  EnquiryItem,
  EnquiryStatus,
  InterestRegistrationItem,
  InterestRegistrationStatus,
  VacancyApplicationItem,
} from '../common/types.js';

export type SubmissionTab =
  | 'all'
  | 'service_enquiries'
  | 'quote'
  | 'contact'
  | 'internship'
  | 'research'
  | 'careers_interest';

export interface UnifiedSubmission {
  id: string;
  submissionType: 'service_enquiry' | 'quote' | 'contact' | 'internship_application' | 'research_application' | 'careers_interest';
  typeLabel: string;
  referenceNumber: string;
  fullName: string;
  email: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  companyName?: string;
  serviceOrDomain: string;
  budgetRange?: string;
  expectedTimeline?: string;
  projectDescription?: string;
  presentAddress?: string;
  resumeFileName?: string;
  resumeOriginalName?: string;
  resumeSizeBytes?: number;
  resumeDownloadUrl?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  status: string;
  priority?: string;
  notes: { id: string; adminName: string; noteText: string; createdAt: string }[];
  statusHistory: { id: string; adminName?: string; oldStatus?: string; newStatus: string; comment?: string; createdAt: string }[];
  createdAt: string;
  updatedAt?: string;
}

@Injectable()
export class SubmissionsService {
  constructor(private readonly storeService: StoreService) {}

  private mapEnquiryToUnified(e: EnquiryItem): UnifiedSubmission {
    let subType: 'service_enquiry' | 'quote' | 'contact' = 'service_enquiry';
    let typeLabel = 'Service Consultation';

    const source = (e.sourceTitle || '').toLowerCase();
    const service = (e.serviceName || '').toLowerCase();
    const desc = (e.projectDescription || '').toLowerCase();

    if (
      source.includes('quote') ||
      source.includes('scoping') ||
      service.includes('scoping') ||
      desc.includes('scoping')
    ) {
      subType = 'quote';
      typeLabel = 'Get a Quote';
    } else if (
      source.includes('contact') ||
      source.includes('leadership') ||
      service.includes('direct leadership contact')
    ) {
      subType = 'contact';
      typeLabel = 'Contact Enquiry';
    }

    return {
      id: e.id,
      submissionType: subType,
      typeLabel,
      referenceNumber: e.enquiryNumber,
      fullName: e.fullName,
      email: e.email,
      phoneCountryCode: e.phoneCountryCode,
      phoneNumber: e.phoneNumber,
      companyName: e.companyName,
      serviceOrDomain: e.serviceName,
      budgetRange: e.budgetRange,
      expectedTimeline: e.expectedTimeline,
      projectDescription: e.projectDescription,
      status: e.status,
      priority: e.priority,
      notes: e.notes || [],
      statusHistory: e.statusHistory || [],
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    };
  }

  private mapVacancyToUnified(v: VacancyApplicationItem): UnifiedSubmission {
    const isInternship = v.opportunityType === 'INTERNSHIP';
    return {
      id: v.id,
      submissionType: isInternship ? 'internship_application' : 'research_application',
      typeLabel: isInternship ? 'Internship Application' : 'Research Application',
      referenceNumber: v.referenceNumber,
      fullName: v.fullName,
      email: v.email,
      phoneNumber: v.phone,
      serviceOrDomain: v.opportunityTitle || v.technicalField,
      presentAddress: v.presentAddress,
      resumeFileName: v.resumeFileName,
      resumeOriginalName: v.resumeOriginalName,
      resumeSizeBytes: v.resumeSizeBytes,
      resumeDownloadUrl: v.resumeFileName ? `/api/careers/resumes/${v.resumeFileName}` : undefined,
      linkedInUrl: v.linkedInUrl,
      githubUrl: v.githubUrl,
      portfolioUrl: v.portfolioUrl,
      projectDescription: v.coverNote,
      status: v.status,
      notes: (v.adminNotes || []).map((n) => ({
        id: n.id,
        adminName: n.adminName,
        noteText: n.noteText,
        createdAt: n.createdAt,
      })),
      statusHistory: [],
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    };
  }

  private mapInterestToUnified(i: InterestRegistrationItem): UnifiedSubmission {
    return {
      id: i.id,
      submissionType: 'careers_interest',
      typeLabel: `Future Interest (${i.preferredType === 'RESEARCH' ? 'Research' : 'Internship'})`,
      referenceNumber: i.referenceNumber,
      fullName: i.fullName,
      email: i.email,
      phoneNumber: i.phone,
      serviceOrDomain: i.customDomain ? `${i.domain} (${i.customDomain})` : i.domain,
      presentAddress: i.presentAddress,
      resumeFileName: i.resumeFileName,
      resumeOriginalName: i.resumeOriginalName,
      resumeSizeBytes: i.resumeSizeBytes,
      resumeDownloadUrl: i.resumeFileName ? `/api/careers/resumes/${i.resumeFileName}` : undefined,
      linkedInUrl: i.linkedInUrl,
      githubUrl: i.githubUrl,
      portfolioUrl: i.portfolioUrl,
      projectDescription: i.introduction,
      status: i.status,
      notes: (i.adminNotes || []).map((n) => ({
        id: n.id,
        adminName: n.adminName,
        noteText: n.noteText,
        createdAt: n.createdAt,
      })),
      statusHistory: [],
      createdAt: i.createdAt,
      updatedAt: i.updatedAt,
    };
  }

  async getAllSubmissions(params: {
    tab?: SubmissionTab;
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    sort?: 'newest' | 'oldest';
    page?: number;
    limit?: number;
  }) {
    const enquiriesRes = await this.storeService.getEnquiries({ page: 1, limit: 10000 });
    const enquiries = enquiriesRes.items || [];
    const vacanciesRes = await this.storeService.getVacancyApplications({ limit: 10000 });
    const vacancies = vacanciesRes.items || [];
    const interestsRes = await this.storeService.getInterestRegistrations({ limit: 10000 });
    const interests = interestsRes.items || [];

    // Map all into unified collection
    const allUnified: UnifiedSubmission[] = [
      ...enquiries.map((e) => this.mapEnquiryToUnified(e)),
      ...vacancies.map((v) => this.mapVacancyToUnified(v)),
      ...interests.map((i) => this.mapInterestToUnified(i)),
    ];

    // Compute counts by tab
    const counts: Record<string, number> = {
      all: allUnified.length,
      service_enquiries: allUnified.filter((s) => s.submissionType === 'service_enquiry').length,
      quote: allUnified.filter((s) => s.submissionType === 'quote').length,
      contact: allUnified.filter((s) => s.submissionType === 'contact').length,
      internship: allUnified.filter((s) => s.submissionType === 'internship_application').length,
      research: allUnified.filter((s) => s.submissionType === 'research_application').length,
      careers_interest: allUnified.filter((s) => s.submissionType === 'careers_interest').length,
    };

    let filtered = allUnified;

    // Filter by tab
    if (params.tab && params.tab !== 'all') {
      if (params.tab === 'service_enquiries') {
        filtered = filtered.filter((s) => s.submissionType === 'service_enquiry');
      } else if (params.tab === 'quote') {
        filtered = filtered.filter((s) => s.submissionType === 'quote');
      } else if (params.tab === 'contact') {
        filtered = filtered.filter((s) => s.submissionType === 'contact');
      } else if (params.tab === 'internship') {
        filtered = filtered.filter((s) => s.submissionType === 'internship_application');
      } else if (params.tab === 'research') {
        filtered = filtered.filter((s) => s.submissionType === 'research_application');
      } else if (params.tab === 'careers_interest') {
        filtered = filtered.filter((s) => s.submissionType === 'careers_interest');
      }
    }

    // Filter by search
    if (params.search && params.search.trim().length > 0) {
      const q = params.search.trim().toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.phoneNumber && s.phoneNumber.toLowerCase().includes(q)) ||
          s.referenceNumber.toLowerCase().includes(q) ||
          s.serviceOrDomain.toLowerCase().includes(q)
      );
    }

    // Filter by status
    if (params.status && params.status !== 'All') {
      filtered = filtered.filter((s) => s.status.toLowerCase() === params.status?.toLowerCase());
    }

    // Filter by date range
    if (params.startDate) {
      const startMs = new Date(params.startDate).getTime();
      filtered = filtered.filter((s) => new Date(s.createdAt).getTime() >= startMs);
    }
    if (params.endDate) {
      const endMs = new Date(params.endDate).getTime();
      filtered = filtered.filter((s) => new Date(s.createdAt).getTime() <= endMs);
    }

    // Sort
    const isOldest = params.sort === 'oldest';
    filtered.sort((a, b) => {
      const tA = new Date(a.createdAt).getTime();
      const tB = new Date(b.createdAt).getTime();
      return isOldest ? tA - tB : tB - tA;
    });

    const total = filtered.length;
    const page = params.page || 1;
    const limit = params.limit || 15;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      items: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      counts,
    };
  }

  async getSubmissionById(id: string): Promise<UnifiedSubmission> {
    const list = await this.getAllSubmissions({ tab: 'all', limit: 100000 });
    const found = list.items.find((s) => s.id === id);
    if (!found) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    return found;
  }

  async updateStatus(id: string, newStatus: string, adminName: string, comment?: string): Promise<{ success: boolean }> {
    const submission = await this.getSubmissionById(id);

    if (['service_enquiry', 'quote', 'contact'].includes(submission.submissionType)) {
      await this.storeService.updateEnquiryStatus(id, newStatus as EnquiryStatus, adminName, comment);
    } else if (['internship_application', 'research_application'].includes(submission.submissionType)) {
      await this.storeService.updateVacancyApplicationStatus(id, newStatus as ApplicationStatus, adminName);
    } else if (submission.submissionType === 'careers_interest') {
      await this.storeService.updateInterestRegistrationStatus(id, newStatus as InterestRegistrationStatus, adminName);
    }

    return { success: true };
  }

  async addNote(id: string, noteText: string, adminName: string): Promise<{ success: boolean }> {
    const submission = await this.getSubmissionById(id);

    if (['service_enquiry', 'quote', 'contact'].includes(submission.submissionType)) {
      await this.storeService.addEnquiryNote(id, adminName, noteText);
    } else if (['internship_application', 'research_application'].includes(submission.submissionType)) {
      await this.storeService.addVacancyApplicationNote(id, adminName, noteText);
    } else if (submission.submissionType === 'careers_interest') {
      await this.storeService.addInterestRegistrationNote(id, adminName, noteText);
    }

    return { success: true };
  }

  async exportCsv(params: { tab?: SubmissionTab; search?: string; status?: string }): Promise<string> {
    const res = await this.getAllSubmissions({ ...params, page: 1, limit: 100000 });
    const headers = [
      'Reference ID',
      'Submission Type',
      'Full Name',
      'Email',
      'Phone',
      'Service / Track Domain',
      'Budget Range',
      'Expected Timeline',
      'Status',
      'Resume Attachment',
      'Submitted Date',
    ];

    const escapeCsv = (val: any) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = res.items.map((s) => [
      escapeCsv(s.referenceNumber),
      escapeCsv(s.typeLabel),
      escapeCsv(s.fullName),
      escapeCsv(s.email),
      escapeCsv(s.phoneNumber || ''),
      escapeCsv(s.serviceOrDomain || ''),
      escapeCsv(s.budgetRange || ''),
      escapeCsv(s.expectedTimeline || ''),
      escapeCsv(s.status),
      escapeCsv(s.resumeOriginalName || s.resumeFileName || ''),
      escapeCsv(s.createdAt),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  }
}
