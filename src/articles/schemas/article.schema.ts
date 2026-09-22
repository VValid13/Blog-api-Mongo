import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Picture, PictureSchema } from './picture.schema.js';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true, versionKey: false })
export class Article {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  content: string;

  @Prop({ required: true, type: String })
  author: string;

  @Prop({ type: [PictureSchema], default: [] })
  pictures: Picture[];

  createdAt: Date;

  updatedAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

ArticleSchema.index({ title: 1, author: 1 }, { unique: true });
