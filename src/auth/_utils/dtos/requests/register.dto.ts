import { IsEmail, MinLength } from 'class-validator';
import { IsNotEmptyString } from '../../../../_utils/decorators/IsNotEmptyString.js';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmptyString()
  @MinLength(8)
  password: string;
}
