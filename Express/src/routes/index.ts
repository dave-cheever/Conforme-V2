import { Router } from 'express';

import { calculateAudits } from 'app-utils';

import AuthRouter from './auth';
import FilesRouter from './files';

const baseRouter = (passport) => {
  const router = Router();

  router.use('/calc', calculateAudits);
  router.use('/auth', AuthRouter(passport));
  router.use('/files', FilesRouter());

  return router;
};

export default baseRouter;
