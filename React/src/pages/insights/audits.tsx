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
              <Box bg="auditsInsights.list.bg" borderRadius="20px" h="100%" pb={7} w="full">
                <AdminTableHeader title={`${capitalize(pluralize(t('audit')))} per site`}>
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
                      setSitesSortType('totalAuditsCount');
                      setSitesSortOrder(sitesSortOrder === 'asc' && sitesSortType === 'totalAuditsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={sitesSortType === 'totalAuditsCount'}
                    sortOrder={sitesSortType === 'totalAuditsCount' ? sitesSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="C"
                    onClick={() => {
                      setSitesSortType('completedAuditsCount');
                      setSitesSortOrder(sitesSortOrder === 'asc' && sitesSortType === 'completedAuditsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={sitesSortType === 'completedAuditsCount'}
                    sortOrder={sitesSortType === 'completedAuditsCount' ? sitesSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="U"
                    onClick={() => {
                      setSitesSortType('upcomingAuditsCount');
                      setSitesSortOrder(sitesSortOrder === 'asc' && sitesSortType === 'upcomingAuditsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={sitesSortType === 'upcomingAuditsCount'}
                    sortOrder={sitesSortType === 'upcomingAuditsCount' ? sitesSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="M"
                    onClick={() => {
                      setSitesSortType('missedAuditsCount');
                      setSitesSortOrder(sitesSortOrder === 'asc' && sitesSortType === 'missedAuditsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={sitesSortType === 'missedAuditsCount'}
                    sortOrder={sitesSortType === 'missedAuditsCount' ? sitesSortOrder : undefined}
                    w="10%"
                  />
                </AdminTableHeader>
                <Flex flexDir="column" maxH="300px" overflowY="auto" w="full">
                  {sites?.map((site) => (
                    <InsightListItem item={site} key={site._id} />
                  ))}
                </Flex>
              </Box>
            </GridItem>
            <GridItem h="100%" w="100%">
              <Box bg="auditsInsights.list.bg" borderRadius="20px" h="100%" pb={7} w="full">
                <AdminTableHeader title={`${capitalize(pluralize(t('audit')))} per area`}>
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
                      setAreasSortType('totalAuditsCount');
                      setAreasSortOrder(areasSortOrder === 'asc' && areasSortType === 'totalAuditsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={areasSortType === 'totalAuditsCount'}
                    sortOrder={areasSortType === 'totalAuditsCount' ? areasSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="C"
                    onClick={() => {
                      setAreasSortType('completedAuditsCount');
                      setAreasSortOrder(areasSortOrder === 'asc' && areasSortType === 'completedAuditsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={areasSortType === 'completedAuditsCount'}
                    sortOrder={areasSortType === 'completedAuditsCount' ? areasSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="U"
                    onClick={() => {
                      setAreasSortType('upcomingAuditsCount');
                      setAreasSortOrder(areasSortOrder === 'asc' && areasSortType === 'upcomingAuditsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={areasSortType === 'upcomingAuditsCount'}
                    sortOrder={areasSortType === 'upcomingAuditsCount' ? areasSortOrder : undefined}
                    w="10%"
                  />
                  <AdminTableHeaderElement
                    label="M"
                    onClick={() => {
                      setAreasSortType('missedAuditsCount');
                      setAreasSortOrder(areasSortOrder === 'asc' && areasSortType === 'missedAuditsCount' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={areasSortType === 'missedAuditsCount'}
                    sortOrder={areasSortType === 'missedAuditsCount' ? areasSortOrder : undefined}
                    w="10%"
                  />
                </AdminTableHeader>
                <Flex flexDir="column" overflowY="auto" w="full">
                  {areas?.map((area) => (
                    <InsightListItem item={area} key={area._id} />
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
