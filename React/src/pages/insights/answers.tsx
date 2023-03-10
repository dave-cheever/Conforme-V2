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

const AnswersInsights = ({ answerType, questionsCategoriesId }) => {
  const { filtersValues, setFilters, walkItemFiltersValue, setWalkItemFiltersValue, usedFilters } = useFiltersContext();
  const { data, loading, error, refetch } = useQuery(GET_ANSWERS_INSIGHTS, {
    variables: {
      answersInsightsQueryInput: {
        questionsCategoriesId,
      },
    },
  });

  useEffect(() => {
    if (walkItemFiltersValue && !isEmpty(walkItemFiltersValue) && !isEmpty(filtersValues) && !isEmpty(usedFilters)) {
      // Delay setting filters by 100ms to make sure that other useEffects finished and filters won't be cleared
      const delayFilters = setTimeout(() => {
        setFilters(Object.entries(walkItemFiltersValue).reduce((acc, [key, value]) => ({ ...acc, [key]: value.value }), {}));
        setWalkItemFiltersValue({});
        clearTimeout(delayFilters);
      }, 100);
    }
  }, [filtersValues, usedFilters, setWalkItemFiltersValue, walkItemFiltersValue, setFilters]);

  useEffect(() => {
    // Parse filters to format expected by GraphQL Query
    const parsedFilters: any = Object.entries(filtersValues).reduce((acc, filter) => {
      if (!filter || !filter[1] || !usedFilters.includes(filter[0])) return { ...acc };

      const [key, value] = filter;

      if (
        !value.value ||
        (Array.isArray(value.value) && value.value.length === 0) ||
        (key === 'usersIds' && value.value?.addedByIds?.length === 0)
      )
        return acc;

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
    (<Box data-id="cbbc2f6482f5" pt="3">
      {error ? (
        <Text data-id="5f7805f82787">{error.message}</Text>
      ) : loading ? (
        <Box data-id="0fdb941f0c87" h="100vh">
          <Loader center data-id="96ed58e2afc9" />
        </Box>
      ) : (
        <>
          <Grid alignItems="center" data-id="d4dab0f8e0a1" templateColumns="1fr .25fr">
            <GridItem data-id="2e756da47bdc" w="100%">
              <InsightsChart data-id="8866350f2e3e" option={echartsOption} />
            </GridItem>
            <GridItem data-id="02d7bfdccd8b" w="100%">
              <Flex data-id="b3cd8c2ec805" direction="column" textAlign="left">
                <Text
                  as="span"
                  color="insights.secondaryText"
                  data-id="1f0b59b358bd"
                  fontWeight="bold">
                  Total {answerType.toLowerCase()}
                </Text>
                <Heading color="#1E1836" data-id="31df75a059bb" fontSize="100px">
                  {data?.answersInsights?.totalAnswers}
                </Heading>
              </Flex>
            </GridItem>
          </Grid>
          <InsightsDetailedStats
            businessUnits={businessUnits}
            data-id="3df330b119a3"
            insightsType="answers"
            loadMoreBusinessUnits={getBusinessUnitsData}
            loadMoreLocations={getLocationsData}
            loadMoreUsers={getUsersData}
            locations={locations}
            questionsCategoriesId={questionsCategoriesId}
            questionsCategoryName={answerType}
            users={users} />
        </>
      )}
    </Box>)
  );
};

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
