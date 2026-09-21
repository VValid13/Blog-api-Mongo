import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { UserMapper } from '../users/_utils/mappers/user.mapper.js';
import { AuthExceptions } from './_utils/exceptions/auth.exceptions.js';
import { RegisterDto } from './_utils/dtos/requests/register.dto.js';
import { LoginDto } from './_utils/dtos/requests/login.dto.js';
import { hashRefreshToken } from './_utils/helpers/refresh-token-hash.helper.js';
import { SALT_ROUNDS } from './_utils/constants/auth.constants.js';
import { MongoId } from '../_utils/types/mongo-id.type.js';
import type { UserDocument } from '../users/schemas/user.schema.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly userMapper: UserMapper,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authExceptions: AuthExceptions,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, SALT_ROUNDS);
    const user = await this.usersService.create(
      registerDto.email,
      hashedPassword,
    );
    return this.userMapper.toResponse(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw this.authExceptions.invalidCredentials();
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordMatches) {
      throw this.authExceptions.invalidCredentials();
    }

    return await this.issueTokens(user._id, user.email);
  }

  async refresh(currentUser: UserDocument, tokenOwner: UserDocument) {
    if (!currentUser._id.equals(tokenOwner._id)) {
      throw this.authExceptions.invalidRefreshToken();
    }
    return await this.issueTokens(tokenOwner._id, tokenOwner.email);
  }

  async logout(userId: MongoId) {
    await this.usersService.setRefreshToken(userId, null);
  }

  private async issueTokens(userId: MongoId, email: string) {
    const sub = userId.toString();
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub, email }),
      this.jwtService.signAsync(
        { sub, email },
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
          expiresIn: Number(
            this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '604800'),
          ),
        },
      ),
    ]);

    await this.usersService.setRefreshToken(
      userId,
      hashRefreshToken(refreshToken),
    );

    return { accessToken, refreshToken };
  }
}
