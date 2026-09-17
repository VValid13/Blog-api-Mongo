import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, timingSafeEqual } from 'node:crypto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { UserMapper } from '../users/_utils/mappers/user.mapper.js';
import { UsersExceptions } from '../users/_utils/exceptions/users.exceptions.js';
import { AuthExceptions } from './_utils/exceptions/auth.exceptions.js';
import { RegisterDto } from './_utils/dtos/requests/register.dto.js';
import { LoginDto } from './_utils/dtos/requests/login.dto.js';
import { RefreshTokenDto } from './_utils/dtos/requests/refresh-token.dto.js';
import { JwtPayload } from './_utils/types/jwt-payload.type.js';
import { MongoId } from '../_utils/types/mongo-id.type.js';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly userMapper: UserMapper,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authExceptions: AuthExceptions,
    private readonly usersExceptions: UsersExceptions,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw this.usersExceptions.emailAlreadyExists(registerDto.email);
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, SALT_ROUNDS);
    const user = await this.usersService.create(
      registerDto.email,
      hashedPassword,
    );
    return this.userMapper.toResponse(user);
  }

  async onboarding(userId: MongoId, username: string) {
    await this.usersService.setUsername(userId, username);
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

  async refresh(refreshTokenDto: RefreshTokenDto) {
    const payload = await this.verifyRefreshToken(refreshTokenDto.refreshToken);

    const user = await this.usersService.findByIdOrFail(payload.sub);
    if (
      !user.hashedRefreshToken ||
      !this.refreshTokenMatches(
        refreshTokenDto.refreshToken,
        user.hashedRefreshToken,
      )
    ) {
      await this.usersService.setRefreshToken(user._id, null);
      throw this.authExceptions.invalidRefreshToken();
    }

    return await this.issueTokens(user._id, user.email);
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
      this.hashRefreshToken(refreshToken),
    );

    return { accessToken, refreshToken };
  }

  private async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw this.authExceptions.invalidRefreshToken();
    }
  }

  private hashRefreshToken(refreshToken: string): string {
    return createHash('sha256').update(refreshToken).digest('hex');
  }

  private refreshTokenMatches(
    providedToken: string,
    storedHash: string,
  ): boolean {
    const provided = Buffer.from(this.hashRefreshToken(providedToken));
    const stored = Buffer.from(storedHash);
    return (
      provided.length === stored.length && timingSafeEqual(provided, stored)
    );
  }
}
