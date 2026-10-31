import {
  Body,
  Controller,
  Get,
  Header,
  Ip,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EnquiriesService } from './enquiries.service.js';
import { CreateEnquiryDto } from './dto/create-enquiry.dto.js';
import { AdminGuard } from '../auth/admin.guard.js';
import { EnquiryPriority, EnquiryStatus } from '../common/types.js';

@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  // Public submission endpoint
  @Post()
  async submitEnquiry(@Body() dto: CreateEnquiryDto, @Ip() ip: string) {
    return this.enquiriesService.submitEnquiry(dto, ip);
  }

  // Admin export CSV
  @Get('export/csv')
  @UseGuards(AdminGuard)
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="manymorgan-enquiries.csv"')
  async exportCsv() {
    return this.enquiriesService.exportCsv();
  }

  // Admin list enquiries
  @Get()
  @UseGuards(AdminGuard)
  async getEnquiries(
    @Query('status') status?: string,
    @Query('service') service?: string,
    @Query('priority') priority?: string,
    @Query('search') search?: string,
    @Query('includeArchived') includeArchived?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.enquiriesService.getEnquiries({
      status,
      service,
      priority,
      search,
      includeArchived: includeArchived === 'true',
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 15,
    });
  }

  // Admin get single enquiry
  @Get(':id')
  @UseGuards(AdminGuard)
  async getEnquiryById(@Param('id') id: string) {
    return this.enquiriesService.getEnquiryById(id);
  }

  // Admin update status
  @Patch(':id/status')
  @UseGuards(AdminGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: EnquiryStatus; comment?: string },
    @Req() req: any
  ) {
    const adminName = req.admin?.fullName || 'Administrator';
    return this.enquiriesService.updateStatus(id, body.status, adminName, body.comment);
  }

  // Admin update priority
  @Patch(':id/priority')
  @UseGuards(AdminGuard)
  async updatePriority(@Param('id') id: string, @Body() body: { priority: EnquiryPriority }) {
    return this.enquiriesService.updatePriority(id, body.priority);
  }

  // Admin add private note
  @Post(':id/notes')
  @UseGuards(AdminGuard)
  async addNote(@Param('id') id: string, @Body() body: { noteText: string }, @Req() req: any) {
    const adminName = req.admin?.fullName || 'Administrator';
    return this.enquiriesService.addNote(id, adminName, body.noteText);
  }

  // Admin send customer communication
  @Post(':id/messages')
  @UseGuards(AdminGuard)
  async sendMessage(
    @Param('id') id: string,
    @Body() body: { subject: string; message: string },
    @Req() req: any
  ) {
    const adminName = req.admin?.fullName || 'Administrator';
    return this.enquiriesService.sendCustomerMessage(id, adminName, body.subject, body.message);
  }

  // Admin toggle archive
  @Patch(':id/archive')
  @UseGuards(AdminGuard)
  async toggleArchive(@Param('id') id: string) {
    return this.enquiriesService.toggleArchive(id);
  }
}
