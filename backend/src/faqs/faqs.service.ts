import { Injectable, NotFoundException } from '@nestjs/common';
import { StoreService } from '../common/store.service.js';
import { GeneralFaqItem } from '../common/types.js';

@Injectable()
export class FaqsService {
  constructor(private readonly storeService: StoreService) {}

  async getFaqs(includeUnpublished = false): Promise<GeneralFaqItem[]> {
    return this.storeService.getFaqs(includeUnpublished);
  }

  async createFaq(data: Partial<GeneralFaqItem>): Promise<GeneralFaqItem> {
    return this.storeService.createFaq(data);
  }

  async updateFaq(id: string, updates: Partial<GeneralFaqItem>): Promise<GeneralFaqItem> {
    const updated = await this.storeService.updateFaq(id, updates);
    if (!updated) {
      throw new NotFoundException(`FAQ '${id}' not found`);
    }
    return updated;
  }

  async deleteFaq(id: string): Promise<{ success: boolean }> {
    const success = await this.storeService.deleteFaq(id);
    if (!success) {
      throw new NotFoundException(`FAQ '${id}' not found`);
    }
    return { success };
  }
}
