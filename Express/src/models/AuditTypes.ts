import { model, models, Schema } from "mongoose";
import { GraphQLError } from "graphql";
import { v4 as uuidv4 } from "uuid";

import { IAuditType, IAuditTypeModel, IQuestion, IQuestionModel, TQuestionValue } from "app-interfaces";
import { AuditLogs } from "app-models";
import { genMetatags, getAuditRecordValues, getBasicElement, removeDatabaseFields } from "app-utils";

const auditTypesSchema = new Schema<IAuditType, IAuditTypeModel>({
  _id: String,
  name: String,
  frequency: {
    type: String,
    enum: ["Daily", "Weekly", "Monthly", "Quarterly", "6 months", "Annual", "2 years", "3 years", "5 years", "Variable", "Ad-hoc"],
  },
  sections: [{
    type: {
      type: String,
      enum: ["notes", "questionsCategory"],
    },
    _id: String,
  }],
  view: {
    type: String,
    enum: ["categorized", "singlePage"],
  },
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

// Creating custom methods for every collection to manipulate th DB because we want to do some checks

auditTypesSchema.statics.customCreate = async function (auditType: IAuditType, userId: string, organizationId: string): Promise<IAuditType> {
  const createdAuditType = await this.create({
    ...auditType,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags("added", userId),
  });

  // if (createdQuestion?._doc) {
  //   const addAuditLog = async () => {
  //     const newValues = removeDatabaseFields(createdQuestion._doc);
  //     const values = await getAuditRecordValues({ newValues });
  //     AuditLogs.customAudit({
  //       coll: 'questions',
  //       action: "add",
  //       element: {
  //         _id: createdQuestion._id,
  //         name: question.question,
  //       },
  //       values,
  //     }, userId, organizationId);
  //   };
  //   addAuditLog();
  // }

  return createdAuditType;
};

auditTypesSchema.statics.customFind = async function (selector: any = {}, organizationId: string): Promise<IAuditType[]> {
  const auditTypes = await this.find({
    ...selector,
    organizationId,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return auditTypes;
};

auditTypesSchema.statics.customFindOne = async function (selector: any = {}, organizationId: string): Promise<IAuditType | null> {
  const auditType = await this.findOne({
    ...selector,
    organizationId,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return auditType;
};

auditTypesSchema.statics.customFindById = async function (_id: string): Promise<IAuditType> {
  const auditType = await this.findOne({
    _id,
    "metatags.removedAt": { $eq: null },
  }).lean();
  if (!auditType) {
    throw new Error("Audit type not found");
  }
  return auditType;
};

auditTypesSchema.statics.customUpdateOne = async function (selector: object = {}, updates: Partial<IAuditType>, userId: string, organizationId: string): Promise<IAuditType> {
  const auditType = await this.customFindOne(selector, organizationId);
  if (!auditType) {
    throw new GraphQLError('Audit type doesn\'t exist');
  }

  const updatedAuditType = {
    ...auditType,
    ...updates,
    metatags: {
      ...auditType?.metatags,
      ...genMetatags("updated", userId),
    },
  };
  const updatedResult = await this.updateOne(selector, updatedAuditType);

  // if (updatedResult?.modifiedCount) {
  //   const addAuditLog = async () => {
  //     const oldValues = removeDatabaseFields(auditType);
  //     const newValues = removeDatabaseFields(updatedQuestion);
  //     const values = await getAuditRecordValues({ oldValues, newValues });
  //     AuditLogs.customAudit({
  //       coll: 'questions',
  //       action: "update",
  //       element: {
  //         _id: auditType._id,
  //         name: auditType.question,
  //       },
  //       values,
  //     }, userId, organizationId);
  //   };
  //   addAuditLog();
  // }

  return updatedAuditType;
};

auditTypesSchema.statics.customDelete = async function (selector: object = {}, userId: string, organizationId: string): Promise<number> {
  const auditType = await this.customFindOne(selector, organizationId);
  if (!auditType) {
    throw new GraphQLError('Question doesn\'t exist');
  }

  const updatedAuditType = {
    ...auditType,
    metatags: {
      ...auditType?.metatags,
      ...genMetatags("removed", userId),
    },
  };
  const deletedResult = await this.updateOne(selector, updatedAuditType);

  // if (deletedResult?.modifiedCount) {
  //   const addAuditLog = async () => {
  //     const oldValues = removeDatabaseFields(auditType);
  //     const values = await getAuditRecordValues({ oldValues });
  //     AuditLogs.customAudit({
  //       coll: 'questions',
  //       action: "delete",
  //       element: {
  //         _id: auditType._id,
  //         name: auditType.question,
  //       },
  //       values,
  //     }, userId, organizationId);
  //   };
  //   addAuditLog();
  // }

  return deletedResult?.modifiedCount;
};

const auditTypeModel = model<IAuditType, IAuditTypeModel>("AuditType", auditTypesSchema);
export default auditTypeModel;
