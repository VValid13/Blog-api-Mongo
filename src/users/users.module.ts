import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller.js';
import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';
import { UsersExceptions } from './_utils/exceptions/users.exceptions.js';
import { UserMapper } from './_utils/mappers/user.mapper.js';
import { User, UserSchema } from './schemas/user.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersExceptions, UserMapper],
  exports: [UsersService, UserMapper],
})
export class UsersModule {}
