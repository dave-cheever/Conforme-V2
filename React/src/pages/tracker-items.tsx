import { useEffect, useRef, useState } from 'react';

import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { Divider, Flex } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize, uniqBy } from 'lodash';
import pluralize from 'pluralize';
import { useSearchParams } from 'react-router-dom';

import ChangeViewButton from '../components/ChangeViewButton';
import AssignedToMeFilter from '../components/Filters/AssignedToMeFilter';
import Header from '../components/Header';
import Loader from '../components/Loader';
import NoRecordsFound from '../components/NoRecordsFound';
import { PanelView, trackerPanelConfig } from '../components/PanelView';
import SortButton from '../components/SortButton';
import TrackerItemsList from '../components/TrackerItem/TrackerItemsList';
import { useAppContext } from '../contexts/AppProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';
import useNavigate from '../hooks/useNavigate';
import useSort from '../hooks/useSort';
import { IResponse } from '../interfaces/IResponse';
import { TViewMode } from '../interfaces/TViewMode';
import updateLocalStorageFilter from '../utils/filterStorage';
import { removeEmptyArraysAndObjects } from '../utils/helpers';
import FilterButton from '../components/FilterButton';
import isAuditPage from '../utils/isAuditPage';
import { useNavigationTopContext } from '../contexts/NavigationTopProvider';

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
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { setSearchText } = useNavigationTopContext();
  const { module, user } = useAppContext();
  const device = useDevice();

  // Sync search query from URL to search bar context
  useEffect(() => {
    if (searchQuery) {
      setSearchText(searchQuery);
    }
  }, [searchQuery, setSearchText]);
  const {
    filtersValues,
    appliedFilters,
    setUsedFilters,
    setFilters,
    applyFiltersImmediately,
    setResponsesStatusesCounts,
    setShowFiltersPanel,
    setResponseFiltersValue,
    setDefaultFilters,
    usedFilters,
    sortingState,
    setSortingState,
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
      updateLocalStorageFilter(module._id, 'usersIds', 'User', filterValue, user._id, applyFiltersImmediately);
    } else if (!isChecked && user && module) {
      // When unchecked, clear the responsible filter
      const filterValue = {
        responsibleIds: [],
        accountableIds: [],
        contributorIds: [],
        followerIds: [],
      };
      updateLocalStorageFilter(module._id, 'usersIds', 'User', filterValue, user._id, applyFiltersImmediately);
    }
  };

  const { sortOrder, sortType, setSortType, setSortOrder } = useSort([], 'dueDate');

  // Apply sorting from context when it changes (e.g., from preset)
  const prevSortingStateRef = useRef<{ sortType: string; sortOrder: 'asc' | 'desc' } | null>(null);
  const isApplyingFromContext = useRef(false);

  useEffect(() => {
    if (
      sortingState &&
      (prevSortingStateRef.current === null ||
        prevSortingStateRef.current.sortType !== sortingState.sortType ||
        prevSortingStateRef.current.sortOrder !== sortingState.sortOrder)
    ) {
      isApplyingFromContext.current = true;
      setSortType(sortingState.sortType);
      setSortOrder(sortingState.sortOrder);
      // Reset the flag after state updates
      setTimeout(() => {
        isApplyingFromContext.current = false;
      }, 0);
    }
    prevSortingStateRef.current = sortingState;
  }, [sortingState, setSortType, setSortOrder]);

  // Update context when local sorting changes (but not when applying from context)
  useEffect(() => {
    if (!isApplyingFromContext.current) setSortingState({ sortType, sortOrder });
  }, [sortType, sortOrder, setSortingState]);
  const { isPathActive, navigateTo } = useNavigate();
  const sortBy = [
    { label: 'Item name', key: 'trackerItem.name' },
    { label: 'Due for renewal', key: 'dueDate' },
    { label: capitalize(t('compliant')), key: 'calculatedStatus' },
    { label: 'Regulatory body', key: 'trackerItem.regulatoryBody.name' },
    { label: 'Responsible', key: 'responsible.displayName' },
    { label: capitalize(t('business unit')), key: 'businessUnit.name' },
  ];

  // Initialize viewMode from localStorage to prevent flash of default view
  const [viewMode, setViewMode] = useState<TViewMode>(() => {
    if (typeof window !== 'undefined') {
      const savedView = localStorage.getItem('viewMode') as TViewMode;
      if (savedView && ['list', 'panel'].includes(savedView)) {
        return savedView;
      }
    }
    return 'panel';
  });
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

    const key = `${module?._id}-filters-${user.userId}`;
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

  // 2️ Always re-parse current appliedFilters
  useEffect(() => {
    if (!appliedFilters) return;

    const parsed = Object.entries(appliedFilters).reduce(
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
    const usersFilter = (appliedFilters as any)?.usersIds?.value;
    let assignedToMe = false;
    if (usersFilter) {
      if (Array.isArray(usersFilter.responsibleIds)) {
        const ids = usersFilter.responsibleIds;
        if (ids.length === 1 && ids[0] === user?.userId) assignedToMe = true;
      } else if (Array.isArray(usersFilter.userIds)) {
        const ids = usersFilter.userIds;
        if (ids.length === 1 && ids[0] === user?.userId) assignedToMe = true;
      }
    }
    setAssignedToMe(assignedToMe);
  }, [appliedFilters]);

  // Load function
  const loadResponses = async (page: number) => {
    const cleanedFilters = removeEmptyArraysAndObjects(parsedFilters);
    const res = await getTrackerResponses({
      variables: {
        responsesQuery: {
          ...cleanedFilters,
          ...(searchQuery ? { searchText: searchQuery } : {}),
        },
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
  }, [localStorageChecked, sortOrder, sortType, JSON.stringify(parsedFilters), hasStoredFilters, searchQuery]);

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


  // Helper function to render main content with loading state
  const renderMainContent = () => {
    if (loading) return <Loader center data-id="000197" />;

    if (viewMode === 'list') {
      return (
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
      );
    }

    if (viewMode === 'panel') {
      return (
        <PanelView
          config={{
            ...trackerPanelConfig,
            actions: {
              ...trackerPanelConfig.actions,
              primary: {
                ...trackerPanelConfig.actions.primary!,
                onClick: (response: IResponse) => navigateTo(`/tracker-item/${response._id}`),
              },
              panelClick: {
                onClick: (response: IResponse) => navigateTo(`/tracker-item/${response._id}`),
              },
            },
          }}
          data-id="000207"
          dataSourceName="tracker items"
          items={responses}
        />
      );
    }

    // Default to panel view
    return (
      <PanelView
        config={{
          ...trackerPanelConfig,
          actions: {
            ...trackerPanelConfig.actions,
            primary: {
              ...trackerPanelConfig.actions.primary!,
              onClick: (response: IResponse) => navigateTo(`/tracker-item/${response._id}`),
            },
            panelClick: {
              onClick: (response: IResponse) => navigateTo(`/tracker-item/${response._id}`),
            },
          },
        }}
        data-id="000207"
        dataSourceName="tracker items"
        items={responses}
      />
    );
  };

  const isAuditPageValue = isAuditPage(isPathActive);

  return (
    <>
      <Header
        breadcrumbs={[pluralize(t('tracker item'))]}
        data-id="000288"
        mobileBreadcrumbs={[pluralize(t('tracker item'))]}
        pageLabel={capitalize(t('tracker item'))}
      >
        <Flex data-id="001521" direction="row" justifyContent="space-between" pl={[0, 0, "6"]} w="full">
          <AssignedToMeFilter data-id="001205" isChecked={assignedToMe} onToggle={handleAssignedToMeToggle} />
          <Flex data-id="001522" direction="row">

            {device !== 'mobile' && (
              <Flex data-id="001524" direction="row">
                <ChangeViewButton data-id="000289" setViewMode={setViewMode} viewMode={viewMode} views={['list', 'panel']} />
                <Divider borderColor="gray.300" data-id="000290" height="30px" mt={1} mx={4} orientation="vertical" />
              </Flex>
            )}

            <Flex gap={2} data-id="001523" direction="row">
              <SortButton
                data-id="000291"
                setSortOrder={setSortOrder}
                setSortType={setSortType}
                sortBy={sortBy}
                sortOrder={sortOrder}
                sortType={sortType}
              />
              {device !== 'desktop' && usedFilters && isAuditPageValue && usedFilters.length > 0 && <FilterButton data-id="000279" />}
            </Flex>
          </Flex>
        </Flex>
      </Header>
      <Flex data-id="000292" direction="column" h={['calc(100vh - 200px)', 'calc(100vh - 150px)']} overflow="auto" zIndex={1}>
        {error ? (
          <NoRecordsFound
            data-id="000293"
            dataSourceName="tracker items"
            height="100%"
          />
        ) : (
          renderMainContent()
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
      menuItemFocus: '#0068A314',
      menuItemFontSelected: '#0068A3',
      menuItemFont: '#9A9EA1',
    },
  },
};
