import { useEffect, useMemo, useState } from 'react';

import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { Box, Flex, Text } from '@chakra-ui/react';
import { EChartsOption, graphic } from 'echarts';
import { isEmpty } from 'lodash';

import { actionsInsightsTypes } from '../../bootstrap/config';
import InsightsCard from '../../components/Insights/InsightsCard';
import InsightsChart from '../../components/Insights/InsightsChart';
import InsightsDetailedStats from '../../components/Insights/InsightsDetailedStats';
import Loader from '../../components/Loader';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import { ILocation } from '../../interfaces/ILocation';
import { IUser } from '../../interfaces/IUser';

const GET_ACTIONS_INSIGHTS = gql`
  query ($actionsInsightsQueryInput: ActionsInsightsQueryInput) {
    actionsInsights(actionsInsightsQueryInput: $actionsInsightsQueryInput) {
      totalActions
      completedActions
      inProgressActions
      overdueActions
      totalActionsChart {
        dates
        counts
      }
      completedActionsChart {
        dates
        counts
      }
      inProgressActionsChart {
        dates
        counts
      }
      overdueActionsChart {
        dates
        counts
      }
    }
  }
`;

const GET_LOCATIONS_ACTIONS_INSIGHTS = gql`
  query ($locationsPagination: LocationsPaginationInput) {
    locations(locationsPagination: $locationsPagination) {
      _id
      name
      totalActionsCount
      completedActionsCount
      inProgressActionsCount
      overdueActionsCount
    }
  }
`;

const GET_BUSINESS_UNITS_ACTIONS_INSIGHTS = gql`
  query ($businessUnitsPagination: BusinessUnitsPaginationInput) {
    businessUnits(businessUnitsPagination: $businessUnitsPagination) {
      _id
      name
      totalActionsCount
      completedActionsCount
      inProgressActionsCount
      overdueActionsCount
    }
  }
`;

const GET_USERS_ACTIONS_INSIGHTS = gql`
  query ($usersPagination: UsersPaginationInput) {
    users(usersPagination: $usersPagination) {
      _id
      displayName
      imgUrl
      totalActionsCount
      completedActionsCount
      inProgressActionsCount
      overdueActionsCount
    }
  }
`;

const ActionsInsights = () => {
  const { filtersValues, setFilters, actionFiltersValue, setActionFiltersValue, usedFilters } = useFiltersContext();
  const { data, loading, error, refetch } = useQuery(GET_ACTIONS_INSIGHTS);

  // Set pre-defined filters
  useEffect(() => {
    if (actionFiltersValue && !isEmpty(actionFiltersValue) && !isEmpty(filtersValues) && !isEmpty(usedFilters)) {
      // Delay setting filters by 100ms to make sure that other useEffects finished and filters won't be cleared
      const delayFilters = setTimeout(() => {
        setFilters(Object.entries(actionFiltersValue).reduce((acc, [key, value]) => ({ ...acc, [key]: value.value }), {}));
        setActionFiltersValue({});
        clearTimeout(delayFilters);
      }, 100);
    }
  }, [filtersValues, usedFilters, setActionFiltersValue, actionFiltersValue, setFilters]);

  useEffect(() => {
    // Parse filters to format expected by GraphQL Query
    const parsedFilters = Object.entries(filtersValues).reduce((acc, filter) => {
      if (!filter || !filter[1] || !usedFilters.includes(filter[0])) return { ...acc };

      const [key, value] = filter;
      if (
        !value.value ||
        (Array.isArray(value.value) && value.value.length === 0) ||
        (key === 'usersIds' && value.value?.assigneesIds?.length === 0)
      )
        return acc;

      return {
        ...acc,
        [key]: value.value,
      };
    }, {});

    if (parsedFilters) {
      refetch({
        actionsInsightsQueryInput: {
          ...parsedFilters,
          scope: {
            type: 'answer',
          },
        },
      });
    }
  }, [filtersValues]);

  const [getLocationsData, { data: locationsData }] = useLazyQuery(GET_LOCATIONS_ACTIONS_INSIGHTS, {
    variables: {
      locationsPagination: {
        limit: 5,
        offset: 0,
      },
    },
  });
  const [locations, setLocations] = useState<ILocation[]>([]);
  useEffect(() => setLocations((locations) => [...locations, ...(locationsData?.locations || [])]), [JSON.stringify(locationsData)]);

  const [getBusinessUnitsData, { data: businessUnitsData }] = useLazyQuery(GET_BUSINESS_UNITS_ACTIONS_INSIGHTS, {
    variables: {
      businessUnitsPagination: {
        limit: 5,
        offset: 0,
      },
    },
  });
  const [businessUnits, setBusinessUnits] = useState<IBusinessUnit[]>([]);
  useEffect(
    () => setBusinessUnits((businessUnits) => [...businessUnits, ...(businessUnitsData?.businessUnits || [])]),
    [JSON.stringify(businessUnitsData)],
  );

  const [getUsersData, { data: usersData }] = useLazyQuery(GET_USERS_ACTIONS_INSIGHTS, {
    variables: {
      usersPagination: {
        limit: 5,
        offset: 0,
      },
    },
  });
  const [users, setUsers] = useState<IUser[]>([]);
  useEffect(() => setUsers((users) => [...users, ...(usersData?.users || [])]), [JSON.stringify(usersData)]);

  const [selectedActionsStatsCount, setSelectedActionsStatsCount] = useState('total');
  const actionsStatsCounts = useMemo(
    () => [
      {
        status: 'total',
        actions: data?.actionsInsights?.totalActions,
        chart: data?.actionsInsights?.totalActionsChart,
        color: '#1E1836',
      },
      {
        status: 'completed',
        actions: data?.actionsInsights?.completedActions,
        chart: data?.actionsInsights?.completedActionsChart,
        color: '#41B916',
      },
      {
        status: 'inProgress',
        actions: data?.actionsInsights?.inProgressActions,
        chart: data?.actionsInsights?.inProgressActionsChart,
        color: '#FF9A00',
      },
      {
        status: 'overdue',
        actions: data?.actionsInsights?.overdueActions,
        chart: data?.actionsInsights?.overdueActionsChart,
        color: '#E93C44',
      },
    ],
    [data],
  );

  useEffect(() => {
    getLocationsData();
    getBusinessUnitsData();
    getUsersData();
  }, []);

  const echartsOption = useMemo(
    () => ({
      grid: {
        top: 50,
        left: 45,
      },
      tooltip: {
        trigger: 'axis',
        position: (pt) => [pt[0], '10%'],
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: actionsStatsCounts.find((filter) => filter.status === selectedActionsStatsCount)?.chart?.dates,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: actionsStatsCounts.find((filter) => filter.status === selectedActionsStatsCount)?.chart?.counts,
          smooth: true,
          symbol: 'circle',
          type: 'line',
          itemStyle: {
            color: actionsStatsCounts.find((filter) => filter.status === selectedActionsStatsCount)?.color as string,
          },
          businessUnitStyle: {
            color: new graphic.LinearGradient(1, 0, 1, 1, [
              {
                offset: 0,
                color: 'rgba(255, 255, 255, 1)',
              },
              {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)',
              },
            ]),
          },
        },
      ],
    }),
    [data, selectedActionsStatsCount],
  ) as EChartsOption;

  return (
    <Box pt="3">
      {error ? (
        <Text>{error.message}</Text>
      ) : loading ? (
        <Box h="100vh">
          <Loader center />
        </Box>
      ) : (
        <>
          <Flex
            sx={{
              '@media (max-width: 768px)': {
                overflowX: 'scroll',
                '::-webkit-scrollbar': { display: 'none' },
              },
            }}
          >
            {actionsStatsCounts.map((filter) => (
              <InsightsCard
                count={filter.actions}
                key={filter.status}
                onSelect={setSelectedActionsStatsCount}
                selected={selectedActionsStatsCount === filter.status}
                status={filter.status}
                type="actions"
              />
            ))}
          </Flex>
          <Text
            color={actionsStatsCounts.find((filter) => filter.status === selectedActionsStatsCount)?.color}
            fontSize="xxl"
            fontWeight="bold"
            my={['15px', '25px']}
          >
            {actionsInsightsTypes[selectedActionsStatsCount]}{' '}
            <Text as="span" color="insights.secondaryText">
              actions
            </Text>
          </Text>
          <InsightsChart option={echartsOption} />
          <InsightsDetailedStats
            businessUnits={businessUnits}
            insightsType="actions"
            loadMoreBusinessUnits={getBusinessUnitsData}
            loadMoreLocations={getLocationsData}
            loadMoreUsers={getUsersData}
            locations={locations}
            users={users}
          />
        </>
      )}
    </Box>
  );
};

export default ActionsInsights;

export const actionsInsightsStyles = {
  actionsInsights: {
    mostAddedBy: {
      bg: 'white',
    },
    list: {
      bg: 'white',
      headerBorderColor: '#F0F0F0',
    },
  },
};
