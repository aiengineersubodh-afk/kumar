import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service.js';
import { AdminGuard } from '../auth/admin.guard.js';
import { ServiceCategoryItem, ServiceItem } from '../common/types.js';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // Category endpoints
  @Get('categories/all')
  async getCategories() {
    return this.servicesService.getCategories();
  }

  @Post('categories')
  @UseGuards(AdminGuard)
  async createCategory(@Body() data: Partial<ServiceCategoryItem>) {
    return this.servicesService.createCategory(data);
  }

  @Put('categories/:id')
  @UseGuards(AdminGuard)
  async updateCategory(@Param('id') id: string, @Body() updates: Partial<ServiceCategoryItem>) {
    return this.servicesService.updateCategory(id, updates);
  }

  @Delete('categories/:id')
  @UseGuards(AdminGuard)
  async deleteCategory(@Param('id') id: string) {
    return this.servicesService.deleteCategory(id);
  }

  @Get()
  async getServices(@Query('all') all?: string) {
    const includeUnpublished = all === 'true';
    return this.servicesService.getAllServices(includeUnpublished);
  }

  @Get(':slug')
  async getServiceBySlug(@Param('slug') slug: string) {
    return this.servicesService.getServiceBySlug(slug);
  }

  @Post()
  @UseGuards(AdminGuard)
  async createService(@Body() data: Partial<ServiceItem>) {
    return this.servicesService.createService(data);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async updateService(@Param('id') id: string, @Body() updates: Partial<ServiceItem>) {
    return this.servicesService.updateService(id, updates);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteService(@Param('id') id: string) {
    return this.servicesService.deleteService(id);
  }
}
