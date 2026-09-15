import { IsEmail } from 'class-validator';
import { IsNotEmptyString } from '../../../../_utils/decorators/IsNotEmptyString.js';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmptyString()
  password: string;
}
