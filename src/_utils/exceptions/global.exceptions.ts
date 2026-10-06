import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Type,
} from '@nestjs/common';
import { MongoId } from '../types/mongo-id.type.js';

@Injectable()
export class GlobalExceptions {
  notFound(entity: Type, id: MongoId) {
    return new NotFoundException(`${entity.name} ${id} not found`);
  }

  invalidId(entity: Type, id: MongoId) {
    return new BadRequestException(
      `Invalid id shape for ${entity.name}: ${id}`,
    );
  }
}
