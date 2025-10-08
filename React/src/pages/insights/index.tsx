import { useEffect, useMemo, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Flex, Text } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import FilterButton from '../../components/FilterButton';
import FilterPills from '../../components/FilterPills';
import QuickFilters from '../../components/Filters/QuickFilters';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import useDevice from '../../hooks/useDevice';
import ActionsInsights from './actions';
import AnswersInsights from './answers';
import AuditsInsights from './audits';

export const GET_QUESTIONS_CATEGORIES = gql`
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
        component: <AnswersInsights answerType={questionsCategory?.name} data-id="000705" questionsCategoriesId={questionsCategory?._id} />,
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

  // Create pills for FilterPills component
  const insightPills = useMemo(
    () =>
      panels.map((panel) => ({
        _id: panel._id,
        name: panel.name,
      })),
    [panels],
  );

  useEffect(() => {
    setUsedFilters(panels[selectedPanel]?.usedFilters ?? []);

    return () => {
      setShowFiltersPanel(false);
      setUsedFilters([]);
    };
  }, [selectedPanel]);

  return (
    <Flex data-id="000707" direction="column" h="full" isolation="isolate" overflowY="hidden" zIndex="1">
      <Header breadcrumbs={['Insights']} data-id="000708" mobileBreadcrumbs={['Insights']}>
        {device === 'mobile' && <FilterButton data-id="000709" insightsFilter />}
      </Header>
      {device !== 'mobile' && (
        <Flex data-id="000710" h="max-content" pl={['4', '8', '8']} position="relative" zIndex="2">
          <QuickFilters data-id="000711" w={['full', 'calc(100% - 64px)', 'calc(100% - 64px)']} />
        </Flex>
      )}
      {(() => {
        if (error) 
          return <Text data-id="000712">{error.message}</Text>;
        
        if (loading) 
          return <Loader center data-id="000713" />;
        
        return (
          <Flex data-id="000714" direction="column" overflowY="scroll" pt="3" px={[4, 8]}>
            <FilterPills
              data-id="000715"
              onPillChange={setSelectedPanel}
              panelMarginLeft={['0', '0']}
              panelPadding={['0', '0']}
              pills={insightPills}
              selectedIndex={selectedPanel}
              tabListProps={{
                overflowX: 'auto',
                sx: {
                  '::-webkit-scrollbar': {
                    display: 'none',
                  },
                },
                whiteSpace: 'nowrap',
              }}
              tabPanelProps={{
                w: 'full',
                p: 0,
                px: 0,
                ml: 0,
              }}
              tabPanelsProps={{
                w: 'full',
              }}
              tabProps={{
                minW: 'fit-content',
                px: 4,
              }}
              tabsProps={{
                w: 'full',
              }}
            >
              {(pill, index) => {
                const panel = panels[index];
                return panel?.component;
              }}
            </FilterPills>
          </Flex>
        );
      })()}
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
    secondaryText: '#787486',
  },
};
