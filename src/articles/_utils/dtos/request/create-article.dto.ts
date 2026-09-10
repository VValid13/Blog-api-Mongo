import { IsStringAndNotEmpty } from '../../decorators/IsStringAndNotEmpty.js';

export class CreateArticleDto {
  @IsStringAndNotEmpty()
  title: string;

  @IsStringAndNotEmpty()
  content: string;

  @IsStringAndNotEmpty()
  author: string;
}
