import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

export function IsStringAndNotEmpty() {
  return applyDecorators(IsString(), IsNotEmpty());
}
