import { Organizations } from "app-models";
import { getDomain, sessionizeOrganization } from "app-utils";

const organization = async (_, __, { req, organization: sessionOrganization }) => {
  try {
    if (sessionOrganization) {
      return sessionOrganization;
    }
    
    const organization = await Organizations.getByDomain(getDomain(req));
    return sessionizeOrganization(organization);
  } catch (err: any) {
    throw new Error(err);
  }
};

export default organization;
