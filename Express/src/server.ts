import { ApolloServer } from 'apollo-server-express';
import session from 'cookie-session';
import cors from 'cors';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from 'morgan';
import passport from 'passport';

import { ISession, IUser } from 'app-interfaces';
import { CORSConfig, getProtocol } from 'app-utils';

import { context, resolvers, typeDefs } from './graphql';
import initPassport from './passport-config';
import baseRouter from './routes';

// Overwrite global interface
declare global {
  namespace Express {
    interface User extends IUser {}
    interface Request {
      session: ISession;
    }
  }
}

global.apiUrl = `${getProtocol()}${process.env.API_URL}`;
const getApp = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
  });
  await server.start();

  // // Daily CRON jobs
  // const responseDueCron = new CronJob('0 0 8 * * *', () => {
  //   responseDueEmail();
  // });
  // responseDueCron.start();

  // // Weekly cron jobs
  // const responseWeekCon = new CronJob('0 0 * * 0', () => {
  //   responseWeeklyEmail();
  // });
  // responseWeekCon.start();

  initPassport(passport);
  app.disable('x-powered-by');
  app.use(cors(CORSConfig));
  app.use(logger('dev'));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(
    session({
      name: process.env.SESS_NAME || 'sessionName',
      secret: process.env.SESS_SECRET || 'sessionSecret',
      secure: process.env.APPSETTING_NODE_ENV !== 'dev',
      httpOnly: true,
      domain:
        process.env.APPSETTING_NODE_ENV === 'dev'
          ? undefined
          : process.env.API_URL,
      sameSite: process.env.APPSETTING_NODE_ENV === 'dev' ? false : 'none',
      maxAge: Number(process.env.SESS_LIFETIME_IN_MINUTES || 15) * 60 * 1000,
    }),
  );
  app.set('trust proxy', 1);
  app.use(passport.initialize());
  app.use(passport.session());
  // app.use(setOrganization);
  app.use('/', baseRouter(passport));
  app.use('/images', express.static('public'));
  app.use('/images', (req, res) =>
    res
      .status(StatusCodes.PERMANENT_REDIRECT)
      .redirect(`${global.apiUrl}/images/placeholder.png`),
  );

  server.applyMiddleware({
    app,
    cors: CORSConfig,
  });

  return app;
};

export default getApp;
