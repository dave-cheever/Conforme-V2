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
  
  // Intercept Better Auth error route and redirect to login with error message
  app.get("/api/auth/error", (req, res) => {
    const errorParam = req.query.error as string;
    if (errorParam) {
      // Convert Better Auth error code to readable message
      // Format: "User_doesn't_exist_in_Conforme_AAD_group" -> "User doesn't exist in Conforme AAD group"
      const errorMessage = errorParam
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
      
      // Always use environment variable as source of truth for security
      // Validate any user-provided URLs against the allowed domain
      const allowedClientUrl = `${getProtocol()}${process.env.CLIENT_URL}`.replace(/\/$/, '');
      
      // Validate user-provided URL if present (for security, prevent open redirects)
      let clientUrl = allowedClientUrl;
      let userProvidedUrl: string | null = null;
      
      try {
        if (req.cookies?.clientUrl) {
          userProvidedUrl = req.cookies.clientUrl;
        } else if (req.headers.referer) {
          userProvidedUrl = new URL(req.headers.referer).origin;
        }
      } catch (error) {
        // If URL parsing fails, ignore user-provided URL
        userProvidedUrl = null;
      }
      
      if (userProvidedUrl) {
        try {
          const userUrl = new URL(userProvidedUrl);
          const allowedUrl = new URL(allowedClientUrl);
          // Only use user-provided URL if it matches the allowed domain
          if (userUrl.hostname === allowedUrl.hostname && userUrl.protocol === allowedUrl.protocol) {
            clientUrl = userUrl.origin;
          }
        } catch (error) {
          // If URL parsing fails, fall back to allowed URL
          clientUrl = allowedClientUrl;
        }
      }
      
      // Remove trailing slash if present
      clientUrl = clientUrl.replace(/\/$/, '');
      
      // Redirect to login page with error message
      const redirectUrl = `${clientUrl}/login?errorMessage=${encodeURIComponent(errorMessage)}`;
      return res.redirect(redirectUrl);
    }
    // If no error param, let Better Auth handle it
    return toNodeHandler(auth)(req, res);
  });
  
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
