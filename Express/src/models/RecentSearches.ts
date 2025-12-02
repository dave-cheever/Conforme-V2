import { model, Schema } from 'mongoose';

import { IRecentSearch, IRecentSearchModel } from 'app-interfaces';
import { ENTITY_TYPES } from 'app-enums';

const recentSearchSchema = new Schema<IRecentSearch, IRecentSearchModel>({
  _id: String,
  userId: { type: String, required: true },
  term: { type: String, required: true },
  entityId: { type: String, required: true },
  entityType: {
    type: String,
    required: true,
    enum: ENTITY_TYPES,
  },
  organizationId: { type: String, required: true },
  metatags: {
    addedAt: Date,
    addedBy: String,
    updatedAt: Date,
    updatedBy: String,
    removedAt: Date,
    removedBy: String,
  },
});

recentSearchSchema.statics.customFindByUserId = async function (
  userId: string,
  organizationId: string,
): Promise<IRecentSearch[]> {
  const recentSearches = await this.find({
    userId,
    organizationId,
    'metatags.removedAt': { $eq: null },
  })
    .lean();

  return recentSearches;
};

const recentSearchModel = model<IRecentSearch, IRecentSearchModel>('RecentSearch', recentSearchSchema, 'recentsearches');

export default recentSearchModel;

