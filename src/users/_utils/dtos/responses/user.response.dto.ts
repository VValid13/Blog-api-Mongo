import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class UserResponseDto {
  @ApiProperty({ type: String })
  id: Types.ObjectId;

  email: string;
  createdAt: Date;
}
