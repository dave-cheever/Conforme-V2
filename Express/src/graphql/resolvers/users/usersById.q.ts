import { GraphService } from 'app-services';

const usersById = async (_, { userQueryInput }, { organization }) => {
  try {
    const { usersIds } = userQueryInput;

    const items = await GraphService.getBasicUsers({ usersIds, organization });
    return items;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default usersById;
