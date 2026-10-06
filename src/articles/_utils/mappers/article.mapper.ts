import { Injectable } from '@nestjs/common';
import { ArticleResponseDto } from '../dtos/responses/article.response.dto.js';
import { StorageMapper } from '../../../storage/_utils/mappers/storage.mapper.js';
import type { ArticleDocument } from '../../schemas/article.schema.js';

@Injectable()
export class ArticleMapper {
  constructor(private readonly storageMapper: StorageMapper) {}

  async toResponse(article: ArticleDocument): Promise<ArticleResponseDto> {
    return {
      id: article._id.toString(),
      title: article.title,
      content: article.content,
      authorName: article.author,
      pictures: await Promise.all(
        (article.pictures ?? []).map((picture) =>
          this.storageMapper.toRustfsFileResponse(picture),
        ),
      ),
      createdAt: article.createdAt,
    };
  }
}
