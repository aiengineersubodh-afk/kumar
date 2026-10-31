import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Ip,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { AdminGuard } from '../auth/admin.guard.js';
import type {
  ApplicationStatus,
  InterestRegistrationStatus,
  OpportunityStatus,
  OpportunityType,
} from '../common/types.js';
import { CareersService, type UploadedMulterFile } from './careers.service.js';
import { ApplyVacancyDto } from './dto/apply-vacancy.dto.js';
import { CreateOpportunityDto } from './dto/create-opportunity.dto.js';
import { RegisterInterestDto } from './dto/register-interest.dto.js';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto.js';

@Controller('careers')
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  // ==========================================
  // Public Careers Endpoints
  // ==========================================

  @Get('status')
  async getStatus() {
    return this.careersService.getPublicStatus();
  }

  @Get('opportunities')
  async getOpportunities(
    @Query('type') type?: string,
    @Query('field') field?: string,
    @Query('search') search?: string
  ) {
    return this.careersService.getPublicOpportunities({
      type: type as OpportunityType,
      field,
      search,
    });
  }

  @Get('opportunities/:id')
  async getOpportunityById(@Param('id') id: string) {
    return this.careersService.getPublicOpportunityById(id);
  }

  @Post('apply')
  @UseInterceptors(FileInterceptor('resume'))
  async applyVacancy(
    @Body() dto: ApplyVacancyDto,
    @UploadedFile() file: UploadedMulterFile,
    @Ip() ip: string
  ) {
    return this.careersService.submitVacancyApplication(dto, file, ip);
  }

  @Post('interest')
  @UseInterceptors(FileInterceptor('resume'))
  async registerInterest(
    @Body() dto: RegisterInterestDto,
    @UploadedFile() file: UploadedMulterFile,
    @Ip() ip: string
  ) {
    return this.careersService.submitInterestRegistration(dto, file, ip);
  }

  // ==========================================
  // Admin Careers Management Endpoints
  // ==========================================

  @Get('admin/settings')
  @UseGuards(AdminGuard)
  async getSettings() {
    return this.careersService.getAdminSettings();
  }

  @Post('admin/activate')
  @UseGuards(AdminGuard)
  async activateCareers(@Req() req: any) {
    const adminName = req.admin?.fullName || 'Administrator';
    return this.careersService.activateCareers(adminName);
  }

  @Post('admin/deactivate')
  @UseGuards(AdminGuard)
  async deactivateCareers(@Req() req: any) {
    const adminName = req.admin?.fullName || 'Administrator';
    return this.careersService.deactivateCareers(adminName);
  }

  @Get('admin/stats')
  @UseGuards(AdminGuard)
  async getStats() {
    return this.careersService.getAdminStats();
  }

  // Opportunities Management
  @Get('admin/opportunities')
  @UseGuards(AdminGuard)
  async getAdminOpportunities(
    @Query('type') type?: string,
    @Query('field') field?: string,
    @Query('status') status?: string,
    @Query('search') search?: string
  ) {
    return this.careersService.getAdminOpportunities({
      type: type as OpportunityType,
      field,
      status: status as OpportunityStatus,
      search,
    });
  }

  @Post('admin/opportunities')
  @UseGuards(AdminGuard)
  async createOpportunity(@Body() dto: CreateOpportunityDto) {
    return this.careersService.createOpportunity(dto);
  }

  @Get('admin/opportunities/:id')
  @UseGuards(AdminGuard)
  async getAdminOpportunityById(@Param('id') id: string) {
    return this.careersService.getOpportunityById(id);
  }

  @Patch('admin/opportunities/:id')
  @UseGuards(AdminGuard)
  async updateOpportunity(@Param('id') id: string, @Body() dto: UpdateOpportunityDto) {
    return this.careersService.updateOpportunity(id, dto);
  }

  @Delete('admin/opportunities/:id')
  @UseGuards(AdminGuard)
  async deleteOpportunity(@Param('id') id: string) {
    return this.careersService.deleteOpportunity(id);
  }

  // Vacancy Applications Management
  @Get('admin/applications/export/csv')
  @UseGuards(AdminGuard)
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="manymorgan-applications.csv"')
  async exportApplicationsCsv() {
    return this.careersService.exportApplicationsCsv();
  }

  @Get('admin/applications')
  @UseGuards(AdminGuard)
  async getAdminApplications(
    @Query('type') type?: string,
    @Query('field') field?: string,
    @Query('opportunityId') opportunityId?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.careersService.getAdminApplications({
      type: type as OpportunityType,
      field,
      opportunityId,
      status: status as ApplicationStatus,
      search,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 15,
    });
  }

  @Get('admin/applications/:id')
  @UseGuards(AdminGuard)
  async getApplicationById(@Param('id') id: string) {
    return this.careersService.getApplicationById(id);
  }

  @Patch('admin/applications/:id/status')
  @UseGuards(AdminGuard)
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Req() req: any
  ) {
    const adminName = req.admin?.fullName || 'Administrator';
    return this.careersService.updateApplicationStatus(id, status as ApplicationStatus, adminName);
  }

  @Post('admin/applications/:id/notes')
  @UseGuards(AdminGuard)
  async addApplicationNote(
    @Param('id') id: string,
    @Body('noteText') noteText: string,
    @Req() req: any
  ) {
    const adminName = req.admin?.fullName || 'Administrator';
    return this.careersService.addApplicationNote(id, adminName, noteText);
  }

  // General Interest Registrations Management
  @Get('admin/interest/export/csv')
  @UseGuards(AdminGuard)
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="manymorgan-interest-registrations.csv"')
  async exportInterestCsv() {
    return this.careersService.exportInterestCsv();
  }

  @Get('admin/interest')
  @UseGuards(AdminGuard)
  async getAdminInterest(
    @Query('preferredType') preferredType?: string,
    @Query('domain') domain?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.careersService.getAdminInterest({
      preferredType: preferredType as OpportunityType,
      domain,
      status: status as InterestRegistrationStatus,
      search,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 15,
    });
  }

  @Get('admin/interest/:id')
  @UseGuards(AdminGuard)
  async getInterestById(@Param('id') id: string) {
    return this.careersService.getInterestById(id);
  }

  @Patch('admin/interest/:id/status')
  @UseGuards(AdminGuard)
  async updateInterestStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Req() req: any
  ) {
    const adminName = req.admin?.fullName || 'Administrator';
    return this.careersService.updateInterestStatus(id, status as InterestRegistrationStatus, adminName);
  }

  @Post('admin/interest/:id/notes')
  @UseGuards(AdminGuard)
  async addInterestNote(
    @Param('id') id: string,
    @Body('noteText') noteText: string,
    @Req() req: any
  ) {
    const adminName = req.admin?.fullName || 'Administrator';
    return this.careersService.addInterestNote(id, adminName, noteText);
  }

  // Secure Admin Resume Download
  @Get('resumes/:filename')
  @UseGuards(AdminGuard)
  async downloadResume(@Param('filename') filename: string, @Res() res: Response) {
    const { filePath, fileName } = this.careersService.getResumeFilePath(filename);
    return res.download(filePath, fileName);
  }
}
