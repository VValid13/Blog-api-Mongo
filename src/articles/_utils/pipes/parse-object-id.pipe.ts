import { Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ArticlesRepository } from '../../articles.repository.js';
import { ArticlesExceptions } from '../exceptions/articles.exceptions.js';
import { ArticleDocument } from '../../schemas/article.schema.js';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<
  string,
  Promise<ArticleDocument>
> {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly articlesExceptions: ArticlesExceptions,
  ) {}

  async transform(value: string) {
    if (!isValidObjectId(value)) {
      throw this.articlesExceptions.invalidArticleId(value);
    }
    return await this.articlesRepository.findByIdOrFail(value);
  }
}
