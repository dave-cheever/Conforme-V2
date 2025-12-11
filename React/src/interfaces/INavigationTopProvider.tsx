import { Dispatch, SetStateAction } from 'react';

import { IRecentSearch } from './IRecentSearch';
import { ISearchResult } from './ISearchResult';

export interface INavigationTopContext {
  isSearchBarOpen: boolean;
  setIsSearchBarOpen: Dispatch<SetStateAction<boolean>>;

  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;

  searchResults: ISearchResult[];
  setSearchResults: Dispatch<SetStateAction<ISearchResult[]>>;

  searchLoading: boolean;
  setSearchLoading: Dispatch<SetStateAction<boolean>>;

  searchError: boolean;
  setSearchError: Dispatch<SetStateAction<boolean>>;

  recentSearches: IRecentSearch[];
  setRecentSearches: Dispatch<SetStateAction<IRecentSearch[]>>;
  recentSearchesLoading: boolean;
  setRecentSearchesLoading: Dispatch<SetStateAction<boolean>>;
}
