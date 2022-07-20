import { useCallback, useEffect, useRef } from 'react';

import { gql, useLazyQuery, useQuery } from '@apollo/client';
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
} from '@chakra-ui/react';
import { debounce, isEmpty } from 'lodash';

import { useAppContext } from '../contexts/AppProvider';
import { useNavigationTopContext } from '../contexts/NavigationTopProvider';
import useNavigate from '../hooks/useNavigate';
import { CrossIcon } from '../icons';
import Loader from './Loader';

const GET_SEARCH_RESULTS = gql`
  query SearchResults($searchQuery: SearchQuery) {
    search(searchQuery: $searchQuery) {
      audits {
        _id
        primaryText
        secondaryText
        type
      }
      responses {
        _id
        primaryText
        secondaryText
        type
      }
    }
  }
`;

const GET_SEARCH_HISTORY = gql`
  query SearchHistory($SearchHistoryQuery: AuditLogsQuery) {
    auditLog(auditLogsQuery: $SearchHistoryQuery) {
      _id
      auditLogs {
        _id
        records {
          action
          values
        }
      }
    }
  }
`;

const SearchBar = () => {
  const ref = useRef() as React.MutableRefObject<HTMLInputElement>;
  const { module, user } = useAppContext();
  const { navigateTo } = useNavigate();
  const { isSearchBarOpen, setIsSearchBarOpen, searchText, setSearchText } = useNavigationTopContext();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { data: historyData, refetch } = useQuery(GET_SEARCH_HISTORY, {
    variables: {
      SearchHistoryQuery: {
        actions: ['search'],
        userId: user?._id,
        moduleId: module?._id,
        limit: 3,
      },
    },
    fetchPolicy: 'network-only',
  });

  useOutsideClick({
    ref,
    handler: () => {
      onClose();
      setIsSearchBarOpen(false);
    },
  });

  const recentlySearchPhrases =
    historyData?.auditLog?.auditLogs?.reduce((acc, curr) => {
      const searchPhrases = curr.records.filter(({ action }) => action === 'search').map((record) => record.values?.searchText?.new?.value);
      return [...acc, ...searchPhrases];
    }, []) || [];

  const [getSearchResults, { loading, data }] = useLazyQuery(GET_SEARCH_RESULTS);
  const search = useCallback(
    debounce((searchText) => {
      if (searchText) {
        getSearchResults({
          variables: {
            searchQuery: {
              searchText,
              moduleId: module?._id,
            },
          },
        });
        refetch();
      }
    }, 750),
    [],
  );

  useEffect(() => search(searchText), [search, searchText]);

  return (
    <Flex direction="column" position="relative" ref={ref}>
      <InputGroup
        display="block"
        maxW="100%"
        transition="width .15s"
        w={['calc(100vw - 30px)', isSearchBarOpen ? '550px' : '260px']}
        zIndex={1}
      >
        <InputLeftElement color="navigationTop.inputIconColor" pointerEvents="none">
          <SearchIcon fill="navigationTop.searchBarIcon" opacity="1" stroke="brand.outerSpace" />
        </InputLeftElement>
        <InputRightElement display={isSearchBarOpen ? 'block' : 'none'} h="full">
          <CrossIcon
            _active={{}}
            _hover={{
              color: 'navigationTop.notificationIconHover',
              opacity: 0.7,
              cursor: 'pointer',
            }}
            h="13.5px"
            ml="15px"
            mt="10px"
            onClick={() => {
              setIsSearchBarOpen(false);
              setSearchText('');
            }}
            stroke="navigationTop.searchCrossIconStroke"
            w="13.5px"
          />
        </InputRightElement>
        <Input
          bg="navigationTop.inputBg"
          fontSize="smm"
          fontWeight="semi_medium"
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => {
            setIsSearchBarOpen(true);
            onOpen();
          }}
          placeholder="Search"
          rounded="20px"
          value={searchText}
        />
      </InputGroup>
      {isOpen && (
        <Box
          display={isSearchBarOpen && (recentlySearchPhrases?.length > 0 || data?.search || loading) ? 'block' : 'none'}
          position="absolute"
          pt={[6, 12]}
          w="full"
          zIndex={0}
        >
          <Stack bg="white" boxShadow="0px 3px 10px rgba(0, 0, 0, .1)" fontSize="smm" p={4} rounded="20px">
            {loading ? (
              <Loader size="sm" />
            ) : (
              data &&
              ((module?.type === 'tracker' ? data.search.responses : data.search.audits).length > 0 ? (
                <Stack>
                  {(module?.type === 'tracker' ? data?.search?.responses : data?.search?.audits)?.map((searchResult) => (
                    <Stack
                      _hover={{
                        textDecoration: 'underline',
                      }}
                      cursor="pointer"
                      direction="row"
                      key={searchResult._id}
                      onClick={() => navigateTo(`/${searchResult.type}/${searchResult._id}`)}
                    >
                      <Text>{searchResult.primaryText}</Text>
                      <Text>•</Text>
                      <Text color="gray">{searchResult.secondaryText}</Text>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <Text>No results found</Text>
              ))
            )}
            {data && !isEmpty(recentlySearchPhrases) && <Divider color="lightgray" />}
            {!isEmpty(recentlySearchPhrases) && (
              <Stack>
                <Text color="gray" fontStyle="italic">
                  Recently searched:
                </Text>
                {recentlySearchPhrases.map((phrase, i) => (
                  <Box
                    _hover={{
                      textDecoration: 'underline',
                    }}
                    cursor="pointer"
                    key={i}
                    onClick={() => setSearchText(phrase)}
                  >
                    {phrase}
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>
        </Box>
      )}
    </Flex>
  );
};

export default SearchBar;
