import { IsNotEmptyString } from '../../../../_utils/decorators/IsNotEmptyString.js';

export class RefreshTokenDto {
  @IsNotEmptyString()
  refreshToken: string;
}
