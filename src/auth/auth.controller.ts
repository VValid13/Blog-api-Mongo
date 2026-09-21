import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './_utils/dtos/requests/register.dto.js';
import { LoginDto } from './_utils/dtos/requests/login.dto.js';
import { RefreshTokenDto } from './_utils/dtos/requests/refresh-token.dto.js';
import { CurrentUser } from './_utils/decorators/current-user.decorator.js';
import { Protect } from './_utils/decorators/protect.decorator.js';
import { RefreshTokenPipe } from './_utils/pipes/refresh-token.pipe.js';
import { UserResponseDto } from '../users/_utils/dtos/responses/user.response.dto.js';
import type { UserDocument } from '../users/schemas/user.schema.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Créer un compte utilisateur' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Corps de requête invalide' })
  @ApiResponse({ status: 409, description: 'Cet email est déjà utilisé' })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Se connecter et obtenir un couple de tokens' })
  @ApiResponse({ status: 200, description: 'Couple access/refresh token' })
  @ApiResponse({ status: 401, description: 'Email ou mot de passe invalide' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Protect({ requireUsername: false })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Échanger un refresh token contre un nouveau couple de tokens',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Couple access/refresh token' })
  @ApiResponse({
    status: 401,
    description:
      'Non authentifié, ou refresh token invalide, révoqué ou appartenant à un autre utilisateur',
  })
  async refresh(
    @CurrentUser() currentUser: UserDocument,
    @Body('refreshToken', RefreshTokenPipe) tokenOwner: UserDocument,
  ) {
    return await this.authService.refresh(currentUser, tokenOwner);
  }

  @Protect({ requireUsername: false })
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Révoquer le refresh token de l'utilisateur connecté",
  })
  @ApiResponse({ status: 204, description: 'Déconnecté' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  async logout(@CurrentUser() user: UserDocument) {
    await this.authService.logout(user._id);
  }
}
