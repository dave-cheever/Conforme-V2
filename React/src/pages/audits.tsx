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

const CSVLinkComponent = CSVLink as unknown as React.FC<any>;

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
  const [ filteredAudits, setFilteredAudits] = useState<IAudit[]>([]);
  const [ filtersInitialized, setFiltersInitialized] = useState(false);
  const { sortedData: sortedAudits, sortOrder, sortType, setSortType, setSortOrder } = useSort(filteredAudits, 'auditor.displayName', 'asc');
  const sortBy = [
    { label: 'Due date', key: 'dueDate' },
    { label: capitalize(t('location')), key: 'location.name' },
    { label: 'Status', key: 'status' },
    { label: 'Walk type', key: 'walkType' },
    { label: 'Auditor', key: 'auditor.displayName' },
    { label: 'Date submitted', key: 'completedDate' },
  ];
  const [viewMode, setViewMode] = useState<TViewMode>('grid');

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
      const validFilters = Object.entries(parsed).reduce((acc, [key, filter]) => {
        const value = (filter as { value: any })?.value;
        const isValidArray = Array.isArray(value) && value.length > 0;
        const isValidObject = typeof value === 'object' && value !== null && Object.keys(value).length > 0;
        if (isValidArray || isValidObject) acc[key] = { value };
        return acc;
      }, {} as Record<string, { value: any }>);
      if (Object.keys(validFilters).length > 0) {
        const plainValues = Object.entries(validFilters).reduce((acc, [key, val]) => ({ ...acc, [key]: val.value }), {});
        setDefaultFilters(plainValues);
        setAuditFiltersValue((curr) => ({ ...curr, ...validFilters }));
      } else 
        setFiltersInitialized(true);
      
    } catch (err) {
      console.error("Failed to parse stored filters", err);
      setFiltersInitialized(true);
    }
  }, [user, usedFilters]);

  useEffect(() => {
    const buValue = filtersValues?.businessUnitsIds?.value;
    const ready = Array.isArray(buValue) && buValue.length > 0;
    if (ready && !filtersInitialized) 
      setFiltersInitialized(true);
    
  }, [filtersValues, filtersInitialized]);

  useEffect(() => {
    setUsedFilters(allowedFilters);
    return () => {
      setDefaultFilters({});
      setShowFiltersPanel(false);
      setUsedFilters([]);
    };
  }, [allowedFilters]);

  useEffect(() => {
    if (auditFiltersValue && !isEmpty(auditFiltersValue) && !isEmpty(filtersValues) && !isEmpty(usedFilters)) {
      const delayFilters = setTimeout(() => {
        setFilters(Object.entries(auditFiltersValue).reduce((acc, [key, value]) => ({ ...acc, [key]: value.value }), {}));
        setAuditFiltersValue({});
        clearTimeout(delayFilters);
      }, 100);
    }
  }, [filtersValues, usedFilters, auditFiltersValue, setAuditFiltersValue, setFilters]);

  useEffect(() => {
    const parsedFilters = Object.entries(filtersValues).reduce((acc, [key, value]) => {
      if (!value || !allowedFilters.includes(key)) return acc;
      let extractedValue = value?.value;
      if (key === "dueDate") {
        if (Array.isArray(extractedValue) && extractedValue.length > 0) extractedValue = extractedValue[0];
        else if (typeof extractedValue !== "string") return acc;
      }
      if (key === "usersIds" && typeof extractedValue === "object")
        if (!extractedValue.auditorsIds?.length && !extractedValue.participantsIds?.length) return acc;
      if (extractedValue === undefined || extractedValue === null || (Array.isArray(extractedValue) && extractedValue.length === 0)) return acc;
      return { ...acc, [key]: extractedValue };
    }, {});

    if (Object.keys(parsedFilters).length > 0) refetch({ auditQueryInput: parsedFilters });
  }, [filtersValues]);

  useEffect(() => {
    if (data && data?.audits && !error) setFilteredAudits(data?.audits);
  }, [data?.audits]);

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

  const csvData = useMemo(() => (filteredAudits ?? []).map(({ participantsIds, auditorId, reference, metatags, ...audit }) => ({
    ...audit,
    dueDate: audit?.dueDate ? format(new Date(audit?.dueDate), 'd MMM yyyy') : 'No due date',
    participants: audit?.participants?.map((participant) => participant.displayName).join(', '),
  })), [JSON.stringify(filteredAudits)]);

  return (
    <>
      <Modal
        data-id="030925-a17931"
        isOpen={adminModalState !== 'closed'}
        key={audit._id}
        onClose={onCloseModal}
        size={device === 'desktop' || device === 'tablet' || adminModalState === 'delete' ? '2xl' : 'full'}
        variant={adminModalState === 'delete' ? 'deleteModal' : 'conformeModal'}>
        <ModalOverlay data-id="030925-837c3f" />
        <AuditModal data-id="030925-be4d30" refetch={refetch} />
      </Modal>
      <Header
        data-id="030925-023862"
        breadcrumbs={[pluralize(t('audit'))]}
        mobileBreadcrumbs={[pluralize(t('audit'))]}>
        <ChangeViewButton
          data-id="030925-966d62"
          setViewMode={setViewMode}
          viewMode={viewMode}
          views={['grid', 'list', 'group']} />
        {device !== 'mobile' && (
          <CSVLinkComponent
            data-id="030925-3ab713"
            data={csvData}
            filename="audits.csv"
            headers={csvHeaders}
            target="_blank">
            <Button
              data-id="030925-da98ed"
              _hover={{ bg: 'reasponseHeader.buttonLightBgHover', color: 'reasponseHeader.buttonLightColorHover', cursor: 'pointer', '&:hover svg path': { stroke: 'white' } }}
              bg="white"
              borderRadius="10px"
              display="none"
              ml="15px"
              rightIcon={<ExportIcon data-id="030925-2185ba" height="15px" width="15px" />}>
              <Text data-id="030925-26d811" fontSize="smm" fontWeight="bold">Export</Text>
            </Button>
          </CSVLinkComponent>
        )}
        <SortButton
          data-id="030925-ff38a6"
          setSortOrder={setSortOrder}
          setSortType={setSortType}
          sortBy={sortBy}
          sortOrder={sortOrder}
          sortType={sortType} />
      </Header>
      <Flex
        data-id="030925-1184ba"
        h={['calc(100vh - 80px)', 'full']}
        overflow="auto"
        pb={[4, 0]}>
        {loading ? <Loader data-id="030925-44a9f5" center /> : (
          viewMode === 'grid' ? (
            <Grid
              data-id="030925-24b907"
              display={['grid', 'grid', 'flex']}
              flexWrap="wrap"
              gap={[4, 4, 6]}
              h="fit-content"
              pb={[14, 8]}
              pt="3"
              px={[4, 8]}
              templateColumns={['repeat(auto-fill, minmax(250px, 1fr))', '']}
              w="full">
              {sortedAudits.length > 0 ? sortedAudits.map((audit) => <AuditSquare data-id="030925-f7a5bb" audit={audit} key={audit._id} />) : (
                <Flex
                  data-id="030925-c21052"
                  alignItems="center"
                  fontSize="18px"
                  fontStyle="italic"
                  h="200px"
                  justifyContent="center"
                  w="full">No audits found. Try adjusting the filters.</Flex>
              )}
            </Grid>
          ) : viewMode === 'list' ? (
            sortedAudits.length > 0 ? (
              <AuditsList
                data-id="030925-34d845"
                audits={sortedAudits}
                setSortOrder={setSortOrder}
                setSortType={setSortType}
                sortOrder={sortOrder}
                sortType={sortType} />
            ) : (
              <Flex
                data-id="030925-365fe8"
                alignItems="center"
                fontSize="18px"
                fontStyle="italic"
                h="200px"
                justifyContent="center"
                w="full">No audits found. Try adjusting the filters.</Flex>
            )
          ) : (
            sortedAudits.length > 0 ? <AuditsGroup data-id="030925-f725b1" audits={sortedAudits} /> : <Flex
              data-id="030925-c124a2"
              alignItems="center"
              fontSize="18px"
              fontStyle="italic"
              h="200px"
              justifyContent="center"
              w="full">No audits found. Try adjusting the filters.</Flex>
          )
        )}
      </Flex>
    </>
  );
}

function AuditsWithContext() {
  return <AuditModalProvider data-id="030925-fe5ad3"><Audits data-id="030925-322140" /></AuditModalProvider>;
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
