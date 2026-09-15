import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { MongoId } from '../_utils/types/mongo-id.type.js';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(email: string, hashedPassword: string) {
    return await this.usersRepository.create(email, hashedPassword);
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findByEmail(email);
  }

  async findByIdOrFail(userId: MongoId) {
    return await this.usersRepository.findByIdOrFail(userId);
  }

  async setRefreshToken(userId: MongoId, hashedRefreshToken: string | null) {
    await this.usersRepository.setRefreshToken(userId, hashedRefreshToken);
  }
}
