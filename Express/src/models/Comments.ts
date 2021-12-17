import { model, Schema } from 'mongoose';

import { IComment, ICommentModel } from 'app-interfaces';

const commentSchema = new Schema<IComment, ICommentModel>({
  _id: String,
  responseId: String,
  text: String,
  authorId: String,
  metatags: {
    addedAt: Date,
    addedBy: String,
    updatedAt: Date,
    updatedBy: String,
    removedAt: Date,
    removedBy: String
  }
});

// Creating custom methods for every collection to manipulate th DB because we want to do some checks

commentSchema.statics.customFind = async function (_id: string): Promise<IComment[]> {
  const comments = await this.find({
    responseId:_id,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return comments;
};

commentSchema.statics.customFindById = async function (_id: string): Promise<IComment> {
  const comment = await this.findOne({
    _id,
    "metatags.removedAt": { $eq: null },
  }).lean();
  if (!comment) {
    throw new Error("Comment not found");
  }
  return comment;
};

const commentModel = model<IComment, ICommentModel>('Comment', commentSchema);
export default commentModel;
