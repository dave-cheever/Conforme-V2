import React, { createContext, useContext, useMemo } from "react";

import { IConfigContext } from "../interfaces/IConfigContext";
import {
  auditsMenuItems,
  trackerMenuItems,
} from '../bootstrap/config';
import { useAppContext } from "./AppProvider";

export const ConfigContext = createContext({} as IConfigContext);

export const useConfigContext = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfigContext must be used within the ConnfigProvider');
  }
  return context;
};

const ConfigProvider = (props: any) => {
  const { organizationConfig } = useAppContext();
  const menuItems = useMemo(() => {
    if (organizationConfig?.addons.find(({ name }) => name === 'audits')) {
      return auditsMenuItems;
    }
    return trackerMenuItems;
  }, [organizationConfig]);

  const value = useMemo(() => ({
    menuItems,
  }), [ // eslint-disable-line react-hooks/exhaustive-deps
    menuItems,
  ]);

  return (
    <ConfigContext.Provider value={value}>
      {props.children}
    </ConfigContext.Provider>
  )
}

export default ConfigProvider;
