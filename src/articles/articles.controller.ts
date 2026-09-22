import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ArticlesService } from './articles.service.js';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto.js';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto.js';
import { ArticleResponseDto } from './_utils/dtos/responses/article.response.dto.js';
import {
  PICTURE_FIELD_NAME,
  PICTURE_MAX_SIZE_BYTES,
  PICTURE_MIME_TYPE_REGEX,
} from './_utils/constants/articles.constants.js';
import { ParseObjectIdPipe } from './_utils/pipes/parse-object-id.pipe.js';
import { ParsePictureIdPipe } from './_utils/pipes/parse-picture-id.pipe.js';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import type { ArticleDocument } from './schemas/article.schema.js';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Protect()
  @Post()
  @ApiOperation({ summary: 'Créer un article' })
  @ApiResponse({ status: 201, type: ArticleResponseDto })
  @ApiResponse({ status: 400, description: 'Corps de requête invalide' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({
    status: 409,
    description: 'Un article avec ce titre existe déjà pour cet auteur',
  })
  async create(@Body() createArticleDto: CreateArticleDto) {
    return await this.articlesService.create(createArticleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les articles' })
  @ApiResponse({ status: 200, type: [ArticleResponseDto] })
  async findAll() {
    return await this.articlesService.findAll();
  }

  @Get(':articleId')
  @ApiOperation({ summary: 'Récupérer un article par son id' })
  @ApiParam({
    name: 'articleId',
    description: "Identifiant Mongo de l'article",
  })
  @ApiResponse({ status: 200, type: ArticleResponseDto })
  @ApiResponse({ status: 400, description: 'Id invalide' })
  @ApiResponse({ status: 404, description: 'Article introuvable' })
  async findById(
    @Param('articleId', ParseObjectIdPipe) article: ArticleDocument,
  ) {
    return await this.articlesService.findById(article);
  }

  @Protect()
  @Patch(':articleId')
  @ApiOperation({ summary: 'Modifier un article' })
  @ApiParam({
    name: 'articleId',
    description: "Identifiant Mongo de l'article",
  })
  @ApiResponse({ status: 200, type: ArticleResponseDto })
  @ApiResponse({ status: 400, description: 'Id ou corps de requête invalide' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'Article introuvable' })
  async update(
    @Param('articleId', ParseObjectIdPipe) article: ArticleDocument,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return await this.articlesService.updateArticle(article, updateArticleDto);
  }

  @Protect()
  @Post(':articleId/pictures')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor(PICTURE_FIELD_NAME, {
      limits: { fileSize: PICTURE_MAX_SIZE_BYTES },
    }),
  )
  @ApiOperation({ summary: 'Ajouter une photo à un article' })
  @ApiParam({
    name: 'articleId',
    description: "Identifiant Mongo de l'article",
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: [PICTURE_FIELD_NAME],
      properties: {
        [PICTURE_FIELD_NAME]: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, type: ArticleResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Id invalide, fichier manquant ou type de fichier refusé',
  })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'Article introuvable' })
  @ApiResponse({ status: 413, description: 'Fichier trop volumineux' })
  @ApiResponse({ status: 502, description: 'Stockage indisponible' })
  async addPicture(
    @Param('articleId', ParseObjectIdPipe) article: ArticleDocument,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: PICTURE_MAX_SIZE_BYTES }),
          new FileTypeValidator({ fileType: PICTURE_MIME_TYPE_REGEX }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.articlesService.addPicture(article, file);
  }

  @Protect()
  @Delete(':articleId/pictures/:pictureId')
  @ApiOperation({ summary: "Supprimer une photo d'un article" })
  @ApiParam({
    name: 'articleId',
    description: "Identifiant Mongo de l'article",
  })
  @ApiParam({
    name: 'pictureId',
    description: 'Identifiant Mongo de la photo',
  })
  @ApiResponse({ status: 200, type: ArticleResponseDto })
  @ApiResponse({
    status: 400,
    description: "Id d'article ou de photo invalide",
  })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'Article ou photo introuvable' })
  async deletePicture(
    @Param('articleId', ParseObjectIdPipe) article: ArticleDocument,
    @Param('pictureId', ParsePictureIdPipe) pictureId: string,
  ) {
    return await this.articlesService.deletePicture(article, pictureId);
  }

  @Protect()
  @Delete(':articleId')
  @ApiOperation({ summary: 'Supprimer un article' })
  @ApiParam({
    name: 'articleId',
    description: "Identifiant Mongo de l'article",
  })
  @ApiResponse({ status: 200, type: ArticleResponseDto })
  @ApiResponse({ status: 400, description: 'Id invalide' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'Article introuvable' })
  async delete(
    @Param('articleId', ParseObjectIdPipe) article: ArticleDocument,
  ) {
    return await this.articlesService.delete(article._id);
  }
}
