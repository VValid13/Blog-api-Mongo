import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class StorageExceptions {
  uploadFailed(key: string) {
    return new BadGatewayException(`Failed to upload object ${key}`);
  }

  deleteFailed(key: string) {
    return new BadGatewayException(`Failed to delete object ${key}`);
  }

  listFailed(prefix: string) {
    return new BadGatewayException(`Failed to list objects under ${prefix}`);
  }

  deleteManyFailed(count: number) {
    return new BadGatewayException(`Failed to delete ${count} objects`);
  }

  invalidSignedUrl(key: string) {
    return new InternalServerErrorException(
      `Signed url for object ${key} is not a valid url`,
    );
  }
}
