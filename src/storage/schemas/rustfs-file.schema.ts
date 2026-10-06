import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class RustfsFile {
  @Prop({ required: true, type: String })
  bucket: string;

  @Prop({ required: true, type: String })
  key: string;

  @Prop({ required: true, type: String })
  fileName: string;

  @Prop({ required: true, type: String })
  mimeType: string;

  @Prop({ required: true, type: Date })
  createdAt: Date;

  @Prop({ required: true, type: Number })
  size: number;
}

export const RustfsFileSchema = SchemaFactory.createForClass(RustfsFile);
