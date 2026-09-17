import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service.js';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto.js';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto.js';
import { ArticleResponseDto } from './_utils/dtos/responses/article.response.dto.js';
import { ParseObjectIdPipe } from './_utils/pipes/parse-object-id.pipe.js';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import type { ArticleDocument } from './schemas/article.schema.js';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiOperation({ summary: 'Créer un article' })
  @ApiResponse({ status: 201, type: ArticleResponseDto })
  @ApiResponse({ status: 400, description: 'Corps de requête invalide' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({
    status: 409,
    description: 'Un article avec ce titre existe déjà pour cet auteur',
  })
  @Protect()
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    return await this.articlesService.create(createArticleDto);
  }

  @ApiOperation({ summary: 'Lister tous les articles' })
  @ApiResponse({ status: 200, type: [ArticleResponseDto] })
  @Get()
  async findAll() {
    return await this.articlesService.findAll();
  }

  @ApiOperation({ summary: 'Récupérer un article par son id' })
  @ApiParam({
    name: 'articleId',
    description: "Identifiant Mongo de l'article",
  })
  @ApiResponse({ status: 200, type: ArticleResponseDto })
  @ApiResponse({ status: 400, description: 'Id invalide' })
  @ApiResponse({ status: 404, description: 'Article introuvable' })
  @Get(':articleId')
  async findById(
    @Param('articleId', ParseObjectIdPipe) article: ArticleDocument,
  ) {
    return await this.articlesService.findById(article);
  }

  @ApiOperation({ summary: 'Modifier un article' })
  @ApiParam({
    name: 'articleId',
    description: "Identifiant Mongo de l'article",
  })
  @ApiResponse({ status: 200, type: ArticleResponseDto })
  @ApiResponse({ status: 400, description: 'Id ou corps de requête invalide' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'Article introuvable' })
  @Protect()
  @Patch(':articleId')
  async update(
    @Param('articleId', ParseObjectIdPipe) article: ArticleDocument,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return await this.articlesService.updateArticle(article, updateArticleDto);
  }

  @ApiOperation({ summary: 'Supprimer un article' })
  @ApiParam({
    name: 'articleId',
    description: "Identifiant Mongo de l'article",
  })
  @ApiResponse({ status: 200, type: ArticleResponseDto })
  @ApiResponse({ status: 400, description: 'Id invalide' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'Article introuvable' })
  @Protect()
  @Delete(':articleId')
  async delete(
    @Param('articleId', ParseObjectIdPipe) article: ArticleDocument,
  ) {
    return await this.articlesService.delete(article._id);
  }
}
