import { Body, Controller, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { OnboardingDto } from './_utils/dtos/requests/onboarding.dto.js';
import { CurrentUser } from '../auth/_utils/decorators/current-user.decorator.js';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import type { UserDocument } from './schemas/user.schema.js';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Protect({ requireUsername: false })
  @Patch('onboarding')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Définir son nom d'utilisateur (complète l'inscription)",
  })
  @ApiResponse({ status: 204, description: 'Username mis à jour' })
  @ApiResponse({ status: 400, description: 'Corps de requête invalide' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({
    status: 409,
    description: "Ce nom d'utilisateur est déjà pris",
  })
  async onboarding(
    @CurrentUser() user: UserDocument,
    @Body() onboardingDto: OnboardingDto,
  ) {
    await this.usersService.setUsername(user._id, onboardingDto.username);
  }
}
