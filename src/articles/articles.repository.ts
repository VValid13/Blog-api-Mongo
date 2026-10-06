import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto.js';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto.js';
import { RustfsFile } from '../storage/schemas/rustfs-file.schema.js';
import { GlobalExceptions } from '../_utils/exceptions/global.exceptions.js';
import { MongoId } from '../_utils/types/mongo-id.type.js';
import { Article, ArticleDocument } from './schemas/article.schema.js';

@Injectable()
export class ArticlesRepository {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
    private readonly globalExceptions: GlobalExceptions,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    return await this.articleModel.create(createArticleDto);
  }

  async findAll() {
    return await this.articleModel.find().lean().exec();
  }

  async findReferencedPictureKeys(pictureKeys: string[]) {
    const articles = await this.articleModel
      .find({ 'pictures.key': { $in: pictureKeys } }, { 'pictures.key': 1 })
      .lean()
      .exec();
    const searchedKeys = new Set(pictureKeys);
    return new Set(
      articles
        .flatMap((article) => article.pictures ?? [])
        .map((picture) => picture.key)
        .filter((key) => searchedKeys.has(key)),
    );
  }

  async findByIdOrFail(articleId: MongoId) {
    return await this.articleModel
      .findById(articleId)
      .orFail(() => this.globalExceptions.notFound(Article, articleId))
      .lean()
      .exec();
  }

  async updateByIdOrFail(
    article: ArticleDocument,
    updateArticleDto: UpdateArticleDto,
  ) {
    return await this.articleModel
      .findByIdAndUpdate(article._id, updateArticleDto, {
        returnDocument: 'after',
      })
      .orFail(() => this.globalExceptions.notFound(Article, article._id))
      .lean()
      .exec();
  }

  async addPictureOrFail(articleId: MongoId, rustfsFile: RustfsFile) {
    return await this.articleModel
      .findByIdAndUpdate(
        articleId,
        { $push: { pictures: rustfsFile } },
        { returnDocument: 'after' },
      )
      .orFail(() => this.globalExceptions.notFound(Article, articleId))
      .lean()
      .exec();
  }

  async removePictureOrFail(articleId: MongoId, pictureKey: string) {
    return await this.articleModel
      .findByIdAndUpdate(
        articleId,
        { $pull: { pictures: { key: pictureKey } } },
        { returnDocument: 'after' },
      )
      .orFail(() => this.globalExceptions.notFound(Article, articleId))
      .lean()
      .exec();
  }

  async deleteByIdOrFail(articleId: MongoId) {
    return await this.articleModel
      .findByIdAndDelete(articleId)
      .orFail(() => this.globalExceptions.notFound(Article, articleId))
      .lean()
      .exec();
  }
}
