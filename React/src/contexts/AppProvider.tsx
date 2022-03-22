import React, { createContext, useContext, useMemo, useState } from "react";

import { IAppContext } from "../interfaces/IAppContext";
import { IUser } from "../interfaces/IUser";
import { IRoles } from "../interfaces/IRoles";
import { ISetting } from "../interfaces/ISetting";
import { IOrganization } from "../interfaces/IOrganization";

export const AppContext = createContext({} as IAppContext);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within the AppProvider');
  }
  return context;
};

const AppProvider = (props: any) => {
  const [roles, setRoles] = useState<IRoles>();
  const [settings, setSettings] = useState<ISetting[]>([]);
  const [organizationConfig, setOrganizationConfig] = useState<IOrganization>();
  const [user, setUser] = useState<IUser | null>();

  const value = useMemo(() => ({
    roles, setRoles,
    settings, setSettings,
    organizationConfig, setOrganizationConfig,
    user, setUser,
  }), [ // eslint-disable-line react-hooks/exhaustive-deps
    roles,
    settings,
    organizationConfig,
    user,
  ]);

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppProvider;
