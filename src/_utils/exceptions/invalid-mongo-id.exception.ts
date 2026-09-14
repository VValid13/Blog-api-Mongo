import { BadRequestException } from '@nestjs/common';

export class InvalidMongoIdException extends BadRequestException {
  constructor(id: string) {
    super(`Invalid id shape: ${id}`);
  }
}
