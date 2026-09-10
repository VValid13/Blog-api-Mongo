import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto.js';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto.js';
import { MongoId } from './_utils/types/mongo-id.type.js';
import { Article, ArticleDocument } from './schemas/article.schema.js';

@Injectable()
export class ArticlesRepository {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
  ) {}

  create(createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articleModel.create(createArticleDto);
  }

  findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  findByIdOrFail(articleId: MongoId): Promise<Article> {
    return this.articleModel
      .findById(articleId)
      .orFail(() => new NotFoundException(`Article ${articleId} not found`))
      .exec();
  }

  updateByIdOrFail(
    articleId: MongoId,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    return this.articleModel
      .findByIdAndUpdate(articleId, updateArticleDto, { new: true })
      .orFail(() => new NotFoundException(`Article ${articleId} not found`))
      .exec();
  }

  deleteByIdOrFail(articleId: MongoId): Promise<Article> {
    return this.articleModel
      .findByIdAndDelete(articleId)
      .orFail(() => new NotFoundException(`Article ${articleId} not found`))
      .exec();
  }
}
