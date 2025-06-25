import { isAfter, isBefore, parseISO, sub } from 'date-fns';
import { GraphQLError } from 'graphql';

import { IOrganization, IUser } from 'app-interfaces';
import { Organizations } from 'app-models';
import { fromNodeHeaders } from 'better-auth/node';
import auth from 'src/utils/auth/auth';

const context = async ({ req, res }) => {

  const clientUrl = req.cookies?.clientUrl || '';
  const domain = new URL(clientUrl)?.host || '';
  let organization;
  try {
    organization = await Organizations.customFindByDomain(domain);
  } catch (error) {
    console.log('No organization found');
  }

  // Function to authorize user in GraphQL methods
  // Throws an error if session is not valid
  const authorize = async (): Promise<IUser> => {

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session)
      throw new GraphQLError('No session found');

    return { 
      ...session.user
    } as IUser;
  };

  return {
    req,
    res,
    organization,
    authorize,
  };
};

export default context;

export interface IContext {
  req: any;
  res: any;
  organization: IOrganization;
  authorize: () => Promise<IUser>;
};
