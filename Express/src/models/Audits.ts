import { response } from 'express';
import { GraphQLError } from 'graphql';
import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IAudit, IAuditModel } from 'app-interfaces';
import { genMetatags, isPermitted, join } from 'app-utils';

const auditsSchema = new Schema<IAudit, IAuditModel>({
  _id: String,
  auditTypeId: String,
  reference: String,
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'missed'],
  },
  dueDate: Date,
  submittedDate: Date,
  walkType: {
    type: String,
    enum: ['physical', 'virtual'],
  },
  siteId: String,
  areaId: String,
  auditorId: String,
  participantsIds: [String],
  organizationId: String,
  metatags: {
    addedAt: Date,
    addedBy: String,
    updatedAt: Date,
    updatedBy: String,
    removedAt: Date,
    removedBy: String,
  },
});

auditsSchema.statics.customGenerateReference = async function (): Promise<string> {
  let reference = '0000001';
  const lastAudit = await this.findOne({}).sort({ 'metatags.addedAt': -1 }).lean();
  if (lastAudit && lastAudit.reference) {
    const newReference = parseInt(lastAudit.reference, 10) + 1;
    reference = `000000${newReference}`.slice(-7);
  }
  return reference;
};

auditsSchema.statics.customCreate = async function (audit: IAudit, userId: string, organizationId: string): Promise<IAudit> {
  const createdAudit = await this.create({
    ...audit,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags('added', userId),
  });

  return createdAudit;
};

auditsSchema.statics.customSearch = async function (searchQuery, user, organizationId): Promise<IAudit[]> {
  const { searchText } = searchQuery;
  const pipeline: any[] = [
    {
      $match: {
        organizationId,
      },
    },
  ];

  if (
    !isPermitted({
      user,
      action: 'audits.viewAll',
      data: { response },
    })
  ) {
    pipeline.push({
      $match: {
        $or: [{ auditorId: user._id }, { participantsIds: { $in: [user._id] } }],
      },
    });
  }

  // Join business unit
  join({
    pipeline,
    collection: 'businessUnits',
    from: 'areaId',
    to: 'area',
  });

  // Filter by search text (in area)
  pipeline.push({
    $match: {
      'area.name': new RegExp(searchText, 'i'),
    },
  });

  join({
    pipeline,
    collection: 'locations',
    from: 'siteId',
    to: 'site',
  });

  pipeline.push({
    $limit: 5,
  });

  pipeline.push({
    $project: {
      _id: 1,
      primaryText: '$area.name',
      secondaryText: '$site.name',
      type: 'audits',
    },
  });

  const data = await this.aggregate(pipeline);

  return data;
};

auditsSchema.statics.customFind = async function (selector: any = {}, organizationId: string): Promise<IAudit[]> {
  const audits = await this.find({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return audits;
};

auditsSchema.statics.customFindOne = async function (selector: any = {}, organizationId: string): Promise<IAudit | null> {
  const audit = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return audit;
};

auditsSchema.statics.customFindById = async function (_id: string): Promise<IAudit> {
  const audit = await this.findOne({
    _id,
    'metatags.removedAt': { $eq: null },
  }).lean();
  if (!audit) throw new Error('Audit not found');

  return audit;
};

auditsSchema.statics.customUpdateOne = async function (
  selector: object = {},
  updates: Partial<IAudit>,
  userId: string,
  organizationId: string,
): Promise<IAudit> {
  const audit = await this.customFindOne(selector, organizationId);
  if (!audit) throw new GraphQLError("Audit doesn't exist");

  const updatedAudit = {
    ...audit,
    ...updates,
    metatags: {
      ...audit?.metatags,
      ...genMetatags('updated', userId),
    },
  };
  await this.updateOne(selector, updatedAudit);

  return updatedAudit;
};

auditsSchema.statics.customDelete = async function (selector: object = {}, userId: string, organizationId: string): Promise<number> {
  const audit = await this.customFindOne(selector, organizationId);
  if (!audit) throw new GraphQLError("Audit doesn't exist");

  const updatedAudit = {
    ...audit,
    metatags: {
      ...audit?.metatags,
      ...genMetatags('removed', userId),
    },
  };
  const deletedResult = await this.updateOne(selector, updatedAudit);

  return deletedResult?.modifiedCount;
};

const auditsModel = model<IAudit, IAuditModel>('Audit', auditsSchema);

export default auditsModel;
