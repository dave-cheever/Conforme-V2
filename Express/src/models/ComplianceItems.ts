import { model, Schema } from 'mongoose';

import { IComplianceItem, IComplianceItemModel } from 'app-interfaces';

const complianceItemSchema = new Schema<IComplianceItem, IComplianceItemModel>({
  _id: String,
  name: String,
  description: String,
  categoryId: String,
  regulatoryBodyId: String,
  functionalAreaId: String,
  dueDate: Date,
  frequency: String,
  businessUnitsIds: [String],
  evidenceItems: [String],
  retentionPeriod: Number,
  questions: [{
    type: {
      type: String,
      enum: ['text', 'toggle', 'datePicker'],
    },
    name: String,
    description: String,
    value: Schema.Types.Mixed,
    required: Boolean,
    outdated: Boolean,
  }],
  published: Boolean,
  ref: String,
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

complianceItemSchema.statics.getById = async function (_id: string): Promise<IComplianceItem> {
  const complianceItem = await this.findById(_id);
  if (!complianceItem) {
    throw new Error('ComplianceItem not found');
  }
  return complianceItem._doc;
}

const complianceItemModel = model<IComplianceItem, IComplianceItemModel>('ComplianceItem', complianceItemSchema);
export default complianceItemModel;
