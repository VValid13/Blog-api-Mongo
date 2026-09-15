import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthExceptions {
  invalidCredentials() {
    return new UnauthorizedException('Invalid email or password');
  }

  invalidRefreshToken() {
    return new UnauthorizedException('Invalid refresh token');
  }
}
