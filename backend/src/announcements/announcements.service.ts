import { Injectable, NotFoundException } from '@nestjs/common';
import { StoreService } from '../common/store.service.js';
import { AnnouncementItem } from '../common/types.js';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly storeService: StoreService) {}

  async getActiveAnnouncement(): Promise<AnnouncementItem | null> {
    return this.storeService.getActiveAnnouncement();
  }

  async getAllAnnouncements(): Promise<AnnouncementItem[]> {
    return this.storeService.getAllAnnouncements();
  }

  async createAnnouncement(data: Partial<AnnouncementItem>): Promise<AnnouncementItem> {
    return this.storeService.createAnnouncement(data);
  }

  async updateAnnouncement(id: string, updates: Partial<AnnouncementItem>): Promise<AnnouncementItem> {
    const updated = await this.storeService.updateAnnouncement(id, updates);
    if (!updated) {
      throw new NotFoundException(`Announcement '${id}' not found`);
    }
    return updated;
  }

  async deleteAnnouncement(id: string): Promise<{ success: boolean }> {
    const success = await this.storeService.deleteAnnouncement(id);
    if (!success) {
      throw new NotFoundException(`Announcement '${id}' not found`);
    }
    return { success };
  }
}
