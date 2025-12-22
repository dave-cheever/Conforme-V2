import { diff } from 'deep-object-diff';
import { GraphQLError } from 'graphql';
import { model, models, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IActionTemplate, IActionTemplateModel, IAuditValues, IAuditValue } from 'app-interfaces';
import { AuditLogs, ActionCategories, Organizations } from 'app-models';
import {
  genMetatags,
  getAuditValueForLookup,
  getAuditValueForString,
  getAuditValueForUser,
  removeDatabaseFields,
} from 'app-utils';


async function validateUniqueTitle(this: any, title: string) {
  const query: any = {
    title: title.trim(),
    organizationId: this.organizationId,
    'metatags.removedAt': { $eq: null },
  };
  
  // Exclude current document when updating
  if (this._id) {
    query._id = { $ne: this._id };
  }
  
  const actionTemplateCount = await models.ActionTemplate.countDocuments(query);
  return actionTemplateCount === 0;
}

// This method is used to prepare values object for audit log
const getAuditRecordValues = async ({
  oldValues = {},
  newValues = {},
  organization,
}: {
  oldValues?: any;
  newValues?: any;
  organization?: any;
}): Promise<IAuditValues> => {
  // It takes all the differences between old and new object
  const differences = diff(oldValues, newValues);
  const fields = Object.keys(differences);

  // and fills the audit record object with these differences
  const auditRecordValuesPromise = fields.reduce(async (accP, field) => {
    const acc = await accP;
    let value: IAuditValue = {};
    const oldValue = oldValues[field];
    const newValue = newValues[field];

    switch (field) {
      // If updated 'actionCategoryId' field, get action category from database and set value as id and label as name
      case 'actionCategoryId':
        value = await getAuditValueForLookup({
          collection: ActionCategories,
          labelField: 'name',
          oldValue,
          newValue,
        });
        break;

      // If updated 'suggestedOwnerId' field, set user's ID as value and full name as label
      case 'suggestedOwnerId':
        value = await getAuditValueForUser({
          oldValue,
          newValue,
          organization,
        });
        break;

      default:
        if (typeof oldValue === 'string' || typeof newValue === 'string') {
          value = getAuditValueForString(oldValue, newValue);
        }
    }
    return {
      ...acc,
      [field]: value,
    };
  }, Promise.resolve({}));

  const auditRecordValues = await auditRecordValuesPromise;
  return auditRecordValues;
};

const actionTemplatesSchema = new Schema<IActionTemplate, IActionTemplateModel>({
  _id: String,
  title: {
    type: String,
    required: true,
    validate: [validateUniqueTitle, 'Template title must be unique'],
  },
  description: {
    type: String,
    required: false,
  },
  actionCategoryId: {
    type: String,
    required: true,
  },
  suggestedOwnerId: {
    type: String,
    required: false,
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

actionTemplatesSchema.statics.customCreate = async function (
  actionTemplate: Partial<IActionTemplate>,
  userId: string,
  organizationId: string,
): Promise<IActionTemplate> {
  const trimmedTitle = actionTemplate.title?.trim();
  if (!trimmedTitle) {
    throw new GraphQLError('Template title is required');
  }

  if (!actionTemplate.actionCategoryId) {
    throw new GraphQLError('Action category is required');
  }

  // Verify that the action category exists and is active
  const { ActionCategories } = await import('app-models');
  const category = await ActionCategories.customFindOne(
    { _id: actionTemplate.actionCategoryId },
    organizationId,
  );
  if (!category) {
    throw new GraphQLError('Action category not found or inactive');
  }

  const existingTemplate = await this.findOne({
    title: trimmedTitle,
    organizationId,
    'metatags.removedAt': { $eq: null },
  });

  if (existingTemplate) {
    throw new GraphQLError('Template title must be unique');
  }

  const createdActionTemplate = await this.create({
    ...actionTemplate,
    title: trimmedTitle,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags('added', userId),
  });

  if (createdActionTemplate?._doc) {
    const addAuditLog = async () => {
      const newValues = removeDatabaseFields(createdActionTemplate._doc);
      const organization = await Organizations.customFindById(organizationId);
      const values = await getAuditRecordValues({ newValues, organization });
      AuditLogs.customAudit(
        {
          coll: 'actionTemplates',
          action: 'add',
          element: {
            _id: createdActionTemplate._doc._id,
            name: newValues.title,
          },
          values,
        },
        userId,
        organizationId,
      );
    };
    addAuditLog();
  }

  return createdActionTemplate;
};

actionTemplatesSchema.statics.customFind = async function (
  selector: any = {},
  organizationId: string,
): Promise<IActionTemplate[]> {
  const actionTemplates = await this.find({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return actionTemplates;
};

actionTemplatesSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string,
): Promise<IActionTemplate | null> {
  const actionTemplate = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return actionTemplate;
};

actionTemplatesSchema.statics.customFindById = async function (
  _id: string,
  organizationId: string,
): Promise<IActionTemplate> {
  const actionTemplate = await this.findOne({
    _id,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  if (!actionTemplate) throw new Error('Action template not found');

  return actionTemplate;
};

actionTemplatesSchema.statics.customUpdateOne = async function (
  selector: object = {},
  updates: Partial<IActionTemplate>,
  userId: string,
  organizationId: string,
): Promise<IActionTemplate> {
  const actionTemplate = await this.customFindOne(selector, organizationId);
  if (!actionTemplate) throw new GraphQLError("Action template doesn't exist");

  let trimmedUpdates = { ...updates };
  if (updates.title !== undefined) {
    const trimmedTitle = updates.title.trim();
    if (!trimmedTitle) {
      throw new GraphQLError('Template title is required');
    }

    const existingTemplate = await this.findOne({
      title: trimmedTitle,
      organizationId,
      _id: { $ne: actionTemplate._id },
      'metatags.removedAt': { $eq: null },
    });

    if (existingTemplate) {
      throw new GraphQLError('Template title must be unique');
    }

    trimmedUpdates.title = trimmedTitle;
  }

  if (updates.actionCategoryId !== undefined) {
    // Verify that the action category exists and is active
    const { ActionCategories } = await import('app-models');
    const category = await ActionCategories.customFindOne(
      { _id: updates.actionCategoryId },
      organizationId,
    );
    if (!category) {
      throw new GraphQLError('Action category not found or inactive');
    }
  }

  const updatedActionTemplate = {
    ...actionTemplate,
    ...trimmedUpdates,
    metatags: {
      ...actionTemplate?.metatags,
      ...genMetatags('updated', userId),
    },
  };
  const updatedResult = await this.updateOne(selector, updatedActionTemplate);

  if (updatedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const organization = await Organizations.customFindById(organizationId);
      const oldValues = removeDatabaseFields(actionTemplate);
      const newValues = removeDatabaseFields(updatedActionTemplate);
      const values = await getAuditRecordValues({
        oldValues,
        newValues,
        organization,
      });
      AuditLogs.customAudit(
        {
          coll: 'actionTemplates',
          action: 'update',
          element: {
            _id: actionTemplate._id,
            name: actionTemplate.title,
          },
          values,
        },
        userId,
        organizationId,
      );
    };
    addAuditLog();
  }

  return updatedActionTemplate;
};

actionTemplatesSchema.statics.customDelete = async function (
  selector: object = {},
  userId: string,
  organizationId: string,
): Promise<number> {
  const actionTemplate = await this.customFindOne(selector, organizationId);
  if (!actionTemplate) throw new GraphQLError("Action template doesn't exist");

  const updatedActionTemplate = {
    ...actionTemplate,
    metatags: {
      ...actionTemplate?.metatags,
      ...genMetatags('removed', userId),
    },
  };
  const deletedResult = await this.updateOne(selector, updatedActionTemplate);

  if (deletedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const organization = await Organizations.customFindById(organizationId);
      const oldValues = removeDatabaseFields(updatedActionTemplate);
      const values = await getAuditRecordValues({
        oldValues,
        organization,
      });
      AuditLogs.customAudit(
        {
          coll: 'actionTemplates',
          action: 'delete',
          element: {
            _id: actionTemplate._id,
            name: actionTemplate.title,
          },
          values,
        },
        userId,
        organizationId,
      );
    };
    addAuditLog();
  }

  return deletedResult?.modifiedCount;
};

const actionTemplateModel = model<IActionTemplate, IActionTemplateModel>(
  'ActionTemplate',
  actionTemplatesSchema,
  'actionTemplates',
);
export default actionTemplateModel;

