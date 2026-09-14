import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
} from '@nestjs/common';
import type { Response } from 'express';
import { MongoServerError } from 'mongodb';

const DUPLICATE_KEY_ERROR_CODE = 11000;

@Catch(MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const httpException = this.toHttpException(exception);
    response
      .status(httpException.getStatus())
      .json(httpException.getResponse());
  }

  private toHttpException(exception: MongoServerError) {
    if (exception.code === DUPLICATE_KEY_ERROR_CODE) {
      const duplicateFields = Object.entries(exception.keyValue ?? {})
        .map(([field, value]) => `${field}: "${value}"`)
        .join(', ');
      return new ConflictException(`Duplicate value for ${duplicateFields}`);
    }
    return new ConflictException('Database conflict');
  }
}
