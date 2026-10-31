import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { SubmissionsService, type SubmissionTab } from './submissions.service.js';
import { AdminGuard } from '../auth/admin.guard.js';

@Controller('submissions')
@UseGuards(AdminGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get()
  async getAllSubmissions(
    @Query('tab') tab?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('sort') sort?: 'newest' | 'oldest',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.submissionsService.getAllSubmissions({
      tab: tab as SubmissionTab,
      search,
      status,
      startDate,
      endDate,
      sort,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 15,
    });
  }

  @Get('export/csv')
  async exportCsv(
    @Query('tab') tab?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Res() res?: Response,
  ) {
    const csvData = await this.submissionsService.exportCsv({
      tab: tab as SubmissionTab,
      search,
      status,
    });
    const filename = `submissions-export-${new Date().toISOString().slice(0, 10)}.csv`;

    if (res) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(csvData);
    }
    return csvData;
  }

  @Get(':id')
  async getSubmissionById(@Param('id') id: string) {
    return this.submissionsService.getSubmissionById(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; comment?: string },
    @Req() req: any,
  ) {
    const adminName = req.admin?.name || req.admin?.fullName || 'Admin';
    return this.submissionsService.updateStatus(id, body.status, adminName, body.comment);
  }

  @Post(':id/notes')
  async addNote(
    @Param('id') id: string,
    @Body() body: { noteText: string },
    @Req() req: any,
  ) {
    const adminName = req.admin?.name || req.admin?.fullName || 'Admin';
    return this.submissionsService.addNote(id, body.noteText, adminName);
  }
}
