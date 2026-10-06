import {
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadBucketCommand,
  ListObjectsV2Command,
  type ListObjectsV2CommandOutput,
  NotFound,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PRESIGNED_URL_EXPIRES_IN_SECONDS,
  S3_CLIENT_TOKEN,
} from './_utils/constants/storage.constants.js';
import { StorageExceptions } from './_utils/exceptions/storage.exceptions.js';
import type { StorageObject } from './_utils/types/storage-object.type.js';
import { RustfsFile } from './schemas/rustfs-file.schema.js';
import { isUrl } from '../_utils/helpers/url.helper.js';
import type { Url } from '../_utils/types/url.type.js';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly bucket: string;

  constructor(
    @Inject(S3_CLIENT_TOKEN) private readonly client: S3Client,
    configService: ConfigService,
    private readonly storageExceptions: StorageExceptions,
  ) {
    this.bucket = configService.getOrThrow<string>('S3_BUCKET');
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

  async upload(key: string, file: Express.Multer.File): Promise<RustfsFile> {
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    } catch (error) {
      this.logger.error(`Failed to upload object ${key}`, error);
      throw this.storageExceptions.uploadFailed(key);
    }
    return {
      bucket: this.bucket,
      key,
      fileName: file.originalname,
      mimeType: file.mimetype,
      createdAt: new Date(),
      size: file.size,
    };
  }

  async delete(rustfsFile: RustfsFile) {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: rustfsFile.bucket,
          Key: rustfsFile.key,
        }),
      );
    } catch (error) {
      this.logger.error(`Failed to delete object ${rustfsFile.key}`, error);
      throw this.storageExceptions.deleteFailed(rustfsFile.key);
    }
  }

  async *listObjectPages(prefix: string): AsyncGenerator<StorageObject[]> {
    let continuationToken: string | undefined;
    do {
      let page: ListObjectsV2CommandOutput;
      try {
        page = await this.client.send(
          new ListObjectsV2Command({
            Bucket: this.bucket,
            Prefix: prefix,
            ContinuationToken: continuationToken,
          }),
        );
      } catch (error) {
        this.logger.error(`Failed to list objects under ${prefix}`, error);
        throw this.storageExceptions.listFailed(prefix);
      }
      yield (page.Contents ?? []).flatMap((object) =>
        object.Key && object.LastModified
          ? [{ key: object.Key, lastModified: object.LastModified }]
          : [],
      );
      continuationToken = page.NextContinuationToken;
    } while (continuationToken);
  }

  async deleteMany(keys: string[]): Promise<number> {
    try {
      const result = await this.client.send(
        new DeleteObjectsCommand({
          Bucket: this.bucket,
          Delete: { Objects: keys.map((key) => ({ Key: key })), Quiet: true },
        }),
      );
      const failedKeys = (result.Errors ?? []).map((error) => error.Key);
      if (failedKeys.length > 0) {
        this.logger.warn(`Failed to delete objects: ${failedKeys.join(', ')}`);
      }
      return keys.length - failedKeys.length;
    } catch (error) {
      this.logger.error(`Failed to delete ${keys.length} objects`, error);
      throw this.storageExceptions.deleteManyFailed(keys.length);
    }
  }

  async getSignedUrl(rustfsFile: RustfsFile): Promise<Url> {
    const signedUrl = await getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: rustfsFile.bucket,
        Key: rustfsFile.key,
      }),
      { expiresIn: PRESIGNED_URL_EXPIRES_IN_SECONDS },
    );
    if (!isUrl(signedUrl)) {
      throw this.storageExceptions.invalidSignedUrl(rustfsFile.key);
    }
    return signedUrl;
  }
}
