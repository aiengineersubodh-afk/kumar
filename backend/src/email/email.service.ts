import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { EnquiryItem } from '../common/types.js';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;
  private businessEmail: string;
  private fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.businessEmail = this.configService.get<string>('BUSINESS_ALERT_EMAIL') || 'projects@manymorgan.com';
    this.fromEmail = this.configService.get<string>('EMAIL_FROM') || 'ManyMorgan <onboarding@resend.dev>';

    if (apiKey && !apiKey.includes('placeholder')) {
      try {
        this.resend = new Resend(apiKey);
        this.logger.log('Resend Email Provider successfully initialized.');
      } catch (err) {
        this.logger.warn(`Failed to initialize Resend: ${err}. Falling back to simulated delivery.`);
      }
    } else {
      this.logger.log('Resend API key not configured. Using simulated delivery logger (Development Mode).');
    }
  }

  async sendEnquiryAcknowledgement(
    customerEmail: string,
    enquiryNumber: string,
    customerName: string,
    serviceName: string
  ): Promise<{ success: boolean; messageId?: string }> {
    const subject = `Enquiry Received [${enquiryNumber}] — ManyMorgan Engineering`;
    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; line-height: 1.6;">
        <div style="margin-bottom: 24px; border-bottom: 2px solid #2563eb; padding-bottom: 12px;">
          <h2 style="color: #0f172a; margin: 0; font-size: 24px; letter-spacing: -0.5px;">MANYMORGAN</h2>
          <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Premier Software Engineering & Digital Transformation</p>
        </div>
        <p>Dear ${customerName},</p>
        <p>Thank you for reaching out to ManyMorgan. We have formally registered your project enquiry regarding <strong>${serviceName}</strong>.</p>
        <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; color: #334155;"><strong>Enquiry Reference:</strong> ${enquiryNumber}</p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #334155;"><strong>Status:</strong> Under Architectural Review</p>
        </div>
        <p>Our solutions architecture leadership will review your requirements and follow up with you within 24 to 48 business hours with an initial evaluation and consultation schedule.</p>
        <p style="margin-top: 32px; font-size: 14px; color: #64748b;">Warm regards,<br/><strong>ManyMorgan Client Solutions Team</strong><br/>contact@manymorgan.com</p>
      </div>
    `;

    if (this.resend) {
      try {
        const response = await this.resend.emails.send({
          from: this.fromEmail,
          to: customerEmail,
          subject,
          html: htmlBody,
        });
        return { success: true, messageId: response.data?.id };
      } catch (e) {
        this.logger.error(`Failed to send email via Resend: ${e}`);
      }
    }

    // Development mode simulation
    this.logger.log(`[SIMULATED EMAIL ACKNOWLEDGEMENT] To: ${customerEmail} | Subject: ${subject} | Ref: ${enquiryNumber}`);
    return { success: true, messageId: `sim-${Date.now()}` };
  }

  async sendBusinessAlert(enquiry: EnquiryItem): Promise<{ success: boolean; messageId?: string }> {
    const subject = `[ALERT] New Project Enquiry Received: ${enquiry.enquiryNumber} (${enquiry.serviceName})`;
    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px;">
        <h3 style="color: #1e40af;">New Enquiry Alert — ${enquiry.enquiryNumber}</h3>
        <p><strong>Client:</strong> ${enquiry.fullName} (${enquiry.email})</p>
        <p><strong>Company:</strong> ${enquiry.companyName || 'N/A'}</p>
        <p><strong>Phone:</strong> ${enquiry.phoneCountryCode} ${enquiry.phoneNumber}</p>
        <p><strong>Service:</strong> ${enquiry.serviceName}</p>
        <p><strong>Budget:</strong> ${enquiry.budgetRange || 'Not specified'}</p>
        <p><strong>Timeline:</strong> ${enquiry.expectedTimeline || 'Not specified'}</p>
        <p><strong>Description:</strong></p>
        <blockquote style="background: #f1f5f9; padding: 12px; border-left: 3px solid #0284c7;">${enquiry.projectDescription}</blockquote>
      </div>
    `;

    if (this.resend) {
      try {
        const response = await this.resend.emails.send({
          from: this.fromEmail,
          to: this.businessEmail,
          subject,
          html: htmlBody,
        });
        return { success: true, messageId: response.data?.id };
      } catch (e) {
        this.logger.error(`Failed to send alert via Resend: ${e}`);
      }
    }

    this.logger.log(`[SIMULATED BUSINESS ALERT] To: ${this.businessEmail} | Subject: ${subject}`);
    return { success: true, messageId: `sim-alert-${Date.now()}` };
  }

  async sendCustomCustomerMessage(
    to: string,
    subject: string,
    message: string
  ): Promise<{ success: boolean; messageId?: string }> {
    const htmlBody = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h3 style="color: #0f172a;">ManyMorgan Client Communications</h3>
        <p>${message.replace(/\n/g, '<br/>')}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b;">ManyMorgan &bull; contact@manymorgan.com</p>
      </div>
    `;

    if (this.resend) {
      try {
        const response = await this.resend.emails.send({
          from: this.fromEmail,
          to,
          subject,
          html: htmlBody,
        });
        return { success: true, messageId: response.data?.id };
      } catch (e) {
        this.logger.error(`Failed to send custom message via Resend: ${e}`);
      }
    }

    this.logger.log(`[SIMULATED CUSTOM MESSAGE] To: ${to} | Subject: ${subject}`);
    return { success: true, messageId: `sim-msg-${Date.now()}` };
  }
}
