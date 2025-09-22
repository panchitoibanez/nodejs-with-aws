import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
  Get,
  Delete,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth/auth.guard';
import { StorageService } from './storage.service';
import type { Request as ExpressRequest } from 'express';

@Controller('storage')
@UseGuards(AuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  private getUserId(req: ExpressRequest): string {
    if (!req.user?.sub) {
      throw new BadRequestException('User ID not found on request');
    }
    return req.user.sub;
  }

  @Post('product-image/:wishlistId/:itemId')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProductImage(
    @Request() req: ExpressRequest,
    @Param('wishlistId', ParseUUIDPipe) wishlistId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only images are allowed.');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 5MB.');
    }

    const result = await this.storageService.uploadProductImage(
      wishlistId,
      itemId,
      file.buffer,
      file.mimetype,
      file.originalname,
    );

    return {
      success: true,
      data: {
        key: result.key,
        url: result.url,
        signedUrl: result.signedUrl,
        originalName: file.originalname,
        size: file.size,
        contentType: file.mimetype,
      },
    };
  }

  @Post('profile-picture')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @Request() req: ExpressRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const userId = this.getUserId(req);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only images are allowed.');
    }

    // Validate file size (max 2MB for profile pictures)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 2MB.');
    }

    const result = await this.storageService.uploadProfilePicture(
      userId,
      file.buffer,
      file.mimetype,
      file.originalname,
    );

    return {
      success: true,
      data: {
        key: result.key,
        url: result.url,
        signedUrl: result.signedUrl,
        originalName: file.originalname,
        size: file.size,
        contentType: file.mimetype,
      },
    };
  }

  @Get('signed-url/:key')
  async getSignedUrl(@Request() req: ExpressRequest, @Param('key') key: string) {
    const userId = this.getUserId(req);

    // Basic validation to ensure user can only access their own files
    if (!key.includes(userId) && !key.includes('products/')) {
      throw new BadRequestException('Access denied to this resource');
    }

    const signedUrl = await this.storageService.getSignedUrl(key);

    return {
      success: true,
      data: {
        signedUrl,
        expiresIn: 3600, // 1 hour
      },
    };
  }

  @Delete(':key')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteObject(@Request() req: ExpressRequest, @Param('key') key: string) {
    const userId = this.getUserId(req);

    // Basic validation to ensure user can only delete their own files
    if (!key.includes(userId) && !key.includes('products/')) {
      throw new BadRequestException('Access denied to this resource');
    }

    await this.storageService.deleteObject(key);
  }

  @Get('metadata/:key')
  async getObjectMetadata(@Request() req: ExpressRequest, @Param('key') key: string) {
    const userId = this.getUserId(req);

    // Basic validation to ensure user can only access their own files
    if (!key.includes(userId) && !key.includes('products/')) {
      throw new BadRequestException('Access denied to this resource');
    }

    const metadata = await this.storageService.getObjectMetadata(key);

    if (!metadata) {
      throw new BadRequestException('Object not found');
    }

    return {
      success: true,
      data: metadata,
    };
  }
}
