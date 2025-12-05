import { useSearchParams } from 'react-router-dom';

import { Flex, Text } from '@chakra-ui/react';

import Header from '../components/Header';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get('query') || '';
  const categoryType = searchParams.get('categoryType') || '';

  return (
    <>
      <Header
        breadcrumbs={['Search Results']}
        data-id="003290"
        mobileBreadcrumbs={['Search Results']}
        pageLabel="Search Results"
      />
      <Flex
        data-id="003291"
        flexDirection="column"
        h="full"
        overflow="auto"
        w="full">
        <Flex
          bg="white"
          borderRadius="20px"
          data-id="003292"
          flexDirection="column"
          h="auto"
          maxWidth="full"
          mb={['25px', '25px']}
          ml="7"
          mr="25px"
          p="25px 30px">
          <Text data-id="003293" fontSize="2xl" fontWeight="bold" mb={6}>
            Search Results
          </Text>
          {searchText && (
            <Text data-id="003294" color="gray.600" fontSize="md" mb={4}>
              Query: {searchText}
            </Text>
          )}
          {categoryType && (
            <Text data-id="003295" color="gray.600" fontSize="md" mb={4}>
              Category: {categoryType}
            </Text>
          )}
        </Flex>
      </Flex>
    </>
  );
}

export default SearchResults;

