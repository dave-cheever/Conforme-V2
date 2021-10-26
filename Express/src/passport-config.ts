import { OIDCStrategy, IOIDCStrategyOptionWithoutRequest, IOIDCStrategyOptionWithRequest } from 'passport-azure-ad';

import { IUser } from 'app-interfaces';
import { Organizations, Users } from 'app-models';
import { sessionizeUser, getUserName } from 'app-utils';
import { GraphService } from 'app-services';
import moment from 'moment';
import { isBefore } from 'date-fns';
import { PassportStatic } from 'passport';

const initPassport = (passport: PassportStatic) => {
  // Azure AD
  const azureADStrategyOptions: IOIDCStrategyOptionWithRequest = {
    identityMetadata: "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
    clientID: process.env.AZURE_AD_CLIENT_ID || 'clientId',
    responseType: 'id_token',
    responseMode: 'form_post',
    redirectUrl: `${global.apiUrl}/auth/aad/callback`,
    allowHttpForRedirectUrl: process.env.APPSETTING_NODE_ENV === 'dev',
    validateIssuer: false,
    scope: ['email', 'profile'],
    loggingLevel: 'info',
    passReqToCallback: true,
  };
  const azureADCallback = async (req, profile, done) => {
    const { state: domain } = req.body;
    const { oid: _id, tid: tenantId } = profile._json;
    const organization = await Organizations.getByDomain(domain);

    // Check if organization has valid licence
    if (isBefore(organization.licenceExpirationDate, new Date())) {
      return done(null, { organization }, 'Organization\'s licence expired');
    }

    // Check if logged user is from allowed tenant
    // If allowed tenant is 'all', app is open to users from all tenants
    if (!organization.allowedTenantsIds.includes('all') && !organization.allowedTenantsIds.includes(tenantId)) {
      return done(null, { organization }, 'User from this tenant is not allowed');
    }

    // Check if logged user belong to access group (if configured)
    if (organization.accessGroupId) {
      const belongsToComplianceCheckerGroup = await GraphService.checkMemberGroup({
        userId: _id,
        groupId: organization.accessGroupId,
        organization,
      });
      if (!belongsToComplianceCheckerGroup) {
        return done(null, { organization }, 'User doesn\'t exist in Compliance Checker AAD group');
      }
    }

    let user: IUser;
    const userQuery = {
      userId: _id,
      organization,
    };
    try {
      user = await Users.findByIdWithDetails(userQuery);
    } catch (e) {
      await Users.add(_id);
      user = await Users.findByIdWithDetails(userQuery);
    }
    if (!user) {
      return done(null, { organization }, 'Internal server error - Azure AD auth');
    }
    const sessionUser = await sessionizeUser(user);
    return done(null, { user: sessionUser, organization });
  };
  passport.use(new OIDCStrategy(azureADStrategyOptions, azureADCallback));
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user as IUser));
};

export default initPassport;
