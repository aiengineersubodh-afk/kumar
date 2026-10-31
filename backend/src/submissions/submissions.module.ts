import { Module } from '@nestjs/common';
import { SubmissionsController } from './submissions.controller.js';
import { SubmissionsService } from './submissions.service.js';
import { StoreService } from '../common/store.service.js';
import { AuthService } from '../auth/auth.service.js';

@Module({
  controllers: [SubmissionsController],
  providers: [SubmissionsService, StoreService, AuthService],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}

