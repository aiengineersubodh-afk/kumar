import { Injectable, NotFoundException } from '@nestjs/common';
import { StoreService } from '../common/store.service.js';
import { NotificationItem } from '../common/types.js';

@Injectable()
export class NotificationsService {
  constructor(private readonly storeService: StoreService) {}

  async getNotifications(): Promise<{ items: NotificationItem[]; unreadCount: number }> {
    return this.storeService.getNotifications();
  }

  async markAsRead(id: string): Promise<{ success: boolean }> {
    const success = await this.storeService.markNotificationRead(id);
    if (!success) {
      throw new NotFoundException(`Notification '${id}' not found`);
    }
    return { success: true };
  }

  async markAllAsRead(): Promise<{ success: boolean }> {
    await this.storeService.markAllNotificationsRead();
    return { success: true };
  }
}
