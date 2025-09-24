import React, { createContext, useContext, useMemo } from 'react';

import useConfig from '../hooks/useConfig';
import { IConfigContext } from '../interfaces/IConfigContext';
import { useAppContext } from './AppProvider';

export const ConfigContext = createContext({} as IConfigContext);

export const useConfigContext = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfigContext must be used within the ConnfigProvider');

  return context;
};

function ConfigProvider({ children }) {
  const { organizationConfig, module } = useAppContext();
  const { auditsMenuItems, trackerMenuItems } = useConfig();
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

  return <ConfigContext.Provider data-id="000009" value={value}>{children}</ConfigContext.Provider>;
}

export default ConfigProvider;
