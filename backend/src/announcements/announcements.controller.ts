import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service.js';
import { AdminGuard } from '../auth/admin.guard.js';
import { AnnouncementItem } from '../common/types.js';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  // Public endpoint for currently active banner
  @Get('active')
  async getActive() {
    return this.announcementsService.getActiveAnnouncement();
  }

  // Admin list all
  @Get()
  @UseGuards(AdminGuard)
  async getAll() {
    return this.announcementsService.getAllAnnouncements();
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() data: Partial<AnnouncementItem>) {
    return this.announcementsService.createAnnouncement(data);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: string, @Body() updates: Partial<AnnouncementItem>) {
    return this.announcementsService.updateAnnouncement(id, updates);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: string) {
    return this.announcementsService.deleteAnnouncement(id);
  }
}
