import { useEffect } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Flex, Text } from '@chakra-ui/react';

import Header from '../components/Header';
import Loader from '../components/Loader';

const GET_ANSWERS = gql`
  query {
    answers {
      question {
        question
        questionsCategoryId
        questionsCategory {
          name
        }
      }
      addedBy {
        displayName
        imgUrl
      }
      scope {
        type
        _id
      }
      actions {
        scope {
          _id
        }
        _id
      }
      metatags {
        addedAt
        addedBy
      }
    }
    audits {
      _id
      walkType
      areaId
      area {
        name
      }
      metatags {
        addedAt
      }
    }
  }
`;

const WalkItems = () => {
  const { data, loading, error } = useQuery(GET_ANSWERS);

  useEffect(() => {
    // eslint-disable-next-line
    console.log(data?.answers);
  }, [data]);

  return (
    <>
      <Header breadcrumbs={['Walk Items']} mobileBreadcrumbs={['Walk Items']} />
      <Flex h={['calc(100vh - 210px)', 'calc(100vh - 150px)']} overflow="auto">
        {/* eslint-disable */}
        {error ? (
          <Text>{error.message}</Text>
        ) : loading ? (
          <Loader center={true} />
        ) : (
          <></>
        )}
        {/* eslint-enable */}
      </Flex>
    </>
  );
};

export default WalkItems;
