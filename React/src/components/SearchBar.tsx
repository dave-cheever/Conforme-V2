import { useCallback, useEffect } from "react";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { SearchIcon } from "@chakra-ui/icons";
import { InputGroup, InputLeftElement, InputRightElement, Input, Flex, Stack, Box, Text, Divider } from "@chakra-ui/react";
import debounce from "lodash.debounce";

import { CrossIcon } from "../icons";
import { useNavigationTopContext } from "../contexts/NavigationTopProvider";
import { useHistory } from "react-router";
import Loader from "./Loader";
import { useAppContext } from "../contexts/AppProvider";

const GET_SEARCH_RESULTS = gql`
  query SearchResults($searchQuery: SearchQuery) {
    search(searchQuery: $searchQuery) {
      _id
      primaryText
      secondaryText
      type
    }
  }
`;

const GET_SEARCH_HISTORY = gql`
  query SearchHistory($SearchHistoryQuery: AuditLogsQuery) {
    auditLogs(auditLogsQuery: $SearchHistoryQuery) {
      _id
      records {
        action
        values
      }
    }
  }
`;

const SearchBar = () => {
  const history = useHistory();
  const { user } = useAppContext();
  const {
    isSearchBarOpen, setIsSearchBarOpen,
    searchText, setSearchText,
  } = useNavigationTopContext();

  const { data: historyData } = useQuery(GET_SEARCH_HISTORY, {
    variables: {
      SearchHistoryQuery: {
        action: 'search',
        userId: user?._id,
        limit: 3,
      },
    },
    fetchPolicy: 'network-only',
  });

  const recentlySearchPhrases = historyData?.auditLogs?.reduce((acc, curr) => {
    const searchPhrases = curr.records.filter(({ action }) => action === 'search').map(record => record.values?.searchText?.new?.value);
    return [...acc, ...searchPhrases];
  }, []) || [];

  // eslint-disable-next-line
  const search = useCallback(
    debounce((searchText) => {
      if (searchText) {
        getSearchResults({
          variables: {
            searchQuery: {
              searchText,
            },
          },
        });
      }
    }, 750),
    [],
  );
  useEffect(() => search(searchText), [search, searchText]);
  const [getSearchResults, { loading, data }] = useLazyQuery(GET_SEARCH_RESULTS);

  return (
    <Flex direction="column" position="relative">
      <InputGroup
        display="block"
        w={["calc(100vw - 30px)", isSearchBarOpen ? "550px" : "260px"]}
        maxW="100%"
        transition='width .15s'
        zIndex={1}
      >
        <InputLeftElement
          pointerEvents="none"
          color="navigationTop.inputIconColor"
          children={<SearchIcon fill="navigationTop.searchBarIcon" stroke="brand.outerSpace" opacity="1" />}
        />
        <InputRightElement h='full' display={isSearchBarOpen ? 'block' : 'none'}>
          <CrossIcon
            _hover={{ color: "navigationTop.notificationIconHover", opacity: 0.7, cursor: "pointer" }}
            _active={{}}
            h="13.5px"
            w="13.5px"
            mt='10px'
            ml='15px'
            onClick={() => {
              setIsSearchBarOpen(false);
              setSearchText('');
            }}
            stroke="navigationTop.searchCrossIconStroke"
          />
        </InputRightElement>
        <Input
          bg="navigationTop.inputBg"
          rounded="20px"
          placeholder="Search"
          fontWeight="semi_medium"
          fontSize="smm"
          onFocus={() => setIsSearchBarOpen(true)}
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
      </InputGroup>
      <Box
        position="absolute"
        w='full'
        pt={[6, 12]}
        zIndex={0}
        display={isSearchBarOpen && (recentlySearchPhrases?.length > 0 || data?.search || loading) ? "block" : "none"}
      >
        <Stack
          p={4}
          rounded="20px"
          bg="white"
          boxShadow="0px 3px 10px rgba(0, 0, 0, .1)"
          fontSize="smm"
        >
          {loading ? (
            <Loader size="sm" />
          ) : data && (data.search.length > 0 ? (
            <Stack>
              {data?.search?.map(searchResult => (
                <Stack
                  key={searchResult._id}
                  direction="row"
                  cursor='pointer'
                  _hover={{
                    textDecoration: 'underline',
                  }}
                  onClick={() => history.push(`${searchResult.type}/${searchResult._id}`)}
                >
                  <Text>{searchResult.primaryText}</Text>
                  <Text>•</Text>
                  <Text color="gray">{searchResult.secondaryText}</Text>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Text>No results found</Text>
          ))}
          {data && <Divider color="lightgray" />}
          <Stack>
            <Text color="gray" fontStyle="italic">Recently searched:</Text>
            {recentlySearchPhrases.map((phrase, i) => (
              <Box
                key={i}
                cursor='pointer'
                _hover={{
                  textDecoration: 'underline'
                }}
                onClick={() => setSearchText(phrase)}
              >{phrase}</Box>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Flex >
  );
};

export default SearchBar;
