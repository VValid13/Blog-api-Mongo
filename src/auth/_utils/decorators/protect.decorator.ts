import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard.js';
import { UsernameSetGuard } from '../../guards/username-set.guard.js';
import type { ProtectOptions } from '../types/protect-options.type.js';

export function Protect({ requireUsername = true }: ProtectOptions = {}) {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, ...(requireUsername ? [UsernameSetGuard] : [])),
  );
}
