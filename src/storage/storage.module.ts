import { Module } from '@nestjs/common';
import { StorageExceptions } from './_utils/exceptions/storage.exceptions.js';
import { StorageService } from './storage.service.js';

@Module({
  providers: [StorageService, StorageExceptions],
  exports: [StorageService],
})
export class StorageModule {}
