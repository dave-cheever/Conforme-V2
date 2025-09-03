import { useEffect, useMemo, useState } from 'react';

import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { Box, Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/react';
import { EChartsOption, graphic } from 'echarts';
import { isEmpty } from 'lodash';

import InsightsChart from '../../components/Insights/InsightsChart';
import InsightsDetailedStats from '../../components/Insights/InsightsDetailedStats';
import Loader from '../../components/Loader';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import { ILocation } from '../../interfaces/ILocation';
import { IUser } from '../../interfaces/IUser';

const GET_ANSWERS_INSIGHTS = gql`
  query ($answersInsightsQueryInput: AnswersInsightsQueryInput!) {
    answersInsights(answersInsightsQueryInput: $answersInsightsQueryInput) {
      totalAnswers
      closedAnswers
      resolvedAnswers
      openAnswers
      totalAnswersChart {
        dates
        counts
      }
    }
  }
`;

const GET_LOCATIONS_ANSWERS_INSIGHTS = gql`
  query ($locationsAnswersCountInput: LocationsAnswersCountInput, $locationsPagination: LocationsPaginationInput) {
    locations(locationsAnswersCountInput: $locationsAnswersCountInput, locationsPagination: $locationsPagination) {
      _id
      name
      totalAnswersCount
      openAnswersCount
      resolvedAnswersCount
      closedAnswersCount
    }
  }
`;

const GET_BUSINESS_UNITS_ANSWERS_INSIGHTS = gql`
  query ($businessUnitsAnswersCountInput: BusinessUnitsAnswersCountInput, $businessUnitsPagination: BusinessUnitsPaginationInput) {
    businessUnits(businessUnitsAnswersCountInput: $businessUnitsAnswersCountInput, businessUnitsPagination: $businessUnitsPagination) {
      _id
      name
      totalAnswersCount
      openAnswersCount
      resolvedAnswersCount
      closedAnswersCount
    }
  }
`;

const GET_USERS_ANSWERS_INSIGHTS = gql`
  query ($usersAnswersCountInput: UsersAnswersCountInput, $usersPagination: UsersPaginationInput) {
    users(usersAnswersCountInput: $usersAnswersCountInput, usersPagination: $usersPagination) {
      _id
      displayName
      imgUrl
      totalAnswersCount
      openAnswersCount
      resolvedAnswersCount
      closedAnswersCount
    }
  }
`;

function AnswersInsights({ answerType, questionsCategoriesId }) {
  const { filtersValues, setFilters, answerFiltersValue, setAnswerFiltersValue, usedFilters } = useFiltersContext();
  const { data, loading, error, refetch } = useQuery(GET_ANSWERS_INSIGHTS, {
    variables: {
      answersInsightsQueryInput: {
        questionsCategoriesId,
      },
    },
  });

  useEffect(() => {
    if (answerFiltersValue && !isEmpty(answerFiltersValue) && !isEmpty(filtersValues) && !isEmpty(usedFilters)) {
      // Delay setting filters by 100ms to make sure that other useEffects finished and filters won't be cleared
      const delayFilters = setTimeout(() => {
        setFilters(Object.entries(answerFiltersValue).reduce((acc, [key, value]) => ({ ...acc, [key]: value.value }), {}));
        setAnswerFiltersValue({});
        clearTimeout(delayFilters);
      }, 100);
    }
  }, [filtersValues, usedFilters, setAnswerFiltersValue, answerFiltersValue, setFilters]);

  useEffect(() => {
    // Parse filters to format expected by GraphQL Query
    const parsedFilters: any = Object.entries(filtersValues).reduce((acc, filter) => {
      if (!filter || !filter[1] || !usedFilters.includes(filter[0])) return { ...acc };

      const [key, value] = filter;

      if (key === 'usersIds') {
        const userFilter = value.value;
        if (!userFilter) return acc;

        // If auditorsIds or participantsIds are provided, we need to transform them
        let addedByIds = userFilter.addedByIds || [];

        // If auditorsIds or participantsIds are provided, use them as addedByIds
        if (userFilter.auditorsIds && userFilter.auditorsIds.length > 0) 
          addedByIds = [...addedByIds, ...userFilter.auditorsIds];
        
        if (userFilter.participantsIds && userFilter.participantsIds.length > 0) 
          addedByIds = [...addedByIds, ...userFilter.participantsIds];

        // Remove duplicates
        addedByIds = [...new Set(addedByIds)];

        if (addedByIds.length === 0) return acc;

        return {
          ...acc,
          [key]: { addedByIds },
        };
      }

      if (!value.value || (Array.isArray(value.value) && value.value.length === 0)) return acc;

      return {
        ...acc,
        [key]: value?.value,
      };
    }, {});

    if (parsedFilters) {
      refetch({
        answersInsightsQueryInput: {
          ...parsedFilters,
          questionsCategoriesId,
        },
      });
    }
  }, [filtersValues]);

  const [getLocationsData, { data: locationsData }] = useLazyQuery(GET_LOCATIONS_ANSWERS_INSIGHTS, {
    variables: {
      locationsPagination: {
        limit: 5,
        offset: 0,
      },
      locationsAnswersCountInput: {
        questionsCategoriesId,
      },
    },
  });
  const [locations, setLocations] = useState<ILocation[]>([]);
  useEffect(() => setLocations((locations) => [...locations, ...(locationsData?.locations || [])]), [JSON.stringify(locationsData)]);

  const [getBusinessUnitsData, { data: businessUnitsData }] = useLazyQuery(GET_BUSINESS_UNITS_ANSWERS_INSIGHTS, {
    variables: {
      businessUnitsPagination: {
        limit: 5,
        offset: 0,
      },
      businessUnitsAnswersCountInput: {
        questionsCategoriesId,
      },
    },
  });
  const [businessUnits, setBusinessUnits] = useState<IBusinessUnit[]>([]);
  useEffect(
    () => setBusinessUnits((businessUnits) => [...businessUnits, ...(businessUnitsData?.businessUnits || [])]),
    [JSON.stringify(businessUnitsData)],
  );

  const [getUsersData, { data: usersData }] = useLazyQuery(GET_USERS_ANSWERS_INSIGHTS, {
    variables: {
      usersPagination: {
        limit: 5,
        offset: 0,
      },
      usersAnswersCountInput: {
        questionsCategoriesId,
      },
    },
  });
  const [users, setUsers] = useState<IUser[]>([]);
  useEffect(() => setUsers((users) => [...users, ...(usersData?.users || [])]), [JSON.stringify(usersData)]);

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
        data: data?.answersInsights?.totalAnswersChart?.dates,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: data?.answersInsights?.totalAnswersChart?.counts,
          smooth: true,
          symbol: 'circle',
          type: 'line',
          itemStyle: {
            color: '#1E1836',
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
    [data],
  ) as EChartsOption;

  return (
    <Box data-id="030925-b88e74" pt="3">
      {error ? (
        <Text data-id="030925-1908f9">{error.message}</Text>
      ) : loading ? (
        <Box data-id="030925-7381b1" h="100vh">
          <Loader data-id="030925-8a8895" center />
        </Box>
      ) : (
        <>
          <Grid data-id="030925-7119ec" alignItems="center" templateColumns="1fr .25fr">
            <GridItem data-id="030925-27371a" w="100%">
              <InsightsChart data-id="030925-77c7d7" option={echartsOption} />
            </GridItem>
            <GridItem data-id="030925-9852c3" w="100%">
              <Flex data-id="030925-e83d57" direction="column" textAlign="left">
                <Text data-id="030925-998733" as="span" color="insights.secondaryText" fontWeight="bold">
                  Total {answerType.toLowerCase()}
                </Text>
                <Heading data-id="030925-76ddae" color="#1E1836" fontSize="100px">
                  {data?.answersInsights?.totalAnswers}
                </Heading>
              </Flex>
            </GridItem>
          </Grid>
          <InsightsDetailedStats
            data-id="030925-af1dcf"
            businessUnits={businessUnits}
            insightsType="answers"
            loadMoreBusinessUnits={getBusinessUnitsData}
            loadMoreLocations={getLocationsData}
            loadMoreUsers={getUsersData}
            locations={locations}
            questionsCategoriesId={questionsCategoriesId}
            questionsCategoryName={answerType}
            users={users}
          />
        </>
      )}
    </Box>
  );
}

export default AnswersInsights;

export const answersInsightsStyles = {
  answersInsights: {
    mostAddedBy: {
      bg: 'white',
    },
    list: {
      bg: 'white',
      headerBorderColor: '#F0F0F0',
    },
  },
};
