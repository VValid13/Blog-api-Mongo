import { Injectable } from '@nestjs/common';
import { ArticlesRepository } from './articles.repository.js';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto.js';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto.js';
import { MongoId } from '../_utils/types/mongo-id.type.js';
import { ArticleDocument } from './schemas/article.schema.js';

@Injectable()
export class ArticlesService {
  constructor(private readonly articlesRepository: ArticlesRepository) {}

  async create(createArticleDto: CreateArticleDto) {
    return await this.articlesRepository.create(createArticleDto);
  }

  async findAll() {
    return await this.articlesRepository.findAll();
  }

  async updateArticle(
    article: ArticleDocument,
    updateArticleDto: UpdateArticleDto,
  ) {
    return await this.articlesRepository.updateByIdOrFail(
      article,
      updateArticleDto,
    );
  }

  async delete(articleId: MongoId) {
    return await this.articlesRepository.deleteByIdOrFail(articleId);
  }
}
