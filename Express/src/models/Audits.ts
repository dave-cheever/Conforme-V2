import { GraphQLError } from 'graphql';
import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IAudit, IAuditModel } from 'app-interfaces';
import { genMetatags } from 'app-utils';

const auditsSchema = new Schema<IAudit, IAuditModel>({
  _id: String,
  auditTypeId: String,
  reference: String,
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

auditsSchema.statics.customGenerateReference =
  async function (): Promise<string> {
    let reference = '0000001';
    const lastAudit = await this.findOne({})
      .sort({ 'metatags.addedAt': -1 })
      .lean();
    if (lastAudit && lastAudit.reference) {
      const newReference = parseInt(lastAudit.reference, 10) + 1;
      reference = `000000${newReference}`.slice(-7);
    }
    return reference;
  };

auditsSchema.statics.customCreate = async function (
  audit: IAudit,
  userId: string,
  organizationId: string,
): Promise<IAudit> {
  const createdAudit = await this.create({
    ...audit,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags('added', userId),
  });

  return createdAudit;
};

auditsSchema.statics.customFind = async function (
  selector: any = {},
  organizationId: string,
): Promise<IAudit[]> {
  const audits = await this.find({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return audits;
};

auditsSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string,
): Promise<IAudit | null> {
  const audit = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return audit;
};

auditsSchema.statics.customFindById = async function (
  _id: string,
): Promise<IAudit> {
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

auditsSchema.statics.customDelete = async function (
  selector: object = {},
  userId: string,
  organizationId: string,
): Promise<number> {
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
