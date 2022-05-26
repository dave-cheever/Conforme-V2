import React, { createContext, useContext, useMemo } from 'react';

import { auditsMenuItems, trackerMenuItems } from '../bootstrap/config';
import { IConfigContext } from '../interfaces/IConfigContext';
import { useAppContext } from './AppProvider';

export const ConfigContext = createContext({} as IConfigContext);

export const useConfigContext = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfigContext must be used within the ConnfigProvider');

  return context;
};

const ConfigProvider = ({ children }) => {
  const { organizationConfig, module } = useAppContext();
  const menuItems = useMemo(() => {
    if (module?.type === 'audits') return auditsMenuItems;

    return trackerMenuItems;
  }, [organizationConfig, module]);

  const value = useMemo(
    () => ({
      menuItems,
    }),
    // eslint-disable-line react-hooks/exhaustive-deps
    [menuItems],
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};

export default ConfigProvider;
