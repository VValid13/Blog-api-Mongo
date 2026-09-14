import { IsNotEmptyString } from '../../decorators/IsNotEmptyString.js';

export class CreateArticleDto {
  @IsNotEmptyString()
  title: string;

  @IsNotEmptyString()
  content: string;

  @IsNotEmptyString()
  author: string;
}
