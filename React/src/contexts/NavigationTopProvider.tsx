import React, { createContext, useContext, useMemo, useState } from 'react';

import { INavigationTopContext } from '../interfaces/INavigationTopProvider';

export const NavigationTopContext = createContext({} as INavigationTopContext);

export const useNavigationTopContext = () => {
  const context = useContext(NavigationTopContext);
  if (!context) throw new Error('useNavigationTopContext must be used within the NavigationTopProvider');
  return context;
};

const NavigationTopProvider = ({ children }) => {
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>('');

  const value = useMemo(
    () => ({
      isSearchBarOpen,
      setIsSearchBarOpen,
      searchText,
      setSearchText,
    }),
    // eslint-disable-line react-hooks/exhaustive-deps
    [isSearchBarOpen, searchText],
  );

  return <NavigationTopContext.Provider value={value}>{children}</NavigationTopContext.Provider>;
};

export default NavigationTopProvider;
