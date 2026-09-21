import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class UsernameSetGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.user?.username) {
      throw new ForbiddenException(
        'Complete your profile (set a username) before accessing this resource',
      );
    }
    return true;
  }
}
