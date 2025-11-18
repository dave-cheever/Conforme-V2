import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAppContext } from '../contexts/AppProvider';
import authClient from '../utils/auth-client';

const useAuth = () => {
  const {
    data: session,
    isPending, // Indicates if the session data is still being fetched
  } = authClient.useSession();
  const { setUser, user } = useAppContext();
  const location = useLocation();

  useEffect(() => {
    if (isPending) return;
    
    // If we have a session, always clear the redirect flag immediately
    // This ensures that after successful authentication, protected routes become accessible
    if (session) {
      // Clear the redirect flag when we have a session (successful login)
      sessionStorage.removeItem('isRedirectingToLogin');
      sessionStorage.removeItem('isRedirectingToLoginTimestamp');
      setUser(session.user as any);
      return;
    }
    
    // No session - check if we're in the process of redirecting to login
    const isRedirectingToLogin = sessionStorage.getItem('isRedirectingToLogin') === 'true';
    const redirectFlagAge = sessionStorage.getItem('isRedirectingToLoginTimestamp');
    
    // If we're redirecting to login, don't clear user state to prevent flash
    // But only if the flag is recent (not stale)
    if (isRedirectingToLogin && redirectFlagAge) {
      const age = Date.now() - parseInt(redirectFlagAge, 10);
      // If flag is stale (older than 10 seconds), clear it and allow user state to be cleared
      if (age > 10000) {
        sessionStorage.removeItem('isRedirectingToLogin');
        sessionStorage.removeItem('isRedirectingToLoginTimestamp');
        setUser(null);
      }
      // Otherwise, keep the user state to prevent flash during redirect
      return;
    }
    
    // No redirect in progress, clear user state
    setUser(null);
  }, [session, isPending, location.pathname, setUser, user]);

  return isPending;
};

export default useAuth;
