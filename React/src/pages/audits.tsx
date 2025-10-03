import { useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';

import { gql, useQuery } from '@apollo/client';
import { Button, Flex, Grid, Modal, ModalOverlay, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { capitalize, isEmpty } from 'lodash';
import pluralize from 'pluralize';

import AuditsGroup from '../components/Audit/AuditsGroup';
import AuditsList from '../components/Audit/AuditsList';
import AuditSquare from '../components/Audit/AuditSquare';
import AuditModal from '../components/AuditModal/AuditModal';
import ChangeViewButton from '../components/ChangeViewButton';
import AssignedToMeFilter from '../components/Filters/AssignedToMeFilter';
import Header from '../components/Header';
import Loader from '../components/Loader';
import SortButton from '../components/SortButton';
import { useAdminContext } from '../contexts/AdminProvider';
import { useAppContext } from '../contexts/AppProvider';
import AuditModalProvider, { useAuditModalContext } from '../contexts/AuditModalProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';
import useSort from '../hooks/useSort';
import { ExportIcon } from '../icons';
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
    setUsedFilters,
    setFilters,
    setDefaultFilters,
    setShowFiltersPanel,
    auditFiltersValue,
    setAuditFiltersValue,
    usedFilters,
  } = useFiltersContext();
  const device = useDevice();
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
  const sortBy = [
    { label: 'Due date', key: 'dueDate' },
    { label: capitalize(t('location')), key: 'location.name' },
    { label: 'Status', key: 'status' },
    { label: 'Walk type', key: 'walkType' },
    { label: 'Auditor', key: 'auditor.displayName' },
    { label: 'Date submitted', key: 'completedDate' },
  ];
  const [viewMode, setViewMode] = useState<TViewMode>('grid');

  const handleAssignedToMeToggle = (isChecked: boolean) => {
    setAssignedToMe(isChecked);

    if (!user || !module) return;

    const myId = String(user.userId ?? user._id ?? '');
    const filterValue = isChecked ? { auditorsIds: myId ? [myId] : [], participantsIds: [] } : { auditorsIds: [], participantsIds: [] };

    updateLocalStorageFilter(module._id, 'usersIds', 'User', filterValue, user._id, setFilters);
  };

  const allowedFilters = useMemo(() => {
    const filters: string[] = [];
    if (module?.featureFlags?.enableSafetyWalk) filters.push('walkType');
    filters.push('status', 'locationsIds', 'businessUnitsIds', 'usersIds', 'createdDate', 'dueDate', 'showArchived');
    return filters;
  }, [module]);

  useEffect(() => {
    if (!user || usedFilters.length === 0) return;
    const stored = localStorage.getItem(`${module?._id}-filters-${user._id}`);

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
      console.error('Failed to parse stored filters', err);
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

  useEffect(() => {
    const parsedFilters = Object.entries(filtersValues).reduce((acc, [key, value]) => {
      if (!value || !allowedFilters.includes(key)) return acc;
      let extractedValue = value?.value;
      if (key === 'dueDate') {
        if (Array.isArray(extractedValue) && extractedValue.length > 0) extractedValue = extractedValue[0];
        else if (typeof extractedValue !== 'string') return acc;
      }
      if (key === 'usersIds' && typeof extractedValue === 'object')
        if (!extractedValue.auditorsIds?.length && !extractedValue.participantsIds?.length) return acc;
      if (extractedValue === undefined || extractedValue === null || (Array.isArray(extractedValue) && extractedValue.length === 0))
        return acc;
      return { ...acc, [key]: extractedValue };
    }, {});

    if (Object.keys(parsedFilters).length > 0) refetch({ auditQueryInput: parsedFilters });

    // Safely check for auditorsIds array and userId match
    const auditorsIds = (filtersValues?.usersIds?.value as any)?.auditorsIds;
    if (Array.isArray(auditorsIds) && auditorsIds.length === 1 && auditorsIds[0] === user?.userId) 
      setAssignedToMe(true);
     else 
      setAssignedToMe(false);
    
  }, [filtersValues, user?.userId]);

  useEffect(() => {
    if (data && data?.audits && !error) setFilteredAudits(data?.audits);
  }, [data?.audits]);

  // Sync assignedToMe state with current filter state
  useEffect(() => {
    if (!filtersInitialized) return;

    const myIds = getMyIds(user || undefined);
    const currentUsersFilter = filtersValues.usersIds?.value;

    setAssignedToMe(isAssignedToMeFilter(currentUsersFilter, myIds));
  }, [filtersValues.usersIds, user?._id, user?.userId, filtersInitialized]);

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

  // Helper function to render list view
  const renderListView = () => {
    if (sortedAudits.length > 0) {
      return (
        <AuditsList
          audits={sortedAudits}
          data-id="000201"
          setSortOrder={setSortOrder}
          setSortType={setSortType}
          sortOrder={sortOrder}
          sortType={sortType}
        />
      );
    }
    return renderEmptyState('000202');
  };

  // Helper function to render group view
  const renderGroupView = () => {
    if (sortedAudits.length > 0) return <AuditsGroup audits={sortedAudits} data-id="000203" />;

    return renderEmptyState('000204');
  };

  // Helper function to render main content
  const renderMainContent = () => {
    if (loading) return <Loader center data-id="000197" />;

    if (viewMode === 'grid') return renderGridView();

    if (viewMode === 'list') return renderListView();

    return renderGroupView();
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
        <AssignedToMeFilter data-id="001204" isChecked={assignedToMe} onToggle={handleAssignedToMeToggle} />
        <ChangeViewButton data-id="000190" setViewMode={setViewMode} viewMode={viewMode} views={['grid', 'list', 'group']} />

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
