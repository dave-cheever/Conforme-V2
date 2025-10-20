import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAppContext } from '../contexts/AppProvider';
import authClient from '../utils/auth-client';

const useAuth = () => {
  const {
    data: session,
    isPending, // Indicates if the session data is still being fetched
  } = authClient.useSession();
  const { setUser } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isPending) return;
    if (session) setUser(session.user as any);
    else {
      setUser(null);
      authClient.signOut();
    }
  }, [session, isPending, location.pathname]);

  return isPending;
};

export default useAuth;
