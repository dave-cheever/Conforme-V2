import React, { createContext, useContext, useMemo, useState } from 'react';

import { AdminModalState, IAdminContext } from '../interfaces/IAdminContext';

export const AdminContext = createContext({} as IAdminContext);

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdminContext must be used within the AdminProvider');

  return context;
};

const AdminProvider = ({ children }: any) => {
  const [adminModalState, setAdminModalState] = useState<AdminModalState>('closed');

  const value = useMemo(
    () => ({
      adminModalState,
      setAdminModalState,
    }),
    [adminModalState],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export default AdminProvider;
