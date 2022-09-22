import { Router } from 'express';

import { calculateAudits } from 'app-utils';

import AuthRouter from './auth';
import FilesRouter from './files';
import MigrationRouter from './migration';

const baseRouter = (passport) => {
  const router = Router();

  router.use('/calc', calculateAudits);
  router.use('/auth', AuthRouter(passport));
  router.use('/files', FilesRouter());
  router.use('/migration', MigrationRouter());

  return router;
};

export default baseRouter;
