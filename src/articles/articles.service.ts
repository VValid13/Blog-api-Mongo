import { Injectable } from '@nestjs/common';
import { ArticlesRepository } from './articles.repository.js';
import { CreateArticleDto } from './_utils/dtos/request/create-article.dto.js';
import { UpdateArticleDto } from './_utils/dtos/request/update-article.dto.js';
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

  findById(articleId: string): Promise<Article> {
    return this.articlesRepository.findById(articleId);
  }

  updateArticle(
    articleId: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    return this.articlesRepository.updateById(articleId, updateArticleDto);
  }

  delete(articleId: string): Promise<Article> {
    return this.articlesRepository.deleteById(articleId);
  }
}
