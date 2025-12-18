
import { ISearchResult } from '../interfaces/ISearchResult';

export interface ModuleType {
  type?: 'audits' | 'tracker';
  _id?: string;
}

/**
 * Generates the URL for a search result based on module type and category
 */
export function getResultUrl(result: ISearchResult, categoryType: string, moduleType?: string): string {
  if (moduleType === 'audits') {
    if (categoryType === 'actions') {
      return `actions?id=${result._id}`;
    }
    if (categoryType === 'answers') {
      return `answers?id=${result._id}`;
    }
    return `audits/${result._id}`;
  }
  
  if (moduleType === 'tracker') {
    return `tracker-item/${result._id}`;
  }
  
  return '';
}

/**
 * Generates the page URL for a category based on module type
 */
export function getPageUrlForCategory(scopeType: string, moduleType?: string): string {
  if (moduleType === 'audits') {
    if (scopeType === 'actions') {
      return '/actions';
    }
    if (scopeType === 'answers') {
      return '/answers';
    }
    return '/dashboard';
  }
  
  if (moduleType === 'tracker') {
    return '/dashboard';
  }
  
  return '';
}

/**
 * Determines if recent searches should be fetched based on mobile/desktop context
 */
export function shouldFetchRecentSearches(
  userId: string | undefined,
  isInMobileDrawer: boolean,
  isSearchBarOpen: boolean,
  hasFetchedInMobileSession: boolean
): boolean {
  if (!userId) {
    return false;
  }
  
  if (isInMobileDrawer) {
    return isSearchBarOpen && !hasFetchedInMobileSession;
  }
  
  return isSearchBarOpen;
}

/**
 * Checks if an error is an abort error (cancelled query)
 */
export function isAbortError(error: any): boolean {
  return error.name === 'AbortError' || 
         error.message?.includes('aborted') || 
         error.name === 'CanceledError';
}

/**
 * Options for executeSearch function
 */
export interface IExecuteSearchOptions {
  setSearchError: (error: boolean) => void;
  setSearchResults: (results: ISearchResult[]) => void;
  setHasSearched: (searched: boolean) => void;
  handleSearchError: () => void;
}

/**
 * Processes search results and handles errors
 */
export async function executeSearch(
  searchTextValue: string,
  getSearchResults: any,
  moduleId: string | undefined,
  scopes: any[],
  abortController: AbortController,
  options: IExecuteSearchOptions
): Promise<void> {
  if (!searchTextValue?.trim()) {
    return;
  }

  const { setSearchError, setSearchResults, setHasSearched, handleSearchError } = options;
  setSearchError(false);

  try {
    const results = await getSearchResults({
      variables: {
        searchQuery: {
          searchText: searchTextValue,
          moduleId,
          scopes,
        },
      },
      context: {
        fetchOptions: {
          signal: abortController.signal,
        },
      },
    });

    if (!abortController.signal.aborted) {
      if (results.error) {
        console.error('Search error:', results.error);
        handleSearchError();
      } else {
        setSearchResults(results.data?.search || []);
        setHasSearched(true);
      }
    }
  } catch (error: any) {
    if (isAbortError(error)) {
      return;
    }
    
    if (!abortController.signal.aborted) {
      console.error('Search error:', error);
      handleSearchError();
    }
  }
}

/**
 * Clears search state when search text is empty
 */
export function clearSearchState(
  abortController: AbortController | null,
  setAbortController: (controller: AbortController | null) => void,
  setSearchError: (error: boolean) => void,
  setSearchResults: (results: ISearchResult[]) => void,
  setHasSearched: (searched: boolean) => void
): void {
  if (abortController) {
    abortController.abort();
    setAbortController(null);
  }
  setSearchError(false);
  setSearchResults([]);
  setHasSearched(false);
}

