import { useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';

import { gql, useQuery } from '@apollo/client';
import { Button, Flex, Grid, Modal, ModalOverlay, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';
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
import AuditTeamProvider from '../contexts/AuditTeamProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';
import useSort from '../hooks/useSort';
import { ExportIcon } from '../icons';
import { IAudit } from '../interfaces/IAudit';
import { TViewMode } from '../interfaces/TViewMode';

const GET_AUDITS = gql`
  query ($auditQueryInput: AuditQueryInput) {
    audits(auditQueryInput: $auditQueryInput) {
      _id
      walkType
      dueDate
      completedDate
      status
      auditorId
      numberOfActions
      auditType {
        _id
        name
        startingDate
        frequency
      }
      site {
        _id
        name
      }
      area {
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
      }
    }
  }
`;

const Audits = () => {
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
  const { module } = useAppContext();
  const { adminModalState, setAdminModalState } = useAdminContext();
  const { audit, reset, trigger } = useAuditModalContext();
  const { data, loading, error, refetch } = useQuery(GET_AUDITS);
  const [filteredAudits, setFilteredAudits] = useState<IAudit[]>([]);
  const { sortedData: sortedAudits, sortOrder, sortType, setSortType, setSortOrder } = useSort(filteredAudits, 'dueDate', 'desc');
  const sortBy = [
    { label: 'Due date', key: 'dueDate' },
    { label: 'Site', key: 'site.name' },
    { label: 'Area', key: 'area.name' },
    { label: 'Status', key: 'status' },
    { label: 'Walk type', key: 'walkType' },
    { label: 'Auditor', key: 'auditor.displayName' },
    { label: 'Date submitted', key: 'completedDate' },
  ];
  const [viewMode, setViewMode] = useState<TViewMode>('grid');

  useEffect(() => {
    setUsedFilters(['walkType', 'status', 'sitesIds', 'areasIds', 'usersIds', 'createdDate', 'dueDate']);

    return () => {
      setDefaultFilters({});
      setShowFiltersPanel(false);
      setUsedFilters([]);
    };
  }, []);

  // Set pre-defined filters
  useEffect(() => {
    if (auditFiltersValue && !isEmpty(auditFiltersValue) && !isEmpty(filtersValues) && !isEmpty(usedFilters)) {
      // Delay setting filters by 100ms to make sure that other useEffects finished and filters won't be cleared
      const delayFilters = setTimeout(() => {
        setFilters(Object.entries(auditFiltersValue).reduce((acc, [key, value]) => ({ ...acc, [key]: value.value }), {}));
        setAuditFiltersValue({});
        clearTimeout(delayFilters);
      }, 100);
    }
  }, [filtersValues, usedFilters, setAuditFiltersValue, auditFiltersValue, setFilters]);

  // Set default filters
  useEffect(() => {
    if (!isEmpty(module?.defaultFilters?.audits)) {
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
      const defaultFilters = Object.entries(module!.defaultFilters.audits!).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: {
            value,
          },
        }),
        {},
      );
      setDefaultFilters(Object.entries(module!.defaultFilters.audits!).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}));
      setAuditFiltersValue((curr) => ({ ...curr, ...defaultFilters }));
    }
  }, []);

  useEffect(() => {
    // Parse filters to format expected by GraphQL Query
    const parsedFilters = Object.entries(filtersValues).reduce((acc, filter) => {
      if (!filter || !filter[1]) return { ...acc };

      const [key, value] = filter;

      if (
        !value.value ||
        (Array.isArray(value.value) && value.value.length === 0) ||
        (key === 'usersIds' && value.value?.auditorsIds?.length === 0 && value.value?.participantsIds?.length === 0)
      )
        return acc;

      return {
        ...acc,
        [key]: value?.value,
      };
    }, {});

    if (parsedFilters) refetch({ auditQueryInput: parsedFilters });
  }, [filtersValues]);

  // Load audits
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
    { label: 'Area', key: 'area.name' },
    { label: 'Site', key: 'site.name' },
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

  return (
    <>
      <Modal
        isOpen={adminModalState !== 'closed'}
        key={audit._id}
        onClose={onCloseModal}
        size={device === 'desktop' || device === 'tablet' || adminModalState === 'delete' ? '2xl' : 'full'}
        variant={adminModalState === 'delete' ? 'deleteModal' : 'conformeModal'}
      >
        <ModalOverlay />
        <AuditModal refetch={refetch} />
      </Modal>
      <Header breadcrumbs={[pluralize(t('audit'))]} mobileBreadcrumbs={[pluralize(t('audit'))]}>
        <ChangeViewButton setViewMode={setViewMode} viewMode={viewMode} views={['grid', 'list', 'group']} />
        {device !== 'mobile' && (
          <>
            <CSVLink data={csvData} filename="audits.csv" headers={csvHeaders} target="_blank">
              <Button
                _hover={{
                  bg: 'reasponseHeader.buttonLightBgHover',
                  color: 'reasponseHeader.buttonLightColorHover',
                  cursor: 'pointer',
                  '&:hover svg path': { stroke: 'white' },
                }}
                bg="white"
                borderRadius="10px"
                display="none"
                ml="15px"
                rightIcon={<ExportIcon height="15px" width="15px" />}
              >
                <Text fontSize="smm" fontWeight="bold">
                  Export
                </Text>
              </Button>
            </CSVLink>
            <SortButton setSortOrder={setSortOrder} setSortType={setSortType} sortBy={sortBy} sortOrder={sortOrder} sortType={sortType} />
          </>
        )}
      </Header>
      <Flex h={['calc(100vh - 210px)', 'calc(100vh - 150px)']} overflow="auto">
        {error ? (
          <Text>{error.message}</Text>
        ) : loading ? (
          <Loader center />
        ) : (
          <>
            {viewMode === 'grid' && (
              <Grid
                display={['grid', 'grid', 'flex']}
                flexWrap="wrap"
                gap={[4, 4, 6]}
                h="fit-content"
                pb={[0, 8]}
                pt="3"
                px={[4, 8]}
                templateColumns={['repeat(auto-fill, minmax(250px, 1fr))', '']}
                w="full"
              >
                {sortedAudits.length > 0 ? (
                  sortedAudits?.map((audit) => <AuditSquare audit={audit} key={audit._id} />)
                ) : (
                  <Flex fontSize="18px" fontStyle="italic" h="full" w="full">
                    No audits found
                  </Flex>
                )}
              </Grid>
            )}
            {viewMode === 'list' && (
              <AuditsList
                audits={sortedAudits}
                setSortOrder={setSortOrder}
                setSortType={setSortType}
                sortOrder={sortOrder}
                sortType={sortType}
              />
            )}
            {viewMode === 'group' && <AuditsGroup audits={sortedAudits} />}
          </>
        )}
      </Flex>
    </>
  );
};

const AuditsWithContext = () => (
  <AuditTeamProvider>
    <AuditModalProvider>
      <Audits />
    </AuditModalProvider>
  </AuditTeamProvider>
);

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
