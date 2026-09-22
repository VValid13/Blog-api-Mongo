import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ArticleResponseDto } from '../dtos/responses/article.response.dto.js';
import { PictureResponseDto } from '../dtos/responses/picture.response.dto.js';

interface ArticleLike {
  _id: Types.ObjectId;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

@Injectable()
export class ArticleMapper {
  toResponse(
    article: ArticleLike,
    pictures: PictureResponseDto[],
  ): ArticleResponseDto {
    return {
      id: article._id.toString(),
      title: article.title,
      content: article.content,
      authorName: article.author,
      pictures,
      createdAt: article.createdAt,
    };
  }
}
