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
import { ArticleMapper } from './_utils/mappers/article.mapper.js';
import { ParseObjectIdPipe } from './_utils/pipes/parse-object-id.pipe.js';
import type { ArticleDocument } from './schemas/article.schema.js';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    const article = await this.articlesService.create(createArticleDto);
    return ArticleMapper.toResponse(article);
  }

  @Get()
  async findAll() {
    const articles = await this.articlesService.findAll();
    return ArticleMapper.toResponseList(articles);
  }

  @Get(':articleId')
  findById(@Param('articleId', ParseObjectIdPipe) article: ArticleDocument) {
    return ArticleMapper.toResponse(article);
  }

  @Patch(':articleId')
  async update(
    @Param('articleId', ParseObjectIdPipe) article: ArticleDocument,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    const updatedArticle = await this.articlesService.updateArticle(
      article,
      updateArticleDto,
    );
    return ArticleMapper.toResponse(updatedArticle);
  }

  @Delete(':articleId')
  async delete(
    @Param('articleId', ParseObjectIdPipe) article: ArticleDocument,
  ) {
    const deletedArticle = await this.articlesService.delete(article._id);
    return ArticleMapper.toResponse(deletedArticle);
  }
}
