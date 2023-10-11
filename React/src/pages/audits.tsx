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
  const { sortedData: sortedAudits, sortOrder, sortType, setSortType, setSortOrder } = useSort(filteredAudits, 'dueDate', 'desc');
  const sortBy = [
    { label: 'Due date', key: 'dueDate' },
    { label: capitalize(t('location')), key: 'location.name' },
    { label: 'Status', key: 'status' },
    { label: 'Walk type', key: 'walkType' },
    { label: 'Auditor', key: 'auditor.displayName' },
    { label: 'Date submitted', key: 'completedDate' },
  ];
  const [viewMode, setViewMode] = useState<TViewMode>('grid');
  const allowedFilters = useMemo(
    () => ['walkType', 'status', 'locationsIds', 'businessUnitsIds', 'usersIds', 'createdDate', 'dueDate', 'showArchived'],
    [],
  );

  useEffect(() => {
    setUsedFilters(allowedFilters);

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
        {
          usersIds: {
            value: {
              auditorsIds: [user!._id],
            },
          },
        },
      );
      setDefaultFilters(defaultFilters);
      setAuditFiltersValue((curr) => ({ ...curr, ...defaultFilters }));
    }
  }, []);

  useEffect(() => {
    // Parse filters to format expected by GraphQL Query
    const parsedFilters = Object.entries(filtersValues).reduce((acc, filter) => {
      if (!filter || !filter[1] || !allowedFilters.includes(filter[0])) return { ...acc };

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

  return (<>
    <Modal
      data-id="5926f822cca0"
      isOpen={adminModalState !== 'closed'}
      key={audit._id}
      onClose={onCloseModal}
      size={device === 'desktop' || device === 'tablet' || adminModalState === 'delete' ? '2xl' : 'full'}
      variant={adminModalState === 'delete' ? 'deleteModal' : 'conformeModal'}>
      <ModalOverlay data-id="1ffc74d0cbca" />
      <AuditModal data-id="76df78cb3226" refetch={refetch} />
    </Modal>
    <Header
      breadcrumbs={[pluralize(t('audit'))]}
      data-id="2dd476cb0929"
      mobileBreadcrumbs={[pluralize(t('audit'))]}>
      <ChangeViewButton
        data-id="bafef65da6de"
        setViewMode={setViewMode}
        viewMode={viewMode}
        views={['grid', 'list', 'group']} />
      {device !== 'mobile' && (
        <CSVLink
          data={csvData}
          data-id="39c6f57fa46c"
          filename="audits.csv"
          headers={csvHeaders}
          target="_blank">
          <Button
            _hover={{
              bg: 'reasponseHeader.buttonLightBgHover',
              color: 'reasponseHeader.buttonLightColorHover',
              cursor: 'pointer',
              '&:hover svg path': { stroke: 'white' },
            }}
            bg="white"
            borderRadius="10px"
            data-id="358c8463aff6"
            display="none"
            ml="15px"
            rightIcon={<ExportIcon data-id="d7c9bee09c61" height="15px" width="15px" />}>
            <Text data-id="ce45ced54779" fontSize="smm" fontWeight="bold">
              Export
            </Text>
          </Button>
        </CSVLink>
      )}
      <SortButton
        data-id="f2ae2eb1e511"
        setSortOrder={setSortOrder}
        setSortType={setSortType}
        sortBy={sortBy}
        sortOrder={sortOrder}
        sortType={sortType} />
    </Header>
    <Flex
      data-id="9eb10120da8c"
      h={['calc(100vh - 80px)', 'full']}
      overflow="auto"
      pb={[4, 0]}>
      {error ? (
        <Text data-id="f7a4ac7f4df3">{error.message}</Text>
      ) : loading ? (
        <Loader center data-id="24a7de8c60a9" />
      ) : (
        <>
          {viewMode === 'grid' && (
            <Grid
              data-id="32f1dd5d8dc5"
              display={['grid', 'grid', 'flex']}
              flexWrap="wrap"
              gap={[4, 4, 6]}
              h="fit-content"
              pb={[14, 8]}
              pt="3"
              px={[4, 8]}
              templateColumns={['repeat(auto-fill, minmax(250px, 1fr))', '']}
              w="full">
              {sortedAudits.length > 0 ? (
                sortedAudits?.map((audit) => <AuditSquare audit={audit} data-id="78c2a1327b38" key={audit._id} />)
              ) : (
                <Flex
                  data-id="864e662bfe75"
                  fontSize="18px"
                  fontStyle="italic"
                  h="full"
                  w="full">
                  No audits found
                </Flex>
              )}
            </Grid>
          )}
          {viewMode === 'list' && (
            <AuditsList
              audits={sortedAudits}
              data-id="df4d1191f7df"
              setSortOrder={setSortOrder}
              setSortType={setSortType}
              sortOrder={sortOrder}
              sortType={sortType} />
          )}
          {viewMode === 'group' && <AuditsGroup audits={sortedAudits} data-id="7bb6297801dc" />}
        </>
      )}
    </Flex>
  </>);
}

function AuditsWithContext() {
  return <AuditModalProvider data-id="5b60c03025f5">
    <Audits data-id="c5293404d035" />
  </AuditModalProvider>
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
