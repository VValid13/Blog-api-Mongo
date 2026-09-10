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
import { Article } from './schemas/article.schema.js';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  findAll(): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @Get(':articleId')
  findById(@Param('articleId', ParseObjectIdPipe) article: Article): Article {
    return article;
  }

  @Patch(':articleId')
  update(
    @Param('articleId', ParseObjectIdPipe) article: Article,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    return this.articlesService.updateArticle(article._id, updateArticleDto);
  }

  @Delete(':articleId')
  delete(
    @Param('articleId', ParseObjectIdPipe) article: Article,
  ): Promise<Article> {
    return this.articlesService.delete(article._id);
  }
}
