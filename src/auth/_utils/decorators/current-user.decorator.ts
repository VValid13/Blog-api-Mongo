import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserDocument } from '../../../users/schemas/user.schema.js';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UserDocument => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
