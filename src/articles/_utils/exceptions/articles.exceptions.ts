import { Injectable, NotFoundException } from '@nestjs/common';
import { MongoId } from '../../../_utils/types/mongo-id.type.js';

@Injectable()
export class ArticlesExceptions {
  articleNotFound(articleId: MongoId) {
    return new NotFoundException(`Article ${articleId} not found`);
  }
}
