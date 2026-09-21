import { IsNotEmptyString } from '../../../../_utils/decorators/IsNotEmptyString.js';

export class OnboardingDto {
  @IsNotEmptyString()
  username: string;
}
