import { useCallback, useEffect, useMemo, useRef, useState, startTransition } from 'react';
import { flushSync } from 'react-dom';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { useNavigationTopContext } from '../contexts/NavigationTopProvider';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Button, Divider, Flex, Modal, ModalOverlay, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { capitalize, isEmpty } from 'lodash';
import pluralize from 'pluralize';
import React from 'react';

import AuditModal from '../components/AuditModal/AuditModal';
import ChangeViewButton from '../components/ChangeViewButton';
import AssignedToMeFilter from '../components/Filters/AssignedToMeFilter';
import Header from '../components/Header';
import Loader from '../components/Loader';
import NoRecordsFound from '../components/NoRecordsFound';
import { auditPanelConfig, PanelView } from '../components/PanelView';
import SortButton from '../components/SortButton';
import AvatarCell from '../components/Table/Cells/AvatarCell';
import DateTimeCell from '../components/Table/Cells/DateTimeCell';
import StatusCell from '../components/Table/Cells/StatusCell';
import TextOrNumberCell from '../components/Table/Cells/TextOrNumberCell';
import ListView, { ColumnConfig } from '../components/Table/ListView';
import { useAdminContext } from '../contexts/AdminProvider';
import { useAppContext } from '../contexts/AppProvider';
import AuditModalProvider, { useAuditModalContext } from '../contexts/AuditModalProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';
import { auditWalkTypes } from '../hooks/useFiltersUtils';
import useNavigate from '../hooks/useNavigate';
import useSort from '../hooks/useSort';
import { ExportIcon, LocationIcon } from '../icons';
import { IAudit } from '../interfaces/IAudit';
import { TViewMode } from '../interfaces/TViewMode';
import updateLocalStorageFilter from '../utils/filterStorage';
import FilterButton from '../components/FilterButton';
import isAuditPage from '../utils/isAuditPage';
import usePagination from '../hooks/usePagination';

const CSVLinkComponent = CSVLink as unknown as React.FC<any>;

// Helper functions for user ID normalization and filter checking
function getMyIds(user?: { _id?: string; userId?: string }) {
  return [user?.userId, user?._id].filter(Boolean).map(String);
}

function isAssignedToMeFilter(val: any, myIds: string[]) {
  if (!val || typeof val !== 'object') return false;

  const auditors = Array.isArray(val.auditorsIds) ? val.auditorsIds : [];
  const participants = Array.isArray(val.participantsIds) ? val.participantsIds : [];

  // Combine and normalize any candidate IDs in the filter
  const combined = [...auditors, ...participants].filter(Boolean).map(String);

  // If exactly one ID is targeted and it's me, treat as "assigned to me"
  if (combined.length === 1 && myIds.includes(combined[0])) return true;

  return false;
}

const GET_AUDITS = gql`
  query ($auditQueryInput: AuditQueryInput, $pagination: PaginationInput) {
    audits(auditQueryInput: $auditQueryInput, pagination: $pagination) {
      audits {
        _id
        reference
        walkType
        dueDate
        completedDate
        status
        auditorId
        numberOfActions
        answersCount
        recurring
        auditType {
          _id
          name
          startingDate
          frequency
          sections {
            type
            _id
          }
        }
        location {
          _id
          name
        }
        businessUnit {
          _id
          name
        }
        auditor {
          _id
          displayName
          imgUrl
        }
        participantsIds
        metatags {
          addedAt
          removedBy
        }
      }
      total
    }
  }
`;

const SAVE_RECENT_SEARCH = gql`
  mutation SaveRecentSearch($saveRecentSearchInput: SaveRecentSearchInput!) {
    saveRecentSearch(saveRecentSearchInput: $saveRecentSearchInput) {
      _id
      userId
      text
      organizationId
      metatags {
        addedAt
        addedBy
        updatedAt
        updatedBy
        removedAt
        removedBy
      }
    }
  }
`;

function Audits() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { setSearchText } = useNavigationTopContext();
  const {
    filtersValues,
    appliedFilters,
    setUsedFilters,
    setFilters,
    applyFiltersImmediately,
    setDefaultFilters,
    setShowFiltersPanel,
    auditFiltersValue,
    setAuditFiltersValue,
    usedFilters,
    sortingState,
    setSortingState,
  } = useFiltersContext();
  const device = useDevice();
  const { navigateTo, isPathActive } = useNavigate();
  const { user, module } = useAppContext();
  const { adminModalState, setAdminModalState } = useAdminContext();
  const { audit, reset, trigger } = useAuditModalContext();
  const { currentPage, setCurrentPage, pageSize, setPageSize, total, setTotal } = usePagination();
  const [filteredAudits, setFilteredAudits] = useState<IAudit[]>([]);
  const [allFilteredAudits, setAllFilteredAudits] = useState<IAudit[]>([]); // Store all filtered audits when searching
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const [assignedToMe, setAssignedToMe] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>(''); // Track last search query to detect changes
  const [saveRecentSearch] = useMutation(SAVE_RECENT_SEARCH);

  // Sync search query from URL to search bar context
  useEffect(() => {
    if (searchQuery) {
      setSearchText(searchQuery);
    }
  }, [searchQuery, setSearchText]);
  const {
    sortOrder: sortOrderState,
    sortType: sortTypeState,
    setSortType: setSortTypeOriginal,
    setSortOrder: setSortOrderOriginal,
  } = useSort([], 'auditor.displayName', 'asc');
  // When searching, fetch a large number of audits to allow client-side filtering
  // Otherwise use normal pagination
  // IMPORTANT: When searching, always use limit: 10000, offset: 0 regardless of currentPage/pageSize
  // This prevents the query from refetching with wrong pagination when user changes page/pageSize
  // Use useMemo to stabilize variables when searching - prevents unnecessary refetches
  // When searching, variables should NOT depend on pageSize or currentPage to prevent refetches
  const queryVariables = useMemo(() => {
    if (searchQuery) {
      // When searching, always use these fixed values (don't depend on pageSize/currentPage)
      return {
        pagination: {
          limit: 10000,
          offset: 0,
          sortBy: sortTypeState,
          sortDirection: sortOrderState,
        },
      };
    } else {
      // When not searching, use normal pagination
      return {
        pagination: {
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
          sortBy: sortTypeState,
          sortDirection: sortOrderState,
        },
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchQuery,
    sortTypeState,
    sortOrderState,
    // Conditionally include pageSize and currentPage - only when NOT searching
    // This prevents the query from refetching when pagination changes during search
    ...(searchQuery ? [] : [pageSize, currentPage]),
  ]);

  const { data, loading, error, refetch } = useQuery(GET_AUDITS, {
    variables: queryVariables,
    // When searching, always fetch fresh data to avoid stale cache issues
    fetchPolicy: searchQuery ? 'network-only' : 'cache-first',
    skip: false,
  });

  // Track sorting transition state
  const [isSorting, setIsSorting] = useState(false);
  const sortTypeRef = useRef<string>(sortTypeState);
  const sortOrderRef = useRef<'asc' | 'desc'>(sortOrderState);

  // Update refs when sort state changes
  useEffect(() => {
    sortTypeRef.current = sortTypeState;
    sortOrderRef.current = sortOrderState;
  }, [sortTypeState, sortOrderState]);

  const scheduleHideSortingState = () => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        setIsSorting(false);
      }, 100);
    });
  };

  // Wrapper functions that show loading immediately and use startTransition
  const setSortType = useCallback(
    (newSortType: string) => {
      if (newSortType !== sortTypeRef.current) {
        flushSync(() => {
          setIsSorting(true);
        });

        startTransition(() => {
          setSortTypeOriginal(newSortType);
        });

        requestAnimationFrame(() => {
          scheduleHideSortingState();
        });
      }
    },
    [setSortTypeOriginal],
  );

  const setSortOrder = useCallback(
    (newSortOrder: 'asc' | 'desc') => {
      if (newSortOrder !== sortOrderRef.current) {
        // Immediately show loading state
        flushSync(() => {
          setIsSorting(true);
        });

        // Use startTransition to defer the sorting work
        startTransition(() => {
          setSortOrderOriginal(newSortOrder);
        });

        // Hide loading after sort completes
        requestAnimationFrame(() => {
          scheduleHideSortingState();
        });
      }
    },
    [setSortOrderOriginal],
  );

  // Use the state values for display
  const sortType = sortTypeState;
  const sortOrder = sortOrderState;

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
      // When applying from context, use the original setters to avoid showing loading
      setSortTypeOriginal(sortingState.sortType);
      setSortOrderOriginal(sortingState.sortOrder);
      // Reset the flag after state updates
      setTimeout(() => {
        isApplyingFromContext.current = false;
      }, 0);
    }
    prevSortingStateRef.current = sortingState;
  }, [sortingState, setSortTypeOriginal, setSortOrderOriginal]);

  // Update context when local sorting changes (but not when applying from context)
  useEffect(() => {
    if (!isApplyingFromContext.current) setSortingState({ sortType, sortOrder });
  }, [sortType, sortOrder, setSortingState]);
  const sortBy = [
    { label: 'Due date', key: 'dueDate' },
    { label: capitalize(t('location')), key: 'location.name' },
    { label: 'Status', key: 'status' },
    { label: 'Walk type', key: 'walkType' },
    { label: 'Auditor', key: 'auditor.displayName' },
    { label: 'Reference', key: 'reference' },
    { label: 'Date submitted', key: 'completedDate' },
  ];
  // Initialize viewMode from localStorage to prevent flash of default view
  const [viewMode, setViewModeState] = useState<TViewMode>(() => {
    if (typeof window !== 'undefined') {
      const savedView = localStorage.getItem('viewMode') as TViewMode;
      if (savedView && ['list', 'panel'].includes(savedView)) {
        return savedView;
      }
    }
    return 'list';
  });

  // Track view transition state to show loading during switch
  const [isViewTransitioning, setIsViewTransitioning] = useState(false);
  const prevViewModeRef = useRef<TViewMode>(viewMode);
  // Use a ref to track current viewMode to avoid stale closure issues
  const viewModeRef = useRef<TViewMode>(viewMode);

  // Update ref when viewMode changes
  useEffect(() => {
    viewModeRef.current = viewMode;
    prevViewModeRef.current = viewMode;
  }, [viewMode]);

  // Custom setViewMode that immediately shows loading and uses startTransition
  const setViewMode = useCallback((newViewMode: TViewMode) => {
    // Use ref to check current value to avoid stale closure
    if (newViewMode !== viewModeRef.current) {
      // Immediately show loading state synchronously (before any transitions)
      flushSync(() => {
        setIsViewTransitioning(true);
      });

      // Use startTransition to mark the view change as a non-urgent update
      // This allows React to keep the UI responsive during the transition
      startTransition(() => {
        setViewModeState(newViewMode);
        localStorage.setItem('viewMode', newViewMode);
      });

      // Hide loading after the transition completes
      // Use a slightly longer delay to ensure the new view has rendered
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            setIsViewTransitioning(false);
          }, 150);
        });
      });
    }
  }, []); // Empty deps array since we use ref

  // Helper function to save recent search and navigate
  const handleAuditClick = useCallback(
    (audit: IAudit) => {
      // Save to recent searches if there's a search query in the URL
      if (searchQuery && user?.userId) {
        saveRecentSearch({
          variables: {
            saveRecentSearchInput: {
              userId: user.userId,
              text: audit.reference || audit.auditType?.name || '',
            },
          },
        }).catch((error) => {
          console.error('Failed to save recent search:', error);
        });
      }
      navigateTo(`/audits/${audit._id}`);
    },
    [navigateTo, searchQuery, user, saveRecentSearch],
  );

  const columns: ColumnConfig[] = useMemo(
    () => [
      {
        label: 'Due date',
        sortKey: 'dueDate',
        width: '9%',
        dataId: '000309',
        render: (row) => <DateTimeCell data-id="002149" date={row?.dueDate} fallbackText="No due date" showTime={false} />,
      },
      {
        label: capitalize(t('location')),
        sortKey: 'location.name',
        width: module?.featureFlags?.enableSafetyWalk ? '20%' : '12%',
        dataId: '000310',
        render: (row) => <TextOrNumberCell data-id="002087" fallbackText="Virtual" icon={LocationIcon} text={row.location?.name} />,
      },
      {
        label: 'Status',
        sortKey: 'status',
        width: '12%',
        dataId: '000311',
        render: (row) => <StatusCell data-id="001212" status={row?.status} />,
      },
      {
        label: 'Walk type',
        sortKey: 'walkType',
        width: '9%',
        dataId: '000312',
        disabled: !module?.featureFlags?.enableSafetyWalk,
        render: (row) => <TextOrNumberCell data-id="002088" text={auditWalkTypes[row?.walkType]} />,
      },
      {
        label: 'Auditor',
        sortKey: 'auditor.displayName',
        width: '18%',
        dataId: '000313',
        render: (row) => <AvatarCell data-id="001206" users={row.auditor ? [row.auditor] : []} userType="auditors" />,
      },
      {
        label: 'Reference',
        sortKey: 'reference',
        width: '13%',
        dataId: '000314',
        render: (row) => <TextOrNumberCell data-id="002089" text={row.reference} />,
      },
      {
        label: 'Date submitted',
        sortKey: 'completedDate',
        width: '10%',
        dataId: '000315',
        render: (row) => (
          <DateTimeCell
            data-id="002150"
            date={row?.status === 'completed' && row?.completedDate}
            fallbackText="No submitted date"
            showTime
          />
        ),
      },
      {
        label: 'View',
        sortKey: '',
        width: '7%',
        dataId: '000316',
        disableSort: true,
        render: (row) => (
          <Button
            data-id="002091"
            onClick={(e) => {
              e.stopPropagation();
              handleAuditClick(row);
            }}
            size="sm"
            variant="outline"
          >
            View
          </Button>
        ),
      },
    ],
    [t, module?.featureFlags?.enableSafetyWalk, handleAuditClick],
  );
  const handleAssignedToMeToggle = (isChecked: boolean) => {
    setAssignedToMe(isChecked);

    if (!user || !module) return;

    const myId = String(user.userId ?? user._id ?? '');
    const filterValue = isChecked ? { auditorsIds: myId ? [myId] : [], participantsIds: [] } : { auditorsIds: [], participantsIds: [] };

    updateLocalStorageFilter(module._id, 'usersIds', 'User', filterValue, user._id, applyFiltersImmediately);
  };

  const allowedFilters = useMemo(() => {
    const filters: string[] = [];
    if (module?.featureFlags?.enableSafetyWalk) filters.push('walkType');
    filters.push('status', 'locationsIds', 'businessUnitsIds', 'usersIds', 'createdDate', 'dueDate', 'showArchived');
    return filters;
  }, [module]);

  const handleRowClick = useCallback(
    (row: IAudit) => {
      handleAuditClick(row);
    },
    [handleAuditClick],
  );

  useEffect(() => {
    if (!user || usedFilters.length === 0) return;
    const stored = localStorage.getItem(`${module?._id}-filters-${user.userId}`);

    if (!stored) {
      setFiltersInitialized(true);
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      const validFilters = Object.entries(parsed).reduce(
        (acc, [key, filter]) => {
          const value = (filter as { value: any })?.value;
          const isValidArray = Array.isArray(value) && value.length > 0;
          const isValidObject = typeof value === 'object' && value !== null && Object.keys(value).length > 0;
          if (isValidArray || isValidObject) acc[key] = { value };
          return acc;
        },
        {} as Record<string, { value: any }>,
      );

      if (Object.keys(validFilters).length > 0) {
        const plainValues = Object.entries(validFilters).reduce((acc, [key, val]) => ({ ...acc, [key]: val.value }), {});
        setDefaultFilters(plainValues);
        setAuditFiltersValue((curr) => ({ ...curr, ...validFilters }));
        // Don't set filtersInitialized here - let it be set after filters are applied
      } else setFiltersInitialized(true);
    } catch (err) {
      setFiltersInitialized(true);
    }
  }, [user, usedFilters]);

  useEffect(() => {
    const buValue = filtersValues?.businessUnitsIds?.value;
    const ready = Array.isArray(buValue) && buValue.length > 0;
    if (ready && !filtersInitialized) setFiltersInitialized(true);
  }, [filtersValues, filtersInitialized]);

  useEffect(() => {
    setUsedFilters(allowedFilters);
    return () => {
      setDefaultFilters({});
      setShowFiltersPanel(false);
      setUsedFilters([]);
    };
  }, [allowedFilters]);

  // Fallback to ensure filtersInitialized gets set
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!filtersInitialized) setFiltersInitialized(true);
    }, 2000); // 2 second timeout

    return () => clearTimeout(timeout);
  }, [filtersInitialized]);

  useEffect(() => {
    if (auditFiltersValue && !isEmpty(auditFiltersValue) && !isEmpty(filtersValues) && !isEmpty(usedFilters)) {
      const delayFilters = setTimeout(() => {
        const newFilters = Object.entries(auditFiltersValue).reduce((acc, [key, value]) => ({ ...acc, [key]: value.value }), {});
        setFilters(newFilters);
        setAuditFiltersValue({});
        // Set filtersInitialized after filters are applied
        setFiltersInitialized(true);
        clearTimeout(delayFilters);
      }, 100);
    }
  }, [filtersValues, usedFilters, auditFiltersValue, setAuditFiltersValue, setFilters]);

  const parseDueDateFilter = (extractedValue: any) => {
    if (!Array.isArray(extractedValue) || extractedValue.length === 0) return typeof extractedValue === 'string' ? extractedValue : null;

    // Support both shapes:
    // 1) ['dateRange', startDate, endDate]
    // 2) [['dateRange', startDate, endDate]]
    if (Array.isArray(extractedValue[0])) {
      const [nestedArray] = extractedValue;
      return nestedArray;
    }
    if (extractedValue[0] === 'dateRange') {
      const [filter, start, end] = extractedValue;
      return [filter, start, end ?? null];
    }
    if (extractedValue.length === 1 && typeof extractedValue[0] === 'string') {
      // Simple date array: ['date'] -> just the date string
      const [date] = extractedValue;
      return date;
    }
    // Exact date format: ['exactDate', date] -> [filter, startDate, undefined]
    const [filter, date] = extractedValue;
    return [filter, date, undefined];
  };

  const parseUsersIdsFilter = (extractedValue: any) => {
    if (typeof extractedValue !== 'object') return extractedValue;
    if (!extractedValue.auditorsIds?.length && !extractedValue.participantsIds?.length) return null;
    return extractedValue;
  };

  const isValidFilterValue = (value: any) => value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0);

  useEffect(() => {
    if (!appliedFilters) return;

    const parsedFilters = Object.entries(appliedFilters).reduce((acc, [key, value]) => {
      if (!value || !allowedFilters.includes(key)) return acc;

      let extractedValue = value?.value;

      if (key === 'dueDate') extractedValue = parseDueDateFilter(extractedValue);
      else if (key === 'usersIds') extractedValue = parseUsersIdsFilter(extractedValue);

      if (!isValidFilterValue(extractedValue)) return acc;

      return { ...acc, [key]: extractedValue };
    }, {});

    // Reset to page 1 when filters change
    setCurrentPage(1);

    if (Object.keys(parsedFilters).length > 0) {
      refetch({
        auditQueryInput: parsedFilters,
        pagination: {
          limit: pageSize,
          offset: 0,
          sortBy: sortTypeState,
          sortDirection: sortOrderState,
        },
      });
    }

    // Safely check for auditorsIds array and userId match
    const { auditorsIds } = (appliedFilters as any)?.usersIds?.value || {};
    if (Array.isArray(auditorsIds) && auditorsIds.length === 1 && auditorsIds[0] === user?.userId) setAssignedToMe(true);
    else setAssignedToMe(false);
  }, [appliedFilters, user?.userId, pageSize, sortTypeState, sortOrderState, refetch, allowedFilters]);

  // Reset to page 1 when search query changes and refetch data
  useEffect(() => {
    if (searchQuery) {
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
      // Refetch data when search query is present to ensure fresh results
      // This handles the case when navigating back to the page with search query
      // Always use limit: 10000, offset: 0 when searching
      refetch({
        pagination: {
          limit: 10000,
          offset: 0,
          sortBy: sortTypeState,
          sortDirection: sortOrderState,
        },
      });
    } else {
      // Clear allFilteredAudits when search query is removed
      setAllFilteredAudits([]);
      setLastSearchQuery('');
    }
  }, [searchQuery, refetch, sortTypeState, sortOrderState]);

  // When searching, paginate filtered audits client-side when page or pageSize changes
  useEffect(() => {
    if (searchQuery && allFilteredAudits.length > 0) {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedAudits = allFilteredAudits.slice(startIndex, endIndex);
      setFilteredAudits(paginatedAudits);
      // CRITICAL: Always set total to the full filtered count, never the current page count
      // This ensures pagination shows correct total even when pageSize changes
      setTotal(allFilteredAudits.length);
    }
  }, [currentPage, pageSize, searchQuery, allFilteredAudits, setTotal]);

  useEffect(() => {
    if (data?.audits && !error) {
      // Handle both array and object with audits property
      const auditsArray = Array.isArray(data.audits) ? data.audits : (data.audits?.audits || []);
      let audits = auditsArray;
      
      // Apply search filter if search query exists
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        audits = audits.filter((audit) => {
          // Search in reference
          if (audit.reference?.toLowerCase().includes(query)) return true;
          // Search in auditType name
          if (audit.auditType?.name?.toLowerCase().includes(query)) return true;
          // Search in business unit name
          if (audit.businessUnit?.name?.toLowerCase().includes(query)) return true;
          // Search in auditor display name
          if (audit.auditor?.displayName?.toLowerCase().includes(query)) return true;
          return false;
        });
        
        // Store all filtered audits for client-side pagination
        // CRITICAL: Prevent overwriting correct data with stale cached data
        // When we already have filtered data and search query matches, preserve it
        // Only update if:
        // 1. No existing filtered data yet (initial load)
        // 2. New search query (different search)
        // 3. Large raw dataset (>= 100) suggests it's the full fetch, not stale paginated data
        const hasExistingData = allFilteredAudits.length > 0;
        const isSameSearch = searchQuery === lastSearchQuery;
        const isNewSearch = lastSearchQuery === '';
        const isLargeDataset = auditsArray.length >= 100;
        
        // Update only if we don't have existing data, OR it's a new search, OR we have a large dataset
        // This prevents stale cached data from overwriting correct data when pageSize changes
        if (!hasExistingData || isNewSearch || isLargeDataset) {
          setAllFilteredAudits(audits);
          // Set total to filtered count (client-side filtering)
          setTotal(audits.length);
          setLastSearchQuery(searchQuery);
        }
        // If we have existing data and it's the same search, preserve it - don't overwrite with stale data
      } else {
        // Set total from data if available (when not searching)
        if (!Array.isArray(data.audits) && data.audits?.total !== undefined) {
          setTotal(data.audits.total);
        } else {
          setTotal(audits.length);
        }
        // When not searching, use all audits (server-side pagination)
        setAllFilteredAudits([]);
        setFilteredAudits(audits);
        setLastSearchQuery('');
      }
    }
  }, [data?.audits, searchQuery, error, setTotal, lastSearchQuery]);

  // Refetch when pagination or sorting changes (but not when searching - we paginate client-side)
  useEffect(() => {
    if (filtersInitialized && !searchQuery) {
      const parsedFilters = Object.entries(appliedFilters || {}).reduce((acc, [key, value]) => {
        if (!value || !allowedFilters.includes(key)) return acc;

        let extractedValue = value?.value;

        if (key === 'dueDate') extractedValue = parseDueDateFilter(extractedValue);
        else if (key === 'usersIds') extractedValue = parseUsersIdsFilter(extractedValue);

        if (!isValidFilterValue(extractedValue)) return acc;

        return { ...acc, [key]: extractedValue };
      }, {});

      refetch({
        auditQueryInput: Object.keys(parsedFilters).length > 0 ? parsedFilters : undefined,
        pagination: {
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
          sortBy: sortTypeState,
          sortDirection: sortOrderState,
        },
      });
    }
  }, [currentPage, pageSize, sortTypeState, sortOrderState, filtersInitialized, searchQuery, refetch, appliedFilters]);

  // Sync assignedToMe state with current filter state
  useEffect(() => {
    if (!filtersInitialized || !appliedFilters) return;

    const myIds = getMyIds(user || undefined);
    const currentUsersFilter = (appliedFilters as any).usersIds?.value;

    setAssignedToMe(isAssignedToMeFilter(currentUsersFilter, myIds));
  }, [(appliedFilters as any)?.usersIds, user?._id, user?.userId, filtersInitialized]);

  const onCloseModal = async () => {
    await trigger();
    reset();
    setAdminModalState('closed');
  };

  const csvHeaders = [
    { label: '_id', key: '_id' },
    { label: 'Audit type', key: 'auditType.name' },
    { label: 'Walk type', key: 'walkType' },
    { label: 'Status', key: 'status' },
    { label: capitalize(t('business unit')), key: 'businessUnit.name' },
    { label: capitalize(t('location')), key: 'location.name' },
    { label: 'Auditor', key: 'auditor.displayName' },
    { label: 'Participants', key: 'participants' },
  ];

  const csvData = useMemo(
    () =>
      (filteredAudits ?? []).map(({ participantsIds, auditorId, reference, metatags, ...audit }) => ({
        ...audit,
        dueDate: audit?.dueDate ? format(new Date(audit?.dueDate), 'd MMM yyyy') : 'No due date',
        participants: audit?.participants?.map((participant) => participant.displayName).join(', '),
      })),
    [JSON.stringify(filteredAudits)],
  );

  // Memoize panel config to prevent unnecessary re-renders
  const panelConfig = useMemo(
    () => ({
      ...auditPanelConfig,
      actions: {
        ...auditPanelConfig.actions,
        primary: {
          ...auditPanelConfig.actions.primary!,
          onClick: handleAuditClick,
        },
        panelClick: {
          onClick: handleAuditClick,
        },
      },
    }),
    [handleAuditClick],
  );

  // Memoize panel view component
  const panelViewComponent = useMemo(
    () =>
      filteredAudits?.length > 0 ? (
        <PanelView
          config={panelConfig}
          data-id="002176"
          dataSourceName="audits"
          items={filteredAudits}
          currentPage={currentPage}
          pageSize={pageSize}
          total={total}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      ) : (
        <NoRecordsFound data-id="000202" dataSourceName="audits" height="100%" />
      ),
    [filteredAudits, panelConfig],
  );

  // Memoize list view component
  const listViewComponent = useMemo(
    () => (
      <ListView
        columns={columns}
        data={filteredAudits}
        data-id="000201"
        dataType="audits"
        onRowClick={handleRowClick}
        setSortOrder={setSortOrder}
        setSortType={setSortType}
        sortOrder={sortOrder}
        sortType={sortType}
        currentPage={currentPage}
        pageSize={pageSize}
        total={total}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    ),
    [columns, filteredAudits, handleRowClick, setSortOrder, setSortType, sortOrder, sortType, currentPage, pageSize, total],
  );

  // Update ref when viewMode changes (for tracking)
  useEffect(() => {
    prevViewModeRef.current = viewMode;
  }, [viewMode]);

  // Helper function to render main content
  const renderMainContent = () => {
    if (loading) return <Loader center data-id="000197" />;

    // Show loading during view transition or sorting
    if (isViewTransitioning || isSorting) {
      return <Loader center data-id="000197" />;
    }

    if (viewMode === 'list') {
      return listViewComponent;
    }

    if (viewMode === 'panel') {
      return panelViewComponent;
    }

    // Default to panel view
    return panelViewComponent;
  };

  const isAuditPageValue = isAuditPage(isPathActive);

  return (
    <>
      <Modal
        data-id="000186"
        isOpen={adminModalState !== 'closed'}
        key={audit._id}
        onClose={onCloseModal}
        size={device === 'desktop' || device === 'tablet' || adminModalState === 'delete' ? '2xl' : 'full'}
        variant={adminModalState === 'delete' ? 'deleteModal' : 'conformeModal'}
      >
        <ModalOverlay data-id="000187" />
        <AuditModal data-id="000188" refetch={refetch} />
      </Modal>
      <Header breadcrumbs={[pluralize(t('audit'))]} data-id="000189" mobileBreadcrumbs={[pluralize(t('audit'))]}>
        <Flex data-id="001519" direction="row" justifyContent="space-between" pl={[0, 0, '6']} w="full">
          <AssignedToMeFilter data-id="001204" isChecked={assignedToMe} onToggle={handleAssignedToMeToggle} />

          <Flex data-id="001520" direction="row">
            <ChangeViewButton data-id="000190" setViewMode={setViewMode} viewMode={viewMode} views={['list', 'panel']} />

            {device !== 'mobile' && (
              <>
                <CSVLinkComponent data={csvData} data-id="000191" filename="audits.csv" headers={csvHeaders} target="_blank">
                  <Button
                    _hover={{
                      bg: 'reasponseHeader.buttonLightBgHover',
                      color: 'reasponseHeader.buttonLightColorHover',
                      cursor: 'pointer',
                      '&:hover svg path': { stroke: 'white' },
                    }}
                    bg="white"
                    borderRadius="10px"
                    data-id="000192"
                    display="none"
                    ml="15px"
                    rightIcon={<ExportIcon data-id="000193" height="15px" width="15px" />}
                  >
                    <Text data-id="000194" fontSize="smm" fontWeight="bold">
                      Export
                    </Text>
                  </Button>
                </CSVLinkComponent>

                <Divider borderColor="gray.300" data-id="000290" height="30px" mt={1} mx={4} orientation="vertical" />
              </>
            )}

            <Flex gap={2} data-id="001523" direction="row">
              <SortButton
                data-id="000195"
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


      <Flex data-id="000196" h="full" overflow="auto">
        {renderMainContent()}
      </Flex>
    </>
  );
}

function AuditsWithContext() {
  return (
    <AuditModalProvider data-id="000205">
      <Audits data-id="000206" />
    </AuditModalProvider>
  );
}

export default AuditsWithContext;

export const auditsStyles = {
  auditsItems: {
    header: {
      menuButtonBg: 'white',
      rightIcon: '#9A9EA1',
      menuItemFocus: '#462AC4',
      menuItemFontSelected: '#462AC4',
      menuItemFont: '#9A9EA1',
    },
  },
};
