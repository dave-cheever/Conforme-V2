import { GraphService } from "app-services";

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
      jobTitle
    }));;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default usersById;
