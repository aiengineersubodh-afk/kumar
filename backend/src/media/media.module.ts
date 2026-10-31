import { Module } from '@nestjs/common';
import { MediaController } from './media.controller.js';
import { MediaService } from './media.service.js';
import { StoreService } from '../common/store.service.js';
import { AuthService } from '../auth/auth.service.js';

@Module({
  controllers: [MediaController],
  providers: [MediaService, StoreService, AuthService],
  exports: [MediaService],
})
export class MediaModule {}
