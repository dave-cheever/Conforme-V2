import { useHistory, useLocation } from 'react-router-dom';

import { useAppContext } from '../contexts/AppProvider';

const useNavigate = () => {
  const history = useHistory();
  const location = useLocation();
  const { module } = useAppContext();

  const isPathActive = (path: string, options: { exact?: boolean } = {}) => {
    const { exact } = options;
    const currentPath = history.location.pathname.replace(
      new RegExp('/([a-zA-Z0-9]*)'),
      '',
    );
    if (exact) return currentPath === path;
    return currentPath.includes(path);
  };

  const getPath = () => location.pathname.split('/')[2];

  const navigateTo = (path: string, state?: any) => {
    history.push(`/${module?.path}${path}`, state);
  };

  const openInNewTab = (path: string) => {
    window.open(`/${module?.path}${path}`, '_blank');
  };

  return {
    getPath,
    isPathActive,
    navigateTo,
    openInNewTab,
  };
};

export default useNavigate;
