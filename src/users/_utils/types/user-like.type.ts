import { Types } from 'mongoose';

export type UserLike = {
  _id: Types.ObjectId;
  email: string;
  username: string | null;
  createdAt: Date;
};
