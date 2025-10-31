import addHours from 'date-fns/addHours';

import { useAppContext } from '../contexts/AppProvider';
import authClient from '../utils/auth-client';

const useLogout = () => {
  const { user } = useAppContext();

  const logout = async () => {
    // Prepare lightweight user info for the logout page
    const logOutUser = {
      displayName: user?.displayName,
      imgUrl: user?.imgUrl,
      firstName: user?.firstName,
      expiresAt: addHours(new Date(), 24),
    };
    localStorage.setItem('logOutUser', JSON.stringify(logOutUser));
    

    // Complete server-side sign out
    try {
      await authClient.signOut();
    } catch (e) {
      console.log(e);
    } 
  };

  return logout;
};

export default useLogout;
