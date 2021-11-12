import { model, Schema } from 'mongoose';

import { IComment, ICommentModel } from 'app-interfaces';

const commentSchema = new Schema<IComment, ICommentModel>({
  _id: String,
  responseId: String,
  text: String,
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

commentSchema.statics.get = async function (
  selector: any = {}
): Promise<IComment[]> {
  const comments = await this.find({
    ...selector,
    "metatags.removedAt": { $eq: null },
  });
  return comments.map((comment) => comment._doc);
};

commentSchema.statics.getById = async function (
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
