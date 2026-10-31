import { Module } from '@nestjs/common';
import { CareersController } from './careers.controller.js';
import { CareersService } from './careers.service.js';
import { StoreService } from '../common/store.service.js';
import { AuthService } from '../auth/auth.service.js';

@Module({
  controllers: [CareersController],
  providers: [CareersService, StoreService, AuthService],
  exports: [CareersService],
})
export class CareersModule {}
