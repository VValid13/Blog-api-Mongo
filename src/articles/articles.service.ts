import { Injectable } from '@nestjs/common';
import { ArticlesRepository } from './articles.repository.js';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto.js';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto.js';
import { MongoId } from './_utils/types/mongo-id.type.js';
import { Article } from './schemas/article.schema.js';

@Injectable()
export class ArticlesService {
  constructor(private readonly articlesRepository: ArticlesRepository) {}

  create(createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articlesRepository.create(createArticleDto);
  }

  findAll(): Promise<Article[]> {
    return this.articlesRepository.findAll();
  }

  findById(articleId: MongoId): Promise<Article> {
    return this.articlesRepository.findByIdOrFail(articleId);
  }

  updateArticle(
    articleId: MongoId,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    return this.articlesRepository.updateByIdOrFail(
      articleId,
      updateArticleDto,
    );
  }

  delete(articleId: MongoId): Promise<Article> {
    return this.articlesRepository.deleteByIdOrFail(articleId);
  }
}
