import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PictureDocument = HydratedDocument<Picture>;

@Schema({ versionKey: false })
export class Picture {
  @Prop({ required: true, type: String })
  key: string;
}

export const PictureSchema = SchemaFactory.createForClass(Picture);
