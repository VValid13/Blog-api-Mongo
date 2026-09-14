import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ArticleResponseDto } from '../dtos/responses/article.response.dto.js';

interface ArticleLike {
  _id: Types.ObjectId;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

@Injectable()
export class ArticleMapper {
  toResponse(article: ArticleLike): ArticleResponseDto {
    return {
      id: article._id,
      title: article.title,
      content: article.content,
      authorName: article.author,
      createdAt: article.createdAt,
    };
  }

  toResponseList = (articles: ArticleLike[]): ArticleResponseDto[] =>
    articles.map((article) => this.toResponse(article));
}
