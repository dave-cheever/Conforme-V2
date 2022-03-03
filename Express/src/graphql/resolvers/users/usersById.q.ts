import { GraphService } from "app-services";

const usersById = async (_, {userQueryInput}, { req, authorize }) => {
  try {    
    const { usersIds } = userQueryInput;
    const { organization } = req.session;

    const items = await GraphService.getBasicUsers({usersIds, organization});
    return items;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default usersById;
