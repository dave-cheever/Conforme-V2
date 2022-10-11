import { useEffect, useMemo, useState } from 'react';

import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { Box, Flex, Text } from '@chakra-ui/react';
import { EChartsOption, graphic } from 'echarts';
import { t } from 'i18next';
import { isEmpty } from 'lodash';
import pluralize from 'pluralize';

import { auditsInsightsTypes } from '../../bootstrap/config';
import InsightsCard from '../../components/Insights/InsightsCard';
import InsightsChart from '../../components/Insights/InsightsChart';
import InsightsDetailedStats from '../../components/Insights/InsightsDetailedStats';
import Loader from '../../components/Loader';
import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import { ILocation } from '../../interfaces/ILocation';
import { IUser } from '../../interfaces/IUser';

const GET_AUDITS_INSIGHTS = gql`
  query ($auditsInsightsQueryInput: AuditsInsightsQueryInput) {
    auditsInsights(auditsInsightsQueryInput: $auditsInsightsQueryInput) {
      totalAudits
      completedAudits
      upcomingAudits
      missedAudits
      totalAuditsChart {
        dates
        counts
      }
      completedAuditsChart {
        dates
        counts
      }
      upcomingAuditsChart {
        dates
        counts
      }
      missedAuditsChart {
        dates
        counts
      }
    }
  }
`;

const GET_LOCATIONS_AUDITS_INSIGHTS = gql`
  query ($locationsPagination: LocationsPaginationInput) {
    locations(locationsPagination: $locationsPagination) {
      _id
      name
      totalAuditsCount
      completedAuditsCount
      upcomingAuditsCount
      missedAuditsCount
    }
  }
`;

const GET_BUSINESS_UNITS_AUDITS_INSIGHTS = gql`
  query ($businessUnitsPagination: BusinessUnitsPaginationInput) {
    businessUnits(businessUnitsPagination: $businessUnitsPagination) {
      _id
      name
      totalAuditsCount
      completedAuditsCount
      upcomingAuditsCount
      missedAuditsCount
    }
  }
`;

const GET_USERS_AUDITS_INSIGHTS = gql`
  query ($usersPagination: UsersPaginationInput) {
    users(usersPagination: $usersPagination) {
      _id
      displayName
      imgUrl
      totalAuditsCount
      completedAuditsCount
      upcomingAuditsCount
      missedAuditsCount
    }
  }
`;

const AuditsInsights = () => {
  const { filtersValues, setFilters, setDefaultFilters, auditFiltersValue, setAuditFiltersValue, usedFilters } = useFiltersContext();
  const { module } = useAppContext();
  const { data, loading, error, refetch } = useQuery(GET_AUDITS_INSIGHTS);

  useEffect(() => {
    if (auditFiltersValue && !isEmpty(auditFiltersValue) && !isEmpty(filtersValues) && !isEmpty(usedFilters)) {
      // Delay setting filters by 100ms to make sure that other useEffects finished and filters won't be cleared
      const delayFilters = setTimeout(() => {
        setFilters(Object.entries(auditFiltersValue).reduce((acc, [key, value]) => ({ ...acc, [key]: value.value }), {}));
        setAuditFiltersValue({});
        clearTimeout(delayFilters);
      }, 100);
    }
  }, [filtersValues, usedFilters, setAuditFiltersValue, auditFiltersValue, setFilters]);

  // Set default filters
  useEffect(() => {
    if (!isEmpty(module?.defaultFilters?.audits)) {
      /**
       * Convert filters from
       *
       * {
       *  filterName: ["filterValue"]
       * }
       *
       * to
       *
       * {
       *  filterName: {
       *    value: ["filterValue"]
       *  }
       * }
       */
      const defaultFilters = Object.entries(module!.defaultFilters.audits!).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: {
            value,
          },
        }),
        {},
      );
      setDefaultFilters(Object.entries(module!.defaultFilters.audits!).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}));
      setAuditFiltersValue((curr) => ({ ...curr, ...defaultFilters }));
    }
  }, []);

  useEffect(() => {
    // Parse filters to format expected by GraphQL Query
    const parsedFilters = Object.entries(filtersValues).reduce((acc, filter) => {
      if (!filter || !filter[1] || !usedFilters.includes(filter[0])) return { ...acc };

      const [key, value] = filter;

      if (
        !value.value ||
        (Array.isArray(value.value) && value.value.length === 0) ||
        (key === 'usersIds' && value.value?.auditorsIds?.length === 0 && value.value?.participantsIds?.length === 0)
      )
        return acc;

      return {
        ...acc,
        [key]: value?.value,
      };
    }, {});

    if (parsedFilters) refetch({ auditsInsightsQueryInput: parsedFilters });
  }, [filtersValues]);

  const [getLocationsData, { data: locationsData }] = useLazyQuery(GET_LOCATIONS_AUDITS_INSIGHTS, {
    variables: {
      locationsPagination: {
        limit: 5,
        offset: 0,
      },
    },
  });
  const [locations, setLocations] = useState<ILocation[]>([]);
  useEffect(() => setLocations((locations) => [...locations, ...(locationsData?.locations || [])]), [JSON.stringify(locationsData)]);

  const [getBusinessUnitsData, { data: businessUnitsData }] = useLazyQuery(GET_BUSINESS_UNITS_AUDITS_INSIGHTS, {
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

  const [getUsersData, { data: usersData }] = useLazyQuery(GET_USERS_AUDITS_INSIGHTS, {
    variables: {
      usersPagination: {
        limit: 5,
        offset: 0,
      },
    },
  });
  const [users, setUsers] = useState<IUser[]>([]);
  useEffect(() => setUsers((users) => [...users, ...(usersData?.users || [])]), [JSON.stringify(usersData)]);

  const [selectedAuditsStatsCount, setSelectedAuditsStatsCount] = useState('total');
  const auditsStatsCounts = useMemo(
    () => [
      {
        status: 'total',
        audits: data?.auditsInsights?.totalAudits,
        chart: data?.auditsInsights?.totalAuditsChart,
        color: '#1E1836',
      },
      {
        status: 'completed',
        audits: data?.auditsInsights?.completedAudits,
        chart: data?.auditsInsights?.completedAuditsChart,
        color: '#41B916',
      },
      {
        status: 'upcoming',
        audits: data?.auditsInsights?.upcomingAudits,
        chart: data?.auditsInsights?.upcomingAuditsChart,
        color: '#FF9A00',
      },
      {
        status: 'missed',
        audits: data?.auditsInsights?.missedAudits,
        chart: data?.auditsInsights?.missedAuditsChart,
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
        data: auditsStatsCounts.find((filter) => filter.status === selectedAuditsStatsCount)?.chart?.dates,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: auditsStatsCounts.find((filter) => filter.status === selectedAuditsStatsCount)?.chart?.counts,
          smooth: true,
          symbol: 'circle',
          type: 'line',
          itemStyle: {
            color: auditsStatsCounts.find((filter) => filter.status === selectedAuditsStatsCount)?.color as string,
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
    [data, selectedAuditsStatsCount],
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
            {auditsStatsCounts.map((filter) => (
              <InsightsCard
                count={filter.audits}
                key={filter.status}
                onSelect={setSelectedAuditsStatsCount}
                selected={selectedAuditsStatsCount === filter.status}
                status={filter.status}
              />
            ))}
          </Flex>
          <Text
            color={auditsStatsCounts.find((filter) => filter.status === selectedAuditsStatsCount)?.color}
            fontSize="xxl"
            fontWeight="bold"
            my={['15px', '25px']}
          >
            {auditsInsightsTypes[selectedAuditsStatsCount]}{' '}
            <Text as="span" color="insights.secondaryText">
              {pluralize(t('audit'))}
            </Text>
          </Text>
          <InsightsChart option={echartsOption} />
          <InsightsDetailedStats
            businessUnits={businessUnits}
            insightsType="audits"
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

export default AuditsInsights;

export const auditsInsightsStyles = {
  auditsInsights: {
    types: {
      total: '#1E1836',
      completed: '#41B916',
      upcoming: '#FF9A00',
      missed: '#E93C44',
    },
    insightsCard: {
      color: 'white',
    },
    auditors: {
      bg: 'white',
    },
    list: {
      bg: 'white',
      headerBorderColor: '#F0F0F0',
    },
  },
};
