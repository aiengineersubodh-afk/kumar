import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { StoreService } from '../common/store.service.js';
import { MediaItem } from '../common/types.js';

export interface UploadedMulterMediaFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private readonly uploadDir: string;

  constructor(private readonly storeService: StoreService) {
    this.uploadDir = path.resolve(process.cwd(), 'data', 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async getAllMedia(type?: string): Promise<MediaItem[]> {
    const media = await this.storeService.getMediaItems(type);
    const content = await this.storeService.getContent();
    const services = await this.storeService.getServices(true);

    // Dynamic usage analyzer
    return media.map((item) => {
      const detectedUses: string[] = [...(item.usedIn || [])];

      // Check content sections
      content.forEach((c) => {
        const payloadStr = JSON.stringify(c.contentPayload || {}) + JSON.stringify(c.draftPayload || {});
        if (payloadStr.includes(item.fileName) || (item.url && payloadStr.includes(item.url))) {
          const label = `Content Section: ${c.sectionKey}`;
          if (!detectedUses.includes(label)) detectedUses.push(label);
        }
      });

      // Check services
      services.forEach((s) => {
        if (s.backgroundImage?.includes(item.fileName) || (item.url && s.backgroundImage?.includes(item.url))) {
          const label = `Service Cover: ${s.title}`;
          if (!detectedUses.includes(label)) detectedUses.push(label);
        }
      });

      return {
        ...item,
        usedIn: detectedUses,
      };
    });
  }

  async uploadMedia(file: UploadedMulterMediaFile, usedInDescription?: string): Promise<MediaItem> {
    if (!file || !file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('A valid image or video file is required');
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'];
    const videoExts = ['.mp4', '.webm', '.mov'];

    const isImage = imageExts.includes(ext);
    const isVideo = videoExts.includes(ext);

    if (!isImage && !isVideo) {
      throw new BadRequestException(`Unsupported file format (${ext}). Allowed: ${[...imageExts, ...videoExts].join(', ')}`);
    }

    // Size limit: 25MB for images, 100MB for video
    const maxSizeBytes = isVideo ? 100 * 1024 * 1024 : 25 * 1024 * 1024;
    if (file.size > maxSizeBytes || file.buffer.length > maxSizeBytes) {
      throw new BadRequestException(`File size exceeds maximum allowed limit (${isVideo ? '100 MB for video' : '25 MB for images'})`);
    }

    const safeBase = path.basename(file.originalname, ext).replace(/[^\w-]/g, '_').slice(0, 30);
    const safeFileName = `${safeBase}_${Date.now()}_${uuidv4().slice(0, 8)}${ext}`;
    const destinationPath = path.join(this.uploadDir, safeFileName);

    try {
      fs.writeFileSync(destinationPath, file.buffer);
    } catch (err) {
      this.logger.error(`Failed to write uploaded media file: ${err}`);
      throw new BadRequestException('Failed to write uploaded media file to disk');
    }

    const fileUrl = `/api/media/file/${safeFileName}`;
    const usedInList = usedInDescription ? [usedInDescription] : [];

    return this.storeService.createMediaItem({
      fileName: safeFileName,
      originalName: file.originalname,
      mimeType: file.mimetype || (isVideo ? 'video/mp4' : 'image/jpeg'),
      sizeBytes: file.size || file.buffer.length,
      url: fileUrl,
      fileType: isVideo ? 'video' : 'image',
      usedIn: usedInList,
    });
  }

  async deleteMedia(id: string): Promise<{ success: boolean; message: string }> {
    const item = await this.storeService.getMediaItemById(id);
    if (!item) {
      throw new NotFoundException(`Media item ${id} not found`);
    }

    // Check if uploaded file exists on disk
    const diskPath = path.join(this.uploadDir, item.fileName);
    if (fs.existsSync(diskPath)) {
      try {
        fs.unlinkSync(diskPath);
      } catch (e) {
        this.logger.warn(`Could not unlink media file ${diskPath}: ${e}`);
      }
    }

    await this.storeService.deleteMediaItem(id);
    return { success: true, message: `Media item ${item.originalName} removed successfully.` };
  }

  getFilePath(filename: string): { filePath: string; mimeType: string; isStatic: boolean } {
    // 1. Check data/uploads
    const uploadPath = path.join(this.uploadDir, path.basename(filename));
    if (fs.existsSync(uploadPath)) {
      const ext = path.extname(filename).toLowerCase();
      let mimeType = 'application/octet-stream';
      if (ext === '.mp4') mimeType = 'video/mp4';
      else if (ext === '.webm') mimeType = 'video/webm';
      else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
      else if (ext === '.png') mimeType = 'image/png';
      else if (ext === '.webp') mimeType = 'image/webp';
      else if (ext === '.svg') mimeType = 'image/svg+xml';
      return { filePath: uploadPath, mimeType, isStatic: false };
    }

    // 2. Check public directory in frontend if referencing default assets
    const frontendPublicPath = path.resolve(process.cwd(), '..', 'frontend', 'public', filename.replace(/^\//, ''));
    if (fs.existsSync(frontendPublicPath)) {
      const ext = path.extname(filename).toLowerCase();
      let mimeType = 'application/octet-stream';
      if (ext === '.mp4') mimeType = 'video/mp4';
      else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
      else if (ext === '.png') mimeType = 'image/png';
      return { filePath: frontendPublicPath, mimeType, isStatic: true };
    }

    throw new NotFoundException(`Media file '${filename}' not found`);
  }
}

