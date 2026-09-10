import { CreateArticleDto } from './create-article.dto.js';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class UpdateArticleDto extends PartialType(
  OmitType(CreateArticleDto, ['author'] as const),
) {}
