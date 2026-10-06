import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ArticlesRepository } from './articles.repository.js';
import {
  ORPHAN_PICTURES_CLEANUP_CRON,
  ORPHAN_PICTURES_CLEANUP_JOB_NAME,
  ORPHAN_PICTURES_GRACE_PERIOD_MS,
} from './_utils/constants/articles.constants.js';
import { StorageMapper } from '../storage/_utils/mappers/storage.mapper.js';
import { StorageService } from '../storage/storage.service.js';

@Injectable()
export class ArticlesCleanupService {
  private readonly logger = new Logger(ArticlesCleanupService.name);

  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly storageService: StorageService,
    private readonly storageMapper: StorageMapper,
  ) {}

  @Cron(ORPHAN_PICTURES_CLEANUP_CRON, {
    name: ORPHAN_PICTURES_CLEANUP_JOB_NAME,
  })
  async handleOrphanPicturesCleanup() {
    try {
      const deletedCount = await this.cleanOrphanPictures(
        ORPHAN_PICTURES_GRACE_PERIOD_MS,
      );
      this.logger.log(`Orphan pictures cleanup: ${deletedCount} deleted`);
    } catch (error) {
      this.logger.error('Orphan pictures cleanup failed', error);
    }
  }

  async cleanOrphanPictures(gracePeriodMs: number) {
    const olderThan = Date.now() - gracePeriodMs;
    let deletedCount = 0;

    for await (const page of this.storageService.listObjectPages(
      this.storageMapper.toArticlePicturesPrefix(),
    )) {
      const candidateKeys = page
        .filter((object) => object.lastModified.getTime() < olderThan)
        .map((object) => object.key);
      if (candidateKeys.length === 0) {
        continue;
      }

      const referencedKeys =
        await this.articlesRepository.findReferencedPictureKeys(candidateKeys);
      const orphanKeys = candidateKeys.filter(
        (key) => !referencedKeys.has(key),
      );
      if (orphanKeys.length > 0) {
        deletedCount += await this.storageService.deleteMany(orphanKeys);
      }
    }

    return deletedCount;
  }
}
