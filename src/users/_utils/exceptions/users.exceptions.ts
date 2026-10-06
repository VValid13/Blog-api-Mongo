import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class UsersExceptions {
  emailAlreadyExists(email: string) {
    return new ConflictException(`Email ${email} is already in use`);
  }
}
