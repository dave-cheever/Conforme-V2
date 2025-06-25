import { Users } from 'app-models';
import { genMetatags, isPermitted } from 'app-utils';

const updateUser = async (
  _,
  { updateUserModifyInput },
  { authorize, organization },
) => {
  try {
    const user = await authorize();
    if (
      !isPermitted({ user, action: 'users.edit', data: updateUserModifyInput })
    )
      throw new Error('User is not permitted');

    const updateUser = await Users.customFindById(
      updateUserModifyInput._id,
      organization._id,
    );
    if (!updateUser) throw new Error("User doesn't exist");

    // Ensure defaultPage is an array, otherwise set it to an empty array
    let updatedDefaultPage = Array.isArray(updateUser.defaultPage) ? [...updateUser.defaultPage] : [];
    if (updateUserModifyInput.defaultPage) {
      updateUserModifyInput.defaultPage.forEach((newPage) => {
        // Find if the module name already exists in the array
        const index = updatedDefaultPage.findIndex(
          (page) => page.name === newPage.name
        );

        if (index !== -1) {
          // If it exists, update the specific module
          updatedDefaultPage[index] = {
            ...updatedDefaultPage[index],
            ...newPage, // Update the properties of the matched module
          };
        } else {
          // If the module doesn't exist, add the new module
          updatedDefaultPage.push(newPage);
        }
      });
    }

    // Now build the updated user object
    const updatedUser = {
      ...updateUser._doc,
      ...updateUserModifyInput,
      defaultPage: updatedDefaultPage, // Use the modified defaultPage
      metatags: {
        ...updateUser?.metatags,
        ...genMetatags('updated', user.userId),
      },
    };

    // Update the user in the database
    await Users.updateOne({ userId: updateUser.userId }, updatedUser);

    return updatedUser;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateUser;
