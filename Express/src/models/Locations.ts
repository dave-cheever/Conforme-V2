import { model, Schema } from "mongoose";
import { ILocation, ILocationModel } from "app-interfaces";

const LocationSchema = new Schema<ILocation, ILocationModel>({
  _id: String,
  name: String,
  ownerId: String,
  organizationId: String,
  notes: String,
  metatags: {
    addedAt: Date,
    addedBy: String,
    updatedAt: Date,
    updatedBy: String,
    removedAt: Date,
    removedBy: String,
  }
});

LocationSchema.statics.customFind = async function (
    selector: any = {},
    organizationId
  ): Promise<ILocation[]> {
    const locations = await this.find({
      ...selector,
      organizationId,
      "metatags.removedAt": { $eq: null },
    });
    return locations;
  };

LocationSchema.statics.customFindById = async function (_id: string): Promise<ILocation> {
  const location = await this.findOne({
    _id,
    "metatags.removedAt": { $eq: null },
  });
  if (!location) {
    throw new Error("Location not found");
  }
  return location._doc;
};

LocationSchema.statics.customFindByOwnerId = async function (ownerId: string): Promise<ILocation> {
    const location = await this.findOne({ ownerId });
    if (!location) {
      throw new Error('Location not found');
    }
    return location._doc;
};

LocationSchema.statics.customFindByOrganizationId = async function (organizationId: string): Promise<ILocation> {
    const location = await this.findOne({ organizationId });
    if (!location) {
      throw new Error('Location not found');
    }
    return location._doc;
};

const locationModel = model<ILocation, ILocationModel>("Location", LocationSchema);
export default locationModel;
