export enum MimeType {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  WEBP = 'image/webp',
}

export const PICTURE_MIME_TYPES = [MimeType.JPEG, MimeType.PNG, MimeType.WEBP];

export const MIME_TYPE_EXTENSIONS: Record<MimeType, string> = {
  [MimeType.JPEG]: 'jpg',
  [MimeType.PNG]: 'png',
  [MimeType.WEBP]: 'webp',
};
