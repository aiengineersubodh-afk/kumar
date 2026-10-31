import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import * as fs from 'fs';
import { AdminGuard } from '../auth/admin.guard.js';
import { MediaService, type UploadedMulterMediaFile } from './media.service.js';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @UseGuards(AdminGuard)
  async getAllMedia() {
    return this.mediaService.getAllMedia();
  }

  @Post('upload')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: UploadedMulterMediaFile,
    @Body('usedIn') usedIn?: string
  ) {
    return this.mediaService.uploadMedia(file, usedIn);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteMedia(@Param('id') id: string) {
    return this.mediaService.deleteMedia(id);
  }

  // Public asset streaming (handles byte-range requests for videos)
  @Get('file/:filename')
  async streamFile(
    @Param('filename') filename: string,
    @Headers('range') range: string | undefined,
    @Res() res: Response
  ) {
    const { filePath, mimeType } = this.mediaService.getFilePath(filename);
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    if (range && mimeType.startsWith('video/')) {
      // Parse Range header e.g. "bytes=0-"
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': mimeType,
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': mimeType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400',
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  }
}
