import React, { createContext, useContext, useMemo, useState } from 'react';

import { INavigationTopContext } from '../interfaces/INavigationTopProvider';
import { ISearchResult } from '../interfaces/ISearchResult';

export const NavigationTopContext = createContext({} as INavigationTopContext);

export const useNavigationTopContext = () => {
  const context = useContext(NavigationTopContext);
  if (!context) throw new Error('useNavigationTopContext must be used within the NavigationTopProvider');
  return context;
};

function NavigationTopProvider({ children }) {
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<ISearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<boolean>(false);

  const value = useMemo(
    () => ({
      isSearchBarOpen,
      setIsSearchBarOpen,
      searchText,
      setSearchText,
      searchResults,
      setSearchResults,
      searchLoading,
      setSearchLoading,
      searchError,
      setSearchError,
    }),
    // eslint-disable-line react-hooks/exhaustive-deps
    [isSearchBarOpen, searchText, searchResults, searchLoading, searchError],
  );

  return <NavigationTopContext.Provider data-id="000012" value={value}>{children}</NavigationTopContext.Provider>;
}

export default NavigationTopProvider;
