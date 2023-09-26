import { Router } from 'express';

import { Organizations } from 'app-models';
import {
  getDomain,
  isSignedIn,
  redirectAfterLogin,
  sessionizeOrganization,
} from 'app-utils';

const authRouter = (passport) => {
  const router = Router();

  router.get('/aad', async (req, res, next) => {
    const domain = getDomain(req);
    if (!domain) throw new Error("Organization doesn't exist");

    const organization = await Organizations.customFindByDomain(domain);
    passport.authenticate('azuread-openidconnect', {
      response: res,
      customState: domain,
      tenantIdOrName: organization.tenantId,
    })(req, res, next);
  });

  router.post('/aad/callback', (req, res, next) => {
    passport.authenticate(
      'azuread-openidconnect',
      (err, { user, organization }, errorMessage) => {
        req.session.organization = sessionizeOrganization(organization);
        if (user) {
          req.logIn(user, () =>
            redirectAfterLogin(req, res, errorMessage, organization),
          );
        } else redirectAfterLogin(req, res, errorMessage, organization);
      },
    )(req, res, next);
  });

  router.delete('/logout', isSignedIn, (req, res) => {
    req.logout((err) => {
      console.error(err);
    });
    res.json('OK');
  });

  return router;
};

export default authRouter;
