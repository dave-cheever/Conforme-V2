import { Router } from 'express';

import { calculateAudits } from 'app-utils';
import FilesRouter from './files';
import MigrationRouter from './migration';

const baseRouter = () => {
  const router = Router();

  router.use('/calc', calculateAudits);
  router.use('/files', FilesRouter());
  router.use('/migration', MigrationRouter());

  return router;
};

export default baseRouter;
