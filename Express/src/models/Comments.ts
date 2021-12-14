import { model, Schema } from 'mongoose';

import { IComment, ICommentModel } from 'app-interfaces';

const commentSchema = new Schema<IComment, ICommentModel>({
  _id: String,
  responseId: String,
  text: String,
  author: {
    _id: String,
    firstName: String,
    lastName: String,
    displayName: String,
    email: String,
    jobTitle: String,
    imgUrl: String,
    defaultPage: String,
    role: {
      type: String,
      enum: ['user', 'reader', 'admin'],
      default: 'user',
    },
  },
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

commentSchema.statics.customFind = async function (
  _id: string
): Promise<IComment[]> {
  const comments = await this.find({
    responseId:_id,
    "metatags.removedAt": { $eq: null },
  });
  return comments.map((comment) => comment._doc);
};

commentSchema.statics.customFindById = async function (
  _id: string
): Promise<IComment> {
  const comment = await this.findOne({
    _id,
    "metatags.removedAt": { $eq: null },
  });
  if (!comment) {
    throw new Error("Comment not found");
  }
  return comment._doc;
};

const commentModel = model<IComment, ICommentModel>('Comment', commentSchema);
export default commentModel;
