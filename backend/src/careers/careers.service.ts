import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { StoreService } from '../common/store.service.js';
import {
  ApplicationStatus,
  CareersGlobalStatus,
  InterestRegistrationStatus,
  OpportunityStatus,
  OpportunityType,
} from '../common/types.js';
import { CreateOpportunityDto } from './dto/create-opportunity.dto.js';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto.js';
import { ApplyVacancyDto } from './dto/apply-vacancy.dto.js';
import { RegisterInterestDto } from './dto/register-interest.dto.js';

export interface UploadedMulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class CareersService {
  private readonly logger = new Logger(CareersService.name);
  private readonly uploadDir: string;

  constructor(private readonly storeService: StoreService) {
    this.uploadDir = path.resolve(process.cwd(), 'data', 'resumes');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // --- Resume Validation & Storage Handling ---
  async validateAndStoreResume(file?: UploadedMulterFile): Promise<{
    fileName: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
  }> {
    if (!file || !file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('A valid CV/resume file (.pdf or .docx) is required');
    }

    // 5 MB maximum file size limit
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes || file.buffer.length > maxSizeBytes) {
      throw new BadRequestException('Resume file size exceeds the 5 MB maximum limit');
    }

    // Validate file signatures (Magic Bytes)
    // PDF magic bytes: %PDF- (0x25, 0x50, 0x44, 0x46)
    // DOCX magic bytes: PK\x03\x04 (0x50, 0x4B, 0x03, 0x04)
    const buf = file.buffer;
    const isPdf =
      buf.length >= 4 &&
      buf[0] === 0x25 &&
      buf[1] === 0x50 &&
      buf[2] === 0x44 &&
      buf[3] === 0x46;

    const isDocx =
      buf.length >= 4 &&
      buf[0] === 0x50 &&
      buf[1] === 0x4b &&
      buf[2] === 0x03 &&
      buf[3] === 0x04;

    if (!isPdf && !isDocx) {
      throw new BadRequestException(
        'Invalid document signature. Please upload a genuine, uncorrupted PDF or DOCX file.'
      );
    }

    const ext = isPdf ? '.pdf' : '.docx';
    const safeFileName = `resume_${uuidv4()}${ext}`;
    const destinationPath = path.join(this.uploadDir, safeFileName);

    // Sanitize original filename for display, preventing path traversal
    const sanitizedOriginalName = path.basename(file.originalname || `resume${ext}`).replace(/[^\w.-]/g, '_');

    try {
      fs.writeFileSync(destinationPath, file.buffer);
    } catch (err) {
      this.logger.error(`Failed to securely save resume: ${err}`);
      throw new BadRequestException('Could not persist resume file. Please try again.');
    }

    return {
      fileName: safeFileName,
      originalName: sanitizedOriginalName,
      mimeType: isPdf
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      sizeBytes: file.size,
    };
  }

  getResumeFilePath(fileName: string): { filePath: string; fileName: string } {
    // Prevent any directory traversal
    const safeName = path.basename(fileName);
    if (safeName !== fileName || fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      throw new BadRequestException('Invalid file identifier');
    }

    const filePath = path.join(this.uploadDir, safeName);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Requested resume file was not found');
    }

    return { filePath, fileName: safeName };
  }

  // --- Public Careers Methods ---
  async getPublicStatus() {
    const settings = await this.storeService.getCareersSettings();
    return {
      globalStatus: settings.globalStatus,
      updatedAt: settings.updatedAt,
    };
  }

  async getPublicOpportunities(params?: {
    type?: OpportunityType;
    field?: string;
    search?: string;
  }) {
    const settings = await this.storeService.getCareersSettings();
    if (settings.globalStatus !== 'ACTIVE') {
      return [];
    }

    const opportunities = await this.storeService.getOpportunities({
      type: params?.type,
      field: params?.field,
      search: params?.search,
      includeUnpublished: false,
      status: 'OPEN',
    });

    const now = Date.now();
    return opportunities.filter((o) => {
      if (o.deadline) {
        const d = new Date(o.deadline).getTime();
        if (!isNaN(d) && d < now) {
          return false;
        }
      }
      return true;
    });
  }

  async getPublicOpportunityById(id: string) {
    const settings = await this.storeService.getCareersSettings();
    if (settings.globalStatus !== 'ACTIVE') {
      throw new ConflictException('Applications for current roles are closed at this time.');
    }

    const opp = await this.storeService.getOpportunityById(id);
    if (!opp || !opp.isPublished || opp.status !== 'OPEN') {
      throw new NotFoundException('Opportunity not found or no longer open for applications.');
    }

    if (opp.deadline) {
      const d = new Date(opp.deadline).getTime();
      if (!isNaN(d) && d < Date.now()) {
        throw new BadRequestException('The deadline for this opportunity has passed.');
      }
    }

    return opp;
  }

  async submitVacancyApplication(dto: ApplyVacancyDto, file: UploadedMulterFile, ip?: string) {
    // 1. Anti-spam honeypot
    if (dto.website_hp && dto.website_hp.trim().length > 0) {
      throw new BadRequestException('Submission rejected');
    }

    // 2. Careers Status check (Strict backend enforcement)
    const settings = await this.storeService.getCareersSettings();
    if (settings.globalStatus !== 'ACTIVE') {
      throw new ConflictException(
        'Applications for current roles are closed at this time. You are welcome to submit an expression of interest for future opportunities.'
      );
    }

    // 3. Opportunity existence and status check
    const opp = await this.storeService.getOpportunityById(dto.opportunityId);
    if (!opp || !opp.isPublished || opp.status !== 'OPEN') {
      throw new NotFoundException('Selected opportunity is not currently accepting applications.');
    }

    if (opp.deadline) {
      const d = new Date(opp.deadline).getTime();
      if (!isNaN(d) && d < Date.now()) {
        throw new BadRequestException('The application deadline for this opportunity has passed.');
      }
    }

    // 4. Consent verification
    const consent = dto.consentAccepted === true || dto.consentAccepted === 'true';
    if (!consent) {
      throw new BadRequestException('You must agree to the recruitment processing consent.');
    }

    // 5. File upload validation & storage
    const storedFile = await this.validateAndStoreResume(file);

    // 6. Record persistence
    const application = await this.storeService.createVacancyApplication({
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      opportunityType: opp.type,
      technicalField: opp.technicalField,
      fullName: dto.fullName.trim(),
      phone: dto.phone.trim(),
      email: dto.email.trim().toLowerCase(),
      presentAddress: dto.presentAddress.trim(),
      resumeFileName: storedFile.fileName,
      resumeOriginalName: storedFile.originalName,
      resumeMimeType: storedFile.mimeType,
      resumeSizeBytes: storedFile.sizeBytes,
      linkedInUrl: dto.linkedInUrl?.trim(),
      githubUrl: dto.githubUrl?.trim(),
      portfolioUrl: dto.portfolioUrl?.trim(),
      coverNote: dto.coverNote?.trim(),
      consentAccepted: true,
      consentTimestamp: new Date().toISOString(),
      consentVersion: 'v1.0-2026',
    });

    this.logger.log(`Created vacancy application ${application.referenceNumber} from ${application.email}`);

    return {
      success: true,
      referenceNumber: application.referenceNumber,
      message:
        'Thank you for your interest in ManyMorgan. Your application has been received. Please keep the reference number below for your records.',
    };
  }

  async submitInterestRegistration(dto: RegisterInterestDto, file: UploadedMulterFile, ip?: string) {
    // 1. Anti-spam honeypot
    if (dto.website_hp && dto.website_hp.trim().length > 0) {
      throw new BadRequestException('Submission rejected');
    }

    // 2. Consent verification
    const consent = dto.consentAccepted === true || dto.consentAccepted === 'true';
    if (!consent) {
      throw new BadRequestException('You must agree to the future recruitment processing consent.');
    }

    // 3. File upload validation & storage
    const storedFile = await this.validateAndStoreResume(file);

    // 4. Record persistence
    const reg = await this.storeService.createInterestRegistration({
      fullName: dto.fullName.trim(),
      phone: dto.phone.trim(),
      email: dto.email.trim().toLowerCase(),
      presentAddress: dto.presentAddress.trim(),
      preferredType: dto.preferredType as OpportunityType,
      domain: dto.domain.trim(),
      customDomain: dto.customDomain?.trim(),
      resumeFileName: storedFile.fileName,
      resumeOriginalName: storedFile.originalName,
      resumeMimeType: storedFile.mimeType,
      resumeSizeBytes: storedFile.sizeBytes,
      linkedInUrl: dto.linkedInUrl?.trim(),
      githubUrl: dto.githubUrl?.trim(),
      portfolioUrl: dto.portfolioUrl?.trim(),
      introduction: dto.introduction?.trim(),
      consentAccepted: true,
      consentTimestamp: new Date().toISOString(),
      consentVersion: 'v1.0-2026',
    });

    this.logger.log(`Created general interest registration ${reg.referenceNumber} from ${reg.email}`);

    return {
      success: true,
      referenceNumber: reg.referenceNumber,
      message:
        'Your details have been received and added to our future-opportunities register. If a suitable internship or research opportunity becomes available, the ManyMorgan team may contact you using the contact information you provided. This registration does not guarantee an opening or selection.',
    };
  }

  // --- Admin Operations ---
  async getAdminSettings() {
    return this.storeService.getCareersSettings();
  }

  async activateCareers(adminName: string) {
    const updated = await this.storeService.updateCareersStatus('ACTIVE', adminName);
    this.logger.log(`Careers system activated by ${adminName}`);
    return {
      success: true,
      status: updated.globalStatus,
      updatedAt: updated.updatedAt,
      updatedBy: updated.updatedBy,
    };
  }

  async deactivateCareers(adminName: string) {
    const updated = await this.storeService.updateCareersStatus('INACTIVE', adminName);
    this.logger.log(`Careers system deactivated by ${adminName}`);
    return {
      success: true,
      status: updated.globalStatus,
      updatedAt: updated.updatedAt,
      updatedBy: updated.updatedBy,
    };
  }

  async getAdminStats() {
    return this.storeService.getCareersStats();
  }

  async getAdminOpportunities(params?: {
    type?: OpportunityType;
    field?: string;
    status?: OpportunityStatus;
    search?: string;
  }) {
    return this.storeService.getOpportunities({
      ...params,
      includeUnpublished: true,
    });
  }

  async createOpportunity(dto: CreateOpportunityDto) {
    return this.storeService.createOpportunity({
      ...dto,
      type: dto.type as OpportunityType,
      status: (dto.status as OpportunityStatus) || 'OPEN',
    });
  }

  async getOpportunityById(id: string) {
    const opp = await this.storeService.getOpportunityById(id);
    if (!opp) throw new NotFoundException('Opportunity not found');
    return opp;
  }

  async updateOpportunity(id: string, dto: UpdateOpportunityDto) {
    const updated = await this.storeService.updateOpportunity(id, {
      ...dto,
      type: dto.type ? (dto.type as OpportunityType) : undefined,
      status: dto.status ? (dto.status as OpportunityStatus) : undefined,
    });
    if (!updated) throw new NotFoundException('Opportunity not found');
    return updated;
  }

  async deleteOpportunity(id: string) {
    const deleted = await this.storeService.deleteOpportunity(id);
    if (!deleted) throw new NotFoundException('Opportunity not found');
    return { success: true };
  }

  async getAdminApplications(params?: {
    type?: OpportunityType;
    field?: string;
    opportunityId?: string;
    status?: ApplicationStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return this.storeService.getVacancyApplications(params);
  }

  async getApplicationById(id: string) {
    const app = await this.storeService.getVacancyApplicationById(id);
    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  async updateApplicationStatus(id: string, status: ApplicationStatus, adminName: string) {
    const app = await this.storeService.updateVacancyApplicationStatus(id, status, adminName);
    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  async addApplicationNote(id: string, adminName: string, noteText: string) {
    const note = await this.storeService.addVacancyApplicationNote(id, adminName, noteText);
    if (!note) throw new NotFoundException('Application not found');
    return note;
  }

  async getAdminInterest(params?: {
    preferredType?: OpportunityType;
    domain?: string;
    status?: InterestRegistrationStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return this.storeService.getInterestRegistrations(params);
  }

  async getInterestById(id: string) {
    const item = await this.storeService.getInterestRegistrationById(id);
    if (!item) throw new NotFoundException('Interest record not found');
    return item;
  }

  async updateInterestStatus(id: string, status: InterestRegistrationStatus, adminName: string) {
    const item = await this.storeService.updateInterestRegistrationStatus(id, status, adminName);
    if (!item) throw new NotFoundException('Interest record not found');
    return item;
  }

  async addInterestNote(id: string, adminName: string, noteText: string) {
    const note = await this.storeService.addInterestRegistrationNote(id, adminName, noteText);
    if (!note) throw new NotFoundException('Interest record not found');
    return note;
  }

  async exportApplicationsCsv(): Promise<string> {
    const { items } = await this.storeService.getVacancyApplications({ limit: 10000 });
    const headers = [
      'Reference Number',
      'Opportunity Title',
      'Opportunity Type',
      'Technical Field',
      'Applicant Name',
      'Email',
      'Phone',
      'Present Address',
      'Status',
      'LinkedIn',
      'GitHub',
      'Portfolio',
      'Resume File',
      'Submitted At',
    ];

    const rows = items.map((a) => [
      a.referenceNumber,
      `"${(a.opportunityTitle || '').replace(/"/g, '""')}"`,
      a.opportunityType,
      `"${(a.technicalField || '').replace(/"/g, '""')}"`,
      `"${(a.fullName || '').replace(/"/g, '""')}"`,
      a.email,
      a.phone,
      `"${(a.presentAddress || '').replace(/"/g, '""')}"`,
      a.status,
      a.linkedInUrl || '',
      a.githubUrl || '',
      a.portfolioUrl || '',
      a.resumeOriginalName || '',
      a.createdAt,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  async exportInterestCsv(): Promise<string> {
    const { items } = await this.storeService.getInterestRegistrations({ limit: 10000 });
    const headers = [
      'Reference Number',
      'Applicant Name',
      'Email',
      'Phone',
      'Present Address',
      'Preferred Type',
      'Domain',
      'Custom Domain',
      'Status',
      'LinkedIn',
      'GitHub',
      'Portfolio',
      'Resume File',
      'Submitted At',
    ];

    const rows = items.map((i) => [
      i.referenceNumber,
      `"${(i.fullName || '').replace(/"/g, '""')}"`,
      i.email,
      i.phone,
      `"${(i.presentAddress || '').replace(/"/g, '""')}"`,
      i.preferredType,
      `"${(i.domain || '').replace(/"/g, '""')}"`,
      `"${(i.customDomain || '').replace(/"/g, '""')}"`,
      i.status,
      i.linkedInUrl || '',
      i.githubUrl || '',
      i.portfolioUrl || '',
      i.resumeOriginalName || '',
      i.createdAt,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}
