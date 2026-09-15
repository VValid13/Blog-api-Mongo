import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserResponseDto } from '../dtos/responses/user.response.dto.js';

interface UserLike {
  _id: Types.ObjectId;
  email: string;
  createdAt: Date;
}

@Injectable()
export class UserMapper {
  toResponse(user: UserLike): UserResponseDto {
    return {
      id: user._id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
