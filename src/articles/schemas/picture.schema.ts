import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false })
export class Picture {
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  key: string;
}

export const PictureSchema = SchemaFactory.createForClass(Picture);
