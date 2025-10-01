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
      privacy
    }
  }
`;

const MarkdownComponents: Components = {
  h1: ({ node, ...props }) => (
    <Text
      as="h1"
      data-id="000242"
      fontSize="2xl"
      fontWeight="bold"
      mb={4}
      {...props} />
  ),
  h2: ({ node, ...props }) => (
    <Text
      as="h2"
      data-id="000243"
      fontSize="xl"
      fontWeight="semibold"
      mb={3}
      {...props} />
  ),
  h3: ({ node, ...props }) => (
    <Text
      as="h3"
      data-id="000244"
      fontSize="lg"
      fontWeight="semibold"
      mb={3}
      {...props} />
  ),
  p: ({ node, ...props }) => (
    <Text as="p" data-id="000245" lineHeight="1.6" mb={3} {...props} />
  ),
  ul: ({ node, ...props }) => (
    <Box
      as="ul"
      data-id="000246"
      mb={3}
      pl={5}
      style={{ listStyleType: 'disc' }}
      {...props} />
  ),
  li: ({ node, ...props }) => (
    <Box as="li" data-id="000247" mb={1} {...props} />
  ),
  a: (props) => (
    <Box
      as="a"
      color="blue.500"
      data-id="000248"
      textDecoration="underline"
      {...props} />
  ),
};

function PrivacyPolicy() {
  const { module } = useAppContext();
  const { data, loading } = useQuery(GET_HELP);

  const matchedHelp = data?.help?.find(
    (helpItem) => helpItem.module === module?.type,
  );

  return (
    <Flex
      data-id="000249"
      flexDirection="column"
      h="full"
      overflow="auto"
      w="full"
    >
      <Header
        breadcrumbs={['Home', 'Privacy Policy']}
        data-id="000250"
        mobileBreadcrumbs={['Privacy Policy']}
      />
      <Flex
        bg="white"
        borderRadius="20px"
        data-id="000251"
        flexDirection="column"
        h="auto"
        maxWidth="full"
        mb={['25px', '25px']}
        ml="7"
        mr="25px"
        p="25px 30px"
      >
        {loading ? (
          <Flex align="center" data-id="000252" h="100vh" justify="center">
            Loading...
          </Flex>
        ) : (
          <div data-id="000253">
            {matchedHelp ? (
              <Box data-id="000254" fontSize="14px" mb="30px">
                <ReactMarkdown components={MarkdownComponents} data-id="000255">
                    {t(`${matchedHelp.privacy}`)}
                </ReactMarkdown>
              </Box>
            ) : (
              <Text data-id="000256" fontSize="14px" mb="30px">
                No Content Found
              </Text>
            )}
          </div>
        )}
      </Flex>
    </Flex>
  );
}

export default PrivacyPolicy;
