import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersExceptions } from './_utils/exceptions/users.exceptions.js';
import { MongoId } from '../_utils/types/mongo-id.type.js';
import { User, UserDocument } from './schemas/user.schema.js';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly usersExceptions: UsersExceptions,
  ) {}

  async create(email: string, hashedPassword: string) {
    return await this.userModel.create({ email, password: hashedPassword });
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).lean().exec();
  }

  async findByIdOrFail(userId: MongoId) {
    return await this.userModel
      .findById(userId)
      .orFail(() => this.usersExceptions.userNotFound(userId))
      .lean()
      .exec();
  }

  async setRefreshToken(userId: MongoId, hashedRefreshToken: string | null) {
    await this.userModel
      .updateOne({ _id: userId }, { hashedRefreshToken })
      .exec();
  }
}
