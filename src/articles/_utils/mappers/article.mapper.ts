import { Injectable } from '@nestjs/common';
import { LeanArticle } from '../../schemas/article.schema.js';
import { ArticleResponseDto } from '../dtos/responses/article.response.dto.js';

@Injectable()
export class ArticleMapper {
  toResponse(article: LeanArticle): ArticleResponseDto {
    return {
      id: article._id,
      title: article.title,
      content: article.content,
      authorName: article.author,
      createdAt: article.createdAt,
    };
  }

  toResponseList = (articles: LeanArticle[]): ArticleResponseDto[] =>
    articles.map((article) => this.toResponse(article));
}
