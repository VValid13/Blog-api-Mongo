import { Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ArticlesRepository } from '../../articles.repository.js';
import { InvalidMongoIdException } from '../../../_utils/exceptions/invalid-mongo-id.exception.js';
import { ArticleDocument } from '../../schemas/article.schema.js';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<
  string,
  Promise<ArticleDocument>
> {
  constructor(private readonly articlesRepository: ArticlesRepository) {}

  async transform(value: string) {
    if (!isValidObjectId(value)) {
      throw new InvalidMongoIdException(value);
    }
    return await this.articlesRepository.findByIdOrFail(value);
  }
}
