import './loadEnv'; // Must be the first import
import mongoose from 'mongoose';

import getApp from './server';
import { logger } from 'app-shared';

const ENV_VERSION = '1';
if (ENV_VERSION !== process.env.VERSION) {
  logger.error(`Please update environment variables. Latest version: ${ENV_VERSION}. Your version: ${process.env.VERSION}`);
}
const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_CONNECTION_STRING || 'connection-string')
  .then(async () => {
    console.log('MongoDB connected');
    const app = await getApp();
    app.listen(port, () => {
      logger.info('Express server started on port: ' + port);
    });
  })
  .then(() => {
    return console.log(`Server is listening on ${port}`);
  })
  .catch(e => console.log(e));

// const runServer = async () => {
//   const app = await getApp();
//   app.listen(port, () => {
//     logger.info('Express server started on port: ' + port);
//   });
// };
// runServer();
