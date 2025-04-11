import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import session from 'cookie-session';
import cors from 'cors';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from 'morgan';
import passport from 'passport';

import { ISession, IUser } from 'app-interfaces';
import { CORSConfig, getProtocol } from 'app-utils';

import { context, resolvers, typeDefs } from './graphql';
import { IContext } from './graphql/context';
import initPassport from './passport-config';
import baseRouter from './routes';

// Overwrite global interface
declare global {
  namespace Express {
    interface User extends IUser { }
    interface Request {
      session: ISession;
    }
  }
}

global.apiUrl = `${getProtocol()}${process.env.API_URL}`;
const getApp = async () => {
  const app = express();

  const apolloServer = new ApolloServer<IContext>({typeDefs, resolvers });
  await apolloServer.start();

  initPassport(passport);
  app.disable('x-powered-by');
  app.use(cors(CORSConfig));
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    session({
      name: process.env.SESS_NAME || 'sessionName',
      secret: process.env.SESS_SECRET || 'sessionSecret',
      secure: process.env.APPSETTING_NODE_ENV !== 'dev',
      httpOnly: true,
      domain: process.env.APPSETTING_NODE_ENV === 'dev' ? undefined : process.env.API_URL,
      sameSite: process.env.APPSETTING_NODE_ENV === 'dev' ? false : 'none',
      maxAge: Number(process.env.SESS_LIFETIME_IN_MINUTES || 15) * 60 * 1000,
      resave: true,
    }),
  );
  app.set('trust proxy', 1);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use('/', baseRouter(passport));
  app.use('/images', express.static('public'));
  app.use('/images', (req, res) => res.status(StatusCodes.PERMANENT_REDIRECT).redirect(`${global.apiUrl}/images/placeholder.png`));

  app.use(
    '/graphql',
    cors(CORSConfig),
    json(),
    expressMiddleware<IContext>(apolloServer, { context }),
  );

  return app;
};

export default getApp;
