import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
  useDisclosure,
  useOutsideClick,
  useToast,
} from '@chakra-ui/react';
import { debounce } from 'lodash';

import { toastWarning } from '../bootstrap/config';
import { useAppContext } from '../contexts/AppProvider';
import { useNavigationTopContext } from '../contexts/NavigationTopProvider';
import useConfig from '../hooks/useConfig';
import useDevice from '../hooks/useDevice';
import useNavigate from '../hooks/useNavigate';
import { AuditSearchIcon, ClockIcon, CrossIcon, EmptySearchIcon, MenuIcon, NoResultsFoundIcon, SearchErrorIcon, TrackerItemSearchIcon, ViewMoreIcon } from '../icons';
import { IRecentSearch } from '../interfaces/IRecentSearch';
import { IScope } from '../interfaces/IScope';
import { ISearchCategory } from '../interfaces/ISearchCategory';
import { ISearchResult } from '../interfaces/ISearchResult';
import QuestionsCategoryIcon from './Icon';
import SearchBarMessage from './SearchBar/SearchBarMessage';
import StatusCell from './Table/Cells/StatusCell';
import Loader from './Loader';

const GET_QUESTIONS_CATEGORIES = gql`
  query {
    questionsCategories {
      _id
      name
      icon
    }
  }
`;

const GET_SEARCH_RESULTS = gql`
  query SearchResults($searchQuery: SearchQuery) {
    search(searchQuery: $searchQuery) {
      _id
      title
      type
      user {
        _id
      }
      scope {
        type
        _id
      }
      reference
      status
      auditTypeName
    }
  }
`;

const GET_RECENT_SEARCHES = gql`
  query GetRecentSearches($getRecentSearchesInput: GetRecentSearchesInput!) {
    getRecentSearches(getRecentSearchesInput: $getRecentSearchesInput) {
      _id
      userId
      text
      organizationId
      metatags {
        addedAt
        addedBy
        updatedAt
        updatedBy
        removedAt
        removedBy
      }
    }
  }
`;

const SAVE_RECENT_SEARCH = gql`
  mutation SaveRecentSearch($saveRecentSearchInput: SaveRecentSearchInput!) {
    saveRecentSearch(saveRecentSearchInput: $saveRecentSearchInput) {
      _id
      userId
      text
      organizationId
      metatags {
        addedAt
        addedBy
        updatedAt
        updatedBy
        removedAt
        removedBy
      }
    }
  }
`;

function SearchBar({ isInMobileDrawer = false }: Readonly<{ isInMobileDrawer?: boolean }>) {
  const ref = useRef() as React.MutableRefObject<HTMLInputElement>;
  const hasFetchedInMobileSessionRef = useRef(false);
  const prevIsSearchBarOpenRef = useRef(false);
  const currentAbortControllerRef = useRef<AbortController | null>(null);
  const { module, user } = useAppContext();
  const { navigateTo } = useNavigate();
  const device = useDevice();
  const { isSearchBarOpen, setIsSearchBarOpen, searchText, setSearchText, searchResults: contextSearchResults, setSearchResults: setContextSearchResults, searchLoading: contextSearchLoading, setSearchLoading: setContextSearchLoading, searchError: contextSearchError, setSearchError: setContextSearchError, hasSearched: contextHasSearched, setHasSearched: setContextHasSearched, recentSearches: contextRecentSearches, setRecentSearches: setContextRecentSearches, setRecentSearchesLoading: setContextRecentSearchesLoading } = useNavigationTopContext();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();

  const { auditSearchItems, trackerSearchItems } = useConfig();
  const { data: questionsCategoriesData } = useQuery(GET_QUESTIONS_CATEGORIES, { skip: module?.type !== 'audits' });

  const [selectedSearchCategory, setSelectedSearchCategory] = useState<ISearchCategory>();
  const searchCategories = useMemo(() => {
    let items: ISearchCategory[] = [];
    if (module?.type === 'audits' && questionsCategoriesData) {
      const [audits, actions] = auditSearchItems;
      items = [
        { type: 'all', label: 'All categories', icon: MenuIcon, searchIn: 'all' },
        audits,
        ...(questionsCategoriesData?.questionsCategories ?? []).map((questionsCategory) => ({
          _id: questionsCategory?._id,
          label: questionsCategory.name,
          // eslint-disable-next-line react/no-unstable-nested-components
          icon: (props) => <QuestionsCategoryIcon
            data-id="000358"
            icon={questionsCategory?.icon}
            key={questionsCategory?._id}
            {...props} />,
          type: 'answers',
          url: '/answers',
        })),
        actions,
      ];
    }
    if (module?.type === 'tracker') items = [...trackerSearchItems];
    if (!selectedSearchCategory && items.length > 0) setSelectedSearchCategory(items[0]);
    return items;
  }, [module, questionsCategoriesData]);


  useOutsideClick({
    ref,
    handler: () => {
      onClose();
      setIsSearchBarOpen(false);
    },
  });

  const getScopes = useMemo(() => {
    const scopes: IScope[] = [];
    // Always search all categories for the module
    const searchCategoriesWithoutAll = searchCategories.filter(({ type }) => type !== 'all');
    searchCategoriesWithoutAll.forEach(({ type, _id }) => scopes.push({ type, _id }));
    return scopes;
  }, [searchCategories]);

  const [getSearchResults, { loading }] = useLazyQuery(GET_SEARCH_RESULTS, { fetchPolicy: 'network-only' });
  const [localSearchResults, setLocalSearchResults] = useState<ISearchResult[]>([]);
  const [localSearchError, setLocalSearchError] = useState<boolean>(false);
  const [localHasSearched, setLocalHasSearched] = useState<boolean>(false);
  const [localRecentSearches, setLocalRecentSearches] = useState<IRecentSearch[]>([]);
  const [saveRecentSearch] = useMutation(SAVE_RECENT_SEARCH);

  // For mobile: Track drawer open/close to reset fetch flag
  // This ensures fresh fetch when drawer opens, but prevents fetch on focus
  useEffect(() => {
    if (isInMobileDrawer) {
      // When drawer closes, reset the fetch flag
      if (prevIsSearchBarOpenRef.current && !isSearchBarOpen) {
        hasFetchedInMobileSessionRef.current = false;
      }
      prevIsSearchBarOpenRef.current = isSearchBarOpen;
    }
  }, [isInMobileDrawer, isSearchBarOpen]);

  // Determine if we should fetch recent searches
  // Mobile: Only fetch once when drawer opens (when isSearchBarOpen is true and we haven't fetched)
  // Desktop: Fetch when search bar opens (existing behavior)
  const shouldFetchRecentSearches = useMemo(() => {
    if (!user?.userId) return false;
    
    if (isInMobileDrawer) {
      // Mobile: Fetch when drawer is open and we haven't fetched yet in this session
      return isSearchBarOpen && !hasFetchedInMobileSessionRef.current;
    }
    
    // Desktop: Fetch when search bar is open (existing behavior)
    return isSearchBarOpen;
  }, [user?.userId, isInMobileDrawer, isSearchBarOpen]);

  const { data: recentSearchesData, loading: recentSearchesLoading, error: recentSearchesError } = useQuery(
    GET_RECENT_SEARCHES,
    {
      variables: {
        getRecentSearchesInput: {
          userId: user?.userId || '',
        },
      },
      skip: !shouldFetchRecentSearches,
      fetchPolicy: 'network-only',
      errorPolicy: 'all', // Allow partial data even if some items have errors
    }
  );

  // Mark as fetched when query starts (mobile only)
  useEffect(() => {
    if (isInMobileDrawer && shouldFetchRecentSearches) {
      hasFetchedInMobileSessionRef.current = true;
    }
  }, [isInMobileDrawer, shouldFetchRecentSearches]);

  // Log errors for debugging (but don't block UI if we have partial data)
  useEffect(() => {
    if (recentSearchesError) {
      // Only log if it's a critical error (not just partial data errors)
      // With errorPolicy: 'all', we can still get partial data even with errors
      if (recentSearchesError.graphQLErrors?.some(err => 
        err.message.includes('Cannot return null for non-nullable field')
      )) {
        console.warn('Some recent searches have invalid data and were filtered out:', recentSearchesError);
      } else {
        console.error('Error fetching recent searches:', recentSearchesError);
      }
    }
  }, [recentSearchesError]);

  // Use context state when in mobile drawer, local state otherwise
  const searchResults = isInMobileDrawer ? contextSearchResults : localSearchResults;
  const setSearchResults = isInMobileDrawer ? setContextSearchResults : setLocalSearchResults;
  const searchLoading = isInMobileDrawer ? contextSearchLoading : loading;
  const searchError = isInMobileDrawer ? contextSearchError : localSearchError;
  const setSearchError = isInMobileDrawer ? setContextSearchError : setLocalSearchError;
  const hasSearched = isInMobileDrawer ? contextHasSearched : localHasSearched;
  const setHasSearched = isInMobileDrawer ? setContextHasSearched : setLocalHasSearched;
  const recentSearches = isInMobileDrawer ? contextRecentSearches : localRecentSearches;
  const setRecentSearches = isInMobileDrawer ? setContextRecentSearches : setLocalRecentSearches;


  // Sync loading and error state to context when in mobile drawer
  useEffect(() => {
    if (isInMobileDrawer) {
      setContextSearchLoading(loading);
    }
  }, [loading, isInMobileDrawer, setContextSearchLoading]);

  // Sync error state to context when in mobile drawer
  useEffect(() => {
    if (isInMobileDrawer) {
      setContextSearchError(localSearchError);
    }
  }, [localSearchError, isInMobileDrawer, setContextSearchError]);

  useEffect(() => {
    if (recentSearchesData?.getRecentSearches) {
      // Filter out invalid entries (null/empty text)
      const searches = Array.isArray(recentSearchesData.getRecentSearches)
        ? recentSearchesData.getRecentSearches.filter((search: IRecentSearch) => 
            search && search.text && search.text.trim().length > 0
          )
        : [];
      setRecentSearches(searches);
    } else if (!recentSearchesLoading && recentSearchesData !== undefined) {
      // If query completed but returned no data or null, ensure state is empty array
      setRecentSearches([]);
    }
  }, [recentSearchesData, recentSearchesLoading, setRecentSearches]);

  // Sync recent searches loading state to context when in mobile drawer
  useEffect(() => {
    if (isInMobileDrawer) {
      setContextRecentSearchesLoading(recentSearchesLoading);
    }
  }, [recentSearchesLoading, isInMobileDrawer, setContextRecentSearchesLoading]);

  const handleSearchError = useCallback(() => {
    setSearchError(true);
    setSearchResults([]);
    setHasSearched(true);
  }, [setSearchError, setSearchResults, setHasSearched]);

  const search = useCallback(
    async (searchTextValue: string) => {
      if (searchTextValue?.trim()) {
        // Cancel previous search query if it exists
        if (currentAbortControllerRef.current) {
          currentAbortControllerRef.current.abort();
        }

        // Create new AbortController for this search
        const abortController = new AbortController();
        currentAbortControllerRef.current = abortController;

        try {
          setSearchError(false);
          // Don't clear searchResults here - keep previous results until new ones arrive
          // This prevents showing "no results" during query cancellation
          const results = await getSearchResults({
            variables: {
              searchQuery: {
                searchText: searchTextValue,
                moduleId: module?._id,
                scopes: getScopes,
              },
            },
            context: {
              fetchOptions: {
                signal: abortController.signal,
              },
            },
          });

          // Only update state if this query wasn't cancelled
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
          // Ignore abort errors (cancelled queries)
          if (error.name === 'AbortError' || error.message?.includes('aborted') || error.name === 'CanceledError') {
            return;
          }
          // Only handle error if this query wasn't cancelled
          if (!abortController.signal.aborted) {
            console.error('Search error:', error);
            handleSearchError();
          }
        } finally {
          // Clear the ref if this was the current query
          if (currentAbortControllerRef.current === abortController) {
            currentAbortControllerRef.current = null;
          }
        }
      } else {
        // Cancel any in-flight query when search text is cleared
        if (currentAbortControllerRef.current) {
          currentAbortControllerRef.current.abort();
          currentAbortControllerRef.current = null;
        }
        setSearchError(false);
        setSearchResults([]);
        setHasSearched(false);
      }
    },
    [getSearchResults, module?._id, getScopes, setSearchError, setSearchResults, setHasSearched, handleSearchError],
  );

  // Debounce search with 500ms delay
  const debouncedSearch = useMemo(
    () => debounce((searchTextValue: string) => {
      search(searchTextValue);
    }, 500),
    [search],
  );

  // Effect to trigger search when searchText changes
  useEffect(() => {
    if (searchText) {
      setHasSearched(false); // Reset hasSearched when search text changes
      debouncedSearch(searchText);
    } else {
      // Cancel any in-flight query when search text is cleared
      if (currentAbortControllerRef.current) {
        currentAbortControllerRef.current.abort();
        currentAbortControllerRef.current = null;
      }
      setSearchResults([]);
      setHasSearched(false);
      debouncedSearch.cancel();
    }
    return () => {
      // Cancel debounced search and any in-flight queries
      debouncedSearch.cancel();
      if (currentAbortControllerRef.current) {
        currentAbortControllerRef.current.abort();
        currentAbortControllerRef.current = null;
      }
    };
  }, [searchText, debouncedSearch]);


  // Effect to restore search text from localStorage on mount if context is empty
  // This ensures the search text persists when navigating to detail pages
  useEffect(() => {
    if (!searchText) {
      try {
        const storedSearchText = localStorage.getItem('lastSearchText');
        if (storedSearchText) {
          setSearchText(storedSearchText);
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Group search results by category
  const groupedResults = useMemo(() => {
    const grouped: Record<string, ISearchResult[]> = {};
    searchResults.forEach((result) => {
      const key = `${result.scope.type}-${result.scope._id || 'all'}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(result);
    });
    return grouped;
  }, [searchResults]);

  const saveRecentSearchSafely = useCallback(async (text: string) => {
    if (user?.userId && text?.trim()) {
      try {
        await saveRecentSearch({
          variables: {
            saveRecentSearchInput: {
              userId: user.userId,
              text: text.trim(),
            },
          },
        });
      } catch (error) {
        console.error('Failed to save recent search:', error);
      }
    }
  }, [user?.userId, saveRecentSearch]);

  const getResultUrl = useCallback((result: ISearchResult, categoryType: string): string => {
    switch (module?.type) {
      case 'audits': {
        switch (categoryType) {
          case 'actions':
            return `actions?id=${result._id}`;
          case 'answers':
            return `answers?id=${result._id}`;
          default:
            return `audits/${result._id}`;
        }
      }
      case 'tracker': {
        return `tracker-item/${result._id}`;
      }
      default:
        return '';
    }
  }, [module?.type]);

  const handleSearchResultClick = useCallback((result: ISearchResult) => {
    const category = searchCategories.find((cat) => cat.type === result.scope.type && cat._id == result.scope._id);
    if (!category) return;

    const url = getResultUrl(result, category.type);
    if (!url) {
      toast({
        ...toastWarning,
        title: 'Search for this data type was not yet implemented',
      });
      return;
    }

    navigateTo(`/${url}`);
    setIsSearchBarOpen(false);
    setSearchText('');
    setSearchResults([]);

    // Save the result title text to recent searches - fire and forget
    const searchTextToSave = result.type === 'audits' && result.reference ? result.reference : result.title;
    saveRecentSearchSafely(searchTextToSave);
  }, [searchCategories, getResultUrl, saveRecentSearchSafely, navigateTo, setIsSearchBarOpen, setSearchText, setSearchResults, toast]);

  const handleRecentSearchClick = useCallback((recentSearch: IRecentSearch) => {
    setSearchText(recentSearch.text);
  }, [setSearchText]);

  const getCategoryLabel = useCallback((scopeType: string, scopeId?: string) => {
    if (scopeType === 'all') return 'All categories';
    const category = searchCategories.find((cat) => cat.type === scopeType && cat._id === scopeId);
    const label = category?.label || scopeType;
    return label.charAt(0).toUpperCase() + label.slice(1);
  }, [searchCategories]);

  // Helper function to highlight matching text
  const highlightText = (text: string, query: string) => {
    if (!query || !text) return text;

    const escapedQuery = query.replace(/[.*+?^$\{}()|[\]\\]/g, String.raw`\$&`);
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      // When using split with a capturing group, matches are included in the array
      // Check if this part matches the query (case-insensitive) by creating a new regex
      const matchRegex = new RegExp(`^${escapedQuery}$`, 'i');
      const key = `${part}-${index}`;
      if (matchRegex.test(part)) {
        return (
          <Text data-id="003203" as="span" key={key} fontWeight="bold">
            {part}
          </Text>
        );
      }
      return <React.Fragment key={key}>{part}</React.Fragment>;
    });
  };

  // Helper function to render search result icon
  const renderSearchIcon = useCallback((resultType: string) => {
    if (resultType === 'audits') {
      return <AuditSearchIcon data-id="003219" boxSize="20px" color="#4A5568" />;
    }
    if (resultType === 'tracker-item-response') {
      return <TrackerItemSearchIcon data-id="003220" boxSize="20px" color="#4A5568" />;
    }
    return null;
  }, []);

  // Helper function to render a single search result item
  const renderSearchResultItem = useCallback((result: ISearchResult) => {
    const displayText = result.type === 'audits' && result.reference ? result.reference : result.title;
    return (
      <Flex
        data-id="003216"
        key={result._id}
        _hover={{ 
          cursor: 'pointer',
          bg: '#D6E6F5',
        }}
        align="center"
        gap={2}
        pl={2}
        onClick={() => handleSearchResultClick(result)}
        minH={result.type === 'audits' ? '60px' : '42px'}
        rounded="md"
        transition="background-color 200ms">
        <Flex data-id="003217" flexDir={'row'} align={'center'} gap={4} w="100%" minWidth={0}>
          <Box
            data-id="003218"
            h='28px'
            w='28px'
            rounded='6px'
            bg='#EDF2F7'
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}>
            {renderSearchIcon(result.type)}
          </Box>
          <Stack data-id="003221" spacing={0} flex={1} minWidth={0}>
            <Flex data-id="003222" flexDir={'row'} align={'center'} gap={2} minWidth={0} overflow="hidden">
              <Text 
                data-id="003223" 
                flex={1} 
                fontSize="16px"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                minWidth={0}>
                {highlightText(displayText, searchText)}
              </Text>
              {result.type === 'audits' && result.status && (
                <Box data-id="003417" flexShrink={0}>
                  <StatusCell data-id="003224" status={result.status} size="sm" />
                </Box>
              )}
            </Flex>
            <Flex data-id="003225" align="center" gap={2} minWidth={0} overflow="hidden">
              {result.type === 'audits' && result.auditTypeName && (
                <Text 
                  data-id="003226" 
                  fontSize="16px" 
                  fontWeight="400" 
                  color="gray.700"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  minWidth={0}>
                  {highlightText(result.auditTypeName, searchText)}
                </Text>
              )}
            </Flex>
          </Stack>
        </Flex>
      </Flex>
    );
  }, [handleSearchResultClick, highlightText, searchText, renderSearchIcon]);

  // Helper to determine if we should show a unified loader
  // Only show loader on initial load (no search text) when both are loading AND we have no content to show yet
  const shouldShowUnifiedLoader = useCallback(() => {
    // Only show unified loader on initial load (when there's no search text)
    if (searchText?.trim()) {
      return false;
    }
    
    const bothLoading = recentSearchesLoading && searchLoading;
    const hasRecentSearches = recentSearches && recentSearches.length > 0;
    const hasSearchResults = searchResults && searchResults.length > 0;
    const hasAnyContent = hasRecentSearches || hasSearchResults;
    
    // Show unified loader only if both are loading AND we have no content to display
    return bothLoading && !hasAnyContent;
  }, [recentSearchesLoading, searchLoading, recentSearches, searchResults, searchText]);

  const renderRecentSearches = useCallback(() => {
    // If unified loader is showing, don't show individual loader here
    if (shouldShowUnifiedLoader()) {
      return null;
    }

    // Show loader for recent searches only on initial load (when there's no search text)
    // Once user starts typing, don't show recent searches loader - only show search results loader
    if (recentSearchesLoading && !searchText?.trim()) {
      return (
        <Flex data-id="003342" justify="center" align="center" p={4} mb={4}>
          <Loader data-id="003343" />
        </Flex>
      );
    }

    // Show nothing if no recent searches
    if (!recentSearches || recentSearches.length === 0) {
      return null;
    }

    return (
      <Box data-id="003342" mb={4}>
        <Flex data-id="003209" flexDir={'row'} align={'center'} gap={'8px'} mb={1}>
          <Text data-id="003210" fontSize="14px" fontWeight="600" color={'#718096'}>
            Recent searches
          </Text>
          <Divider data-id="003211" borderColor={'#CBD5E0'} flex={1} />
        </Flex>
        <Stack data-id="003344" spacing={0}>
          {recentSearches.map((recentSearch) => (
            <Flex
              data-id="003345"
              key={recentSearch._id}
              _hover={{ cursor: 'pointer', bg: '#F7FAFC' }}
              align="center"
              gap={2}
              onClick={() => handleRecentSearchClick(recentSearch)}
              px={2}
              py={2}
              rounded="md">
              <ClockIcon data-id="003346" boxSize="16px" color="#718096" />
              <Text 
                data-id="003347" 
                fontSize="14px" 
                color="#2D3748" 
                flex={1}
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                minWidth={0}>
                {recentSearch.text}
              </Text>
            </Flex>
          ))}
        </Stack>
      </Box>
    );
  }, [recentSearchesLoading, recentSearches, handleRecentSearchClick, shouldShowUnifiedLoader, searchText]);

  const getPageUrlForCategory = useCallback((scopeType: string): string => {
    switch (module?.type) {
      case 'audits': {
        switch (scopeType) {
          case 'actions':
            return '/actions';
          case 'answers':
            return '/answers';
          default:
            return '/dashboard'; // Audits page is shown on dashboard
        }
      }
      case 'tracker': {
        return '/dashboard';
      }
      default:
        return '';
    }
  }, [module?.type]);

  const handleViewMoreResultsClick = useCallback(async (scopeType: string) => {
    const pageUrl = getPageUrlForCategory(scopeType);
    if (pageUrl) {
      const params = new URLSearchParams();
      if (searchText) {
        params.set('search', searchText);
      }
      navigateTo(`${pageUrl}?${params.toString()}`);
      setIsSearchBarOpen(false);
      // Don't clear searchText - keep it in the search bar
      setSearchResults([]);
    }
    // Save the current search text to recent searches
    await saveRecentSearchSafely(searchText);
  }, [searchText, saveRecentSearchSafely, getPageUrlForCategory, navigateTo, setIsSearchBarOpen, setSearchResults]);

  const renderLoadingState = useCallback(() => {
    return (
      <Flex data-id="003205" justify="center" p={4}>
        <Loader data-id="003206" />
      </Flex>
    );
  }, []);

  const renderDividerIfRecentSearches = useCallback((dataId: string) => {
    if (recentSearches.length === 0) return null;
    return <Divider data-id={dataId} borderColor={'#CBD5E0'} mb={4} />;
  }, [recentSearches.length]);

  const renderErrorState = useCallback(() => {
    return (
      <>
        {renderDividerIfRecentSearches('003367')}
        <SearchBarMessage
          data-id="003364"
          icon={SearchErrorIcon}
          heading="Search could not be completed"
          text="Please try again, or refresh the page" />
      </>
    );
  }, [renderDividerIfRecentSearches]);

  const renderNoResultsState = useCallback(() => {
    return (
      <>
        {renderDividerIfRecentSearches('003368')}
        <SearchBarMessage
          data-id="003366"
          icon={NoResultsFoundIcon}
          heading="We couldn't find a match"
          text="Check spelling or try another term." />
      </>
    );
  }, [renderDividerIfRecentSearches]);

  const renderGroupedResults = useCallback(() => {
    return (
      <Stack data-id="003207" spacing={4}>
        {Object.entries(groupedResults).map(([key, results]) => {
          const [scopeType, scopeId] = key.split('-');
          const categoryLabel = getCategoryLabel(scopeType, scopeId);
          return (
            <Box data-id="003208" key={key}>
              <Flex data-id="003209" flexDir={'row'} align={'center'} gap={'8px'} mb={1}>
                <Text data-id="003210" fontSize="14px" fontWeight="600" color={'#718096'}>
                  {categoryLabel}
                </Text>
                <Divider data-id="003211" borderColor={'#CBD5E0'} flex={1} />
                {results.length >= 3 && (
                  <Flex
                    data-id="003212"
                    align="center"
                    gap={2}
                    cursor="pointer"
                    px={2}
                    py={1}
                    rounded="md"
                    _hover={{
                      bg: '#D6E6F5',
                    }}
                    transition="background-color 200ms"
                    onClick={() => handleViewMoreResultsClick(scopeType)}>
                    <Text data-id="003213" fontSize="14px" fontWeight="500" color="#0073E6">
                      View more results
                    </Text>
                    <ViewMoreIcon data-id="003214" boxSize="9px" color="#0073E6" />
                  </Flex>
                )}
              </Flex>
              <Stack data-id="003215" spacing={0}>
                {results.map((result) => renderSearchResultItem(result))}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    );
  }, [groupedResults, getCategoryLabel, handleViewMoreResultsClick, renderSearchResultItem]);

  const shouldShowLoading = useCallback(() => {
    return searchLoading || (searchText?.trim() && !hasSearched);
  }, [searchLoading, searchText, hasSearched]);

  const shouldShowResults = useCallback(() => {
    return searchText?.trim() && searchResults.length > 0;
  }, [searchText, searchResults.length]);

  const shouldShowNoResults = useCallback(() => {
    return searchText?.trim() && hasSearched && searchResults.length === 0;
  }, [searchText, hasSearched, searchResults.length]);

  const renderSearchContent = useCallback(() => {
    // If unified loader is showing, don't show individual loader here
    if (shouldShowUnifiedLoader()) {
      return null;
    }

    if (shouldShowLoading()) {
      return renderLoadingState();
    }

    if (searchError) {
      return renderErrorState();
    }

    if (!searchText?.trim()) {
      return null;
    }

    if (shouldShowResults()) {
      return renderGroupedResults();
    }

    if (shouldShowNoResults()) {
      return renderNoResultsState();
    }
    
    return null;
  }, [shouldShowLoading, searchError, searchText, shouldShowResults, shouldShowNoResults, renderLoadingState, renderErrorState, renderGroupedResults, renderNoResultsState, shouldShowUnifiedLoader]);

  return (
    <Flex
      border={"1px solid #CBD5E0"}
      borderRadius={"md"}
      data-id="000359"
      direction="column"
      position="relative"
      ref={ref}
      w={isInMobileDrawer ? "100%" : ["auto", "449px"]}
      boxShadow={isInMobileDrawer ? "none" : undefined}>
      <InputGroup
        data-id="000360"
        display="block"
        maxW="100%"
        transition="width .15s"
        w={isInMobileDrawer ? "100%" : ['calc(100vw - 30px)', isSearchBarOpen ? '550px' : '260px']}
        zIndex={1}>
        <InputLeftElement
          color="navigationTop.inputIconColor"
          data-id="000361"
          pointerEvents="none">
          <SearchIcon
            data-id="000362"
            fill="navigationTop.searchBarIcon"
            opacity="1"
            stroke="brand.outerSpace" />
        </InputLeftElement>
        {!isInMobileDrawer && (
        <InputRightElement
          data-id="000363"
          display={isSearchBarOpen ? 'block' : 'none'}
          h="full">
          <CrossIcon
            _active={{}}
            _hover={{
              opacity: 0.7,
              cursor: 'pointer',
            }}
            data-id="000364"
            h="13.5px"
            ml="15px"
            mt="10px"
            onClick={() => {
              // Navigate to the current module's main page without search query
              const pageUrl = (module?.type === 'audits' || module?.type === 'tracker') ? '/dashboard' : '';
              
              if (pageUrl) {
                navigateTo(pageUrl);
              }
              
              setIsSearchBarOpen(false);
              setSearchText('');
              setSearchResults([]);
              // Clear localStorage when user manually clears search
              try {
                localStorage.removeItem('lastSearchText');
              } catch (e) {
                // Ignore localStorage errors
              }
            }}
            stroke="navigationTop.searchCrossIconStroke"
            w="13.5px" />
        </InputRightElement>
        )}
        <Input
          _placeholder={{ color: '#A0AEC0' }}
          bg="navigationTop.inputBg"
          data-id="000365"
          fontSize="smm"
          fontWeight="semi_medium"
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          onFocus={() => {
            // Mobile: Don't set isSearchBarOpen on focus - it's already set when drawer opens
            // This prevents triggering recent searches query on every focus
            if (!isInMobileDrawer) {
              setIsSearchBarOpen(true);
            }
            onOpen();
            // If SearchBar opens with existing text but no results, trigger a search
            // This handles the case when "View more results" was clicked and SearchBar was closed
            if (searchText?.trim() && searchResults.length === 0) {
              setHasSearched(false);
              debouncedSearch(searchText);
            }
          }}
          placeholder="Search"
          rounded="10px"
          value={searchText}
          w={isInMobileDrawer ? "100%" : ["90%", "447px"]} />
      </InputGroup>
      {isOpen && !isInMobileDrawer && (
        <Box
          data-id="000366"
          display={isSearchBarOpen ? 'block' : 'none'}
          position="absolute"
          pt={[10, 4]}
          top="100%"
          w={['100%', null, '100%']}
          zIndex={1000}>
          <Flex
            bg="white"
            boxShadow={isInMobileDrawer ? "none" : "0px 3px 10px rgba(0, 0, 0, .1)"}
            data-id="000367"
            direction="column"
            fontSize="smm"
            maxH="500px"
            overflowY="auto"
            maxHeight={device === 'desktop' ? '500px' : '75vh'}
            minH={shouldShowUnifiedLoader() || recentSearchesLoading ? '200px' : 'auto'}
            p={'12px'}
            rounded="10px">
            <Box data-id="003204" w={'100%'}>
              {/* Show unified loader if both are loading and no content available */}
              {shouldShowUnifiedLoader() ? (
                <Flex data-id="003205" justify="center" p={4}>
                  <Loader data-id="003206" />
                </Flex>
              ) : (
                <>
                  {searchText ? (
                    <>
                      {renderRecentSearches()}
                      {renderSearchContent()}
                    </>
                  ) : (
                    <>
                      {renderRecentSearches()}
                      {recentSearches.length > 0 && !recentSearchesLoading && (
                        <Divider data-id="003369" borderColor={'#CBD5E0'} mb={4} />
                      )}
                      {!recentSearchesLoading && (
                        <SearchBarMessage data-id="003415" icon={EmptySearchIcon} text="Type a keyword to search" />
                      )}
                    </>
                  )}
                </>
              )}
            </Box>
          </Flex>
        </Box>
      )}
    </Flex>
  );
}

export const searchBarStyles = {
  searchBar: {
    categoriesBg: '#F0F0F080',
    results: {
      bgColor: {
        hover: '#eee',
      },
    },
  },
};

export default SearchBar;