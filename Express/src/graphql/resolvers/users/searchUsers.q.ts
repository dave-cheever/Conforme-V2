import { GraphService } from 'app-services';

const searchUsers = async (_, { searchQuery }, { req }) => {
  try {
    const { searchText } = searchQuery || {};
    const { organization } = req.session;

    const items = await GraphService.getUsers({ searchText, organization });

    return items;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default searchUsers;
