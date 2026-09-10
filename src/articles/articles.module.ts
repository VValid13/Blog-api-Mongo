import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesController } from './articles.controller.js';
import { ArticlesRepository } from './articles.repository.js';
import { ArticlesService } from './articles.service.js';
import { ArticlesExceptions } from './_utils/exceptions/articles.exceptions.js';
import { ParseObjectIdPipe } from './_utils/pipes/parse-object-id.pipe.js';
import { Article, ArticleSchema } from './schemas/article.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
  ],
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    ArticlesRepository,
    ArticlesExceptions,
    ParseObjectIdPipe,
  ],
  exports: [ArticlesService],
})
export class ArticlesModule {}
