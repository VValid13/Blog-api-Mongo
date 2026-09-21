import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { UsersExceptions } from './_utils/exceptions/users.exceptions.js';
import { MongoId } from '../_utils/types/mongo-id.type.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersExceptions: UsersExceptions,
  ) {}

  async create(email: string, hashedPassword: string) {
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw this.usersExceptions.emailAlreadyExists(email);
    }
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

  async setUsername(userId: MongoId, username: string) {
    await this.usersRepository.setUsername(userId, username);
  }
}
