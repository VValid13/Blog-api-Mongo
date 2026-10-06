import { Injectable, Logger } from '@nestjs/common';
import { ArticlesRepository } from './articles.repository.js';
import { ArticleMapper } from './_utils/mappers/article.mapper.js';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto.js';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto.js';
import { RustfsFile } from '../storage/schemas/rustfs-file.schema.js';
import { StorageMapper } from '../storage/_utils/mappers/storage.mapper.js';
import { StorageService } from '../storage/storage.service.js';
import { MimeType } from '../_utils/constants/mime-type.constants.js';
import { GlobalExceptions } from '../_utils/exceptions/global.exceptions.js';
import { MongoId } from '../_utils/types/mongo-id.type.js';
import { ArticleDocument } from './schemas/article.schema.js';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);

  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly articleMapper: ArticleMapper,
    private readonly globalExceptions: GlobalExceptions,
    private readonly storageService: StorageService,
    private readonly storageMapper: StorageMapper,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const article = await this.articlesRepository.create(createArticleDto);
    return await this.articleMapper.toResponse(article);
  }

  async findAll() {
    const articles = await this.articlesRepository.findAll();
    return await Promise.all(
      articles.map((article) => this.articleMapper.toResponse(article)),
    );
  }

  async findById(article: ArticleDocument) {
    return await this.articleMapper.toResponse(article);
  }

  async updateArticle(
    article: ArticleDocument,
    updateArticleDto: UpdateArticleDto,
  ) {
    const updatedArticle = await this.articlesRepository.updateByIdOrFail(
      article,
      updateArticleDto,
    );
    return await this.articleMapper.toResponse(updatedArticle);
  }

  async addPicture(article: ArticleDocument, file: Express.Multer.File) {
    const pictureKey = this.storageMapper.toArticlePictureKey(
      article._id,
      file.mimetype as MimeType,
    );
    const rustfsFile = await this.storageService.upload(pictureKey, file);

    try {
      const updatedArticle = await this.articlesRepository.addPictureOrFail(
        article._id,
        rustfsFile,
      );
      return await this.articleMapper.toResponse(updatedArticle);
    } catch (error) {
      await this.deleteFromStorageBestEffort(rustfsFile);
      throw error;
    }
  }

  async deletePicture(article: ArticleDocument, pictureKey: string) {
    const picture = (article.pictures ?? []).find(
      (candidate) => candidate.key === pictureKey,
    );
    if (!picture) {
      throw this.globalExceptions.notFound(RustfsFile, pictureKey);
    }

    const updatedArticle = await this.articlesRepository.removePictureOrFail(
      article._id,
      pictureKey,
    );
    await this.deleteFromStorageBestEffort(picture);
    return await this.articleMapper.toResponse(updatedArticle);
  }

  async delete(articleId: MongoId) {
    const deletedArticle =
      await this.articlesRepository.deleteByIdOrFail(articleId);
    const response = await this.articleMapper.toResponse(deletedArticle);
    await Promise.all(
      (deletedArticle.pictures ?? []).map((picture) =>
        this.deleteFromStorageBestEffort(picture),
      ),
    );
    return response;
  }

  private async deleteFromStorageBestEffort(rustfsFile: RustfsFile) {
    try {
      await this.storageService.delete(rustfsFile);
    } catch (error) {
      this.logger.warn(
        `Orphaned storage object left behind: ${rustfsFile.key}`,
        error,
      );
    }
  }
}
