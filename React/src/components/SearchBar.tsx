import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
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
import useNavigate from '../hooks/useNavigate';
import { ChevronRight, CrossIcon, MenuIcon } from '../icons';
import { IScope } from '../interfaces/IScope';
import { ISearchCategory } from '../interfaces/ISearchCategory';
import { ISearchResult } from '../interfaces/ISearchResult';
import { IUser } from '../interfaces/IUser';
import QuestionsCategoryIcon from './Icon';
import Loader from './Loader';
import UserAvatar from './UserAvatar';

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
    }
  }
`;

function SearchBar() {
  const ref = useRef() as React.MutableRefObject<HTMLInputElement>;
  const { module } = useAppContext();
  const { navigateTo } = useNavigate();
  const { isSearchBarOpen, setIsSearchBarOpen, searchText, setSearchText } = useNavigationTopContext();
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
            data-id="34703839adfd"
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

  const getScopes = () => {
    const scopes: IScope[] = [];
    if (selectedSearchCategory?.type === 'all') {
      const searchCategoriesWithoutAll = searchCategories.filter(({ type }) => type !== 'all');
      searchCategoriesWithoutAll.forEach(({ type, _id }) => scopes.push({ type, _id }));
    } else {
      scopes.push({
        type: selectedSearchCategory?.type,
        _id: selectedSearchCategory?._id,
      });
    }
    return scopes;
  };

  const [getSearchResults, { loading }] = useLazyQuery(GET_SEARCH_RESULTS, { fetchPolicy: 'network-only' });
  const [searchResults, setSearchResults] = useState<ISearchResult[]>();
  const search = useCallback(
    async (searchText: string) => {
      if (searchText) {
        const results = await getSearchResults({
          variables: {
            searchQuery: {
              searchText,
              moduleId: module?._id,
              scopes: getScopes(),
            },
          },
        });
        setSearchResults(results.data.search);
      }
    },
    [searchText, getScopes, module?._id],
  );

  // Debounce to delay search after changing search phrase
  const debounceSearch = useMemo(() => debounce(search, 750), [JSON.stringify(selectedSearchCategory)]);

  // Effect to trigger search immediately after search category change
  useEffect(() => {
    search(searchText);
  }, [JSON.stringify(selectedSearchCategory)]);

  const handleSearchResultClick = (result: any) => {
    const category = searchCategories.find((category) => category.type === result.type && category._id == result.scope._id);
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
    if (url) navigateTo(`/${url}`);
  };

  return (
    (<Flex border={"1px solid #CBD5E0"} borderRadius={"md"} data-id="1bbf0fad73e2" direction="column"  position="relative" ref={ref} w="449px">
      <InputGroup
        data-id="a5273cba17ab"
        display="block"
        maxW="100%"
        transition="width .15s"
        w={['calc(100vw - 30px)', isSearchBarOpen ? '550px' : '260px']}
        zIndex={1}>
        <InputLeftElement
          color="navigationTop.inputIconColor"
          data-id="7ab9dbdb8063"
          pointerEvents="none">
          <SearchIcon
            data-id="c4caee9485a3"
            fill="navigationTop.searchBarIcon"
            opacity="1"
            stroke="brand.outerSpace" />
        </InputLeftElement>
        <InputRightElement
          data-id="5b7d7ed8f862"
          display={isSearchBarOpen ? 'block' : 'none'}
          h="full">
          <CrossIcon
            _active={{}}
            _hover={{
              color: 'navigationTop.notificationIconHover',
              opacity: 0.7,
              cursor: 'pointer',
            }}
            data-id="02760af478f6"
            h="13.5px"
            ml="15px"
            mt="10px"
            onClick={() => {
              setIsSearchBarOpen(false);
              setSearchText('');
              setSearchResults([]);
            }}
            stroke="navigationTop.searchCrossIconStroke"
            w="13.5px" />
        </InputRightElement>
        <Input
         _placeholder={{ color: '#A0AEC0' }}
          bg="navigationTop.inputBg"
          data-id="76b7cf59603e"
          fontSize="smm"
          fontWeight="semi_medium"
          onChange={(e) => {
            setSearchText(e.target.value);
            debounceSearch(e.target.value);
          }}
          onFocus={() => {
            setIsSearchBarOpen(true);
            onOpen();
          }}
          placeholder="Search"
          rounded="10px"
          value={searchText}
          w="447px" />
      </InputGroup>
      {isOpen && (
        <Box
          data-id="2f0f3c420f1e"
          display={isSearchBarOpen ? 'block' : 'none'}
          position="absolute"
          pt={[6, 12]}
          w="full"
          zIndex={0}>
          <Flex
            bg="white"
            boxShadow="0px 3px 10px rgba(0, 0, 0, .1)"
            data-id="c40ec27aa9ed"
            direction="row"
            fontSize="smm"
            rounded="10px">
            {/* eslint-disable-next-line react/jsx-sort-props */}
            <Box
              bg="searchBar.categoriesBg"
              borderBottomRightRadius="none"
              borderRadius="10px"
              borderTopRightRadius="none"
              data-id="625fcc3a70d0"
              pb={2}
              px={3}>
              {searchCategories.map((searchCategory) => (
                <Box
                  _hover={{
                    cursor: 'pointer',
                  }}
                  alignItems="center"
                  data-id="2ac86a6621dc"
                  display="flex"
                  fontSize={['sm', 'md']}
                  fontWeight="normal"
                  h="42px"
                  key={`${searchCategory.type}-${searchCategory._id}`}
                  mt={2}
                  onClick={() => setSelectedSearchCategory(searchCategory)}
                  pos="relative"
                  w={['100px', '200px']}>
                  <Flex align="center" data-id="b36d7379d190" h="100%">
                    <Flex
                      alignItems="center"
                      bg={
                        `${selectedSearchCategory?.type}-${selectedSearchCategory?._id}` === `${searchCategory.type}-${searchCategory._id}`
                          ? 'navigationLeftItem.selectedLabelBg'
                          : 'navigationLeftItem.unselectedLabelBg'
                      }
                      data-id="d99165ca9f16"
                      h="30px"
                      justifyContent="center"
                      rounded="8px"
                      w="30px">
                      <Icon
                        as={searchCategory.icon}
                        data-id="8c7de759428a"
                        fill="transparent"
                        h="15px"
                        stroke={
                          `${selectedSearchCategory?.type}-${selectedSearchCategory?._id}` ===
                            `${searchCategory.type}-${searchCategory._id}`
                            ? 'navigationLeftItem.selectedIconStroke'
                            : 'navigationLeftItem.unselectedIconStroke'
                        }
                        w="15px" />
                    </Flex>
                  </Flex>
                  <Box
                    color="black"
                    data-id="7c1179ee898e"
                    fontWeight="400"
                    ml="5">
                    {searchCategory.label}
                  </Box>
                </Box>
              ))}
            </Box>
            <Box data-id="954f1f8ff73a" h="auto" w="full">
              {loading ? (
                <Flex align="center" data-id="5610944d5e84" h="100px" justify="center" w="full">
                  <Loader center data-id="cd4b7a92c1ed" size="sm" />
                </Flex>
              ) : (
                <Flex data-id="72cbceada7fe" direction="column">
                  {searchResults ? (
                    searchResults.length > 0 ? (
                      <>
                        {(searchResults ?? []).map((result) => (
                          <HStack
                            _hover={{
                              background: 'searchBar.results.bgColor.hover',
                            }}
                            align="center"
                            cursor="pointer"
                            data-id="9492b2b5c781"
                            key={result._id}
                            onClick={() => handleSearchResultClick(result)}
                            p={3}
                            spacing={3}>
                            <Box data-id="e66521cfa8ae">
                              <UserAvatar data-id="bfc86b910eff" size="sm" userId={(result.user as IUser)?._id} />
                            </Box>
                            <Flex data-id="7bcb4e9f101c" direction="column" grow={1}>
                              {selectedSearchCategory?.type === 'all' && (
                                <Text data-id="8a6ae019fac6" fontSize="xs">
                                  {searchCategories.find(({ type, _id }) => type === result.type && _id == result.scope._id)?.label}
                                </Text>
                              )}
                              <Text data-id="5a545e18dda7" fontSize="smm" fontWeight="bold" noOfLines={1}>
                                {result.title}
                              </Text>
                            </Flex>
                            <ChevronRight cursor="pointer" data-id="b9c27d5eb4e3" />
                          </HStack>
                        ))}
                      </>
                    ) : (
                      <Flex align="center" data-id="50533d923e29" justify="center" mt={4}>
                        <Text data-id="44e8f209a4f5">No results found</Text>
                      </Flex>
                    )

                  ) : (
                    <Flex align="center" data-id="6479715af01d" justify="center" mt={4}>
                      <Text data-id="561cea50604d">Enter search phrase in the box above</Text>
                    </Flex>
                  )}
                </Flex>
              )}
            </Box>
          </Flex>
        </Box>
      )}
    </Flex>)
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
