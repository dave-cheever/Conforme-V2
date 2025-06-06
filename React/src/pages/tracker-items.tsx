import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { Divider, Flex, Grid } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize, isEmpty, uniqBy } from 'lodash';
import pluralize from 'pluralize';

import ChangeViewButton from '../components/ChangeViewButton';
import Header from '../components/Header';
import Loader from '../components/Loader';
import SortButton from '../components/SortButton';
import TrackerItemsGroup from '../components/TrackerItem/TrackerItemsGroup';
import TrackerItemsList from '../components/TrackerItem/TrackerItemsList';
import TrackerItemSquare from '../components/TrackerItem/TrackerItemSquare';
import { useAppContext } from '../contexts/AppProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';
import useSort from '../hooks/useSort';
import { IResponse } from '../interfaces/IResponse';
import { TViewMode } from '../interfaces/TViewMode';

const GET_RESPONSES_TOTALS = gql`
  query ResponsesTotals($responsesQuery: Any) {
    responses(responsesQuery: $responsesQuery) {
      total
    }
  }
`;
const GET_RESPONSES = gql`
  query Responses($responsesQuery: Any, $responsesPagination: PaginationInput) {
    responses(responsesQuery: $responsesQuery, responsesPagination: $responsesPagination) {
      responses {
        _id
        dueDate
        lastCompletionDate
        status
        calculatedStatus
        responsibleId
        evidence {
          name
          uploaded {
            id
            name
            addedAt
            thumbnail
            path
          }
        }
        questions {
          name
          type
          value
          required
          requiredAnswer
        }
        trackerItem {
          name
          frequency
          category {
            name
          }
          regulatoryBody {
            name
          }
        }
        businessUnit {
          name
          imgUrl
        }
        responsible {
          _id
          displayName
          role
        }

        metatags {
          addedBy
        }

      }
      total
    }
  }
`;

function TrackerItems() {
  const { module } = useAppContext();
  const device = useDevice();
  const scrollerRef = useRef<any>(null); // Using 'any' as there is no exported interface to use
  const {
    filtersValues,
    setUsedFilters,
    setFilters,
    setResponsesStatusesCounts,
    setShowFiltersPanel,
    responseFiltersValue,
    setResponseFiltersValue,
    setDefaultFilters,
    usedFilters,
  } = useFiltersContext();
  const [responses, setResponses] = useState<IResponse[]>([]);
  const [parsedFilters, setParsedFilters] = useState({});
  const { sortOrder, sortType, setSortType, setSortOrder } = useSort([], 'dueDate');
  const sortBy = [
    { label: 'Item name', key: 'trackerItem.name' },
    { label: 'Due for renewal', key: 'dueDate' },
    { label: capitalize(t('compliant')), key: 'calculatedStatus' },
    { label: 'Regulatory body', key: 'trackerItem.regulatoryBody.name' },
    { label: 'Responsible', key: 'responsible.displayName' },
    { label: capitalize(t('business unit')), key: 'businessUnit.name' },
  ];
  const [viewMode, setViewMode] = useState<TViewMode>('grid');

  const [total, setTotal] = useState(1);
  const { data: totalCompliantResponses } = useQuery(GET_RESPONSES_TOTALS, {
    variables: {
      responsesQuery: {
        itemStatus: ['compliant'],
      },
    },
  });
  const { data: totalComingUpResponses } = useQuery(GET_RESPONSES_TOTALS, {
    variables: {
      responsesQuery: {
        itemStatus: ['comingUp'],
      },
    },
  });
  const { data: totalNonCompliantResponses } = useQuery(GET_RESPONSES_TOTALS, {
    variables: {
      responsesQuery: {
        itemStatus: ['nonCompliant'],
      },
    },
  });
  const [getTrackerResponses, { error, loading }] = useLazyQuery(GET_RESPONSES, {
    fetchPolicy: 'no-cache',
    variables: {
      responsesQuery: {},
      responsesPagination: {
        limit: 10,
        offset: 0,
        sortBy: sortType,
        sortDirection: sortOrder,
      },
    },
  });

  useEffect(() => {
    const filters = [
      'trackerItemsIds',
      'categoriesIds',
      'usersIds',
      'locationsIds',
      'businessUnitsIds',
      'itemStatus',
      'regulatoryBodiesIds',
      'dueDate',
    ];
    if (module && (module?.customQuestionsInDashboard || []).length > 0) filters.unshift(...module.customQuestionsInDashboard);
    setUsedFilters(filters);
    return () => {
      setShowFiltersPanel(false);
      setUsedFilters([]);
    };
  }, []);

  useEffect(() => {
    if (responseFiltersValue && !isEmpty(responseFiltersValue) && !isEmpty(filtersValues) && !isEmpty(usedFilters)) {
      // Delay setting filters by 100ms to make sure that other useEffects finished and filters won't be cleared
      const delayFilters = setTimeout(() => {
        setFilters(Object.entries(responseFiltersValue).reduce((acc, [key, value]) => ({ ...acc, [key]: value.value }), {}));
        setResponseFiltersValue({});
        clearTimeout(delayFilters);
      }, 100);
    }
  }, [filtersValues, usedFilters, setResponseFiltersValue, responseFiltersValue, setFilters]);

  // Set default filters
  useEffect(() => {
    if (!isEmpty(module?.defaultFilters?.responses)) {
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
      const defaultFilters = Object.entries(module!.defaultFilters.responses!).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: {
            value,
          },
        }),
        {},
      );
      setDefaultFilters(Object.entries(module!.defaultFilters.responses!).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}));
      setResponseFiltersValue((curr) => ({ ...curr, ...defaultFilters }));
    }
  }, []);

  useEffect(() => {
    const responsesStatusesCounts = {
      nonCompliant: totalNonCompliantResponses?.responses?.total || 0,
      compliant: (totalCompliantResponses?.responses?.total || 0) + (totalComingUpResponses?.responses?.total || 0),
      comingUp: totalComingUpResponses?.responses?.total || 0,
    };
    setResponsesStatusesCounts(responsesStatusesCounts);
  }, [totalCompliantResponses?.responses?.total, totalComingUpResponses?.responses?.total, totalNonCompliantResponses?.responses?.total]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Parse filters to format expected by API and reload responses on filter change
   */
  useEffect(() => {
    // Parse filters to format expected by GraphQL Query
      const parsedFilters = Object.entries(filtersValues).reduce((acc, [rawKey, value]) => {
      const key = rawKey === 'Status' ? 'status' : rawKey;

      if (
        !value?.value ||
        (typeof value.value === 'object' && Object.keys(value.value).length === 0) ||
        (key === 'usersIds' &&
          value.value.responsibleIds?.length === 0 &&
          value.value.accountableIds?.length === 0 &&
          value.value.contributorIds?.length === 0 &&
          value.value.followerIds?.length === 0)
      ) 
        return acc;

    return {
      ...acc,
      [key]: value.value,
    };
      }, {});

    setParsedFilters(parsedFilters);
  }, [JSON.stringify(filtersValues)]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * This function loads responses and pushes (unique) to an array displayed on the dashboard
   *
   * @param page Page number defines offset sent to the API
   */
  const loadResponses = async (page: number) => {
    const res = await getTrackerResponses({
      variables: {
        responsesQuery: parsedFilters,
        responsesPagination: { limit: 20, offset: page * 20 - 20, sortBy: sortType, sortDirection: sortOrder },
      },
    });
    if (res.data?.responses?.responses?.length > 0)
      setResponses((filteredResponses) => uniqBy([...filteredResponses, ...res.data.responses.responses], '_id'));
    if (res.data?.responses?.total) setTotal(res.data?.responses?.total);
  };

  /**
   * Reload responses on filters or sort change
   */
  useEffect(() => {
    setResponses([]);
    loadResponses(1);
    if (scrollerRef.current) scrollerRef.current.pageLoaded = 0;
  }, [sortOrder, sortType, JSON.stringify(parsedFilters)]);

  return (<>
    <Header
      breadcrumbs={[pluralize(t('tracker item'))]}
      data-id="93c49454aa8f"
      mobileBreadcrumbs={[pluralize(t('tracker item'))]}>
      {device !== 'mobile' && (
        <>
          <ChangeViewButton
            data-id="71ddbd0a13f3"
            setViewMode={setViewMode}
            viewMode={viewMode}
            views={['grid', 'list', 'group']} />

          <Divider
            borderColor="gray.300"
            height="30px"
            ml={2}
            mr={2}
            mt={1}
            orientation="vertical"
          />
          <SortButton
            data-id="72f816f7350e"
            setSortOrder={setSortOrder}
            setSortType={setSortType}
            sortBy={sortBy}
            sortOrder={sortOrder}
            sortType={sortType} />
        </>
      )}
    </Header>
    <Flex
      data-id="7bf7546ba3a8"
      direction="column"
      h={['calc(100vh - 200px)', 'calc(100vh - 150px)']}
      overflow="auto"
      pb={4}>
      {error ? (
        <Flex
          alignItems="center"
          data-id="864e662bfe75"
          fontSize="18px"
          fontStyle="italic"
          h="200px"
          justifyContent="center"
          w="full">
          No Tracker Items found ,Try adjusting the filters.
        </Flex>
      ) : (
        <>
          {viewMode === 'grid' && (
            <InfiniteScroll
              data-id="c573b6b779c3"
              hasMore={!loading && responses.length < total}
              initialLoad={false}
              loadMore={loadResponses}
              ref={scrollerRef}
              useWindow={false}>
              <Grid
                data-id="06d832594699"
                display={['grid', 'grid', 'flex']}
                flexWrap="wrap"
                gap={6}
                h="fit-content"
                pb={[0, 8]}
                pt="3"
                px={[4, 8]}
                templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', '']}
                w="full">
                {responses.length > 0
                  ? responses.map((response) => <TrackerItemSquare data-id="3c73d7318f93" key={response._id} response={response} />)
                  : !loading && (
                    <Flex
                      data-id="4d543a578ec2"
                      fontSize="18px"
                      fontStyle="italic"
                      h="full"
                      w="full">
                      No {pluralize(t('tracker item'))} found
                    </Flex>
                  )}
              </Grid>
              {loading && <Loader center data-id="331bdbe7d31a" h="60px" key="infinite-loader" />}
            </InfiniteScroll>
          )}
          {viewMode === 'list' && (
            <TrackerItemsList
              data-id="2751fbbf7cb7"
              loading={loading}
              loadResponses={loadResponses}
              responses={responses}
              scrollerRef={scrollerRef}
              setSortOrder={setSortOrder}
              setSortType={setSortType}
              sortOrder={sortOrder}
              sortType={sortType}
              total={total} />
          )}
          {viewMode === 'group' && (
            <TrackerItemsGroup
              data-id="7e9a9ff79bc2"
              loading={loading}
              loadResponses={loadResponses}
              responses={responses}
              scrollerRef={scrollerRef}
              total={total} />
          )}
        </>
      )}
    </Flex>
  </>);
}

export default TrackerItems;

export const trackerItemStyles = {
  trackerItems: {
    header: {
      menuButtonBg: 'white',
      rightIcon: '#9A9EA1',
      menuItemFocus: '#462AC4',
      menuItemFontSelected: '#462AC4',
      menuItemFont: '#9A9EA1',
    },
  },
};
