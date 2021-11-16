import { Users } from "app-models";
import { GraphService } from "app-services";
import { add } from "date-fns";

const getGraphUsers = async (_, {userQueryInput}, { req, authorize }) => {
  try {
    const {searchText} = userQueryInput;
    const { organization } = req.session;

    const items = await GraphService.getUsers({searchText, organization});
    
    return items;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default getGraphUsers;
