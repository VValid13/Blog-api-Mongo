import { Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ArticlesExceptions } from '../exceptions/articles.exceptions.js';

@Injectable()
export class ParsePictureIdPipe implements PipeTransform<string, string> {
  constructor(private readonly articlesExceptions: ArticlesExceptions) {}

  transform(value: string) {
    if (!isValidObjectId(value)) {
      throw this.articlesExceptions.invalidPictureId(value);
    }
    return value;
  }
}
