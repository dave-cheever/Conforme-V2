import { GraphService } from 'app-services';

const searchUsers = async (_, { searchQuery }, { req }) => {
  try {
    const { searchText, organization } = searchQuery || {};
    if (!organization) {
      throw new Error('No organization provided');
    }

    const items = await GraphService.getUsersWithOrg({ searchText, organization });

    return items;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default searchUsers;
