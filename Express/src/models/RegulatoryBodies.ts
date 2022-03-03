import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from "uuid";

import { IBaseWithName, IBaseWithNameModel } from 'app-interfaces';
import { genMetatags, getAuditRecordValues, getBasicElement, removeDatabaseFields } from 'app-utils';
import { AuditLogs } from 'app-models';
import { GraphQLError } from 'graphql';

const regulatoryBodySchema = new Schema<IBaseWithName, IBaseWithNameModel>({
  _id: String,
  name: String,
  organizationId: String,
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

regulatoryBodySchema.statics.customCreate = async function (regulatoryBody: IBaseWithName, userId: string, organizationId: string): Promise<IBaseWithName> {
  const createdRegulatoryBody = await this.create({
    ...regulatoryBody,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags("added", userId),
  });

  if (createdRegulatoryBody?._doc) {
    const addAuditLog = async () => {
      const element = getBasicElement(createdRegulatoryBody._doc);
      const newValues = removeDatabaseFields(createdRegulatoryBody._doc);
      const values = await getAuditRecordValues({ newValues });
      AuditLogs.customAudit({
        coll: 'regulatoryBodies',
        action: "add",
        element,
        values,
      }, userId, organizationId);
    };
    addAuditLog();
  }

  return createdRegulatoryBody;
};

regulatoryBodySchema.statics.customFindOne = async function (selector: any = {}, organizationId: string): Promise<IBaseWithName | null> {
  const regulatoryBody = await this.findOne({
    ...selector,
    organizationId,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return regulatoryBody;
};

regulatoryBodySchema.statics.customFindById = async function (_id: string): Promise<IBaseWithName> {
  const regulatoryBody = await this.findOne({
    _id,
    "metatags.removedAt": { $eq: null },
  }).lean();
  if (!regulatoryBody) {
    throw new Error('Regulatory body not found');
  }
  return regulatoryBody;
};

regulatoryBodySchema.statics.customFind = async function (selector: any = {}, organizationId): Promise<IBaseWithName[]> {
  const regulatoryBodies = await this.find({
    ...selector,
    organizationId,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return regulatoryBodies;
};

regulatoryBodySchema.statics.customUpdateOne = async function (selector: object = {}, updates: Partial<IBaseWithName>, userId: string, organizationId: string): Promise<IBaseWithName> {
  const regulatoryBody = await this.customFindOne(selector, organizationId);
  if (!regulatoryBody) {
    throw new GraphQLError('Regulatory body doesn\'t exist');
  }

  const updatedRegulatoryBody = {
    ...regulatoryBody,
    ...updates,
    metatags: {
      ...regulatoryBody?.metatags,
      ...genMetatags("updated", userId),
    },
  };
  const updatedResult = await this.updateOne(selector, updatedRegulatoryBody);

  if (updatedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const element = getBasicElement(updatedRegulatoryBody);
      const oldValues = removeDatabaseFields(regulatoryBody);
      const newValues = removeDatabaseFields(updatedRegulatoryBody);
      const values = await getAuditRecordValues({ oldValues, newValues });
      AuditLogs.customAudit({
        coll: 'categories',
        action: "update",
        element,
        values,
      }, userId, organizationId);
    };
    addAuditLog();
  }

  return updatedRegulatoryBody;
};

regulatoryBodySchema.statics.customDelete = async function (selector: object = {}, userId: string, organizationId: string): Promise<number> {
  const regulatoryBody = await this.customFindOne(selector, organizationId);
  if (!regulatoryBody) {
    throw new GraphQLError('Regulatory body doesn\'t exist');
  }

  const updatedRegulatoryBody = {
    ...regulatoryBody,
    metatags: {
      ...regulatoryBody?.metatags,
      ...genMetatags("removed", userId),
    },
  };
  const deletedResult = await this.updateOne(selector, updatedRegulatoryBody);

  if (deletedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const element = getBasicElement(regulatoryBody);
      const oldValues = removeDatabaseFields(regulatoryBody);
      const values = await getAuditRecordValues({ oldValues });
      AuditLogs.customAudit({
        coll: 'regulatoryBodies',
        action: "delete",
        element,
        values,
      }, userId, organizationId);
    };
    addAuditLog();
  }

  return deletedResult?.modifiedCount;
};

const regulatoryBodyModel = model<IBaseWithName, IBaseWithNameModel>('RegulatoryBody', regulatoryBodySchema, 'regulatoryBodies');
export default regulatoryBodyModel;
