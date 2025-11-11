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

    // Overview route is at /overview (not prefixed with module path)
    if (path === '/overview') {
      return location.pathname === '/overview';
    }

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
   * @param path path inside module (or /overview which is not module-prefixed)
   * @param state additional state to pass
   */
  const navigateTo = (path: string, state?: any) => {
    // Overview route is at /overview (not prefixed with module path)
    if (path === '/overview') {
      navigate('/overview', state);
    } else {
      navigate(`/${module?.path}${path}`, state);
    }
  };

  const openInNewTab = (path: string) => {
    // Overview route is at /overview (not prefixed with module path)
    if (path === '/overview') {
      window.open('/overview', '_blank');
    } else {
      window.open(`/${module?.path}${path}`, '_blank');
    }
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
