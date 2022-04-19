import mongoose from 'mongoose';

import { Categories } from 'app-models';
import { isPermitted } from 'app-utils';

const createCategory = async (_, { name }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'categories.add' }))
      throw new Error('User is not permitted');

    const createdCategory = await Categories.customCreate(
      { name: name.trim() },
      user._id,
      organization._id,
    );
    return createdCategory;
  } catch (err: any) {
    if (err instanceof mongoose.Error.ValidationError)
      throw new Error(err.errors.name.message);

    throw new Error(err);
  }
};

export default createCategory;
