import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { AdminGuard } from '../auth/admin.guard.js';

@Controller('notifications')
@UseGuards(AdminGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications() {
    return this.notificationsService.getNotifications();
  }

  @Patch('read-all')
  async markAllRead() {
    return this.notificationsService.markAllAsRead();
  }

  @Patch(':id/read')
  async markRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
