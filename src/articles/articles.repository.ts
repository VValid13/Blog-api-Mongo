import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticlesExceptions } from './_utils/exceptions/articles.exceptions.js';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto.js';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto.js';
import { MongoId } from '../_utils/types/mongo-id.type.js';
import { Article, ArticleDocument } from './schemas/article.schema.js';

const DUPLICATE_KEY_ERROR_CODE = 11000;

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === DUPLICATE_KEY_ERROR_CODE
  );
}

@Injectable()
export class ArticlesRepository {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
    private readonly articlesExceptions: ArticlesExceptions,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    try {
      return await this.articleModel.create(createArticleDto);
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw this.articlesExceptions.articleAlreadyExists(
          createArticleDto.title,
          createArticleDto.author,
        );
      }
      throw error;
    }
  }

  async findAll() {
    return await this.articleModel.find().exec();
  }

  async findByIdOrFail(articleId: MongoId) {
    return await this.articleModel
      .findById(articleId)
      .orFail(() => this.articlesExceptions.articleNotFound(articleId))
      .exec();
  }

  async updateByIdOrFail(
    article: ArticleDocument,
    updateArticleDto: UpdateArticleDto,
  ) {
    return await this.articleModel
      .findByIdAndUpdate(article._id, updateArticleDto, { new: true })
      .orFail(() => this.articlesExceptions.articleNotFound(article._id))
      .exec();
  }

  async deleteByIdOrFail(articleId: MongoId) {
    return await this.articleModel
      .findByIdAndDelete(articleId)
      .orFail(() => this.articlesExceptions.articleNotFound(articleId))
      .exec();
  }
}
