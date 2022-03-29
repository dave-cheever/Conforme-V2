import { Router } from 'express';

import AuthRouter from './auth';
import FilesRouter from './files';

const baseRouter = (passport) => {
  const router = Router();

  router.use('/auth', AuthRouter(passport));
  router.use('/files', FilesRouter());

  return router;
};

export default baseRouter;
