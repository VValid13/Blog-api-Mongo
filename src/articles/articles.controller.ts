import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ArticlesService } from './articles.service.js';
import { CreateArticleDto } from './dto/create-article.dto.js';
import { UpdateArticleDto } from './dto/update-article.dto.js';
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

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Article> {
    const article = await this.articlesService.findById(id);
    if (!article) {
      throw new NotFoundException(`Article ${id} not found`);
    }
    return article;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const article = await this.articlesService.updateArticle(
      id,
      updateArticleDto,
    );
    if (!article) {
      throw new NotFoundException(`Article ${id} not found`);
    }
    return article;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Article> {
    const article = await this.articlesService.delete(id);
    if (!article) {
      throw new NotFoundException(`Article ${id} not found`);
    }
    return article;
  }
}
