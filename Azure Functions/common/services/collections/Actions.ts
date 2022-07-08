import { model, Schema } from 'mongoose';
import { IAction } from '../../interfaces/IAction';
import { IActionModel } from '../../interfaces/IActionModel';

const actionsSchema = new Schema<IAction, IActionModel>({
  _id: String,
  title: String,
  dueDate: String,
  status: {
    type: String,
    default: 'open',
    enum: ['open', 'closed'],
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high']
  },
  description: String,
  assigneeId: String,
  attachments: [
    {
      _id: false,
      id: String,
      name: String,
      addedAt: Date
    }
  ],
  scope: {
    module: {
      type: String,
      enum: ['audits', 'tracker']
    },
    moduleId: String,
    type: {
      type: String
    },
    _id: String
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

actionsSchema.statics.customFind = async function (
  selector: any = {},
  organizationId: string
): Promise<IAction[]> {
  console.log('selector', selector);
  const actions = await this.find({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null }
  }).lean();
  return actions;
};

actionsSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string
): Promise<IAction | null> {
  const action = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null }
  }).lean();
  return action;
};

actionsSchema.statics.customFindById = async function (_id: string): Promise<IAction> {
  const action = await this.findOne({
    _id,
    'metatags.removedAt': { $eq: null }
  }).lean();
  if (!action) throw new Error('Action not found');

  return action;
};

const actionsModel = model<IAction, IActionModel>('Action', actionsSchema, 'actions');

export default actionsModel;
