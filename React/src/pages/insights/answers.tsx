import { useMemo } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Box, Flex, Grid, GridItem, Heading, Spacer, Text } from '@chakra-ui/react';
import { EChartsOption, graphic } from 'echarts';

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
    sortedData: sites,
    sortOrder: sitesSortOrder,
    sortType: sitesSortType,
    setSortOrder: setSitesSortOrder,
    setSortType: setSitesSortType,
  } = useSort(data?.locations ?? []);
  const {
    sortedData: areas,
    sortOrder: areasSortOrder,
    sortType: areasSortType,
    setSortOrder: setAreasSortOrder,
    setSortType: setAreasSortType,
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
          areaStyle: {
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
              <Box bg="answersInsights.list.bg" borderRadius="20px" h="100%" pb={7} w="full">
                <AdminTableHeader title={`${answerType} per site`}>
                  <AdminTableHeaderElement
                    label="Site"
                    onClick={() => {
                      setSitesSortType('name');
                      setSitesSortOrder(sitesSortOrder === 'asc' && sitesSortType === 'name' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={sitesSortType === 'name'}
                    sortOrder={sitesSortType === 'name' ? sitesSortOrder : undefined}
                    w="60%"
                  />
                  <AdminTableHeaderElement
                    label="T"
                    onClick={() => {
                      setSitesSortType('totalAnswersCount');
                      setSitesSortOrder(sitesSortOrder === 'asc' && sitesSortType === 'totalAnswersCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={sitesSortType === 'totalAnswersCount'}
                    sortOrder={sitesSortType === 'totalAnswersCount' ? sitesSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="O"
                    onClick={() => {
                      setSitesSortType('openAnswersCount');
                      setSitesSortOrder(sitesSortOrder === 'asc' && sitesSortType === 'openAnswersCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={sitesSortType === 'openAnswersCount'}
                    sortOrder={sitesSortType === 'openAnswersCount' ? sitesSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="R"
                    onClick={() => {
                      setSitesSortType('resolvedAnswersCount');
                      setSitesSortOrder(sitesSortOrder === 'asc' && sitesSortType === 'resolvedAnswersCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={sitesSortType === 'resolvedAnswersCount'}
                    sortOrder={sitesSortType === 'resolvedAnswersCount' ? sitesSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="C"
                    onClick={() => {
                      setSitesSortType('closedAnswersCount');
                      setSitesSortOrder(sitesSortOrder === 'asc' && sitesSortType === 'closedAnswersCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={sitesSortType === 'closedAnswersCount'}
                    sortOrder={sitesSortType === 'closedAnswersCount' ? sitesSortOrder : undefined}
                    w="10%"
                  />
                </AdminTableHeader>
                <Flex flexDir="column" maxH="300px" overflowY="auto" w="full">
                  {sites?.map((site) => (
                    <InsightListItem item={site} key={site._id} navigation='/admin/sites' type="answers" />
                  ))}
                </Flex>
              </Box>
            </GridItem>
            <GridItem h="100%" w="100%">
              <Box bg="answersInsights.list.bg" borderRadius="20px" h="100%" pb={7} w="full">
                <AdminTableHeader title={`${answerType} per area`}>
                  <AdminTableHeaderElement
                    label="Area"
                    onClick={() => {
                      setAreasSortType('name');
                      setAreasSortOrder(areasSortOrder === 'asc' && areasSortType === 'name' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={areasSortType === 'name'}
                    sortOrder={areasSortType === 'name' ? areasSortOrder : undefined}
                    w="60%"
                  />
                  <AdminTableHeaderElement
                    label="T"
                    onClick={() => {
                      setAreasSortType('totalAnswersCount');
                      setAreasSortOrder(areasSortOrder === 'asc' && areasSortType === 'totalAnswersCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={areasSortType === 'totalAnswersCount'}
                    sortOrder={areasSortType === 'totalAnswersCount' ? areasSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="O"
                    onClick={() => {
                      setAreasSortType('openAnswersCount');
                      setAreasSortOrder(areasSortOrder === 'asc' && areasSortType === 'openAnswersCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={areasSortType === 'openAnswersCount'}
                    sortOrder={areasSortType === 'openAnswersCount' ? areasSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="R"
                    onClick={() => {
                      setAreasSortType('resolvedAnswersCount');
                      setAreasSortOrder(areasSortOrder === 'asc' && areasSortType === 'resolvedAnswersCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={areasSortType === 'resolvedAnswersCount'}
                    sortOrder={areasSortType === 'resolvedAnswersCount' ? areasSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="C"
                    onClick={() => {
                      setAreasSortType('closedAnswersCount');
                      setAreasSortOrder(areasSortOrder === 'asc' && areasSortType === 'closedAnswersCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={areasSortType === 'closedAnswersCount'}
                    sortOrder={areasSortType === 'closedAnswersCount' ? areasSortOrder : undefined}
                    w="10%"
                  />
                </AdminTableHeader>
                <Flex flexDir="column" overflowY="auto" w="full">
                  {areas?.map((area) => (
                    <InsightListItem item={area} key={area._id} navigation='/admin/areas' type="answers" />
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
