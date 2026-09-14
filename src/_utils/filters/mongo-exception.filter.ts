import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  InternalServerErrorException,
} from '@nestjs/common';
import type { Response } from 'express';
import { MongoServerError } from 'mongodb';
import { DUPLICATE_KEY_ERROR_CODE } from '../constants/mongo.constants.js';

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
    switch (exception.code) {
      case DUPLICATE_KEY_ERROR_CODE:
        return new ConflictException(exception.message);
      default:
        return new InternalServerErrorException(exception.message);
    }
  }
}
