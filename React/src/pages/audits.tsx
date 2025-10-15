import { useEffect, useMemo, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';

import { gql, useQuery } from '@apollo/client';
import { Button, Flex, Grid, Modal, ModalOverlay, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { capitalize, isEmpty } from 'lodash';
import pluralize from 'pluralize';

import AuditSquare from '../components/Audit/AuditSquare';
import AuditModal from '../components/AuditModal/AuditModal';
import ChangeViewButton from '../components/ChangeViewButton';
import AssignedToMeFilter from '../components/Filters/AssignedToMeFilter';
import Header from '../components/Header';
import Loader from '../components/Loader';
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
  query ($auditQueryInput: AuditQueryInput) {
    audits(auditQueryInput: $auditQueryInput) {
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
  }
`;

function Audits() {
  const { t } = useTranslation();
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
  const { navigateTo } = useNavigate();
  const { user, module } = useAppContext();
  const { adminModalState, setAdminModalState } = useAdminContext();
  const { audit, reset, trigger } = useAuditModalContext();
  const { data, loading, error, refetch } = useQuery(GET_AUDITS);
  const [filteredAudits, setFilteredAudits] = useState<IAudit[]>([]);
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const [assignedToMe, setAssignedToMe] = useState(false);
  const {
    sortedData: sortedAudits,
    sortOrder,
    sortType,
    setSortType,
    setSortOrder,
  } = useSort(filteredAudits, 'auditor.displayName', 'asc');

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
  const sortBy = [
    { label: 'Due date', key: 'dueDate' },
    { label: capitalize(t('location')), key: 'location.name' },
    { label: 'Status', key: 'status' },
    { label: 'Walk type', key: 'walkType' },
    { label: 'Auditor', key: 'auditor.displayName' },
    { label: 'Reference', key: 'reference' },
    { label: 'Date submitted', key: 'completedDate' },
  ];
  const [viewMode, setViewMode] = useState<TViewMode>('grid');
  const columns: ColumnConfig[] = [
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
        <DateTimeCell data-id="002150" date={row?.status === 'completed' && row?.completedDate} fallbackText="No submitted date" showTime />
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
            navigateTo(`/audits/${row._id}`);
          }}
          size="sm"
          variant="outline"
        >
          View
        </Button>
      ),
    },
  ];
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

    if (Object.keys(parsedFilters).length > 0) refetch({ auditQueryInput: parsedFilters });

    // Safely check for auditorsIds array and userId match
    const { auditorsIds } = (appliedFilters as any)?.usersIds?.value || {};
    if (Array.isArray(auditorsIds) && auditorsIds.length === 1 && auditorsIds[0] === user?.userId) setAssignedToMe(true);
    else setAssignedToMe(false);
  }, [appliedFilters, user?.userId]);

  useEffect(() => {
    if (data && data?.audits && !error) setFilteredAudits(data?.audits);
  }, [data?.audits]);

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

  // Helper function to render empty state
  const renderEmptyState = (dataId: string) => (
    <Flex alignItems="center" data-id={dataId} fontSize="18px" fontStyle="italic" h="200px" justifyContent="center" w="full">
      No audits found. Try adjusting the filters.
    </Flex>
  );

  // Helper function to render grid view
  const renderGridView = () => (
    <Grid
      data-id="000198"
      display={['grid', 'grid', 'flex']}
      flexWrap="wrap"
      gap={[4, 4, 6]}
      h="fit-content"
      pb={[14, 8]}
      pt="3"
      px={[4, 8]}
      templateColumns={['repeat(auto-fill, minmax(250px, 1fr))', '']}
      w="full"
    >
      {sortedAudits.length > 0
        ? sortedAudits.map((audit) => <AuditSquare audit={audit} data-id="000199" key={audit._id} />)
        : renderEmptyState('000200')}
    </Grid>
  );

  const renderPanelView = () =>
    sortedAudits?.length > 0 ? (
      <PanelView
        config={{
          ...auditPanelConfig,
          actions: {
            ...auditPanelConfig.actions,
            primary: {
              ...auditPanelConfig.actions.primary!,
              onClick: (audit: IAudit) => navigateTo(`/audits/${audit._id}`),
            },
            panelClick: {
              onClick: (audit: IAudit) => navigateTo(`/audits/${audit._id}`),
            },
          },
        }}
        data-id="002176"
        items={sortedAudits}
      />
    ) : (
      <Flex alignItems="center" data-id="000202" fontSize="18px" fontStyle="italic" h="200px" justifyContent="center" w="full">
        No audits found. Try adjusting the filters.
      </Flex>
    );

  // Helper function to render main content
  const renderMainContent = () => {
    if (loading) return <Loader center data-id="000197" />;

    if (viewMode === 'grid') return renderGridView();

    if (viewMode === 'list') {
      return (
        <ListView
          columns={columns}
          data={sortedAudits}
          data-id="000201"
          dataType="audits"
          onRowClick={(row: IAudit) => navigateTo(`/audits/${row._id}`)}
          setSortOrder={setSortOrder}
          setSortType={setSortType}
          sortOrder={sortOrder}
          sortType={sortType}
        />
      );
    }

    if (viewMode === 'panel') return renderPanelView();

    // Default to panel view
    return renderPanelView();
  };

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
        <Flex data-id="001519" direction="row" justifyContent="space-between" pl="6" w="full">
          <AssignedToMeFilter data-id="001204" isChecked={assignedToMe} onToggle={handleAssignedToMeToggle} />

          <Flex data-id="001520" direction="row">
            <ChangeViewButton data-id="000190" setViewMode={setViewMode} viewMode={viewMode} views={['grid', 'list', 'group', 'panel']} />

            {device !== 'mobile' && (
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
            )}

            <SortButton
              data-id="000195"
              setSortOrder={setSortOrder}
              setSortType={setSortType}
              sortBy={sortBy}
              sortOrder={sortOrder}
              sortType={sortType}
            />
          </Flex>
        </Flex>
      </Header>
      <Flex data-id="000196" h={['calc(100vh - 80px)', 'full']} overflow="auto" pb={[4, 0]}>
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
