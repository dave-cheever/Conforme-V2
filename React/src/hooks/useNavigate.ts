import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useAppContext } from '../contexts/AppProvider';

const useNavigate = () => {
  const history = useHistory();
  const location = useLocation();
  const { module } = useAppContext();

  // Save last URL to local storage so it can be opened after login
  useEffect(() => {
    if (!['/', '/login', '/logout'].includes(location.pathname))
      localStorage.setItem('lastPath', `${location.pathname}${location.search}`)
  }, [location.pathname]);

  const isPathActive = (path: string, options: { exact?: boolean } = {}) => {
    const { exact } = options;

    // Remove module path from current path
    // and slash if present as last character
    const currentPath = history.location.pathname.replace(new RegExp('/([a-zA-Z0-9-]*)'), '').replace(new RegExp('(/$)'), '');

    // Remove slash if present as last character
    const clearPath = path.replace(new RegExp('(/$)'), '');

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
    history.push(`/${module?.path}${path}`, state);
  };

  const openInNewTab = (path: string) => {
    window.open(`/${module?.path}${path}`, '_blank');
  };

  return {
    history,
    getPath,
    isPathActive,
    navigateTo,
    openInNewTab,
  };
};

export default useNavigate;
