import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ArticlesService } from './articles.service.js';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto.js';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto.js';
import { ParseObjectIdPipe } from './_utils/pipes/parse-object-id.pipe.js';
import type { LeanArticle } from './schemas/article.schema.js';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    return await this.articlesService.create(createArticleDto);
  }

  @Get()
  async findAll() {
    return await this.articlesService.findAll();
  }

  @Get(':articleId')
  async findById(@Param('articleId', ParseObjectIdPipe) article: LeanArticle) {
    return await this.articlesService.findById(article);
  }

  @Patch(':articleId')
  async update(
    @Param('articleId', ParseObjectIdPipe) article: LeanArticle,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return await this.articlesService.updateArticle(article, updateArticleDto);
  }

  @Delete(':articleId')
  async delete(@Param('articleId', ParseObjectIdPipe) article: LeanArticle) {
    return await this.articlesService.delete(article._id);
  }
}
