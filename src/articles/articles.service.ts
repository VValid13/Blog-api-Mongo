import { Injectable } from '@nestjs/common';
import { ArticlesRepository } from './articles.repository.js';
import { ArticleMapper } from './_utils/mappers/article.mapper.js';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto.js';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto.js';
import { MongoId } from '../_utils/types/mongo-id.type.js';
import { LeanArticle } from './schemas/article.schema.js';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly articleMapper: ArticleMapper,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const article = await this.articlesRepository.create(createArticleDto);
    return this.articleMapper.toResponse(article);
  }

  async findAll() {
    const articles = await this.articlesRepository.findAll();
    return this.articleMapper.toResponseList(articles);
  }

  async findById(article: LeanArticle) {
    return this.articleMapper.toResponse(article);
  }

  async updateArticle(
    article: LeanArticle,
    updateArticleDto: UpdateArticleDto,
  ) {
    const updatedArticle = await this.articlesRepository.updateByIdOrFail(
      article,
      updateArticleDto,
    );
    return this.articleMapper.toResponse(updatedArticle);
  }

  async delete(articleId: MongoId) {
    const deletedArticle =
      await this.articlesRepository.deleteByIdOrFail(articleId);
    return this.articleMapper.toResponse(deletedArticle);
  }
}
