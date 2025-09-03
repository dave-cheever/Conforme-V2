import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

import { gql, useQuery } from '@apollo/client';
import { Box, Flex, Text } from '@chakra-ui/react';
import { t } from 'i18next';

import Header from '../components/Header';
import { useAppContext } from '../contexts/AppProvider';

const GET_HELP = gql`
  query {
    help {
      _id
      module
      content
    }
  }
`;

const MarkdownComponents: Components = {
  h1: ({ node, ...props }) => (
    <Text
      data-id="030925-87dcff"
      as="h1"
      fontSize="2xl"
      fontWeight="bold"
      mb={4}
      {...props} />
  ),
  h2: ({ node, ...props }) => (
    <Text
      data-id="030925-9d2fe8"
      as="h2"
      fontSize="xl"
      fontWeight="semibold"
      mb={3}
      {...props} />
  ),
  h3: ({ node, ...props }) => (
    <Text
      data-id="030925-70cf73"
      as="h3"
      fontSize="lg"
      fontWeight="semibold"
      mb={3}
      {...props} />
  ),
  p: ({ node, ...props }) => (
    <Text data-id="030925-95ddf5" as="p" lineHeight="1.6" mb={3} {...props} />
  ),
  ul: ({ node, ...props }) => (
    <Box
      data-id="030925-407f94"
      as="ul"
      mb={3}
      pl={5}
      style={{ listStyleType: 'disc' }}
      {...props} />
  ),
  li: ({ node, ...props }) => (
    <Box data-id="030925-350b9f" as="li" mb={1} {...props} />
  ),
  a: (props) => (
    <Box
      data-id="030925-237b8a"
      as="a"
      color="blue.500"
      textDecoration="underline"
      {...props} />
  ),
};

function Help() {
  const { module } = useAppContext();
  const { data, loading } = useQuery(GET_HELP);

  const matchedHelp = data?.help?.find(
    (helpItem) => helpItem.module === module?.type,
  );

  return (
    <Flex
      data-id="030925-4be809"
      flexDirection="column"
      h="full"
      overflow="auto"
      w="full"
    >
      <Header
        data-id="030925-2271e2"
        breadcrumbs={['Home', 'Help']}
        mobileBreadcrumbs={['Help']}
      />
      <Flex
        data-id="030925-0d22e9"
        bg="white"
        borderRadius="20px"
        flexDirection="column"
        h="auto"
        maxWidth="full"
        mb={['25px', '25px']}
        ml="7"
        mr="25px"
        p="25px 30px"
      >
        {loading ? (
          <Flex data-id="030925-d37f97" align="center" h="100vh" justify="center">
            Loading...
          </Flex>
        ) : (
          <div data-id="030925-dc69cd">
            {matchedHelp ? (
              <Box data-id="030925-346b69" fontSize="14px" mb="30px">
                <ReactMarkdown data-id="030925-b96da4" components={MarkdownComponents}>
                    {t(`${matchedHelp.content}`)}
                </ReactMarkdown>
              </Box>
            ) : (
              <Text data-id="030925-550c49" fontSize="14px" mb="30px">
                No Content Found
              </Text>
            )}
          </div>
        )}
      </Flex>
    </Flex>
  );
}

export default Help;
