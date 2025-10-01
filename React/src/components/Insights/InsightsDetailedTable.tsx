import { LazyQueryExecFunction } from '@apollo/client';
import { Box, Button, Flex } from '@chakra-ui/react';

import useSort from '../../hooks/useSort';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import { ILocation } from '../../interfaces/ILocation';
import { IUser } from '../../interfaces/IUser';
import InsightListItem from './InsightListItem';
import InsightsDetailedTableHeader from './InsightsDetailedTableHeader';
import InsightsDetailedTableHeaderElement from './InsightsDetailedTableHeaderElement';

function InsightsDetailedTable({
  insightsType = 'audits',
  insightsModel = 'users',
  questionsCategoriesId,
  data,
  totals = 0,
  loadMoreLocations,
  loadMoreBusinessUnits,
  loadMoreUsers,
}: {
  data: IUser[] | ILocation[] | IBusinessUnit[];
  insightsType?: 'audits' | 'actions' | 'answers';
  insightsModel?: 'users' | 'businessUnits' | 'locations';
  questionsCategoriesId?: string;
  totals?: number;
  loadMoreLocations?: LazyQueryExecFunction<any, any>;
  loadMoreBusinessUnits?: LazyQueryExecFunction<any, any>;
  loadMoreUsers?: LazyQueryExecFunction<any, any>;
}) {
  const { sortedData, sortOrder, sortType, setSortOrder, setSortType } = useSort(
    data ?? [],
    insightsModel === 'users' ? 'displayName' : 'name',
  );
  const tableFieldsPerType = {
    audits: [
      { label: 'Total', color: '#1E1836', field: 'totalAuditsCount' },
      { label: 'Completed', color: '#41B916', field: 'completedAuditsCount' },
      { label: 'Upcoming', color: '#FF9A00', field: 'upcomingAuditsCount' },
      { label: 'Missed', color: '#E93C44', field: 'missedAuditsCount' },
    ],
    actions: [
      { label: 'Total', color: '#1E1836', field: 'totalActionsCount' },
      { label: 'Completed', color: '#41B916', field: 'completedActionsCount' },
      { label: 'Open', color: '#FF9A00', field: 'inProgressActionsCount' },
      { label: 'Missed', color: '#E93C44', field: 'overdueActionsCount' },
    ],
    answers: [
      { label: 'Total', color: '#1E1836', field: 'totalAnswersCount' },
      { label: 'Open', color: '#41B916', field: 'openAnswersCount' },
      { label: 'Resolved', color: '#FF9A00', field: 'resolvedAnswersCount' },
      { label: 'Closed', color: '#E93C44', field: 'closedAnswersCount' },
    ],
  };

  const loadMore = () => {
    switch (insightsModel) {
      case 'users':
        if (loadMoreUsers) {
          loadMoreUsers({
            variables: {
              usersPagination: {
                limit: 5,
                offset: data.length,
              },
              ...(insightsType === 'answers' && {
                usersAnswersCountInput: {
                  questionsCategoriesId,
                },
              }),
            },
          });
        }
        break;
      case 'locations':
        if (loadMoreLocations) {
          loadMoreLocations({
            variables: {
              locationsPagination: {
                limit: 5,
                offset: data.length,
              },
              ...(insightsType === 'answers' && {
                locationsAnswersCountInput: {
                  questionsCategoriesId,
                },
              }),
            },
          });
        }
        break;
      case 'businessUnits':
        if (loadMoreBusinessUnits) {
          loadMoreBusinessUnits({
            variables: {
              businessUnitsPagination: {
                limit: 5,
                offset: data.length,
              },
              ...(insightsType === 'answers' && {
                businessUnitsAnswersCountInput: {
                  questionsCategoriesId,
                },
              }),
            },
          });
        }
        break;
      default:
        if (loadMoreUsers) {
          loadMoreUsers({
            variables: {
              usersPagination: {
                limit: 5,
                offset: data.length,
              },
              ...(insightsType === 'answers' && {
                usersAnswersCountInput: {
                  questionsCategoriesId,
                },
              }),
            },
          });
        }
    }
  };

  return (
    <Box data-id="000498">
      <InsightsDetailedTableHeader data-id="000499">
        <InsightsDetailedTableHeaderElement
          data-id="000500"
          label="Name"
          onClick={() => {
            setSortType(insightsModel === 'users' ? 'displayName' : 'name');
            setSortOrder(sortOrder === 'asc' && sortType === (insightsModel === 'users' ? 'displayName' : 'name') ? 'desc' : 'asc');
          }}
          pl="0"
          showSortingIcon={sortType === (insightsModel === 'users' ? 'displayName' : 'name')}
          sortOrder={sortType === (insightsModel === 'users' ? 'displayName' : 'name') ? sortOrder : undefined} />
        {(tableFieldsPerType[insightsType] ?? []).map((item) => (
          <InsightsDetailedTableHeaderElement
            color={item.color}
            data-id="000501"
            key={item.label}
            label={item.label}
            ml="0.75rem"
            onClick={() => {
              setSortType(item.field);
              setSortOrder(sortOrder === 'asc' && sortType === item.field ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === item.field}
            sortOrder={sortType === item.field ? sortOrder : undefined} />
        ))}
      </InsightsDetailedTableHeader>
      <Flex
        align="center"
        data-id="000502"
        flexDir="column"
        mb={5}
        minH="350px"
        overflowY="auto"
        w="full">
        {sortedData?.map((item, index) => (
          <InsightListItem
            data-id="000503"
            insightsModel={insightsModel}
            insightsType={insightsType}
            item={item}
            key={item._id}
            light={index % 2 === 0} />
        ))}
      </Flex>
      {totals > sortedData.length && (
        <Flex data-id="000504" justify="end" rounded="md">
          <Button
            bg="insightsDetailedTable.loadMore"
            color="white"
            data-id="000505"
            onClick={loadMore}
            size="sm">
            Load more
          </Button>
        </Flex>
      )}
    </Box>
  );
}

export const insightsDetailedTableStyles = {
  insightsDetailedTable: {
    loadMore: '#1E1836',
  },
};

export default InsightsDetailedTable;
