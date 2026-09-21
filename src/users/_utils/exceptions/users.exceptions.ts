import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MongoId } from '../../../_utils/types/mongo-id.type.js';

@Injectable()
export class UsersExceptions {
  userNotFound(userId: MongoId) {
    return new NotFoundException(`User ${userId} not found`);
  }

  emailAlreadyExists(email: string) {
    return new ConflictException(`Email ${email} is already in use`);
  }
}
