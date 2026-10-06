import { Module } from '@nestjs/common';
import { StorageExceptions } from './_utils/exceptions/storage.exceptions.js';
import { StorageMapper } from './_utils/mappers/storage.mapper.js';
import { storageProviders } from './storage.provider.js';
import { StorageService } from './storage.service.js';

@Module({
  providers: [
    StorageService,
    StorageMapper,
    StorageExceptions,
    ...storageProviders,
  ],
  exports: [StorageService, StorageMapper],
})
export class StorageModule {}
