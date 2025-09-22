import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface UploadResult {
  key: string;
  url: string;
  signedUrl?: string;
}

export interface ProductImage {
  key: string;
  url: string;
  contentType: string;
  size: number;
  uploadedAt: string;
}

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME') || '';
  }

  /**
   * Upload a product image to S3
   */
  async uploadProductImage(
    wishlistId: string,
    itemId: string,
    imageBuffer: Buffer,
    contentType: string,
    originalFileName: string,
  ): Promise<UploadResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const key = `products/${wishlistId}/${itemId}/${timestamp}-${originalFileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: imageBuffer,
      ContentType: contentType,
      Metadata: {
        wishlistId,
        itemId,
        originalFileName,
        uploadedAt: new Date().toISOString(),
      },
    });

    await this.s3Client.send(command);

    const url = `https://${this.bucketName}.s3.amazonaws.com/${key}`;

    // Generate a signed URL for private access (valid for 1 hour)
    const signedUrl = await getSignedUrl(
      this.s3Client,
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
      { expiresIn: 3600 },
    );

    return {
      key,
      url,
      signedUrl,
    };
  }

  /**
   * Upload a user profile picture to S3
   */
  async uploadProfilePicture(
    userId: string,
    imageBuffer: Buffer,
    contentType: string,
    originalFileName: string,
  ): Promise<UploadResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const key = `profiles/${userId}/${timestamp}-${originalFileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: imageBuffer,
      ContentType: contentType,
      Metadata: {
        userId,
        originalFileName,
        uploadedAt: new Date().toISOString(),
      },
    });

    await this.s3Client.send(command);

    const url = `https://${this.bucketName}.s3.amazonaws.com/${key}`;

    // Generate a signed URL for private access (valid for 1 hour)
    const signedUrl = await getSignedUrl(
      this.s3Client,
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
      { expiresIn: 3600 },
    );

    return {
      key,
      url,
      signedUrl,
    };
  }

  /**
   * Get a signed URL for accessing a private object
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * Delete an object from S3
   */
  async deleteObject(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  /**
   * Get object metadata
   */
  async getObjectMetadata(key: string): Promise<ProductImage | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      if (!response.Metadata) {
        return null;
      }

      return {
        key,
        url: `https://${this.bucketName}.s3.amazonaws.com/${key}`,
        contentType: response.ContentType || 'application/octet-stream',
        size: response.ContentLength || 0,
        uploadedAt: response.Metadata.uploadedAt || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting object metadata:', error);
      return null;
    }
  }
}
