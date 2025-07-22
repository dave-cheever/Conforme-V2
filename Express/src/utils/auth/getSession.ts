import { fromNodeHeaders } from 'better-auth/node';
import auth from './auth';

const getSession = async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return session; // Only return the session, do not send a response
};

export default getSession;
