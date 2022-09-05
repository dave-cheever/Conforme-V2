import { useMemo } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Box, Flex, Grid, GridItem, Heading, Spacer, Text } from '@chakra-ui/react';
import { EChartsOption, graphic } from 'echarts';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import AdminTableHeader from '../../components/Admin/AdminTableHeader';
import AdminTableHeaderElement from '../../components/Admin/AdminTableHeaderElement';
import InsightListItem from '../../components/Insights/InsightListItem';
import InsightsChart from '../../components/Insights/InsightsChart';
import Loader from '../../components/Loader';
import UserAvatar from '../../components/UserAvatar';
import useSort from '../../hooks/useSort';

const GET_ANSWERS_INSIGHTS = gql`
  query (
    $answersInsightsQuery: AnswersInsightsQuery!
    $locationsAnswersCountInput: LocationsAnswersCountInput
    $businessUnitsAnswersCountInput: BusinessUnitsAnswersCountInput
  ) {
    answersInsights(answersInsightsQuery: $answersInsightsQuery) {
      totalAnswers
      closedAnswers
      resolvedAnswers
      openAnswers
      totalAnswersChart {
        dates
        counts
      }
      mostAddedBy {
        user {
          _id
          displayName
          imgUrl
        }
        answers
      }
    }
    locations(locationsAnswersCountInput: $locationsAnswersCountInput) {
      _id
      name
      totalAnswersCount
      openAnswersCount
      resolvedAnswersCount
      closedAnswersCount
    }
    businessUnits(businessUnitsAnswersCountInput: $businessUnitsAnswersCountInput) {
      _id
      name
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
      locationsAnswersCountInput: {
        questionsCategoriesId,
      },
      businessUnitsAnswersCountInput: {
        questionsCategoriesId,
      },
    },
  });
  const {
    sortedData: locations,
    sortOrder: locationsSortOrder,
    sortType: locationsSortType,
    setSortOrder: setLocationsSortOrder,
    setSortType: setLocationsSortType,
  } = useSort(data?.locations ?? []);
  const {
    sortedData: businessUnits,
    sortOrder: businessUnitsSortOrder,
    sortType: businessUnitsSortType,
    setSortOrder: setBusinessUnitsSortOrder,
    setSortType: setBusinessUnitsSortType,
  } = useSort(data?.businessUnits ?? []);

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
          <Text fontSize="xxl" fontWeight="bold" my={['15px', '25px']}>
            Most added by
          </Text>
          <Grid gap="20px" templateColumns={['1fr', 'repeat(3, 1fr)', 'repeat(4, 1fr)']}>
            {data?.answersInsights?.mostAddedBy?.map((answerCreator) => (
              <GridItem key={answerCreator.user._id} w="100%">
                <Box bg="answersInsights.mostAddedBy.bg" rounded="20px">
                  <Flex align="center" px="20px" py="15px">
                    <Flex align="center">
                      <UserAvatar size="xs" userId={answerCreator.user._id} />
                      <Text
                        ml="10px"
                        overflowX="hidden"
                        textOverflow="ellipsis"
                        title={answerCreator.user.displayName}
                        w={['100px', '100px', 'full']}
                        whiteSpace="nowrap"
                      >
                        {answerCreator.user.displayName}
                      </Text>
                    </Flex>
                    <Spacer />
                    <Text fontWeight="bold">{answerCreator.actions}</Text>
                  </Flex>
                </Box>
              </GridItem>
            ))}
          </Grid>
          <Grid alignItems="stretch" gap="20px" my={['15px', '25px']} templateColumns={['1fr', 'repeat(2, 1fr)']}>
            <GridItem h="100%" w="100%">
              <Box bg="answersInsights.list.bg" borderRadius="20px" pb={7} w="full">
                <AdminTableHeader title={`${answerType} per location`}>
                  <AdminTableHeaderElement
                    label={capitalize(t('location'))}
                    onClick={() => {
                      setLocationsSortType('name');
                      setLocationsSortOrder(locationsSortOrder === 'asc' && locationsSortType === 'name' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={locationsSortType === 'name'}
                    sortOrder={locationsSortType === 'name' ? locationsSortOrder : undefined}
                    w="60%"
                  />
                  <AdminTableHeaderElement
                    label="T"
                    onClick={() => {
                      setLocationsSortType('totalAnswersCount');
                      setLocationsSortOrder(locationsSortOrder === 'asc' && locationsSortType === 'totalAnswersCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={locationsSortType === 'totalAnswersCount'}
                    sortOrder={locationsSortType === 'totalAnswersCount' ? locationsSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="O"
                    onClick={() => {
                      setLocationsSortType('openAnswersCount');
                      setLocationsSortOrder(locationsSortOrder === 'asc' && locationsSortType === 'openAnswersCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={locationsSortType === 'openAnswersCount'}
                    sortOrder={locationsSortType === 'openAnswersCount' ? locationsSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="R"
                    onClick={() => {
                      setLocationsSortType('resolvedAnswersCount');
                      setLocationsSortOrder(locationsSortOrder === 'asc' && locationsSortType === 'resolvedAnswersCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={locationsSortType === 'resolvedAnswersCount'}
                    sortOrder={locationsSortType === 'resolvedAnswersCount' ? locationsSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="C"
                    onClick={() => {
                      setLocationsSortType('closedAnswersCount');
                      setLocationsSortOrder(locationsSortOrder === 'asc' && locationsSortType === 'closedAnswersCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={locationsSortType === 'closedAnswersCount'}
                    sortOrder={locationsSortType === 'closedAnswersCount' ? locationsSortOrder : undefined}
                    w="10%"
                  />
                </AdminTableHeader>
                <Flex flexDir="column" maxH="300px" overflowY="auto" w="full">
                  {locations?.map((location) => (
                    <InsightListItem
                      item={location}
                      key={location._id}
                      navigation="/admin/locations"
                      questionsCategoriesId={questionsCategoriesId}
                      type="answers"
                    />
                  ))}
                </Flex>
              </Box>
            </GridItem>
            <GridItem h="100%" w="100%">
              <Box bg="answersInsights.list.bg" borderRadius="20px" pb={7} w="full">
                <AdminTableHeader title={`${answerType} per businessUnit`}>
                  <AdminTableHeaderElement
                    label={capitalize(t('business unit'))}
                    onClick={() => {
                      setBusinessUnitsSortType('name');
                      setBusinessUnitsSortOrder(businessUnitsSortOrder === 'asc' && businessUnitsSortType === 'name' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={businessUnitsSortType === 'name'}
                    sortOrder={businessUnitsSortType === 'name' ? businessUnitsSortOrder : undefined}
                    w="60%"
                  />
                  <AdminTableHeaderElement
                    label="T"
                    onClick={() => {
                      setBusinessUnitsSortType('totalAnswersCount');
                      setBusinessUnitsSortOrder(
                        businessUnitsSortOrder === 'asc' && businessUnitsSortType === 'totalAnswersCount' ? 'desc' : 'asc',
                      );
                    }}
                    showSortingIcon={businessUnitsSortType === 'totalAnswersCount'}
                    sortOrder={businessUnitsSortType === 'totalAnswersCount' ? businessUnitsSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="O"
                    onClick={() => {
                      setBusinessUnitsSortType('openAnswersCount');
                      setBusinessUnitsSortOrder(
                        businessUnitsSortOrder === 'asc' && businessUnitsSortType === 'openAnswersCount' ? 'desc' : 'asc',
                      );
                    }}
                    showSortingIcon={businessUnitsSortType === 'openAnswersCount'}
                    sortOrder={businessUnitsSortType === 'openAnswersCount' ? businessUnitsSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="R"
                    onClick={() => {
                      setBusinessUnitsSortType('resolvedAnswersCount');
                      setBusinessUnitsSortOrder(
                        businessUnitsSortOrder === 'asc' && businessUnitsSortType === 'resolvedAnswersCount' ? 'desc' : 'asc',
                      );
                    }}
                    showSortingIcon={businessUnitsSortType === 'resolvedAnswersCount'}
                    sortOrder={businessUnitsSortType === 'resolvedAnswersCount' ? businessUnitsSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="C"
                    onClick={() => {
                      setBusinessUnitsSortType('closedAnswersCount');
                      setBusinessUnitsSortOrder(
                        businessUnitsSortOrder === 'asc' && businessUnitsSortType === 'closedAnswersCount' ? 'desc' : 'asc',
                      );
                    }}
                    showSortingIcon={businessUnitsSortType === 'closedAnswersCount'}
                    sortOrder={businessUnitsSortType === 'closedAnswersCount' ? businessUnitsSortOrder : undefined}
                    w="10%"
                  />
                </AdminTableHeader>
                <Flex flexDir="column" maxH="300px" overflowY="auto" w="full">
                  {businessUnits?.map((businessUnit) => (
                    <InsightListItem item={businessUnit} key={businessUnit._id} navigation="/admin/businessUnits" type="answers" />
                  ))}
                </Flex>
              </Box>
            </GridItem>
          </Grid>
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
