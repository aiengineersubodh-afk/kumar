import { Injectable, NotFoundException } from '@nestjs/common';
import { StoreService } from '../common/store.service.js';
import { ServiceCategoryItem, ServiceItem } from '../common/types.js';

@Injectable()
export class ServicesService {
  constructor(private readonly storeService: StoreService) {}

  // Category Operations
  async getCategories(): Promise<ServiceCategoryItem[]> {
    return this.storeService.getServiceCategories();
  }

  async createCategory(data: Partial<ServiceCategoryItem>): Promise<ServiceCategoryItem> {
    return this.storeService.createServiceCategory(data);
  }

  async updateCategory(id: string, updates: Partial<ServiceCategoryItem>): Promise<ServiceCategoryItem> {
    const updated = await this.storeService.updateServiceCategory(id, updates);
    if (!updated) {
      throw new NotFoundException(`Category '${id}' not found`);
    }
    return updated;
  }

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const success = await this.storeService.deleteServiceCategory(id);
    if (!success) {
      throw new NotFoundException(`Category '${id}' not found`);
    }
    return { success };
  }

  // Service Operations

  async getAllServices(includeUnpublished = false): Promise<ServiceItem[]> {
    return this.storeService.getServices(includeUnpublished);
  }

  async getServiceBySlug(slug: string): Promise<ServiceItem> {
    const service = await this.storeService.getServiceBySlug(slug);
    if (!service) {
      throw new NotFoundException(`Service with slug '${slug}' not found`);
    }
    return service;
  }

  async createService(data: Partial<ServiceItem>): Promise<ServiceItem> {
    return this.storeService.createService(data);
  }

  async updateService(id: string, updates: Partial<ServiceItem>): Promise<ServiceItem> {
    const updated = await this.storeService.updateService(id, updates);
    if (!updated) {
      throw new NotFoundException(`Service with id '${id}' not found`);
    }
    return updated;
  }

  async deleteService(id: string): Promise<{ success: boolean }> {
    const success = await this.storeService.deleteService(id);
    if (!success) {
      throw new NotFoundException(`Service with id '${id}' not found`);
    }
    return { success };
  }
}
