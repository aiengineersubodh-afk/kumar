import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service.js';
import { AdminGuard } from '../auth/admin.guard.js';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // ==========================================
  // Public Endpoints
  // ==========================================

  @Get()
  async getAllContent() {
    return this.contentService.getAllContent();
  }

  @Get('public/:sectionKey')
  async getPublicSection(@Param('sectionKey') sectionKey: string) {
    return this.contentService.getPublicSection(sectionKey);
  }

  @Get(':sectionKey')
  async getContentSection(@Param('sectionKey') sectionKey: string) {
    return this.contentService.getPublicSection(sectionKey);
  }

  // ==========================================
  // Admin CMS Endpoints
  // ==========================================

  @Get('admin/settings/all')
  @UseGuards(AdminGuard)
  async getSettings() {
    return this.contentService.getWebsiteSettings();
  }

  @Post('admin/settings/all')
  @UseGuards(AdminGuard)
  async updateSettings(@Body() body: Record<string, any>) {
    return this.contentService.updateWebsiteSettings(body);
  }

  @Get('admin/summary')
  @UseGuards(AdminGuard)
  async getModulesSummary() {
    return this.contentService.getModulesSummary();
  }

  @Get('admin/:sectionKey')
  @UseGuards(AdminGuard)
  async getAdminSection(@Param('sectionKey') sectionKey: string) {
    return this.contentService.getAdminSection(sectionKey);
  }

  @Post('admin/:sectionKey/draft')
  @UseGuards(AdminGuard)
  async saveDraft(
    @Param('sectionKey') sectionKey: string,
    @Body() body: { title?: string; subtitle?: string; draftPayload: Record<string, any> }
  ) {
    return this.contentService.saveDraft(sectionKey, body);
  }

  @Post('admin/:sectionKey/publish')
  @UseGuards(AdminGuard)
  async publishSection(@Param('sectionKey') sectionKey: string, @Req() req: any) {
    const adminName = req.admin?.fullName || 'Administrator';
    return this.contentService.publishSection(sectionKey, adminName);
  }

  @Post('admin/:sectionKey/discard')
  @UseGuards(AdminGuard)
  async discardDraft(@Param('sectionKey') sectionKey: string) {
    return this.contentService.discardDraft(sectionKey);
  }

  @Post('admin/:sectionKey/rollback/:revisionId')
  @UseGuards(AdminGuard)
  async rollbackRevision(
    @Param('sectionKey') sectionKey: string,
    @Param('revisionId') revisionId: string,
    @Req() req: any
  ) {
    const adminName = req.admin?.fullName || 'Administrator';
    return this.contentService.rollbackRevision(sectionKey, revisionId, adminName);
  }

  // Backward compatible update endpoint
  @Put(':sectionKey')
  @UseGuards(AdminGuard)
  async updateContentSection(
    @Param('sectionKey') sectionKey: string,
    @Body() body: { title?: string; subtitle?: string; contentPayload?: Record<string, any>; isPublished?: boolean },
    @Req() req: any
  ) {
    const adminName = req.admin?.fullName || 'Administrator';
    await this.contentService.saveDraft(sectionKey, {
      title: body.title,
      subtitle: body.subtitle,
      draftPayload: body.contentPayload || {},
    });
    return this.contentService.publishSection(sectionKey, adminName);
  }
}
