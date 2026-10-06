import { RustfsFileResponseDto } from '../../../../storage/_utils/dtos/responses/rustfs-file.response.dto.js';

export class ArticleResponseDto {
  id: string;
  title: string;
  content: string;
  authorName: string;
  pictures: RustfsFileResponseDto[];
  createdAt: Date;
}
