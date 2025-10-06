import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { Divider, Flex, Grid } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize, uniqBy } from 'lodash';
import pluralize from 'pluralize';

import ChangeViewButton from '../components/ChangeViewButton';
import AssignedToMeFilter from '../components/Filters/AssignedToMeFilter';
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
import { TViewMode } from '../interfaces/TViewMode';
import updateLocalStorageFilter from '../utils/filterStorage';
import { removeEmptyArraysAndObjects } from '../utils/helpers';
import { PanelView, trackerPanelConfig } from '../components/PanelView';
import useNavigate from '../hooks/useNavigate';
import { IResponse } from '../interfaces/IResponse';
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
          locations {
            _id
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
  const [assignedToMe, setAssignedToMe] = useState(false);

  const handleAssignedToMeToggle = (isChecked: boolean) => {
    setAssignedToMe(isChecked);

    if (isChecked && user && module) {
      // When checked, set the current user as responsible
      const filterValue = {
        responsibleIds: [user.userId],
        accountableIds: [],
        contributorIds: [],
        followerIds: [],
      };
      updateLocalStorageFilter(module._id, 'usersIds', 'User', filterValue, user._id, setFilters);
    } else if (!isChecked && user && module) {
      // When unchecked, clear the responsible filter
      const filterValue = {
        responsibleIds: [],
        accountableIds: [],
        contributorIds: [],
        followerIds: [],
      };
      updateLocalStorageFilter(module._id, 'usersIds', 'User', filterValue, user._id, setFilters);
    }
  };

  const { sortOrder, sortType, setSortType, setSortOrder } = useSort([], 'dueDate');
  const { navigateTo } = useNavigate();
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
    if (module?.customQuestionsInDashboard?.length) filters.unshift(...module.customQuestionsInDashboard);

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

          // Check if assignedToMe filter is active from stored filters
          const usersFilter = validFilters.usersIds?.value;
          if (usersFilter?.responsibleIds?.length === 1 && usersFilter.responsibleIds[0] === user?.userId) setAssignedToMe(true);
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

        // Special handling for usersIds filter with nested structure
        if (key === 'usersIds' && typeof val.value === 'object' && !Array.isArray(val.value)) {
          // Check if any of the nested arrays have values
          const hasValues = Object.values(val.value).some((arr: any) => Array.isArray(arr) && arr.length > 0);
          if (hasValues) acc[key] = val.value;
        } else acc[key] = val.value;

        return acc;
      },
      {} as Record<string, any>,
    );
    setParsedFilters(parsed);

    // Safely check for responsibleIds or userIds in usersIds filter
    const usersFilter = filtersValues?.usersIds?.value;
    let assignedToMe = false;
    if (usersFilter) {
      if (Array.isArray((usersFilter as any).responsibleIds)) {
        const ids = (usersFilter as any).responsibleIds;
        if (ids.length === 1 && ids[0] === user?.userId) assignedToMe = true;
      } else if (Array.isArray((usersFilter as any).userIds)) {
        const ids = (usersFilter as any).userIds;
        if (ids.length === 1 && ids[0] === user?.userId) assignedToMe = true;
      }
    }
    setAssignedToMe(assignedToMe);
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

    if (res.data?.responses?.responses?.length) setResponses((r) => uniqBy([...r, ...res.data.responses.responses], '_id'));
    if (res.data?.responses?.total != null) setTotal(res.data.responses.total);
  };

  useEffect(() => {
    if (!localStorageChecked) return;
    if (hasStoredFilters && Object.keys(parsedFilters).length === 0) {
      setHasStoredFilters(false);
      return;
    }

    setResponses([]);
    // Reset infinite scroll state by reloading from page 1
    loadResponses(1);
  }, [localStorageChecked, sortOrder, sortType, JSON.stringify(parsedFilters), hasStoredFilters]);

  // Track totals for status badges
  useEffect(() => {
    const counts = {
      nonCompliant: totalNonCompliantResponses?.responses?.total || 0,
      compliant: (totalCompliantResponses?.responses?.total || 0) + (totalComingUpResponses?.responses?.total || 0),
      comingUp: totalComingUpResponses?.responses?.total || 0,
    };
    setResponsesStatusesCounts(counts);
  }, [totalCompliantResponses?.responses?.total, totalComingUpResponses?.responses?.total, totalNonCompliantResponses?.responses?.total]);

  // Sync assignedToMe state with current filter state
  useEffect(() => {
    const currentUsersFilter = filtersValues.usersIds?.value;
    let ids: string[] | undefined;

    if (currentUsersFilter && 'responsibleIds' in currentUsersFilter && Array.isArray(currentUsersFilter.responsibleIds))
      ids = currentUsersFilter.responsibleIds;
    else if (currentUsersFilter && 'userIds' in currentUsersFilter && Array.isArray(currentUsersFilter.userIds))
      ids = currentUsersFilter.userIds;

    if (Array.isArray(ids) && ids.length === 1 && ids[0] === user?.userId) setAssignedToMe(true);
    else setAssignedToMe(false);
  }, [filtersValues.usersIds, user?.userId]);

  return (
    <>
      <Header
        breadcrumbs={[pluralize(t('tracker item'))]}
        data-id="000288"
        mobileBreadcrumbs={[pluralize(t('tracker item'))]}
        pageLabel={capitalize(t('tracker item'))}
      >
        <AssignedToMeFilter data-id="001205" isChecked={assignedToMe} onToggle={handleAssignedToMeToggle} />
        {device !== 'mobile' && (
          <>
            <ChangeViewButton data-id="000289" setViewMode={setViewMode} viewMode={viewMode} views={['grid', 'list', 'group', 'panel']} />
            <Divider borderColor="gray.300" data-id="000290" height="30px" mt={1} mx={4} orientation="vertical" />
            <SortButton
              data-id="000291"
              setSortOrder={setSortOrder}
              setSortType={setSortType}
              sortBy={sortBy}
              sortOrder={sortOrder}
              sortType={sortType}
            />
          </>
        )}
      </Header>
      <Flex data-id="000292" direction="column" h={['calc(100vh - 200px)', 'calc(100vh - 150px)']} overflow="auto" pb={4}>
        {error ? (
          <Flex alignItems="center" data-id="000293" fontSize="18px" fontStyle="italic" h="200px" justifyContent="center" w="full">
            No Tracker Items found, try adjusting the filters.
          </Flex>
        ) : (
          <>
            {' '}
            {viewMode === 'grid' && (
              <InfiniteScrollComponent
                data-id="000294"
                hasMore={!loading && responses.length < total}
                initialLoad={false}
                loadMore={loadResponses}
                useWindow={false}
              >
                <Grid
                  bg="#fff"
                  data-id="000295"
                  gap={6}
                  justifyItems="center"
                  pb={[0, 8]}
                  pt={3}
                  px={[4, 8]}
                  templateColumns={['1fr', 'repeat(auto-fit, minmax(240px, 1fr))', 'repeat(auto-fit, minmax(240px, 1fr))']}
                >
                  {(() => {
                    if (responses.length) return responses.map((r) => <TrackerItemSquare data-id="000296" key={r._id} response={r} />);

                    if (!loading) {
                      return (
                        <Flex data-id="000297" fontSize="18px" fontStyle="italic" h="full" w="full">
                          No {pluralize(t('tracker item'))} found
                        </Flex>
                      );
                    }
                    return null;
                  })()}
                </Grid>
                {loading && <Loader center data-id="000298" h="60px" />}
              </InfiniteScrollComponent>
            )}
            {viewMode === 'list' && (
              <TrackerItemsList
                data-id="000299"
                loading={loading}
                loadResponses={loadResponses}
                responses={responses}
                setSortOrder={setSortOrder}
                setSortType={setSortType}
                sortOrder={sortOrder}
                sortType={sortType}
                total={total}
              />
            )}
            {viewMode === 'group' ? (
              <TrackerItemsGroup data-id="000300" loading={loading} loadResponses={loadResponses} responses={responses} total={total} />
            ) :
            viewMode === 'panel' && (
              <PanelView
              data-id='000207'
              items={responses}
              config={{
                ...trackerPanelConfig,
                actions: {
                  ...trackerPanelConfig.actions,
                  primary: {
                    ...trackerPanelConfig.actions.primary!,
                    onClick: (response: IResponse) => navigateTo(`/responses/${response._id}`)
                  }
                }
              }}
            />
            )
            }
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
