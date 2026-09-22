import { BadGatewayException, Injectable } from '@nestjs/common';

@Injectable()
export class StorageExceptions {
  uploadFailed(key: string) {
    return new BadGatewayException(`Failed to upload object ${key}`);
  }

  deleteFailed(key: string) {
    return new BadGatewayException(`Failed to delete object ${key}`);
  }
}
