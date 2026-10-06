import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageModule } from '../storage/storage.module.js';
import { ArticlesCleanupService } from './articles-cleanup.service.js';
import { ArticlesController } from './articles.controller.js';
import { ArticlesRepository } from './articles.repository.js';
import { ArticlesService } from './articles.service.js';
import { ArticleMapper } from './_utils/mappers/article.mapper.js';
import { ParseObjectIdPipe } from './_utils/pipes/parse-object-id.pipe.js';
import { Article, ArticleSchema } from './schemas/article.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    StorageModule,
  ],
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    ArticlesCleanupService,
    ArticlesRepository,
    ArticleMapper,
    ParseObjectIdPipe,
  ],
  exports: [ArticlesService],
})
export class ArticlesModule {}
