import { PictureResponseDto } from './picture.response.dto.js';

export class ArticleResponseDto {
  id: string;
  title: string;
  content: string;
  authorName: string;
  pictures: PictureResponseDto[];
  createdAt: Date;
}
