import { S3Client } from '@aws-sdk/client-s3';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3_CLIENT_TOKEN } from './_utils/constants/storage.constants.js';

export const storageProviders: Provider[] = [
  {
    provide: S3_CLIENT_TOKEN,
    inject: [ConfigService],
    useFactory: (configService: ConfigService): S3Client =>
      new S3Client({
        endpoint: configService.getOrThrow<string>('S3_ENDPOINT'),
        region: configService.getOrThrow<string>('S3_REGION'),
        forcePathStyle: true,
        credentials: {
          accessKeyId: configService.getOrThrow<string>('S3_ACCESS_KEY'),
          secretAccessKey: configService.getOrThrow<string>('S3_SECRET_KEY'),
        },
      }),
  },
];
