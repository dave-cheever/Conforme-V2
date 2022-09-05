import { useMemo, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Box, Flex, Grid, GridItem, Spacer, Text } from '@chakra-ui/react';
import { EChartsOption, graphic } from 'echarts';
import { t } from 'i18next';
import { capitalize } from 'lodash';

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
              <Box bg="actionsInsights.list.bg" borderRadius="20px" pb={7} w="full">
                <AdminTableHeader title="Actions per location">
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
                      setLocationsSortType('totalActionsCount');
                      setLocationsSortOrder(locationsSortOrder === 'asc' && locationsSortType === 'totalActionsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={locationsSortType === 'totalActionsCount'}
                    sortOrder={locationsSortType === 'totalActionsCount' ? locationsSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="C"
                    onClick={() => {
                      setLocationsSortType('completedActionsCount');
                      setLocationsSortOrder(locationsSortOrder === 'asc' && locationsSortType === 'completedActionsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={locationsSortType === 'completedActionsCount'}
                    sortOrder={locationsSortType === 'completedActionsCount' ? locationsSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="O"
                    onClick={() => {
                      setLocationsSortType('inProgressActionsCount');
                      setLocationsSortOrder(
                        locationsSortOrder === 'asc' && locationsSortType === 'inProgressActionsCount' ? 'desc' : 'asc',
                      );
                    }}
                    showSortingIcon={locationsSortType === 'inProgressActionsCount'}
                    sortOrder={locationsSortType === 'inProgressActionsCount' ? locationsSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="M"
                    onClick={() => {
                      setLocationsSortType('overdueActionsCount');
                      setLocationsSortOrder(locationsSortOrder === 'asc' && locationsSortType === 'overdueActionsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={locationsSortType === 'overdueActionsCount'}
                    sortOrder={locationsSortType === 'overdueActionsCount' ? locationsSortOrder : undefined}
                    w="10%"
                  />
                </AdminTableHeader>
                <Flex flexDir="column" maxH="300px" overflowY="auto" w="full">
                  {locations?.map((location) => (
                    <InsightListItem item={location} key={location._id} navigation="/admin/locations" type="actions" />
                  ))}
                </Flex>
              </Box>
            </GridItem>
            <GridItem h="100%" w="100%">
              <Box bg="actionsInsights.list.bg" borderRadius="20px" pb={7} w="full">
                <AdminTableHeader title="Actions per businessUnit">
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
                      setBusinessUnitsSortType('totalActionsCount');
                      setBusinessUnitsSortOrder(
                        businessUnitsSortOrder === 'asc' && businessUnitsSortType === 'totalActionsCount' ? 'desc' : 'asc',
                      );
                    }}
                    showSortingIcon={businessUnitsSortType === 'totalActionsCount'}
                    sortOrder={businessUnitsSortType === 'totalActionsCount' ? businessUnitsSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="C"
                    onClick={() => {
                      setBusinessUnitsSortType('completedActionsCount');
                      setBusinessUnitsSortOrder(
                        businessUnitsSortOrder === 'asc' && businessUnitsSortType === 'completedActionsCount' ? 'desc' : 'asc',
                      );
                    }}
                    showSortingIcon={businessUnitsSortType === 'completedActionsCount'}
                    sortOrder={businessUnitsSortType === 'completedActionsCount' ? businessUnitsSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="O"
                    onClick={() => {
                      setBusinessUnitsSortType('inProgressActionsCount');
                      setBusinessUnitsSortOrder(
                        businessUnitsSortOrder === 'asc' && businessUnitsSortType === 'inProgressActionsCount' ? 'desc' : 'asc',
                      );
                    }}
                    showSortingIcon={businessUnitsSortType === 'inProgressActionsCount'}
                    sortOrder={businessUnitsSortType === 'inProgressActionsCount' ? businessUnitsSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="M"
                    onClick={() => {
                      setBusinessUnitsSortType('overdueActionsCount');
                      setBusinessUnitsSortOrder(
                        businessUnitsSortOrder === 'asc' && businessUnitsSortType === 'overdueActionsCount' ? 'desc' : 'asc',
                      );
                    }}
                    showSortingIcon={businessUnitsSortType === 'overdueActionsCount'}
                    sortOrder={businessUnitsSortType === 'overdueActionsCount' ? businessUnitsSortOrder : undefined}
                    w="10%"
                  />
                </AdminTableHeader>
                <Flex flexDir="column" maxH="300px" overflowY="auto" w="full">
                  {businessUnits?.map((businessUnit) => (
                    <InsightListItem item={businessUnit} key={businessUnit._id} navigation="/admin/businessUnits" type="actions" />
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
