import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
import { debounce, result } from 'lodash';

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
import Loader from './Loader';
import SearchBarMessage from './SearchBar/SearchBarMessage';
import StatusCell from './Table/Cells/StatusCell';

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
      term
      entityId
      entityType
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
      term
      entityId
      entityType
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
  const { module, user } = useAppContext();
  const { navigateTo } = useNavigate();
  const device = useDevice();
  const { isSearchBarOpen, setIsSearchBarOpen, searchText, setSearchText, searchResults: contextSearchResults, setSearchResults: setContextSearchResults, searchLoading: contextSearchLoading, setSearchLoading: setContextSearchLoading } = useNavigationTopContext();
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

  const getScopes = useCallback(() => {
    const scopes: IScope[] = [];
    // Always search all categories for the module
      const searchCategoriesWithoutAll = searchCategories.filter(({ type }) => type !== 'all');
      searchCategoriesWithoutAll.forEach(({ type, _id }) => scopes.push({ type, _id }));
    return scopes;
  }, [searchCategories]);

  const [getSearchResults, { loading }] = useLazyQuery(GET_SEARCH_RESULTS, { fetchPolicy: 'network-only' });
  const [localSearchResults, setLocalSearchResults] = useState<ISearchResult[]>([]);
  const [searchError, setSearchError] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<IRecentSearch[]>([]);
  const [saveRecentSearch] = useMutation(SAVE_RECENT_SEARCH);

  const { data: recentSearchesData, loading: recentSearchesLoading } = useQuery(
    GET_RECENT_SEARCHES,
    {
      variables: {
        getRecentSearchesInput: {
          userId: user?.userId || '',
        },
      },
      skip: !user?.userId || !isSearchBarOpen,
      fetchPolicy: 'network-only',
    }
  );

  // Use context state when in mobile drawer, local state otherwise
  const searchResults = isInMobileDrawer ? contextSearchResults : localSearchResults;
  const setSearchResults = isInMobileDrawer ? setContextSearchResults : setLocalSearchResults;
  const searchLoading = isInMobileDrawer ? contextSearchLoading : loading;

  // Sync loading state to context when in mobile drawer
  useEffect(() => {
    if (isInMobileDrawer) {
      setContextSearchLoading(loading);
    }
  }, [loading, isInMobileDrawer, setContextSearchLoading]);

  const search = useCallback(
    async (searchTextValue: string) => {
      if (searchTextValue?.trim()) {
        try {
          setSearchError(false);
        const results = await getSearchResults({
          variables: {
            searchQuery: {
                searchText: searchTextValue,
              moduleId: module?._id,
              scopes: getScopes(),
            },
          },
        });
          setSearchResults(results.data?.search || []);
        } catch (error) {
          console.error('Search error:', error);
          setSearchError(true);
          setSearchResults([]);
        }
      } else {
        setSearchError(false);
        setSearchResults([]);
      }
    },
    [getSearchResults, module?._id, getScopes],
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
      debouncedSearch(searchText);
    } else {
      setSearchResults([]);
      debouncedSearch.cancel();
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchText, debouncedSearch]);

  // Effect to update recent searches when data changes
  useEffect(() => {
    if (recentSearchesData?.getRecentSearches) {
      setRecentSearches(recentSearchesData.getRecentSearches);
    }
  }, [recentSearchesData]);

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

  // Map search result type to entity type
  const mapSearchResultTypeToEntityType = (resultType: string): 'audits' | 'actions' | 'locations' | 'complaints' | null => {
    switch (resultType) {
      case 'audits':
        return 'audits';
      case 'actions':
        return 'actions';
      case 'tracker-item-response':
        return null;
      case 'answers':
        return null;
      default:
        return null;
    }
  };

  const handleSearchResultClick = async (result: ISearchResult) => {
    const category = searchCategories.find((category) => category.type === result.scope.type && category._id == result.scope._id);
    if (!category) return;

    let url = '';
    switch (module?.type) {
      case 'audits': {
        switch (category.type) {
          case 'actions':
            url = `actions?id=${result._id}`;
            break;
          case 'answers':
            url = `answers?id=${result._id}`;
            break;
          default:
            url = `audits/${result._id}`;
        }
        break;
      }
      case 'tracker': {
        url = `tracker-item/${result._id}`;
        break;
      }
      default:
        toast({
          ...toastWarning,
          title: 'Search for this data type was not yet implemented',
        });
    }
    if (url) {
      const entityType = mapSearchResultTypeToEntityType(result.type);
      if (entityType && user?.userId) {
        saveRecentSearch({
          variables: {
            saveRecentSearchInput: {
              userId: user.userId,
              term: result.title,
              entityId: result._id,
              entityType,
            },
          },
        })
          .catch((error) => {
            console.error('Failed to save recent search:', error);
          });
      }

      navigateTo(`/${url}`);
      setIsSearchBarOpen(false);
      setSearchText('');
      setSearchResults([]);
    }
  };

  const handleRecentSearchClick = async (recentSearch: IRecentSearch) => {
    let url = '';
    switch (recentSearch.entityType) {
      case 'audits':
        url = `audits/${recentSearch.entityId}`;
        break;
      case 'actions':
        url = `actions?id=${recentSearch.entityId}`;
        break;
      default:
        break;
    }

    if (url) {
      const entityType = mapSearchResultTypeToEntityType(recentSearch.entityType);
      if (entityType && user?.userId) {
        saveRecentSearch({
          variables: {
            saveRecentSearchInput: {
              userId: user.userId,
              term: recentSearch.term,
              entityId: recentSearch.entityId,
              entityType,
            },
          },
        })
          .catch((error) => {
            console.error('Failed to save recent search:', error);
          });
      }

      navigateTo(`/${url}`);
      setIsSearchBarOpen(false);
      setSearchText('');
      setSearchResults([]);
    }
  };

  const getCategoryLabel = (scopeType: string, scopeId?: string) => {
    if (scopeType === 'all') return 'All categories';
    const category = searchCategories.find((cat) => cat.type === scopeType && cat._id === scopeId);
    const label = category?.label || scopeType;
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

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
  const renderSearchIcon = (resultType: string) => {
    if (resultType === 'audits') {
      return <AuditSearchIcon data-id="003219" boxSize="20px" color="#4A5568" />;
    }
    if (resultType === 'tracker-item-response') {
      return <TrackerItemSearchIcon data-id="003220" boxSize="20px" color="#4A5568" />;
    }
    return null;
  };

  // Helper function to render a single search result item
  const renderSearchResultItem = (result: any) => {
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
        h={result.type === 'audits' ? '60px' : '42px'}
        rounded="md"
        transition="background-color 200ms">
        <Flex data-id="003217" flexDir={'row'} align={'center'} gap={4}>
          <Box
            data-id="003218"
            h='28px'
            w='28px'
            rounded='6px'
            bg='#EDF2F7'
            display="flex"
            alignItems="center"
            justifyContent="center">
            {renderSearchIcon(result.type)}
          </Box>
          <Stack data-id="003221" spacing={0}>
            <Flex data-id="003222" flexDir={'row'} align={'center'} gap={2}>
              <Text data-id="003223" flex={1} fontSize="16px">
                {highlightText(
                  result.type === 'audits' && result.reference ? result.reference : result.title,
                  searchText
                )}
              </Text>
              {result.type === 'audits' && result.status && (
                <StatusCell data-id="003224" status={result.status} size="sm" />
              )}
            </Flex>
            <Flex data-id="003225" align="center" gap={2}>
              {result.type === 'audits' && result.auditTypeName && (
                <Text data-id="003226" fontSize="16px" fontWeight="400" color="gray.700">
                  {highlightText(result.auditTypeName, searchText)}
                </Text>
              )}
            </Flex>
          </Stack>
        </Flex>
      </Flex>
    );
  };

  const renderRecentSearches = () => {
    if (recentSearchesLoading) {
      return (
        <Flex data-id="003340" justify="center" p={4}>
          <Loader data-id="003341" />
        </Flex>
      );
    }

    if (recentSearches.length === 0) {
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
              <Text data-id="003347" fontSize="14px" color="#2D3748" flex={1}>
                {recentSearch.term}
              </Text>
            </Flex>
          ))}
        </Stack>
      </Box>
    );
  };

  const renderSearchContent = () => {
    if (searchLoading) {
      return (
        <Flex data-id="003205" justify="center" p={4}>
          <Loader data-id="003206" />
        </Flex>
      );
    }
    
    // Show error message if there's a search error
    if (searchError) {
      return (
        <SearchBarMessage
          data-id="003364"
          icon={SearchErrorIcon}
          heading="Search could not be completed"
          text="Please try again, or refresh the page" />
      );
    }
    
    // Show empty search message when no search text is entered
    if (!searchText?.trim()) {
      return (<SearchBarMessage data-id="003365" icon={EmptySearchIcon} text="Type a keyword to search" />);
    }
    
    // Show results if available
    if (searchResults.length > 0) {
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
                      onClick={() => {
                        // Determine the page URL based on category type
                        let pageUrl = '';
                        switch (module?.type) {
                          case 'audits': {
                            switch (scopeType) {
                              case 'actions':
                                pageUrl = '/actions';
                                break;
                              case 'answers':
                                pageUrl = '/answers';
                                break;
                              default:
                                pageUrl = '/dashboard'; // Audits page is shown on dashboard
                            }
                            break;
                          }
                          case 'tracker': {
                            pageUrl = '/dashboard';
                            break;
                          }
                        }
                        
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
                      }}>
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
    }
    
    // Show no results found message when search text exists but no results
    return (
      <SearchBarMessage
        data-id="003366"
        icon={NoResultsFoundIcon}
        heading="We couldn't find a match"
        text="Check spelling or try another term." />
    );
  };

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
              color: 'navigationTop.notificationIconHover',
              opacity: 0.7,
              cursor: 'pointer',
            }}
            data-id="000364"
            h="13.5px"
            ml="15px"
            mt="10px"
            onClick={() => {
              // Navigate to the current module's main page without search query
              let pageUrl = '';
              switch (module?.type) {
                case 'audits':
                case 'tracker':
                  pageUrl = '/dashboard'; // Audits page is shown on dashboard
                  break;
              }
              
              if (pageUrl) {
                navigateTo(pageUrl);
              }
              
              setIsSearchBarOpen(false);
              setSearchText('');
              setSearchResults([]);
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
            setIsSearchBarOpen(true);
            onOpen();
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
            p={'12px'}
            rounded="10px">
            <Box data-id="003204" w={'100%'}>
              {searchText ? (
                // When search text exists, show search content (results, loading, error, or no results message)
                (renderSearchContent())
              ) : (
                // When no search text, show recent searches if available, otherwise show empty search message
                (renderRecentSearches() || (!recentSearchesLoading && (<SearchBarMessage data-id="003415" icon={EmptySearchIcon} text="Type a keyword to search" />)))
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
