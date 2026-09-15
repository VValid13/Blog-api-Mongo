import { IsNotEmptyString } from '../../../../_utils/decorators/IsNotEmptyString.js';

export class CreateArticleDto {
  @IsNotEmptyString()
  title: string;

  @IsNotEmptyString()
  content: string;

  @IsNotEmptyString()
  author: string;
}
