import { useNavigate } from 'react-router-dom';

import addHours from 'date-fns/addHours';

import { useAppContext } from "../contexts/AppProvider";

const useLogout = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAppContext();

  const logout = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
      method: 'DELETE',
      credentials: 'include',
    });

    // logOut user is expired after 24 hours
    const logOutUser = {
      displayName: user?.displayName,
      imgUrl: user?.imgUrl,
      firstName: user?.firstName,
      expiresAt: addHours(new Date(), 24),
    };
    localStorage.setItem('logOutUser', JSON.stringify(logOutUser));
    setUser(null);
    navigate('/logout');
  };

  return logout;
};

export default useLogout;
