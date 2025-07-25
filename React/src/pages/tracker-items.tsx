import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { Divider, Flex, Grid } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize, uniqBy } from 'lodash';
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
import { removeEmptyArraysAndObjects } from '../utils/helpers';

const InfiniteScrollComponent = InfiniteScroll as unknown as React.FC<any>;

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
  const { module, user } = useAppContext();
  const device = useDevice();
  const scrollerRef = useRef<any>(null);

  const {
    filtersValues,
    setUsedFilters,
    setFilters,
    setResponsesStatusesCounts,
    setShowFiltersPanel,
    setResponseFiltersValue,
    setDefaultFilters,
    usedFilters,
  } = useFiltersContext();

  const [responses, setResponses] = useState<IResponse[]>([]);
  const [parsedFilters, setParsedFilters] = useState<Record<string, any>>({});
  const [localStorageChecked, setLocalStorageChecked] = useState(false);
  const [hasStoredFilters, setHasStoredFilters] = useState(false);

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
    variables: { responsesQuery: { itemStatus: ['compliant'] } },
  });
  const { data: totalComingUpResponses } = useQuery(GET_RESPONSES_TOTALS, {
    variables: { responsesQuery: { itemStatus: ['comingUp'] } },
  });
  const { data: totalNonCompliantResponses } = useQuery(GET_RESPONSES_TOTALS, {
    variables: { responsesQuery: { itemStatus: ['nonCompliant'] } },
  });

  const [getTrackerResponses, { error, loading }] = useLazyQuery(GET_RESPONSES, {
    fetchPolicy: 'no-cache',
  });

  // Set which filters are available
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
    if (module?.customQuestionsInDashboard?.length) 
      filters.unshift(...module.customQuestionsInDashboard);
    
    setUsedFilters(filters);
    return () => {
      setShowFiltersPanel(false);
      setUsedFilters([]);
    };
  }, []);

  // 1️ Read stored filters once, seed context, then mark ready
  useEffect(() => {
    if (!user || usedFilters.length === 0) return;

    const key = `${module?._id}-filters-${user._id}`;
    const stored = localStorage.getItem(key);
    let validFilters: Record<string, { value: any }> = {};

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        validFilters = Object.entries(parsed).reduce(
          (acc, [k, f]) => {
            const v = (f as any).value;
            const isArray = Array.isArray(v) && v.length > 0;
            const isObj = v && typeof v === 'object' && Object.keys(v).length > 0;
            if (isArray || isObj) acc[k] = { value: v };
            return acc;
          },
          {} as Record<string, { value: any }>,
        );

        if (Object.keys(validFilters).length) {
          setDefaultFilters(Object.fromEntries(Object.entries(validFilters).map(([k, v]) => [k, v.value])));
          setResponseFiltersValue((curr) => ({ ...curr, ...validFilters }));
          setFilters(Object.fromEntries(Object.entries(validFilters).map(([k, v]) => [k, v.value])));
          setHasStoredFilters(true);
        }
      } catch (err) {
        console.error('Failed to parse stored filters', err);
      }
    }

    setLocalStorageChecked(true);
  }, [user, usedFilters]);

  // 2️ Always re-parse current filtersValues
  useEffect(() => {
    const parsed = Object.entries(filtersValues).reduce(
      (acc, [rawKey, val]) => {
        if (!val?.value) return acc;
        const key = rawKey === 'Status' ? 'status' : rawKey;
        acc[key] = val.value;
        return acc;
      },
      {} as Record<string, any>,
    );
    setParsedFilters(parsed);
  }, [filtersValues]);

    // Load function
  const loadResponses = async (page: number) => {
    const cleanedFilters = removeEmptyArraysAndObjects(parsedFilters);
    const res = await getTrackerResponses({
      variables: {
        responsesQuery: cleanedFilters,
        responsesPagination: {
          limit: 20,
          offset: page * 20 - 20,
          sortBy: sortType,
          sortDirection: sortOrder,
        },
      },
    });

    if (res.data?.responses?.responses?.length) 
      setResponses((r) => uniqBy([...r, ...res.data.responses.responses], '_id'));
    
    if (res.data?.responses?.total != null) 
      setTotal(res.data.responses.total);
    
  };

  // 3️ Single, guarded loader for page 1 + resets
  useEffect(() => {
    if (!localStorageChecked) return;
    if (hasStoredFilters && Object.keys(parsedFilters).length === 0) return;

    setResponses([]);
    if (scrollerRef.current) scrollerRef.current.pageLoaded = 0;
    loadResponses(1);
  }, [localStorageChecked, sortOrder, sortType, JSON.stringify(parsedFilters)]);

  // Track totals for status badges
  useEffect(() => {
    const counts = {
      nonCompliant: totalNonCompliantResponses?.responses?.total || 0,
      compliant: (totalCompliantResponses?.responses?.total || 0) + (totalComingUpResponses?.responses?.total || 0),
      comingUp: totalComingUpResponses?.responses?.total || 0,
    };
    setResponsesStatusesCounts(counts);
  }, [totalCompliantResponses?.responses?.total, totalComingUpResponses?.responses?.total, totalNonCompliantResponses?.responses?.total]);

  return (
    <>
      <Header
        breadcrumbs={[pluralize(t('tracker item'))]}
        mobileBreadcrumbs={[pluralize(t('tracker item'))]}
        pageLabel={capitalize(t('tracker item'))}
      >
        {device !== 'mobile' && (
          <>
            <ChangeViewButton setViewMode={setViewMode} viewMode={viewMode} views={['grid', 'list', 'group']} />
            <Divider borderColor="gray.300" height="30px" mt={1} mx={4} orientation="vertical" />
            <SortButton setSortOrder={setSortOrder} setSortType={setSortType} sortBy={sortBy} sortOrder={sortOrder} sortType={sortType} />
          </>
        )}
      </Header>

      <Flex direction="column" h={['calc(100vh - 200px)', 'calc(100vh - 150px)']} overflow="auto" pb={4}>
        {error ? (
          <Flex alignItems="center" fontSize="18px" fontStyle="italic" h="200px" justifyContent="center" w="full">
            No Tracker Items found, try adjusting the filters.
          </Flex>
        ) : (
          <>
            {' '}
            {viewMode === 'grid' && (
              <InfiniteScrollComponent
                hasMore={!loading && responses.length < total}
                initialLoad={false}
                loadMore={loadResponses}
                ref={scrollerRef}
                useWindow={false}
              >
                <Grid
                  bg="#fff"
                  gap={6}
                  justifyItems="center"
                  pb={[0, 8]}
                  pt={3}
                  px={[4, 8]}
                  templateColumns={['1fr', 'repeat(auto-fit, minmax(240px, 1fr))', 'repeat(auto-fit, minmax(240px, 1fr))']}
                >
                  {responses.length ? (
                    responses.map((r) => <TrackerItemSquare key={r._id} response={r} />)
                  ) : !loading ? (
                    <Flex fontSize="18px" fontStyle="italic" h="full" w="full">
                      No {pluralize(t('tracker item'))} found
                    </Flex>
                  ) : null}
                </Grid>
                {loading && <Loader center h="60px" />}
              </InfiniteScrollComponent>
            )}
            {viewMode === 'list' && (
              <TrackerItemsList
                loading={loading}
                loadResponses={loadResponses}
                responses={responses}
                scrollerRef={scrollerRef}
                setSortOrder={setSortOrder}
                setSortType={setSortType}
                sortOrder={sortOrder}
                sortType={sortType}
                total={total}
              />
            )}
            {viewMode === 'group' && (
              <TrackerItemsGroup
                loading={loading}
                loadResponses={loadResponses}
                responses={responses}
                scrollerRef={scrollerRef}
                total={total}
              />
            )}
          </>
        )}
      </Flex>
    </>
  );
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
