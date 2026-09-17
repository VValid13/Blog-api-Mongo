import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserLike } from '../../../users/_utils/types/user-like.type.js';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UserLike => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
