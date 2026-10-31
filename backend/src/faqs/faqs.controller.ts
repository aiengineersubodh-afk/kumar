import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { FaqsService } from './faqs.service.js';
import { AdminGuard } from '../auth/admin.guard.js';
import { GeneralFaqItem } from '../common/types.js';

@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Get()
  async getFaqs(@Query('all') all?: string) {
    const includeUnpublished = all === 'true';
    return this.faqsService.getFaqs(includeUnpublished);
  }

  @Post()
  @UseGuards(AdminGuard)
  async createFaq(@Body() data: Partial<GeneralFaqItem>) {
    return this.faqsService.createFaq(data);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async updateFaq(@Param('id') id: string, @Body() updates: Partial<GeneralFaqItem>) {
    return this.faqsService.updateFaq(id, updates);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteFaq(@Param('id') id: string) {
    return this.faqsService.deleteFaq(id);
  }
}
