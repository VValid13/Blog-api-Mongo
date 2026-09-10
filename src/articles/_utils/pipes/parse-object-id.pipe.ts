import { Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ArticlesRepository } from '../../articles.repository.js';
import { InvalidArticleIdException } from '../errors/articles.errors.js';
import { Article } from '../../schemas/article.schema.js';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<
  string,
  Promise<Article>
> {
  constructor(private readonly articlesRepository: ArticlesRepository) {}

  transform(value: string): Promise<Article> {
    if (!isValidObjectId(value)) {
      throw new InvalidArticleIdException(value);
    }
    return this.articlesRepository.findByIdOrFail(value);
  }
}
