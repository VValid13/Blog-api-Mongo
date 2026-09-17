import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard.js';
import { UsernameSetGuard } from '../../guards/username-set.guard.js';

export function Protect() {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, UsernameSetGuard),
  );
}
