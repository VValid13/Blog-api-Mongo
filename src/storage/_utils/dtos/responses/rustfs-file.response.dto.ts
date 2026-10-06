import { ApiProperty } from '@nestjs/swagger';
import type { Url } from '../../../../_utils/types/url.type.js';

export class RustfsFileResponseDto {
  key: string;

  @ApiProperty({ type: String, format: 'uri' })
  url: Url;

  fileName: string;
  mimeType: string;
  size: number;
  createdAt: Date;
}
