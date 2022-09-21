import { useEffect, useMemo, useRef, useState } from 'react';

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

const SearchBar = () => {
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
          _id: questionsCategory._id,
          label: questionsCategory.name,
          icon: (props) => <QuestionsCategoryIcon icon={questionsCategory.icon} key={questionsCategory._id} {...props} />,
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
  const search = async (searchText: string) => {
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
  };

  // Debounce to delay search after changing search phrase
  const debounceSearch = useMemo(() => debounce(search, 750), [JSON.stringify(selectedSearchCategory)]);

  // Effect to trigger search immediately after search category change
  useEffect(() => {
    search(searchText);
  }, [JSON.stringify(selectedSearchCategory)]);
  const handleSearchResultClick = (result: any) => {
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
            url = `walk-items?id=${result._id}`;
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
              setSearchResults([]);
            }}
            stroke="navigationTop.searchCrossIconStroke"
            w="13.5px"
          />
        </InputRightElement>
        <Input
          bg="navigationTop.inputBg"
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
        />
      </InputGroup>
      {isOpen && (
        <Box display={isSearchBarOpen ? 'block' : 'none'} position="absolute" pt={[6, 12]} w="full" zIndex={0}>
          <Flex bg="white" boxShadow="0px 3px 10px rgba(0, 0, 0, .1)" direction="row" fontSize="smm" rounded="10px">
            {/* eslint-disable-next-line react/jsx-sort-props */}
            <Box bg="searchBar.categoriesBg" borderRadius="10px" borderBottomRightRadius="none" borderTopRightRadius="none" px={3} pb={2}>
              {searchCategories.map((searchCategory) => (
                <Box
                  _hover={{
                    cursor: 'pointer',
                  }}
                  alignItems="center"
                  display="flex"
                  fontSize={['sm', 'md']}
                  fontWeight="normal"
                  h="42px"
                  key={`${searchCategory.type}-${searchCategory._id}`}
                  mt={2}
                  onClick={() => setSelectedSearchCategory(searchCategory)}
                  pos="relative"
                  w={['100px', '200px']}
                >
                  <Flex align="center" h="100%">
                    <Flex
                      alignItems="center"
                      bg={
                        `${selectedSearchCategory?.type}-${selectedSearchCategory?._id}` === `${searchCategory.type}-${searchCategory._id}`
                          ? 'navigationLeftItem.selectedLabelBg'
                          : 'navigationLeftItem.unselectedLabelBg'
                      }
                      h="30px"
                      justifyContent="center"
                      rounded="8px"
                      w="30px"
                    >
                      <Icon
                        as={searchCategory.icon}
                        fill="transparent"
                        h="15px"
                        stroke={
                          `${selectedSearchCategory?.type}-${selectedSearchCategory?._id}` ===
                            `${searchCategory.type}-${searchCategory._id}`
                            ? 'navigationLeftItem.selectedIconStroke'
                            : 'navigationLeftItem.unselectedIconStroke'
                        }
                        w="15px"
                      />
                    </Flex>
                  </Flex>
                  <Box color="navigationLeftItem.unselectedMenuItem" fontWeight="400" ml="5">
                    {searchCategory.label}
                  </Box>
                </Box>
              ))}
            </Box>
            <Box h="auto" w="full">
              {loading ? (
                <Flex align="center" h="100px" justify="center" w="full">
                  <Loader center size="sm" />
                </Flex>
              ) : (
                <Flex direction="column">
                  {searchResults ? (
                    <>
                      {searchResults.length > 0 ? (
                        <>
                          {(searchResults ?? []).map((result) => (
                            <HStack
                              _hover={{
                                background: 'searchBar.results.bgColor.hover',
                              }}
                              align="center"
                              cursor="pointer"
                              key={result._id}
                              onClick={() => handleSearchResultClick(result)}
                              p={3}
                              spacing={3}
                            >
                              <Box>
                                <UserAvatar size="sm" userId={(result.user as IUser)?._id} />
                              </Box>
                              <Flex direction="column" grow={1}>
                                {selectedSearchCategory?.type === 'all' && (
                                  <Text fontSize="xs">
                                    {searchCategories.find(({ type, _id }) => type === result.scope.type && _id == result.scope._id)?.label}
                                  </Text>
                                )}
                                <Text fontSize="smm" fontWeight="bold" noOfLines={1}>
                                  {result.title}
                                </Text>
                              </Flex>
                              <ChevronRight cursor="pointer" />
                            </HStack>
                          ))}
                        </>
                      ) : (
                        <Flex align="center" justify="center" mt={4}>
                          <Text>No results found</Text>
                        </Flex>
                      )}
                    </>
                  ) : (
                    <Flex align="center" justify="center" mt={4}>
                      <Text>Enter search phrase in the box above</Text>
                    </Flex>
                  )}
                </Flex>
              )}
            </Box>
          </Flex>
        </Box>
      )}
    </Flex>
  );
};

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
