import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MongoId } from '../../../_utils/types/mongo-id.type.js';

@Injectable()
export class ArticlesExceptions {
  articleNotFound(articleId: MongoId) {
    return new NotFoundException(`Article ${articleId} not found`);
  }

  invalidArticleId(articleId: string) {
    return new BadRequestException(
      `Invalid id shape for article id: ${articleId}`,
    );
  }
}
