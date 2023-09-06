import { useEffect } from 'react';
import { useLocation, useNavigate as useReactNavigate } from 'react-router-dom';

import { useAppContext } from '../contexts/AppProvider';

const useNavigate = () => {
  const navigate = useReactNavigate();
  const location = useLocation();
  const { module } = useAppContext();

  // Save last URL to local storage so it can be opened after login
  useEffect(() => {
    if (location.state?.redirectUrl) localStorage.setItem('redirectUrl', location.state.redirectUrl);
  }, [JSON.stringify(location.state)]);

  const isPathActive = (path: string, options: { exact?: boolean } = {}) => {
    const { exact } = options;

    // Remove module path from current path
    // and slash if present as last character
    const currentPath = location.pathname.replace(/\/([a-zA-Z0-9-]*)/, '').replace(/(\/$)/, '');

    // Remove slash if present as last character
    const clearPath = path.replace(/(\/$)/, '');

    if (exact) return currentPath === clearPath;
    return currentPath.includes(clearPath);
  };

  const getPath = () => location.pathname.split('/')[2];

  /**
   * This function can be used to navigate to a path inside a module
   * @param path path inside module
   * @param state additional state to pass
   */
  const navigateTo = (path: string, state?: any) => {
    navigate(`/${module?.path}${path}`, state);
  };

  const openInNewTab = (path: string) => {
    window.open(`/${module?.path}${path}`, '_blank');
  };

  return {
    navigate,
    getPath,
    isPathActive,
    navigateTo,
    openInNewTab,
  };
};

export default useNavigate;
