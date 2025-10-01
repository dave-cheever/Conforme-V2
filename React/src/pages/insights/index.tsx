import { useEffect, useMemo, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import FilterButton from '../../components/FilterButton';
import QuickFilters from '../../components/Filters/QuickFilters';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import useDevice from '../../hooks/useDevice';
import ActionsInsights from './actions';
import AnswersInsights from './answers';
import AuditsInsights from './audits';

const GET_QUESTIONS_CATEGORIES = gql`
  query ($questionsCategoryQuery: QuestionsCategoryQuery) {
    questionsCategories(questionsCategoryQuery: $questionsCategoryQuery) {
      _id
      name
      showInInsights
    }
  }
`;

function Insights() {
  const { data, loading, error } = useQuery(GET_QUESTIONS_CATEGORIES, {
    variables: {
      questionsCategoryQuery: {
        showInInsights: true,
      },
    },
  });
  const device = useDevice();
  const { setUsedFilters, setShowFiltersPanel } = useFiltersContext();
  const panels = useMemo(
    () => [
      {
        _id: 'audits',
        name: capitalize(pluralize(t('audit'))),
        component: <AuditsInsights data-id="000704" />,
        usedFilters: ['walkType', 'status', 'locationsIds', 'businessUnitsIds', 'usersIds'],
      },
      ...(data?.questionsCategories ?? []).map((questionsCategory) => ({
        _id: questionsCategory?._id,
        name: questionsCategory?.name,
        component: <AnswersInsights
          answerType={questionsCategory?.name}
          data-id="000705"
          questionsCategoriesId={questionsCategory?._id} />,
        usedFilters: ['questionsCategoriesIds', 'businessUnitsIds', 'usersIds', 'locationsIds', 'status', 'createdDate'],
      })),
      {
        _id: 'actions',
        name: 'Actions',
        component: <ActionsInsights data-id="000706" />,
        usedFilters: ['status', 'priority', 'locationsIds', 'businessUnitsIds', 'usersIds', 'dueDate'],
      },
    ],
    [data],
  );
  const [selectedPanel, setSelectedPanel] = useState(0);

  useEffect(() => {
    setUsedFilters(panels[selectedPanel]?.usedFilters ?? []);

    return () => {
      setShowFiltersPanel(false);
      setUsedFilters([]);
    };
  }, [selectedPanel]);

  return (
    <Flex
        data-id="000707"
        direction="column"
        h="full"
        isolation="isolate"
        overflowY="hidden"
        zIndex="1">
      <Header
        breadcrumbs={['Insights']}
        data-id="000708"
        mobileBreadcrumbs={['Insights']}>
        {device === 'mobile' && <FilterButton data-id="000709" insightsFilter />}

      </Header>
      {device !== 'mobile' && (
        <Flex
          data-id="000710"
          h="max-content"
          pl={['4', '8', '8']}
          position="relative"
          zIndex="2">
          <QuickFilters
            data-id="000711"
            w={['full', 'calc(100% - 64px)', 'calc(100% - 64px)']} />
        </Flex>
      )}
      {error ? (
        <Text data-id="000712">{error.message}</Text>
      ) : loading ? (
        <Loader center data-id="000713" />
      ) : (
        <Flex
          data-id="000714"
          direction="column"
          overflowY="scroll"
          pt="3"
          px={[4, 8]}>
          <Tabs
            data-id="000715"
            defaultIndex={selectedPanel}
            isLazy
            onChange={(index) => setSelectedPanel(index)}
            variant="unstyled"
            w="full">
            <TabList
              data-id="000716"
              overflowX="auto"
              sx={{
                '::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
              whiteSpace="nowrap"
            >
              {panels?.map((panel) => (
                <Tab
                  _hover={{
                    opacity: 0.8,
                  }}
                  _selected={{
                    bg: 'insights.tabBg',
                    color: 'insights.tabColor',
                  }}
                  borderRadius="10px"
                  data-id="000717"
                  fontSize="14px"
                  fontWeight="600"
                  key={panel._id}
                  minW="fit-content"
                  mr={[1, 2]}
                  px={4} // ensures decent padding for mobile
                >
                  {panel.name}
                </Tab>
              ))}
            </TabList>
            <TabPanels data-id="000718">
              {panels?.map((panel) => (
                <TabPanel data-id="000719" key={panel._id} px={0}>
                  {panel.component}
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Flex>
      )}
    </Flex>
  );
}

export default Insights;

export const insightsStyles = {
  insights: {
    header: {
      menuButtonBg: 'white',
      rightIcon: '#9A9EA1',
      menuItemFocus: '#462AC4',
      menuItemFontSelected: '#462AC4',
      menuItemFont: '#9A9EA1',
    },
    tabBg: '#462AC4',
    tabColor: '#FFFFFF',
    secondaryText: '#787486',
  },
};
