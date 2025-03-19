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
        component: <AuditsInsights data-id="4e5838fba437" />,
        usedFilters: ['walkType', 'status', 'locationsIds', 'businessUnitsIds', 'usersIds'],
      },
      ...(data?.questionsCategories ?? []).map((questionsCategory) => ({
        _id: questionsCategory?._id,
        name: questionsCategory?.name,
        component: <AnswersInsights
          answerType={questionsCategory?.name}
          data-id="8a2241ed78a0"
          questionsCategoriesId={questionsCategory?._id} />,
        usedFilters: ['questionsCategoriesIds', 'businessUnitsIds', 'usersIds', 'locationsIds', 'status', 'createdDate'],
      })),
      {
        _id: 'actions',
        name: 'Actions',
        component: <ActionsInsights data-id="0f46609e0872" />,
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
    (<Flex
      data-id="a7494e38d3ea"
      direction="column"
      h="full"
      isolation="isolate"
      overflowY="hidden"
      zIndex="1">
      <Header
        breadcrumbs={['Insights']}
        data-id="98049fce081b"
        mobileBreadcrumbs={['Insights']}>
        {device === 'mobile' && <FilterButton data-id="c7f77bc3876e" insightsFilter />}
      </Header>
      {device !== 'mobile' && (
        <Flex
          data-id="85393b4b35a0"
          h="max-content"
          pl={['4', '8', '8']}
          position="relative"
          zIndex="2">
          <QuickFilters
            data-id="44bf97753b08"
            w={['full', 'calc(100% - 64px)', 'calc(100% - 64px)']} />
        </Flex>
      )}
      {error ? (
        <Text data-id="764e3fd4c962">{error.message}</Text>
      ) : loading ? (
        <Loader center data-id="6789c961d87a" />
      ) : (
        <Flex
          data-id="4b6a263d2d7d"
          direction="column"
          overflowY="scroll"
          pt="3"
          px={[4, 8]}>
          <Tabs
            data-id="32a08247b0ba"
            defaultIndex={selectedPanel}
            isLazy
            onChange={(index) => setSelectedPanel(index)}
            variant="unstyled"
            w="full">
            <TabList data-id="92b543195c8e">
              {panels?.map((panel) => (
                <Tab
                  _selected={{
                    bg: 'insights.tabBg',
                    color: 'insights.tabColor',
                  }}
                  borderRadius="10px"
                  data-id="9e2d9f42096c"
                  fontSize="smm"
                  fontWeight="bold"
                  key={panel._id}
                  mr={[1, 2]}>
                  {panel.name}
                </Tab>
              ))}
            </TabList>
            <TabPanels data-id="7f4e915b4849">
              {panels?.map((panel) => (
                <TabPanel data-id="eb61e51d7037" key={panel._id} px={0}>
                  {panel.component}
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Flex>
      )}
    </Flex>)
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
    tabBg: '#1E1836',
    tabColor: '#FFFFFF',
    secondaryText: '#787486',
  },
};
