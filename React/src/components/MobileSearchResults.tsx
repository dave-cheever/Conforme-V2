import React, { useCallback, useMemo } from 'react';

import { gql, useMutation } from '@apollo/client';
import { Box, Divider, Flex, Stack, Text } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import useNavigate from '../hooks/useNavigate';
import { AuditSearchIcon, ClockIcon, EmptySearchIcon, NoResultsFoundIcon, SearchErrorIcon, TrackerItemSearchIcon, ViewMoreIcon } from '../icons';
import { IRecentSearch } from '../interfaces/IRecentSearch';
import { ISearchResult } from '../interfaces/ISearchResult';
import SearchBarMessage from './SearchBar/SearchBarMessage';
import StatusCell from './Table/Cells/StatusCell';
import Loader from './Loader';

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

interface MobileSearchResultsProps {
  searchResults: ISearchResult[];
  searchText: string;
  searchLoading: boolean;
  searchError?: boolean;
  hasSearched: boolean;
  module: any;
  auditSearchItems: any[];
  trackerSearchItems: any[];
  recentSearches: IRecentSearch[];
  recentSearchesLoading: boolean;
  onResultClick: (result: ISearchResult) => void;
  onRecentSearchClick?: (recentSearch: IRecentSearch) => void;
}

function MobileSearchResults({
  searchResults,
  searchText,
  searchLoading,
  searchError = false,
  hasSearched,
  module,
  auditSearchItems,
  trackerSearchItems,
  recentSearches,
  recentSearchesLoading,
  onResultClick,
  onRecentSearchClick,
}: Readonly<MobileSearchResultsProps>) {
  const { navigateTo } = useNavigate();
  const { user } = useAppContext();
  const [saveRecentSearch] = useMutation(SAVE_RECENT_SEARCH);

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

  const getCategoryLabel = (scopeType: string, scopeId?: string) => {
    if (scopeType === 'all') return 'All categories';
    const allSearchItems = module?.type === 'audits' ? auditSearchItems : trackerSearchItems;
    const category = allSearchItems.find((cat: any) => cat.type === scopeType && cat._id === scopeId);
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
      const matchRegex = new RegExp(`^${escapedQuery}$`, 'i');
      const key = `${part}-${index}`;
      if (matchRegex.test(part)) {
        return (
          <Text data-id="003167" as="span" key={key} fontWeight="bold">
            {part}
          </Text>
        );
      }
      return <React.Fragment key={key}>{part}</React.Fragment>;
    });
  };

  const renderSearchResultIcon = (resultType: string) => {
    if (resultType === 'audits') {
      return <AuditSearchIcon data-id="003183" boxSize="20px" color="#4A5568" />;
    }
    if (resultType === 'tracker-item-response') {
      return <TrackerItemSearchIcon data-id="003184" boxSize="20px" color="#4A5568" />;
    }
    return null;
  };

  const renderSearchResultItem = (result: ISearchResult) => {
    const displayText = result.type === 'audits' && result.reference ? result.reference : result.title;
    return (
      <Flex
        data-id="003180"
        key={result._id}
        _hover={{ 
          cursor: 'pointer',
          bg: '#D6E6F5',
        }}
        align="center"
        gap={2}
        onClick={() => handleSearchResultClick(result)}
        h={result.type === 'audits' ? '60px' : '42px'}
        rounded="md"
        transition="background-color 200ms">
        <Flex data-id="003181" flexDir={'row'} align={'center'} gap={4} w="100%" minWidth={0}>
          <Box
            data-id="003182"
            h='28px'
            w='28px'
            rounded='6px'
            bg='#EDF2F7'
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}>
            {renderSearchResultIcon(result.type)}
          </Box>
          <Stack data-id="003185" spacing={0} flex={1} minWidth={0}>
            <Flex data-id="003186" flexDir={'row'} align={'center'} gap={2} minWidth={0} overflow="hidden">
              <Text 
                data-id="003187" 
                flex={1} 
                fontSize="16px"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                minWidth={0}>
                {highlightText(displayText, searchText)}
              </Text>
              {result.type === 'audits' && result.status && (
                <Box data-id="003416" flexShrink={0}>
                  <StatusCell data-id="003188" status={result.status} size="sm" />
                </Box>
              )}
            </Flex>
            <Flex data-id="003189" align="center" gap={2} minWidth={0} overflow="hidden">
              {result.type === 'audits' && result.auditTypeName && (
                <Text 
                  data-id="003190" 
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
  };

  const getPageUrlForScopeType = useCallback((scopeType: string): string => {
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
    const pageUrl = getPageUrlForScopeType(scopeType);
    if (pageUrl) {
      const params = new URLSearchParams();
      if (searchText) {
        params.set('search', searchText);
      }
      navigateTo(`${pageUrl}?${params.toString()}`);
      // Close the drawer
      onResultClick({} as ISearchResult);
    }
    // Save the current search text to recent searches
    await saveRecentSearchSafely(searchText);
  }, [searchText, saveRecentSearchSafely, getPageUrlForScopeType, navigateTo, onResultClick]);

  const handleRecentSearchClick = (recentSearch: IRecentSearch) => {
    if (onRecentSearchClick) {
      onRecentSearchClick(recentSearch);
    }
  };

  const handleSearchResultClick = (result: ISearchResult) => {
    const allSearchItems = module?.type === 'audits' ? auditSearchItems : trackerSearchItems;
    const category = allSearchItems.find((category: any) => category.type === result.scope.type && category._id == result.scope._id);
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
    }
    if (url) {
      // Navigate immediately for instant UI feedback
      navigateTo(`/${url}`);
      onResultClick(result);

      saveRecentSearchSafely(searchText);
    }
  };

  // Show loader on initial load (no search text) when recent searches are loading AND we have no content
  const shouldShowUnifiedLoader = useCallback(() => {
    // Only show unified loader on initial load (when there's no search text)
    if (searchText?.trim()) {
      return false;
    }
    
    const hasRecentSearches = recentSearches && recentSearches.length > 0;
    const hasSearchResults = searchResults && searchResults.length > 0;
    const hasAnyContent = hasRecentSearches || hasSearchResults;
    
    // Show unified loader if recent searches are loading AND we have no content to display
    // This covers the case when drawer opens and only recent searches are loading
    return recentSearchesLoading && !hasAnyContent;
  }, [recentSearchesLoading, recentSearches, searchResults, searchText]);

  const renderRecentSearches = () => {
    // If unified loader is showing, don't show individual loader here
    if (shouldShowUnifiedLoader()) {
      return null;
    }

    // Show loader for recent searches only on initial load (when there's no search text)
    // Once user starts typing, don't show recent searches loader - only show search results loader
    if (recentSearchesLoading && !searchText?.trim()) {
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
  };

  const renderSearchContent = () => {
    // If unified loader is showing, don't show individual loader here
    if (shouldShowUnifiedLoader()) {
      return null;
    }

    // Show loading if actively loading
    // Don't hide this loader even if recent searches are loading - we want to show search loader when user types
    if (searchLoading) {
      return (
        <Flex data-id="003168" justify="center" p={4}>
          <Loader data-id="003169" />
        </Flex>
      );
    }

    // Show error message if there's a search error
    if (searchError) {
      const hasRecentSearches = recentSearches.length > 0;
      return (
        <>
          {hasRecentSearches && <Divider data-id="003367" borderColor={'#CBD5E0'} mb={4} />}
          <SearchBarMessage
            data-id="003361"
            icon={SearchErrorIcon}
            heading="Search could not be completed"
            text="Please try again, or refresh the page" />
        </>
      );
    }

    // Show empty search message when no search text is entered
    // Only show if recent searches are not loading (to avoid showing message while loader is visible)
    if (!searchText?.trim()) {
      if (recentSearchesLoading) {
        return null; // Don't show "Type a keyword to search" while recent searches are loading
      }
      return <SearchBarMessage data-id="003362" icon={EmptySearchIcon} text="Type a keyword to search" />;
    }

    // Show no results found message when search text exists but no results
    // Only show if we've actually completed a search and we're not loading
    if (searchResults.length === 0 && !searchLoading && hasSearched) {
      const hasRecentSearches = recentSearches.length > 0;
      return (
        <>
          {hasRecentSearches && <Divider data-id="003368" borderColor={'#CBD5E0'} mb={4} />}
          <SearchBarMessage
            data-id="003363"
            icon={NoResultsFoundIcon}
            heading="We couldn't find a match"
            text="Check spelling or try another term." />
        </>
      );
    }

    // Show results if available
    return (
      <Stack data-id="003171" spacing={4}>
        {Object.entries(groupedResults).map(([key, results]) => {
          const [scopeType, scopeId] = key.split('-');
          const categoryLabel = getCategoryLabel(scopeType, scopeId);
          return (
            <Box data-id="003172" key={key}>
              <Flex data-id="003173" flexDir={'row'} align={'center'} gap={'8px'} mb={1}>
                <Text data-id="003174" fontSize="14px" fontWeight="600" color={'#718096'}>
                  {categoryLabel}
                </Text>
                <Divider data-id="003175" borderColor={'#CBD5E0'} flex={1} />
                {results.length >= 3 && (
                  <Flex 
                    data-id="003176" 
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
                    <Text data-id="003177" fontSize="14px" fontWeight="500" color="#0073E6">
                      View more results
                    </Text>
                    <ViewMoreIcon data-id="003178" boxSize="9px" color="#0073E6" />
                  </Flex>
                )}
              </Flex>
              <Stack data-id="003179" spacing={0}>
                {results.map((result) => renderSearchResultItem(result))}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    );
  };

  // Show loader if recent searches are loading and no search text (simpler check)
  const showRecentSearchesLoader = !searchText?.trim() && recentSearchesLoading && recentSearches.length === 0;

  return (
    <>
      {/* Show unified loader if recent searches are loading and no content available */}
      {shouldShowUnifiedLoader() || showRecentSearchesLoader ? (
        <Flex data-id="003205" justify="center" p={4}>
          <Loader data-id="003206" />
        </Flex>
      ) : (
        <>
          {renderRecentSearches()}
          {!searchText?.trim() && recentSearches.length > 0 && !recentSearchesLoading && <Divider data-id="003369" borderColor={'#CBD5E0'} mb={4} />}
          {renderSearchContent()}
        </>
      )}
    </>
  );
}

export default MobileSearchResults;

