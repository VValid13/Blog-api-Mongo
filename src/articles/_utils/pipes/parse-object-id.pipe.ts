import { Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ArticlesRepository } from '../../articles.repository.js';
import { GlobalExceptions } from '../../../_utils/exceptions/global.exceptions.js';
import { Article, ArticleDocument } from '../../schemas/article.schema.js';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<
  string,
  Promise<ArticleDocument>
> {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly globalExceptions: GlobalExceptions,
  ) {}

  async transform(value: string) {
    if (!isValidObjectId(value)) {
      throw this.globalExceptions.invalidId(Article, value);
    }
    return await this.articlesRepository.findByIdOrFail(value);
  }
}
