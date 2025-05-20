import { model, Schema } from 'mongoose';
import { IHelp } from 'src/interfaces/IHelp';
import { IHelpModel } from 'src/interfaces/IHelpModel';
import { v4 as uuidv4 } from 'uuid';

const helpSchema = new Schema<IHelp>(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    module: { type: String, required: true },
    content: { type: String, required: true },
    metatags: {
      addedAt: Date,
      addedBy: String,
      updatedAt: Date,
      updatedBy: String,
      removedAt: Date,
      removedBy: String,
    },
  },
  { collection: 'help' }, 
);

helpSchema.statics.customFind = async function (selector: any = {}): Promise<IHelp[]> {
  const query = {
    ...selector,
  };
  const help = await this.find(query).lean();
  return help;
};

helpSchema.statics.customFindOne = async function (selector: any = {}): Promise<IHelp | null> {
  const help = await this.findOne({
    ...selector,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return help;
};

const helpModel = model<IHelp, IHelpModel>('Help', helpSchema);
export default helpModel;
