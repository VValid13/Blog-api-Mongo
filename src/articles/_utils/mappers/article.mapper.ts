import { ArticleDocument } from '../../schemas/article.schema.js';
import { ArticleResponseDto } from '../dtos/responses/article.response.dto.js';

export class ArticleMapper {
  static toResponse(article: ArticleDocument): ArticleResponseDto {
    return {
      _id: article._id,
      title: article.title,
      content: article.content,
      author: article.author,
      createdAt: article.createdAt,
    };
  }

  static toResponseList(articles: ArticleDocument[]): ArticleResponseDto[] {
    return articles.map((article) => ArticleMapper.toResponse(article));
  }
}
