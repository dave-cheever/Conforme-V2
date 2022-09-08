import './loadEnv'; // Must be the first import
import mongoose from 'mongoose';
import cluster from 'node:cluster';
import { cpus } from 'node:os';

import { logger } from 'app-shared';

import getApp from './server';
import setCRONJobs from './utils/cron';

const ENV_VERSION = '1';
if (ENV_VERSION !== process.env.VERSION)
  logger.error(`Please update environment variables. Latest version: ${ENV_VERSION}. Your version: ${process.env.VERSION}`);

const port = process.env.PORT || 3000;
const clusterWorkerSize = process.env.APPSETTING_NODE_ENV === 'dev' ? 1 : cpus().length; // Check number of cpus available

mongoose
  .connect(process.env.DB_CONNECTION_STRING || 'connection-string')
  .then(async () => {
    const startApp = async (processId: number) => {
      const app = await getApp();
      app.listen(port, () => {
        logger.info(`Express server started on port ${port} and worker ${processId}`);
      });
    };
    if (clusterWorkerSize > 1) {
      if (cluster.isPrimary) {
        logger.info('MongoDB connected!');

        setCRONJobs();
        for (let i = 0; i < clusterWorkerSize; i += 1) cluster.fork();

        cluster.on('exit', (worker) => {
          logger.info('Worker', worker.id, ' has exitted.');
          cluster.fork();
        });
      } else await startApp(process.pid);
    } else {
      setCRONJobs();
      await startApp(process.pid);
    };
  })
  .catch((e) => console.log(e));
