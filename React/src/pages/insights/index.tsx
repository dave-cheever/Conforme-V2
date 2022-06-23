import { useEffect, useMemo, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Flex, Spacer, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import FilterButton from '../../components/FilterButton';
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

const Insights = () => {
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
      { _id: 'audits', name: capitalize(pluralize(t('audit'))), component: <AuditsInsights /> },
      ...(data?.questionsCategories ?? []).map((questionsCategory) => ({
        _id: questionsCategory._id,
        name: questionsCategory.name,
        component: <AnswersInsights answerType={questionsCategory.name} questionsCategoriesId={questionsCategory._id} />,
      })),
      { _id: 'actions', name: 'Actions', component: <ActionsInsights /> },
    ],
    [data],
  );
  const [selectedPanel, setSelectedPanel] = useState(0);

  useEffect(() => {
    setUsedFilters(['walkType', 'status', 'sitesIds', 'areasIds', 'usersIds']);
    return () => {
      setShowFiltersPanel(false);
      setUsedFilters([]);
    };
  }, []);

  return (
    <>
      <Header breadcrumbs={['Insights']} mobileBreadcrumbs={['Insights']}>
        {device === 'mobile' && <FilterButton insightsFilter />}
      </Header>

      {error ? (
        <Text>{error.message}</Text>
      ) : loading ? (
        <Loader center />
      ) : (
        <Flex direction="column" pt="3" px={[4, 8]}>
          {device === 'tablet' && (
            <Flex mb={[2, 4]}>
              <Spacer />
              <FilterButton insightsFilter />
            </Flex>
          )}
          <Tabs defaultIndex={selectedPanel} isLazy onChange={(index) => setSelectedPanel(index)} variant="unstyled" w="full">
            <TabList>
              {panels?.map((panel) => (
                <Tab
                  _selected={{
                    bg: 'insights.tabBg',
                    color: 'insights.tabColor',
                  }}
                  borderRadius="10px"
                  fontSize="smm"
                  fontWeight="bold"
                  key={panel._id}
                  mr={[1, 2]}
                >
                  {panel.name}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              {panels?.map((panel) => (
                <TabPanel key={panel._id} px={0}>
                  {panel.component}
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Flex>
      )}
    </>
  );
};

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
