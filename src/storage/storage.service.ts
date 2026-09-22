import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  NotFound,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PRESIGNED_URL_EXPIRES_IN_SECONDS } from './_utils/constants/storage.constants.js';
import { StorageExceptions } from './_utils/exceptions/storage.exceptions.js';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(
    configService: ConfigService,
    private readonly storageExceptions: StorageExceptions,
  ) {
    this.bucket = configService.getOrThrow<string>('S3_BUCKET');
    this.client = new S3Client({
      endpoint: configService.getOrThrow<string>('S3_ENDPOINT'),
      region: configService.getOrThrow<string>('S3_REGION'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: configService.getOrThrow<string>('S3_ACCESS_KEY'),
        secretAccessKey: configService.getOrThrow<string>('S3_SECRET_KEY'),
      },
    });
  }

  async onModuleInit() {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch (error) {
      if (!(error instanceof NotFound)) {
        throw error;
      }
      await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
    }
  }

  async upload(key: string, body: Buffer, contentType: string) {
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        }),
      );
    } catch (error) {
      this.logger.error(`Failed to upload object ${key}`, error);
      throw this.storageExceptions.uploadFailed(key);
    }
  }

  async delete(key: string) {
    try {
      await this.client.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
      );
    } catch (error) {
      this.logger.error(`Failed to delete object ${key}`, error);
      throw this.storageExceptions.deleteFailed(key);
    }
  }

  async getSignedUrl(key: string) {
    return await getSignedUrl(
      this.client,
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      { expiresIn: PRESIGNED_URL_EXPIRES_IN_SECONDS },
    );
  }
}
