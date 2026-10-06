import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import {
  MIME_TYPE_EXTENSIONS,
  MimeType,
} from '../../../_utils/constants/mime-type.constants.js';
import { MongoId } from '../../../_utils/types/mongo-id.type.js';
import { RustfsFile } from '../../schemas/rustfs-file.schema.js';
import { StorageService } from '../../storage.service.js';
import { RustfsFileResponseDto } from '../dtos/responses/rustfs-file.response.dto.js';

@Injectable()
export class StorageMapper {
  constructor(private readonly storageService: StorageService) {}

  toArticlePicturesPrefix(): string {
    return 'articles/';
  }

  toArticlePictureKey(articleId: MongoId, mimeType: MimeType): string {
    return `${this.toArticlePicturesPrefix()}${articleId}/${randomUUID()}.${MIME_TYPE_EXTENSIONS[mimeType]}`;
  }

  async toRustfsFileResponse(
    rustfsFile: RustfsFile,
  ): Promise<RustfsFileResponseDto> {
    return {
      key: rustfsFile.key,
      url: await this.storageService.getSignedUrl(rustfsFile),
      fileName: rustfsFile.fileName,
      mimeType: rustfsFile.mimeType,
      size: rustfsFile.size,
      createdAt: rustfsFile.createdAt,
    };
  }
}
