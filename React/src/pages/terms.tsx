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
      terms
    }
  }
`;

const MarkdownComponents: Components = {
  h1: ({ node, ...props }) => (
    <Text
      data-id="030925-0f0737"
      as="h1"
      fontSize="2xl"
      fontWeight="bold"
      mb={4}
      {...props} />
  ),
  h2: ({ node, ...props }) => (
    <Text
      data-id="030925-074f93"
      as="h2"
      fontSize="xl"
      fontWeight="semibold"
      mb={3}
      {...props} />
  ),
  h3: ({ node, ...props }) => (
    <Text
      data-id="030925-817998"
      as="h3"
      fontSize="lg"
      fontWeight="semibold"
      mb={3}
      {...props} />
  ),
  p: ({ node, ...props }) => (
    <Text data-id="030925-233e3b" as="p" lineHeight="1.6" mb={3} {...props} />
  ),
  ul: ({ node, ...props }) => (
    <Box
      data-id="030925-b80642"
      as="ul"
      mb={3}
      pl={5}
      style={{ listStyleType: 'disc' }}
      {...props} />
  ),
  li: ({ node, ...props }) => (
    <Box data-id="030925-e742b4" as="li" mb={1} {...props} />
  ),
  a: (props) => (
    <Box
      data-id="030925-cce55a"
      as="a"
      color="blue.500"
      textDecoration="underline"
      {...props} />
  ),
};

function Terms() {
  const { module } = useAppContext();
  const { data, loading } = useQuery(GET_HELP);

  const matchedHelp = data?.help?.find(
    (helpItem) => helpItem.module === module?.type,
  );

  return (
    <Flex
      data-id="030925-59d61c"
      flexDirection="column"
      h="full"
      overflow="auto"
      w="full"
    >
      <Header
        data-id="030925-e084b6"
        breadcrumbs={['Home', 'Terms and Conditions']}
        mobileBreadcrumbs={['Terms and Conditions']}
      />
      <Flex
        data-id="030925-a0d9c2"
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
          <Flex data-id="030925-cbfe69" align="center" h="100vh" justify="center">
            Loading...
          </Flex>
        ) : (
          <div data-id="030925-604893">
            {matchedHelp ? (
              <Box data-id="030925-cfabd4" fontSize="14px" mb="30px">
                <ReactMarkdown data-id="030925-bc950f" components={MarkdownComponents}>
                    {t(`${matchedHelp.terms}`)}
                </ReactMarkdown>
              </Box>
            ) : (
              <Text data-id="030925-df2a82" fontSize="14px" mb="30px">
                No Content Found
              </Text>
            )}
          </div>
        )}
      </Flex>
    </Flex>
  );
}

export default Terms;
