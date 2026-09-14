import { BadRequestException, Type } from '@nestjs/common';
import { MongoId } from '../types/mongo-id.type';

export class InvalidMongoIdException extends BadRequestException {
  constructor(schema: Type, id: MongoId) {
    super(`Invalid id shape for ${schema.name}: ${id}`);
  }
}
