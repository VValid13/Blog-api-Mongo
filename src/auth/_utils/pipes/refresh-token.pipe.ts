import { Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../users/users.service.js';
import { AuthExceptions } from '../exceptions/auth.exceptions.js';
import { refreshTokenMatches } from '../helpers/refresh-token-hash.helper.js';
import type { UserDocument } from '../../../users/schemas/user.schema.js';
import type { JwtPayload } from '../types/jwt-payload.type.js';

@Injectable()
export class RefreshTokenPipe implements PipeTransform<
  string,
  Promise<UserDocument>
> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly authExceptions: AuthExceptions,
  ) {}

  async transform(refreshToken: string) {
    const payload = await this.verify(refreshToken);

    const user = await this.usersService.findByIdOrFail(payload.sub);
    const isTokenOwner =
      payload.sub === user._id.toString() && payload.email === user.email;
    if (
      !isTokenOwner ||
      !user.hashedRefreshToken ||
      !refreshTokenMatches(refreshToken, user.hashedRefreshToken)
    ) {
      await this.usersService.setRefreshToken(user._id, null);
      throw this.authExceptions.invalidRefreshToken();
    }

    return user;
  }

  private async verify(refreshToken: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw this.authExceptions.invalidRefreshToken();
    }
  }
}
