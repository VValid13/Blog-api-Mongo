import { Types } from 'mongoose';

export class ArticleResponseDto {
  id: Types.ObjectId;
  title: string;
  content: string;
  authorName: string;
  createdAt: Date;
}
