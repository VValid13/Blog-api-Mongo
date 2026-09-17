import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './_utils/dtos/requests/register.dto.js';
import { LoginDto } from './_utils/dtos/requests/login.dto.js';
import { RefreshTokenDto } from './_utils/dtos/requests/refresh-token.dto.js';
import { OnboardingDto } from './_utils/dtos/requests/onboarding.dto.js';
import { CurrentUser } from './_utils/decorators/current-user.decorator.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { UserResponseDto } from '../users/_utils/dtos/responses/user.response.dto.js';
import type { UserLike } from '../users/_utils/types/user-like.type.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Créer un compte utilisateur' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Corps de requête invalide' })
  @ApiResponse({ status: 409, description: 'Cet email est déjà utilisé' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Se connecter et obtenir un couple de tokens' })
  @ApiResponse({ status: 200, description: 'Couple access/refresh token' })
  @ApiResponse({ status: 401, description: 'Email ou mot de passe invalide' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @ApiOperation({
    summary: 'Échanger un refresh token contre un nouveau couple de tokens',
  })
  @ApiResponse({ status: 200, description: 'Couple access/refresh token' })
  @ApiResponse({
    status: 401,
    description: 'Refresh token invalide ou révoqué',
  })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refresh(refreshTokenDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Révoquer le refresh token de l'utilisateur connecté",
  })
  @ApiResponse({ status: 200, description: 'Déconnecté' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: UserLike) {
    await this.authService.logout(user._id);
    return { message: 'Logged out' };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Définir son nom d'utilisateur (complète l'inscription)",
  })
  @ApiResponse({ status: 200, description: 'Username mis à jour' })
  @ApiResponse({ status: 400, description: 'Corps de requête invalide' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @UseGuards(JwtAuthGuard)
  @Patch('onboarding')
  @HttpCode(HttpStatus.OK)
  async onboarding(
    @CurrentUser() user: UserLike,
    @Body() onboardingDto: OnboardingDto,
  ) {
    await this.authService.onboarding(user._id, onboardingDto.username);
    return { message: 'Username set' };
  }
}
