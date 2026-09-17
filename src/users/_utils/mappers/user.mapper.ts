import { Injectable } from '@nestjs/common';
import { UserLike } from '../types/user-like.type.js';
import { UserResponseDto } from '../dtos/responses/user.response.dto.js';

@Injectable()
export class UserMapper {
  toResponse(user: UserLike): UserResponseDto {
    return {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    };
  }
}
