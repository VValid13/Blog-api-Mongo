import { Global, Module } from '@nestjs/common';
import { GlobalExceptions } from './global.exceptions.js';

@Global()
@Module({
  providers: [GlobalExceptions],
  exports: [GlobalExceptions],
})
export class GlobalExceptionsModule {}
