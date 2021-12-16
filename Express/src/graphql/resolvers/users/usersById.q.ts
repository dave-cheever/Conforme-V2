import { GraphService } from "app-services";
import { getProtocol } from "app-utils";

const usersById = async (_, {userQueryInput}, { req, authorize }) => {
  try {    
    const { usersIds } = userQueryInput;
    const { organization } = req.session;

    const items = await GraphService.getBasicUsers({usersIds, organization});
    
    return items.map(({ id, givenName, displayName, surname, userPrincipalName, jobTitle }) => ({
      _id: id,
      displayName,
      firstName: givenName,
      lastName: surname,
      email: userPrincipalName,
      jobTitle,
      imgUrl: `${getProtocol()}${process.env.API_URL}/files/photo/${id}`
    }));;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default usersById;
