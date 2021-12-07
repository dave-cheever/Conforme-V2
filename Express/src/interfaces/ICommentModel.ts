import { Model } from "mongoose";

import { IComment } from "app-interfaces";

export interface ICommentModel extends Model<IComment> {
  get: (_id: string) => Promise<IComment[]>;
  getById: (_id: string) => Promise<IComment>;
};