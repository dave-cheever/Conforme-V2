import React, { useMemo } from 'react';

import { Box, Divider, Flex, Stack, Text } from '@chakra-ui/react';

import useNavigate from '../hooks/useNavigate';
import { AuditSearchIcon, TrackerItemSearchIcon, ViewMoreIcon } from '../icons';
import { ISearchResult } from '../interfaces/ISearchResult';
import Loader from './Loader';
import StatusCell from './Table/Cells/StatusCell';

interface MobileSearchResultsProps {
  searchResults: ISearchResult[];
  searchText: string;
  searchLoading: boolean;
  module: any;
  auditSearchItems: any[];
  trackerSearchItems: any[];
  onResultClick: (result: ISearchResult) => void;
}

function MobileSearchResults({
  searchResults,
  searchText,
  searchLoading,
  module,
  auditSearchItems,
  trackerSearchItems,
  onResultClick,
}: Readonly<MobileSearchResultsProps>) {
  const { navigateTo } = useNavigate();

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

  const handleSearchResultClick = async (result: ISearchResult) => {
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
      navigateTo(`/${url}`);
      onResultClick(result);
    }
  };

  if (searchLoading) {
    return (
      <Flex data-id="003168" justify="center" p={4}>
        <Loader data-id="003169" />
      </Flex>
    );
  }

  if (searchResults.length === 0) {
    if (searchText) {
      return (
        <Text
          data-id="003170"
          color="gray.500"
          fontSize="14px"
          py={4}
          textAlign="center">No search results found
                  </Text>
      );
    }
    return null;
  }

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
                <Flex data-id="003176" align="center" gap={2} cursor="pointer">
                  <Text data-id="003177" fontSize="14px" fontWeight="500" color="#0073E6">
                    View more results
                  </Text>
                  <ViewMoreIcon data-id="003178" boxSize="9px" color="#0073E6" />
                </Flex>
              )}
            </Flex>
            <Stack data-id="003179" spacing={0}>
              {results.map((result) => (
                <Flex
                  data-id="003180"
                  key={result._id}
                  _hover={{ cursor: 'pointer' }}
                  align="center"
                  gap={2}
                  onClick={() => handleSearchResultClick(result)}
                  h={result.type === 'audits' ? '60px' : '42px'}
                  rounded="md">
                  <Flex data-id="003181" flexDir={'row'} align={'center'} gap={4}>
                    <Box
                      data-id="003182"
                      h='28px'
                      w='28px'
                      rounded='6px'
                      bg='#EDF2F7'
                      display="flex"
                      alignItems="center"
                      justifyContent="center">
                      {(() => {
                        if (result.type === 'audits') {
                          return <AuditSearchIcon data-id="003183" boxSize="20px" color="#4A5568" />;
                        }
                        if (result.type === 'tracker-item-response') {
                          return <TrackerItemSearchIcon data-id="003184" boxSize="20px" color="#4A5568" />;
                        }
                        return null;
                      })()}
                    </Box>
                    <Stack data-id="003185" spacing={0}>
                      <Flex data-id="003186" flexDir={'row'} align={'center'} gap={2}>
                        <Text data-id="003187" flex={1} fontSize="16px">
                          {highlightText(
                            result.type === 'audits' && result.reference ? result.reference : result.title,
                            searchText
                          )}
                        </Text>
                        {result.type === 'audits' && result.status && (
                          <StatusCell data-id="003188" status={result.status} size="sm" />
                        )}
                      </Flex>
                      <Flex data-id="003189" align="center" gap={2}>
                        {result.type === 'audits' && result.auditTypeName && (
                          <Text data-id="003190" fontSize="16px" fontWeight="400" color="gray.700">
                            {highlightText(result.auditTypeName, searchText)}
                          </Text>
                        )}
                      </Flex>
                    </Stack>
                  </Flex>
                </Flex>
              ))}
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
}

export default MobileSearchResults;

