import { Dispatch, SetStateAction } from 'react';

export interface INavigationTopContext {
  isSearchBarOpen: boolean;
  setIsSearchBarOpen: Dispatch<SetStateAction<boolean>>;

  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
}
