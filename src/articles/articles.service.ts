import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateArticleDto } from './dto/create-article.dto.js';
import { Article, ArticleDocument } from './schemas/article.schema.js';
import { UpdateArticleDto } from './dto/update-article.dto.js';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  create(createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articleModel.create(createArticleDto);
  }

  findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  updateArticle(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article | null> {
    return this.articleModel
      .findByIdAndUpdate(id, updateArticleDto, { new: true })
      .exec();
  }

  findById(id: string): Promise<Article | null> {
    return this.articleModel.findById(id).exec();
  }

  delete(id: string): Promise<Article | null> {
    return this.articleModel.findByIdAndDelete(id).exec();
  }
}
