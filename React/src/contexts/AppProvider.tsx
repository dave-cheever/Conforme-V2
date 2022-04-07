import React, { createContext, useContext, useMemo, useState } from 'react';

import { IAppContext } from '../interfaces/IAppContext';
import { IModule } from '../interfaces/IModule';
import { IOrganization } from '../interfaces/IOrganization';
import { IRoles } from '../interfaces/IRoles';
import { ISetting } from '../interfaces/ISetting';
import { IUser } from '../interfaces/IUser';

export const AppContext = createContext({} as IAppContext);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error('useAppContext must be used within the AppProvider');

  return context;
};

const AppProvider = ({ children }) => {
  const [roles, setRoles] = useState<IRoles>();
  const [settings, setSettings] = useState<ISetting[]>([]);
  const [organizationConfig, setOrganizationConfig] = useState<IOrganization>();
  const [module, setModule] = useState<IModule>();
  const [user, setUser] = useState<IUser | null>();

  const value = useMemo(
    () => ({
      roles,
      setRoles,
      settings,
      setSettings,
      organizationConfig,
      setOrganizationConfig,
      module,
      setModule,
      user,
      setUser,
    }),
    [roles, settings, organizationConfig, user],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
