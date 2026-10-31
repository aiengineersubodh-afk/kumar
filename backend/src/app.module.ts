import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StoreService } from './common/store.service.js';
import { EmailService } from './email/email.service.js';
import { AuthService } from './auth/auth.service.js';
import { AuthController } from './auth/auth.controller.js';
import { AdminGuard } from './auth/admin.guard.js';
import { ServicesService } from './services/services.service.js';
import { ServicesController } from './services/services.controller.js';
import { EnquiriesService } from './enquiries/enquiries.service.js';
import { EnquiriesController } from './enquiries/enquiries.controller.js';
import { ContentService } from './content/content.service.js';
import { ContentController } from './content/content.controller.js';
import { FaqsService } from './faqs/faqs.service.js';
import { FaqsController } from './faqs/faqs.controller.js';
import { AnnouncementsService } from './announcements/announcements.service.js';
import { AnnouncementsController } from './announcements/announcements.controller.js';
import { NotificationsService } from './notifications/notifications.service.js';
import { NotificationsController } from './notifications/notifications.controller.js';
import { DashboardService } from './dashboard/dashboard.service.js';
import { DashboardController } from './dashboard/dashboard.controller.js';
import { CareersService } from './careers/careers.service.js';
import { CareersController } from './careers/careers.controller.js';
import { MediaService } from './media/media.service.js';
import { MediaController } from './media/media.controller.js';
import { SubmissionsService } from './submissions/submissions.service.js';
import { SubmissionsController } from './submissions/submissions.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
    }),
  ],
  controllers: [
    AuthController,
    ServicesController,
    EnquiriesController,
    ContentController,
    FaqsController,
    AnnouncementsController,
    NotificationsController,
    DashboardController,
    CareersController,
    MediaController,
    SubmissionsController,
  ],
  providers: [
    StoreService,
    EmailService,
    AuthService,
    AdminGuard,
    ServicesService,
    EnquiriesService,
    ContentService,
    FaqsService,
    AnnouncementsService,
    NotificationsService,
    DashboardService,
    CareersService,
    MediaService,
    SubmissionsService,
  ],
})
export class AppModule {}

