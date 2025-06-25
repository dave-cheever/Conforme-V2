import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from 'morgan';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth/auth";

import { ISession, IUser } from 'app-interfaces';
import { CORSConfig, getProtocol } from 'app-utils';

import { context, resolvers, typeDefs } from './graphql';
import { IContext } from './graphql/context';
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

  app.disable('x-powered-by');
  app.use(cors(CORSConfig));
  // Add cookie-parser middleware
  app.use(cookieParser()); 
  app.all("/api/auth/*", toNodeHandler(auth));
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.set('trust proxy', 1);

  app.use('/', baseRouter());
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
