import { useMemo, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Box, Flex, Grid, GridItem, Spacer, Text } from '@chakra-ui/react';
import { EChartsOption, graphic } from 'echarts';

import { actionsInsightsTypes } from '../../bootstrap/config';
import AdminTableHeader from '../../components/Admin/AdminTableHeader';
import AdminTableHeaderElement from '../../components/Admin/AdminTableHeaderElement';
import InsightListItem from '../../components/Insights/InsightListItem';
import InsightsCard from '../../components/Insights/InsightsCard';
import InsightsChart from '../../components/Insights/InsightsChart';
import Loader from '../../components/Loader';
import UserAvatar from '../../components/UserAvatar';
import useSort from '../../hooks/useSort';

const GET_ACTIONS_INSIGHTS = gql`
  query {
    actionsInsights {
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
      mostAddedBy {
        user {
          _id
          displayName
          imgUrl
        }
        actions
      }
    }
    locations {
      _id
      name
      totalActionsCount
      completedActionsCount
      inProgressActionsCount
      overdueActionsCount
    }
    businessUnits {
      _id
      name
      totalActionsCount
      completedActionsCount
      inProgressActionsCount
      overdueActionsCount
    }
  }
`;

const ActionsInsights = () => {
  const { data, loading, error } = useQuery(GET_ACTIONS_INSIGHTS);
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
          <Text fontSize="xxl" fontWeight="bold" my={['15px', '25px']}>
            Most added by
          </Text>
          <Grid gap="20px" templateColumns={['1fr', 'repeat(3, 1fr)', 'repeat(4, 1fr)']}>
            {data?.actionsInsights?.mostAddedBy?.map((actionCreator) => (
              <GridItem key={actionCreator.user._id} w="100%">
                <Box bg="actionsInsights.mostAddedBy.bg" rounded="20px">
                  <Flex align="center" px="20px" py="15px">
                    <Flex align="center">
                      <UserAvatar size="xs" userId={actionCreator.user._id} />
                      <Text
                        ml="10px"
                        overflowX="hidden"
                        textOverflow="ellipsis"
                        title={actionCreator.user.displayName}
                        w={['100px', '100px', 'full']}
                        whiteSpace="nowrap"
                      >
                        {actionCreator.user.displayName}
                      </Text>
                    </Flex>
                    <Spacer />
                    <Text fontWeight="bold">{actionCreator.actions}</Text>
                  </Flex>
                </Box>
              </GridItem>
            ))}
          </Grid>
          <Grid alignItems="stretch" gap="20px" my={['15px', '25px']} templateColumns={['1fr', 'repeat(2, 1fr)']}>
            <GridItem h="100%" w="100%">
              <Box bg="actionsInsights.list.bg" borderRadius="20px" h="100%" pb={7} w="full">
                <AdminTableHeader title="Actions per site">
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
                      setSitesSortType('totalActionsCount');
                      setSitesSortOrder(sitesSortOrder === 'asc' && sitesSortType === 'totalActionsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={sitesSortType === 'totalActionsCount'}
                    sortOrder={sitesSortType === 'totalActionsCount' ? sitesSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="C"
                    onClick={() => {
                      setSitesSortType('completedActionsCount');
                      setSitesSortOrder(sitesSortOrder === 'asc' && sitesSortType === 'completedActionsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={sitesSortType === 'completedActionsCount'}
                    sortOrder={sitesSortType === 'completedActionsCount' ? sitesSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="O"
                    onClick={() => {
                      setSitesSortType('inProgressActionsCount');
                      setSitesSortOrder(sitesSortOrder === 'asc' && sitesSortType === 'inProgressActionsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={sitesSortType === 'inProgressActionsCount'}
                    sortOrder={sitesSortType === 'inProgressActionsCount' ? sitesSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="M"
                    onClick={() => {
                      setSitesSortType('overdueActionsCount');
                      setSitesSortOrder(sitesSortOrder === 'asc' && sitesSortType === 'overdueActionsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={sitesSortType === 'overdueActionsCount'}
                    sortOrder={sitesSortType === 'overdueActionsCount' ? sitesSortOrder : undefined}
                    w="10%"
                  />
                </AdminTableHeader>
                <Flex flexDir="column" maxH="300px" overflowY="auto" w="full">
                  {sites?.map((site) => (
                    <InsightListItem item={site} key={site._id} type="actions" />
                  ))}
                </Flex>
              </Box>
            </GridItem>
            <GridItem h="100%" w="100%">
              <Box bg="actionsInsights.list.bg" borderRadius="20px" h="100%" pb={7} w="full">
                <AdminTableHeader title="Actions per area">
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
                      setAreasSortType('totalActionsCount');
                      setAreasSortOrder(areasSortOrder === 'asc' && areasSortType === 'totalActionsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={areasSortType === 'totalActionsCount'}
                    sortOrder={areasSortType === 'totalActionsCount' ? areasSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="C"
                    onClick={() => {
                      setAreasSortType('completedActionsCount');
                      setAreasSortOrder(areasSortOrder === 'asc' && areasSortType === 'completedActionsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={areasSortType === 'completedActionsCount'}
                    sortOrder={areasSortType === 'completedActionsCount' ? areasSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="O"
                    onClick={() => {
                      setAreasSortType('inProgressActionsCount');
                      setAreasSortOrder(areasSortOrder === 'asc' && areasSortType === 'inProgressActionsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={areasSortType === 'inProgressActionsCount'}
                    sortOrder={areasSortType === 'inProgressActionsCount' ? areasSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="M"
                    onClick={() => {
                      setAreasSortType('overdueActionsCount');
                      setAreasSortOrder(areasSortOrder === 'asc' && areasSortType === 'overdueActionsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={areasSortType === 'overdueActionsCount'}
                    sortOrder={areasSortType === 'overdueActionsCount' ? areasSortOrder : undefined}
                    w="10%"
                  />
                </AdminTableHeader>
                <Flex flexDir="column" overflowY="auto" w="full">
                  {areas?.map((area) => (
                    <InsightListItem item={area} key={area._id} type="actions" />
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
