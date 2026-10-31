import { Injectable } from '@nestjs/common';
import { StoreService } from '../common/store.service.js';

@Injectable()
export class DashboardService {
  constructor(private readonly storeService: StoreService) {}

  async getMetrics() {
    return this.storeService.getDashboardMetrics();
  }
}
