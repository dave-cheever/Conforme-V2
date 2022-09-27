import { useState } from 'react';

import { gql, LazyQueryExecFunction, useQuery } from '@apollo/client';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import { ILocation } from '../../interfaces/ILocation';
import { IUser } from '../../interfaces/IUser';
import InsightsDetailedTable from './InsightsDetailedTable';

const GET_TOTALS = gql`
  query {
    totals {
      users
      locations
      businessUnits
    }
  }
`;

const InsightsDetailedStats = ({
  insightsType = 'audits',
  questionsCategoryName = 'Questions category',
  businessUnits,
  locations,
  users,
  questionsCategoriesId,
  loadMoreLocations,
  loadMoreBusinessUnits,
  loadMoreUsers,
}: {
  insightsType: 'audits' | 'actions' | 'answers';
  questionsCategoryName?: string;
  businessUnits: IBusinessUnit[];
  locations: ILocation[];
  users: IUser[];
  questionsCategoriesId?: string;
  loadMoreLocations: LazyQueryExecFunction<any, any>;
  loadMoreBusinessUnits: LazyQueryExecFunction<any, any>;
  loadMoreUsers: LazyQueryExecFunction<any, any>;
}) => {
  const { data: totals } = useQuery(GET_TOTALS);
  const tabs = {
    audits: [
      {
        id: 'users',
        label: `${capitalize(pluralize(t('audit')))} per person`,
        component: (
          <InsightsDetailedTable
            data={users}
            insightsModel="users"
            insightsType={insightsType}
            loadMoreUsers={loadMoreUsers}
            totals={totals?.totals?.users || 0}
          />
        ),
      },
      {
        id: 'locations',
        label: `${capitalize(pluralize(t('audit')))} per ${t('location')}`,
        component: (
          <InsightsDetailedTable
            data={locations}
            insightsModel="locations"
            insightsType={insightsType}
            loadMoreLocations={loadMoreLocations}
            totals={totals?.totals?.locations || 0}
          />
        ),
      },
      {
        id: 'businessUnits',
        label: `${capitalize(pluralize(t('audit')))} per ${t('business unit')}`,
        component: (
          <InsightsDetailedTable
            data={businessUnits}
            insightsModel="businessUnits"
            insightsType={insightsType}
            loadMoreBusinessUnits={loadMoreBusinessUnits}
            totals={totals?.totals?.businessUnits || 0}
          />
        ),
      },
    ],
    actions: [
      {
        id: 'users',
        label: 'Actions per person',
        component: (
          <InsightsDetailedTable
            data={users}
            insightsModel="users"
            insightsType={insightsType}
            loadMoreUsers={loadMoreUsers}
            totals={totals?.totals?.users || 0}
          />
        ),
      },
      {
        id: 'locations',
        label: `Actions per ${t('location')}`,
        component: (
          <InsightsDetailedTable
            data={locations}
            insightsModel="locations"
            insightsType={insightsType}
            loadMoreBusinessUnits={loadMoreLocations}
            totals={totals?.totals?.locations || 0}
          />
        ),
      },
      {
        id: 'businessUnits',
        label: `Actions per ${t('business unit')}`,
        component: (
          <InsightsDetailedTable
            data={businessUnits}
            insightsModel="businessUnits"
            insightsType={insightsType}
            loadMoreBusinessUnits={loadMoreLocations}
            totals={totals?.totals?.businessUnits || 0}
          />
        ),
      },
    ],
    answers: [
      {
        id: 'users',
        label: `${capitalize(pluralize(questionsCategoryName))} per person`,
        component: (
          <InsightsDetailedTable
            data={users}
            insightsModel="users"
            insightsType={insightsType}
            loadMoreUsers={loadMoreUsers}
            questionsCategoriesId={questionsCategoriesId}
            totals={totals?.totals?.users || 0}
          />
        ),
      },
      {
        id: 'locations',
        label: `${capitalize(pluralize(questionsCategoryName))} per ${t('location')}`,
        component: (
          <InsightsDetailedTable
            data={locations}
            insightsModel="locations"
            insightsType={insightsType}
            loadMoreLocations={loadMoreBusinessUnits}
            questionsCategoriesId={questionsCategoriesId}
            totals={totals?.totals?.locations || 0}
          />
        ),
      },
      {
        id: 'businessUnits',
        label: `${capitalize(pluralize(questionsCategoryName))} per ${t('business unit')}`,
        component: (
          <InsightsDetailedTable
            data={businessUnits}
            insightsModel="businessUnits"
            insightsType={insightsType}
            loadMoreBusinessUnits={loadMoreLocations}
            questionsCategoriesId={questionsCategoriesId}
            totals={totals?.totals?.businessUnits || 0}
          />
        ),
      },
    ],
  };

  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <Box bg="auditsInsights.list.bg" borderRadius="20px" p={7} pb={0} w="full">
      <Tabs defaultIndex={selectedTab} onChange={(index) => setSelectedTab(index)} variant="unstyled" w="full">
        <TabList>
          {tabs[insightsType].map((tab) => (
            <Tab
              _selected={{
                bg: 'insights.tabBg',
                color: 'insights.tabColor',
              }}
              borderRadius="10px"
              fontSize="smm"
              fontWeight="bold"
              key={tab.id}
              mr={[1, 2]}
            >
              {tab.label}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {tabs[insightsType]?.map((tab) => (
            <TabPanel key={tab.id} px={0}>
              {tab.component}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default InsightsDetailedStats;
