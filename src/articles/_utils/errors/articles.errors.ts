import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MongoId } from '../../../_utils/types/mongo-id.type.js';

export class ArticleNotFoundException extends NotFoundException {
  constructor(articleId: MongoId) {
    super(`Article ${articleId} not found`);
  }
}

export class InvalidArticleIdException extends BadRequestException {
  constructor(articleId: string) {
    super(`Invalid id shape for article id: ${articleId}`);
  }
}
