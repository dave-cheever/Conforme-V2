import { useHistory } from 'react-router-dom';

import { useAppContext } from '../contexts/AppProvider';

const useNavigate = () => {
  const history = useHistory();
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

  const navigateTo = (path: string, state?: any) => {
    history.push(`/${module?.path}${path}`, state);
  };

  return {
    isPathActive,
    navigateTo,
  };
};

export default useNavigate;
