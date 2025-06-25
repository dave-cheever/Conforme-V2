import { useEffect } from 'react';

import { useAppContext } from '../contexts/AppProvider';
import authClient  from '../utils/auth-client';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {

  const { 
    data: session, 
    isPending, // Indicates if the session data is still being fetched
  } = authClient.useSession();
  const { setUser } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPending) return;
    if (session) setUser(session.user as any)
    else {
      setUser(null);
      authClient.signOut();
      navigate('/logout');
    }
  }, [session, isPending]);

  return isPending;
};

export default useAuth;
