import { useEffect, useMemo, useState } from 'react';

import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { Box, Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/react';
import { EChartsOption, graphic } from 'echarts';

import InsightsChart from '../../components/Insights/InsightsChart';
import InsightsDetailedStats from '../../components/Insights/InsightsDetailedStats';
import Loader from '../../components/Loader';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import { ILocation } from '../../interfaces/ILocation';
import { IUser } from '../../interfaces/IUser';

const GET_ANSWERS_INSIGHTS = gql`
  query ($answersInsightsQuery: AnswersInsightsQuery!) {
    answersInsights(answersInsightsQuery: $answersInsightsQuery) {
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
  const { data, loading, error } = useQuery(GET_ANSWERS_INSIGHTS, {
    variables: {
      answersInsightsQuery: {
        questionsCategoriesId,
      },
    },
  });

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
    <Box pt="3">
      {error ? (
        <Text>{error.message}</Text>
      ) : loading ? (
        <Box h="100vh">
          <Loader center />
        </Box>
      ) : (
        <>
          <Grid alignItems="center" templateColumns="1fr .25fr">
            <GridItem w="100%">
              <InsightsChart option={echartsOption} />
            </GridItem>
            <GridItem w="100%">
              <Flex direction="column" textAlign="left">
                <Text as="span" color="insights.secondaryText" fontWeight="bold">
                  Total {answerType.toLowerCase()}
                </Text>
                <Heading color="#1E1836" fontSize="100px">
                  {data?.answersInsights?.totalAnswers}
                </Heading>
              </Flex>
            </GridItem>
          </Grid>
          <InsightsDetailedStats
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
