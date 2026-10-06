import { CronExpression } from '@nestjs/schedule';
import { PICTURE_MIME_TYPES } from '../../../_utils/constants/mime-type.constants.js';
import { toHours } from '../../../_utils/helpers/duration.helper.js';
import { toMb } from '../../../_utils/helpers/file-size.helper.js';

export const PICTURE_FIELD_NAME = 'file';
export const PICTURE_MAX_SIZE_BYTES = toMb(5);
export const PICTURE_MIME_TYPE_REGEX = new RegExp(
  `^(${PICTURE_MIME_TYPES.join('|')})$`,
);

export const ORPHAN_PICTURES_CLEANUP_JOB_NAME = 'orphan-pictures-cleanup';
export const ORPHAN_PICTURES_CLEANUP_CRON = CronExpression.EVERY_DAY_AT_3AM;
export const ORPHAN_PICTURES_GRACE_PERIOD_MS = toHours(1);
