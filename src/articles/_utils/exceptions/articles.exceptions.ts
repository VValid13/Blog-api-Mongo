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

  invalidPictureId(pictureId: string) {
    return new BadRequestException(
      `Invalid id shape for picture: ${pictureId}`,
    );
  }

  pictureNotFound(articleId: MongoId, pictureId: MongoId) {
    return new NotFoundException(
      `Picture ${pictureId} not found on article ${articleId}`,
    );
  }
}
