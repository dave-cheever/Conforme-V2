import { AuthenticationError } from "apollo-server-express";

import { IUser } from "app-interfaces";
import { Organizations } from "app-models";
import { sessionizeOrganization } from "app-utils";
import { isAfter, isBefore, parseISO, sub } from "date-fns";

const context = ({ req, res }) => {
  const { organization } = req.session;

  // Function to authorize user in GraphQL methods
  // Throws an error if session is not valid
  const authorize = async (): Promise<IUser> => {
    const { user } = req;
    if (!user) {
      throw new AuthenticationError('Invalid session');
    }

    // Check organization licence
    // And refresh organization in cookie once at 6 hours
    const { licenceLastChecked } = req.session.passport;
    if (!licenceLastChecked || isBefore(parseISO(licenceLastChecked), sub(new Date(), { hours: 6 }))) {
      const latestOrganization = await Organizations.customFindById(organization._id, '');
      const isLicenceValid = isAfter(new Date(latestOrganization.licenceExpirationDate), new Date());
      if (!isLicenceValid) {
        throw new AuthenticationError('Organization\'s licence expired');
      }
      req.session.passport.licenceLastChecked = new Date();
      req.session.organization = sessionizeOrganization(latestOrganization);
    }
    return user;
  };

  return {
    req,
    res,
    organization,
    authorize,
  };
};

export default context;
