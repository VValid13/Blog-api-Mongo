import { BadRequestException } from '@nestjs/common';

export class InvalidMongoIdException extends BadRequestException {
  constructor(schemaName: string, id: string) {
    super(`Invalid id shape for ${schemaName}: ${id}`);
  }
}
