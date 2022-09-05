import { useMemo, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Box, Flex, Grid, GridItem, Spacer, Text } from '@chakra-ui/react';
import { EChartsOption, graphic } from 'echarts';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import { auditsInsightsTypes } from '../../bootstrap/config';
import AdminTableHeader from '../../components/Admin/AdminTableHeader';
import AdminTableHeaderElement from '../../components/Admin/AdminTableHeaderElement';
import AuditsUsersInsights from '../../components/Insights/AuditsUsersInsights';
import InsightListItem from '../../components/Insights/InsightListItem';
import InsightsCard from '../../components/Insights/InsightsCard';
import InsightsChart from '../../components/Insights/InsightsChart';
import Loader from '../../components/Loader';
import UserAvatar from '../../components/UserAvatar';
import useSort from '../../hooks/useSort';

const GET_AUDITS_INSIGHTS = gql`
  query {
    auditsInsights {
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
      topAuditors {
        user {
          _id
          displayName
          imgUrl
        }
        audits
      }
    }
    locations {
      _id
      name
      totalAuditsCount
      completedAuditsCount
      upcomingAuditsCount
      missedAuditsCount
    }
    businessUnits {
      _id
      name
      totalAuditsCount
      completedAuditsCount
      upcomingAuditsCount
      missedAuditsCount
    }
    users {
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
  const { data, loading, error } = useQuery(GET_AUDITS_INSIGHTS);
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
  const {
    sortedData: users,
    sortOrder: usersSortOrder,
    sortType: usersSortType,
    setSortOrder: setUsersSortOrder,
    setSortType: setUsersSortType,
  } = useSort(data?.users ?? [], 'totalAuditsCount');

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
          <Text fontSize="xxl" fontWeight="bold" my={['15px', '25px']}>
            Top {pluralize(t('auditor'))}
          </Text>
          <Grid gap="20px" templateColumns={['1fr', 'repeat(3, 1fr)', 'repeat(4, 1fr)']}>
            {data?.auditsInsights?.topAuditors?.map((auditor) => (
              <GridItem key={auditor.user._id} w="100%">
                <Box bg="auditsInsights.auditors.bg" rounded="20px">
                  <Flex align="center" px="20px" py="15px">
                    <Flex align="center">
                      <UserAvatar size="xs" userId={auditor.user._id} />
                      <Text
                        ml="10px"
                        overflowX="hidden"
                        textOverflow="ellipsis"
                        title={auditor.user.displayName}
                        w={['100px', '100px', 'full']}
                        whiteSpace="nowrap"
                      >
                        {auditor.user.displayName}
                      </Text>
                    </Flex>
                    <Spacer />
                    <Text fontWeight="bold">{auditor.audits}</Text>
                  </Flex>
                </Box>
              </GridItem>
            ))}
          </Grid>
          <AuditsUsersInsights
            auditsStatsCounts={auditsStatsCounts}
            setSortOrder={setUsersSortOrder}
            setSortType={setUsersSortType}
            sortOrder={usersSortOrder}
            sortType={usersSortType}
            users={users}
          />
          <Grid alignItems="stretch" gap="20px" my={['15px', '25px']} templateColumns={['1fr', 'repeat(2, 1fr)']}>
            <GridItem h="100%" w="100%">
              <Box bg="auditsInsights.list.bg" borderRadius="20px" pb={7} w="full">
                <AdminTableHeader title={`${capitalize(pluralize(t('audit')))} per location`}>
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
                      setLocationsSortType('totalAuditsCount');
                      setLocationsSortOrder(locationsSortOrder === 'asc' && locationsSortType === 'totalAuditsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={locationsSortType === 'totalAuditsCount'}
                    sortOrder={locationsSortType === 'totalAuditsCount' ? locationsSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="C"
                    onClick={() => {
                      setLocationsSortType('completedAuditsCount');
                      setLocationsSortOrder(locationsSortOrder === 'asc' && locationsSortType === 'completedAuditsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={locationsSortType === 'completedAuditsCount'}
                    sortOrder={locationsSortType === 'completedAuditsCount' ? locationsSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="U"
                    onClick={() => {
                      setLocationsSortType('upcomingAuditsCount');
                      setLocationsSortOrder(locationsSortOrder === 'asc' && locationsSortType === 'upcomingAuditsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={locationsSortType === 'upcomingAuditsCount'}
                    sortOrder={locationsSortType === 'upcomingAuditsCount' ? locationsSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="M"
                    onClick={() => {
                      setLocationsSortType('missedAuditsCount');
                      setLocationsSortOrder(locationsSortOrder === 'asc' && locationsSortType === 'missedAuditsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={locationsSortType === 'missedAuditsCount'}
                    sortOrder={locationsSortType === 'missedAuditsCount' ? locationsSortOrder : undefined}
                    w="10%"
                  />
                </AdminTableHeader>
                <Flex flexDir="column" maxH="300px" overflowY="auto" w="full">
                  {locations?.map((location) => (
                    <InsightListItem item={location} key={location._id} navigation="/admin/locations" />
                  ))}
                </Flex>
              </Box>
            </GridItem>
            <GridItem h="100%" w="100%">
              <Box bg="auditsInsights.list.bg" borderRadius="20px" pb={7} w="full">
                <AdminTableHeader title={`${capitalize(pluralize(t('audit')))} per businessUnit`}>
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
                      setBusinessUnitsSortType('totalAuditsCount');
                      setBusinessUnitsSortOrder(
                        businessUnitsSortOrder === 'asc' && businessUnitsSortType === 'totalAuditsCount' ? 'desc' : 'asc',
                      );
                    }}
                    showSortingIcon={businessUnitsSortType === 'totalAuditsCount'}
                    sortOrder={businessUnitsSortType === 'totalAuditsCount' ? businessUnitsSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="C"
                    onClick={() => {
                      setBusinessUnitsSortType('completedAuditsCount');
                      setBusinessUnitsSortOrder(
                        businessUnitsSortOrder === 'asc' && businessUnitsSortType === 'completedAuditsCount' ? 'desc' : 'asc',
                      );
                    }}
                    showSortingIcon={businessUnitsSortType === 'completedAuditsCount'}
                    sortOrder={businessUnitsSortType === 'completedAuditsCount' ? businessUnitsSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="U"
                    onClick={() => {
                      setBusinessUnitsSortType('upcomingAuditsCount');
                      setBusinessUnitsSortOrder(
                        businessUnitsSortOrder === 'asc' && businessUnitsSortType === 'upcomingAuditsCount' ? 'desc' : 'asc',
                      );
                    }}
                    showSortingIcon={businessUnitsSortType === 'upcomingAuditsCount'}
                    sortOrder={businessUnitsSortType === 'upcomingAuditsCount' ? businessUnitsSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="M"
                    onClick={() => {
                      setBusinessUnitsSortType('missedAuditsCount');
                      setBusinessUnitsSortOrder(
                        businessUnitsSortOrder === 'asc' && businessUnitsSortType === 'missedAuditsCount' ? 'desc' : 'asc',
                      );
                    }}
                    showSortingIcon={businessUnitsSortType === 'missedAuditsCount'}
                    sortOrder={businessUnitsSortType === 'missedAuditsCount' ? businessUnitsSortOrder : undefined}
                    w="10%"
                  />
                </AdminTableHeader>
                <Flex flexDir="column" maxH="300px" overflowY="auto" w="full">
                  {businessUnits?.map((businessUnit) => (
                    <InsightListItem item={businessUnit} itemType="businessUnit" key={businessUnit._id} navigation="/admin/businessUnits" />
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
