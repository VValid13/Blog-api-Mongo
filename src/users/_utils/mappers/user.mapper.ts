import { Injectable } from '@nestjs/common';
import { UserDocument } from '../../schemas/user.schema.js';
import { UserResponseDto } from '../dtos/responses/user.response.dto.js';

@Injectable()
export class UserMapper {
  toResponse(user: UserDocument): UserResponseDto {
    return {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    };
  }
}
