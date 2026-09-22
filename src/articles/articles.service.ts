import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ArticlesRepository } from './articles.repository.js';
import { ArticleMapper } from './_utils/mappers/article.mapper.js';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto.js';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto.js';
import { ArticlesExceptions } from './_utils/exceptions/articles.exceptions.js';
import { StorageService } from '../storage/storage.service.js';
import { MongoId } from '../_utils/types/mongo-id.type.js';
import { ArticleDocument } from './schemas/article.schema.js';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);

  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly articleMapper: ArticleMapper,
    private readonly articlesExceptions: ArticlesExceptions,
    private readonly storageService: StorageService,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const article = await this.articlesRepository.create(createArticleDto);
    return await this.toResponse(article);
  }

  async findAll() {
    const articles = await this.articlesRepository.findAll();
    return await Promise.all(
      articles.map((article) => this.toResponse(article)),
    );
  }

  async findById(article: ArticleDocument) {
    return await this.toResponse(article);
  }

  async updateArticle(
    article: ArticleDocument,
    updateArticleDto: UpdateArticleDto,
  ) {
    const updatedArticle = await this.articlesRepository.updateByIdOrFail(
      article,
      updateArticleDto,
    );
    return await this.toResponse(updatedArticle);
  }

  async addPicture(article: ArticleDocument, file: Express.Multer.File) {
    const extension = file.mimetype.split('/')[1];
    const pictureKey = `articles/${article._id}/${randomUUID()}.${extension}`;
    await this.storageService.upload(pictureKey, file.buffer, file.mimetype);

    try {
      const updatedArticle = await this.articlesRepository.addPictureOrFail(
        article._id,
        pictureKey,
      );
      return await this.toResponse(updatedArticle);
    } catch (error) {
      await this.deleteFromStorageBestEffort(pictureKey);
      throw error;
    }
  }

  async deletePicture(article: ArticleDocument, pictureId: MongoId) {
    const picture = (article.pictures ?? []).find(
      (candidate) => candidate._id.toString() === pictureId.toString(),
    );
    if (!picture) {
      throw this.articlesExceptions.pictureNotFound(article._id, pictureId);
    }

    const updatedArticle = await this.articlesRepository.removePictureOrFail(
      article._id,
      pictureId,
    );
    await this.deleteFromStorageBestEffort(picture.key);
    return await this.toResponse(updatedArticle);
  }

  async delete(articleId: MongoId) {
    const deletedArticle =
      await this.articlesRepository.deleteByIdOrFail(articleId);
    const response = await this.toResponse(deletedArticle);
    await Promise.all(
      (deletedArticle.pictures ?? []).map((picture) =>
        this.deleteFromStorageBestEffort(picture.key),
      ),
    );
    return response;
  }

  private async deleteFromStorageBestEffort(pictureKey: string) {
    try {
      await this.storageService.delete(pictureKey);
    } catch (error) {
      this.logger.warn(
        `Orphaned storage object left behind: ${pictureKey}`,
        error,
      );
    }
  }

  private async toResponse(article: ArticleDocument) {
    const pictures = await Promise.all(
      (article.pictures ?? []).map(async (picture) => ({
        id: picture._id.toString(),
        url: await this.storageService.getSignedUrl(picture.key),
      })),
    );
    return this.articleMapper.toResponse(article, pictures);
  }
}
