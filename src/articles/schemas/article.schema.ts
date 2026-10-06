import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  RustfsFile,
  RustfsFileSchema,
} from '../../storage/schemas/rustfs-file.schema.js';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true, versionKey: false })
export class Article {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  content: string;

  @Prop({ required: true, type: String })
  author: string;

  @Prop({ type: [RustfsFileSchema], default: [] })
  pictures: RustfsFile[];

  createdAt: Date;

  updatedAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

ArticleSchema.index({ title: 1, author: 1 }, { unique: true });
