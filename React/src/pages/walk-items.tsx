import { useMemo, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';

import Header from '../components/Header';
import Loader from '../components/Loader';
import WalkItemsList from '../components/WalkItems/WalkItemsList';

const GET_ANSWERS = gql`
  query {
    answers {
      _id
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
    questionsCategories {
      _id
      name
    }
  }
`;

const WalkItems = () => {
  const { data, loading, error, refetch } = useQuery(GET_ANSWERS);
  const panels = useMemo(
    () => [{ _id: 'all', name: 'All' }, ...(data?.questionsCategories ?? [])],
    [data?.questionsCategories],
  );
  const [selectedPanel, setSelectedPanel] = useState(0);
  const answers = useMemo(
    () =>
      selectedPanel === 0
        ? data?.answers
        : data?.answers.filter(
            (answer) =>
              answer?.question?.questionsCategoryId ===
              panels[selectedPanel]?._id,
          ),
    [data, selectedPanel],
  );

  return (
    <>
      <Header breadcrumbs={['Walk Items']} mobileBreadcrumbs={['Walk Items']} />
      <Flex
        h={['calc(100vh - 210px)', 'calc(100vh - 150px)']}
        overflow="auto"
        pt="3"
      >
        {/* eslint-disable */}
        {error ? (
          <Text>{error.message}</Text>
        ) : loading ? (
          <Loader center={true} />
        ) : (
          <>
            <Tabs
              defaultIndex={selectedPanel}
              onChange={(index) => setSelectedPanel(index)}
              variant="unstyled"
              w="full"
            >
              <TabList px={[4, 8]}>
                {panels?.map((panel) => (
                  <Tab
                    key={panel._id}
                    _selected={{
                      bg: 'walkItems.tabBg',
                      color: 'walkItems.tabColor',
                    }}
                    borderRadius="10px"
                    fontSize="smm"
                    fontWeight="bold"
                    mr={[1, 2]}
                  >
                    {panel.name}
                  </Tab>
                ))}
              </TabList>
              <TabPanels>
                {panels?.map((panel) => (
                  <TabPanel key={panel._id}>
                    <WalkItemsList
                      answers={answers}
                      refetchAnswers={refetch}
                    ></WalkItemsList>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </>
        )}
        {/* eslint-enable */}
      </Flex>
    </>
  );
};

export default WalkItems;

export const walkItemsStyles = {
  walkItems: {
    tabBg: '#1E1836',
    tabColor: '#FFFFFF',
  },
};
