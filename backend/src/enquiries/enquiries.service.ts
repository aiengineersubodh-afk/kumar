import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { StoreService } from '../common/store.service.js';
import { EmailService } from '../email/email.service.js';
import { CreateEnquiryDto } from './dto/create-enquiry.dto.js';
import { EnquiryItem, EnquiryNote, EnquiryPriority, EnquiryStatus } from '../common/types.js';

@Injectable()
export class EnquiriesService {
  constructor(
    private readonly storeService: StoreService,
    private readonly emailService: EmailService
  ) {}

  async submitEnquiry(dto: CreateEnquiryDto, ipAddress?: string): Promise<{ success: boolean; enquiryNumber: string; message: string }> {
    // 1. Anti-spam honeypot check
    if (dto.website_hp && dto.website_hp.trim().length > 0) {
      // Silently discard spam submission while pretending success to confuse bots
      return {
        success: true,
        enquiryNumber: `MM-${new Date().getFullYear()}-SPAM`,
        message: 'Your project enquiry has been submitted successfully.',
      };
    }

    if (!dto.privacyPolicyAccepted) {
      throw new BadRequestException('You must acknowledge and accept the Privacy Policy to proceed');
    }

    // 2. Persist in database
    const created = await this.storeService.createEnquiry({
      fullName: dto.fullName.trim(),
      email: dto.email.trim().toLowerCase(),
      phoneCountryCode: dto.phoneCountryCode.trim(),
      phoneNumber: dto.phoneNumber.trim(),
      companyName: dto.companyName?.trim(),
      serviceId: dto.serviceId,
      serviceName: dto.serviceName,
      budgetRange: dto.budgetRange,
      expectedTimeline: dto.expectedTimeline,
      projectDescription: dto.projectDescription.trim(),
      fileAttachmentUrl: dto.fileAttachmentUrl,
      marketingConsent: !!dto.marketingConsent,
      privacyPolicyAccepted: true,
      ipHash: ipAddress ? Buffer.from(ipAddress).toString('base64').substring(0, 16) : undefined,
    });

    // 3. Dispatch automated confirmation email to customer
    await this.emailService.sendEnquiryAcknowledgement(
      created.email,
      created.enquiryNumber,
      created.fullName,
      created.serviceName
    );

    // 4. Dispatch alert email to business team
    await this.emailService.sendBusinessAlert(created);

    return {
      success: true,
      enquiryNumber: created.enquiryNumber,
      message: 'Your project enquiry has been submitted successfully. Our solutions team will review your objectives and follow up within 24 to 48 hours.',
    };
  }

  async getEnquiries(params: {
    status?: string;
    service?: string;
    priority?: string;
    search?: string;
    includeArchived?: boolean;
    page?: number;
    limit?: number;
  }) {
    return this.storeService.getEnquiries(params);
  }

  async getEnquiryById(id: string): Promise<EnquiryItem> {
    const item = await this.storeService.getEnquiryById(id);
    if (!item) {
      throw new NotFoundException(`Enquiry with id or number '${id}' not found`);
    }
    return item;
  }

  async updateStatus(id: string, status: EnquiryStatus, adminName: string, comment?: string): Promise<EnquiryItem> {
    const validStatuses: EnquiryStatus[] = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    const item = await this.storeService.updateEnquiryStatus(id, status, adminName, comment);
    if (!item) {
      throw new NotFoundException(`Enquiry not found`);
    }
    return item;
  }

  async updatePriority(id: string, priority: EnquiryPriority): Promise<EnquiryItem> {
    const validPriorities: EnquiryPriority[] = ['Low', 'Medium', 'High', 'Urgent'];
    if (!validPriorities.includes(priority)) {
      throw new BadRequestException(`Invalid priority: ${priority}`);
    }

    const item = await this.storeService.updateEnquiryPriority(id, priority);
    if (!item) {
      throw new NotFoundException(`Enquiry not found`);
    }
    return item;
  }

  async addNote(id: string, adminName: string, noteText: string): Promise<EnquiryNote> {
    if (!noteText || noteText.trim().length === 0) {
      throw new BadRequestException('Note text cannot be empty');
    }

    const note = await this.storeService.addEnquiryNote(id, adminName, noteText.trim());
    if (!note) {
      throw new NotFoundException(`Enquiry not found`);
    }
    return note;
  }

  async sendCustomerMessage(id: string, adminName: string, subject: string, message: string) {
    const enquiry = await this.storeService.getEnquiryById(id);
    if (!enquiry) {
      throw new NotFoundException(`Enquiry not found`);
    }

    await this.emailService.sendCustomCustomerMessage(enquiry.email, subject, message);

    const comm = await this.storeService.addCommunication(id, {
      adminName,
      recipientEmail: enquiry.email,
      subject,
      bodyText: message,
      messageType: 'email',
      deliveryStatus: 'sent',
    });

    return { success: true, communication: comm };
  }

  async toggleArchive(id: string): Promise<EnquiryItem> {
    const item = await this.storeService.toggleArchiveEnquiry(id);
    if (!item) {
      throw new NotFoundException(`Enquiry not found`);
    }
    return item;
  }

  async exportCsv(): Promise<string> {
    const { items } = await this.storeService.getEnquiries({ limit: 10000 });
    const headers = [
      'Enquiry Number',
      'Created At',
      'Full Name',
      'Email',
      'Phone Code',
      'Phone Number',
      'Company Name',
      'Service',
      'Budget Range',
      'Timeline',
      'Status',
      'Priority',
      'Project Description',
    ];

    const escapeCsv = (val?: string) => {
      if (!val) return '""';
      const clean = val.replace(/"/g, '""').replace(/\r?\n/g, ' ');
      return `"${clean}"`;
    };

    const rows = items.map((e) => [
      escapeCsv(e.enquiryNumber),
      escapeCsv(e.createdAt),
      escapeCsv(e.fullName),
      escapeCsv(e.email),
      escapeCsv(e.phoneCountryCode),
      escapeCsv(e.phoneNumber),
      escapeCsv(e.companyName),
      escapeCsv(e.serviceName),
      escapeCsv(e.budgetRange),
      escapeCsv(e.expectedTimeline),
      escapeCsv(e.status),
      escapeCsv(e.priority),
      escapeCsv(e.projectDescription),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}
