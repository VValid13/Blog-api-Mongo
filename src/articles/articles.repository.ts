import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticlesExceptions } from './_utils/exceptions/articles.exceptions.js';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto.js';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto.js';
import { MongoId } from '../_utils/types/mongo-id.type.js';
import { Article, ArticleDocument } from './schemas/article.schema.js';

@Injectable()
export class ArticlesRepository {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
    private readonly articlesExceptions: ArticlesExceptions,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    return await this.articleModel.create(createArticleDto);
  }

  async findAll() {
    return await this.articleModel.find().lean().exec();
  }

  async findByIdOrFail(articleId: MongoId) {
    return await this.articleModel
      .findById(articleId)
      .orFail(() => this.articlesExceptions.articleNotFound(articleId))
      .lean()
      .exec();
  }

  async updateByIdOrFail(
    article: ArticleDocument,
    updateArticleDto: UpdateArticleDto,
  ) {
    return await this.articleModel
      .findByIdAndUpdate(article._id, updateArticleDto, { new: true })
      .orFail(() => this.articlesExceptions.articleNotFound(article._id))
      .lean()
      .exec();
  }

  async addPictureOrFail(articleId: MongoId, pictureKey: string) {
    return await this.articleModel
      .findByIdAndUpdate(
        articleId,
        { $push: { pictures: { key: pictureKey } } },
        { new: true },
      )
      .orFail(() => this.articlesExceptions.articleNotFound(articleId))
      .lean()
      .exec();
  }

  async removePictureOrFail(articleId: MongoId, pictureId: MongoId) {
    return await this.articleModel
      .findByIdAndUpdate(
        articleId,
        { $pull: { pictures: { _id: pictureId } } },
        { new: true },
      )
      .orFail(() => this.articlesExceptions.articleNotFound(articleId))
      .lean()
      .exec();
  }

  async deleteByIdOrFail(articleId: MongoId) {
    return await this.articleModel
      .findByIdAndDelete(articleId)
      .orFail(() => this.articlesExceptions.articleNotFound(articleId))
      .lean()
      .exec();
  }
}
