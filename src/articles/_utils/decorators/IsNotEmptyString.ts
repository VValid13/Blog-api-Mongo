import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

export function IsNotEmptyString() {
  return applyDecorators(IsString(), IsNotEmpty());
}
