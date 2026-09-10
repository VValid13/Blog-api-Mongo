import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true, versionKey: false })
export class Article {
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  content: string;

  @Prop({ required: true, type: String })
  author: string;

  createdAt: Date;

  updatedAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
