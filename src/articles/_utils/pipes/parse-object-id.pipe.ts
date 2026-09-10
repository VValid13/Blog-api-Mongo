import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { MongoId } from '../types/mongo-id.type.js';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, MongoId> {
  transform(value: string): MongoId {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`Invalid Mongo article id: ${value}`);
    }
    return value;
  }
}
