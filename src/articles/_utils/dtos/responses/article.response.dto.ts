import { Types } from 'mongoose';

export class ArticleResponseDto {
  _id: Types.ObjectId;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}
