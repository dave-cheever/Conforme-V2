import mongoose from 'mongoose';

import { Categories } from 'app-models';
import { isPermitted } from 'app-utils';

const updateCategory = async (
  _,
  { categoryInput },
  { authorize, organization },
) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'categories.edit', data: categoryInput }))
      throw new Error('User is not permitted');

    const category = await Categories.customFindById(
      categoryInput._id,
      organization._id,
    );
    if (!category) throw new Error("Category doesn't exist");

    const updatedCategory = await Categories.customUpdateOne(
      { _id: category._id },
      { name: categoryInput.name },
      user.userId,
      organization._id,
    );
    return updatedCategory;
  } catch (err: any) {
    if (err instanceof mongoose.Error.ValidationError)
      throw new Error(err.errors.name.message);

    throw new Error(err);
  }
};

export default updateCategory;
