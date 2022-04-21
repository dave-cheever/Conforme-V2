import { useCallback, useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';

import { gql, useQuery } from '@apollo/client';
import {
  Button,
  Flex,
  Grid,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';

import AuditsGroup from '../components/Audit/AuditsGroup';
import AuditsList from '../components/Audit/AuditsList';
import AuditSquare from '../components/Audit/AuditSquare';
import AuditModal from '../components/AuditModal/AuditModal';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { useAdminContext } from '../contexts/AdminProvider';
import { useAppContext } from '../contexts/AppProvider';
import AuditModalProvider, {
  useAuditModalContext,
} from '../contexts/AuditModalProvider';
import AuditTeamProvider from '../contexts/AuditTeamProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';
import {
  ChevronRight,
  ExportIcon,
  GridIcon,
  GroupIcon,
  ListIcon,
} from '../icons';
import { IAudit } from '../interfaces/IAudit';

const GET_AUDITS = gql`
  query ($auditQueryInput: AuditQueryInput) {
    audits(auditQueryInput: $auditQueryInput) {
      _id
      walkType
      dueDate
      status
      reference
      auditorId
      participantsIds
      auditType {
        _id
        name
        frequency
        startingDate
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
      participants {
        _id
        displayName
        imgUrl
      }
      metatags {
        addedAt
      }
    }
  }
`;

const Audits = () => {
  const { user } = useAppContext();
  const {
    filtersValues,
    setUsedFilters,
    setFilters,
    setShowFiltersPanel,
    auditFiltersValue,
    setAuditFiltersValue,
    usedFilters,
  } = useFiltersContext();
  const device = useDevice();
  const { adminModalState, setAdminModalState } = useAdminContext();
  const { reset, trigger } = useAuditModalContext();
  const { data, loading, error, refetch } = useQuery(GET_AUDITS);
  const { audit } = useAuditModalContext();
  const [filteredAudits, setFilteredAudits] = useState<IAudit[]>([]);

  useEffect(() => {
    setUsedFilters(['walkType', 'status', 'sitesIds', 'areasIds', 'usersIds']);
    return () => setShowFiltersPanel(false);
  }, []);

  useEffect(() => {
    if (
      auditFiltersValue &&
      !isEmpty(auditFiltersValue) &&
      !isEmpty(filtersValues) &&
      !isEmpty(usedFilters)
    ) {
      setFilters(auditFiltersValue);
      setAuditFiltersValue({});
    }
  }, [
    filtersValues,
    usedFilters,
    setAuditFiltersValue,
    auditFiltersValue,
    setFilters,
  ]);

  useEffect(() => {
    // Parse filters to format expected by GraphQL Query
    const parsedFilters = Object.entries(filtersValues).reduce(
      (acc, filter) => {
        if (!filter || !filter[1]) return { ...acc };

        const [key, value] = filter;

        if (
          !value.value ||
          (Array.isArray(value.value) && value.value.length === 0) ||
          (key === 'usersIds' &&
            value.value.auditorsIds.length === 0 &&
            value.value.participantsIds.length === 0)
        )
          return acc;

        return {
          ...acc,
          [key]: value?.value,
        };
      },
      {},
    );

    if (parsedFilters) refetch({ auditQueryInput: parsedFilters });
  }, [filtersValues]);

  useEffect(() => {
    if (data && data?.audits && !error) {
      const items = [...data?.audits];

      setFilteredAudits(items);
    }
  }, [data?.audits]);

  const initialViewMode = useMemo(() => {
    const savedView = localStorage.getItem('viewMode');
    if (
      savedView &&
      (savedView === 'Grid' || savedView === 'List' || savedView === 'Group')
    )
      return savedView;

    return 'List';
  }, [user]);

  const [viewMode, setViewMode] = useState<'Grid' | 'List' | 'Group'>(
    initialViewMode,
  );

  useEffect(() => {
    if (device === 'mobile') setViewMode('Grid');
  }, [device]);

  const viewIcon = useMemo(
    () => ({
      Grid: <GridIcon boxSize="18px" />,
      List: <ListIcon boxSize="18px" />,
      Group: <GroupIcon boxSize="18px" />,
    }),
    [],
  );

  const onCloseModal = async () => {
    await trigger();
    reset();
    setAdminModalState('closed');
  };

  const changeViewMode = useCallback((_viewMode: 'Grid' | 'List' | 'Group') => {
    setViewMode(_viewMode);
    localStorage.setItem('viewMode', _viewMode);
  }, []);

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
      (data?.audits ?? []).map(
        ({
          typename,
          participantsIds,
          auditorId,
          reference,
          metatags,
          ...audit
        }) => ({
          ...audit,
          dueDate: format(new Date(audit?.dueDate), 'd MMM yyyy'),
          participants: audit?.participants
            ?.map((participant) => participant.displayName)
            .join(', '),
        }),
      ),
    [JSON.stringify(data?.audits)],
  );

  return (
    <>
      <Modal
        isOpen={adminModalState !== 'closed'}
        key={audit._id}
        onClose={onCloseModal}
        size={
          device === 'desktop' ||
          device === 'tablet' ||
          adminModalState === 'delete'
            ? '2xl'
            : 'full'
        }
        variant={adminModalState === 'delete' ? 'deleteModal' : 'conformeModal'}
      >
        <ModalOverlay />
        <AuditModal refetch={refetch} />
      </Modal>
      <Header breadcrumbs={['Audits']} mobileBreadcrumbs={['Audits']}>
        {device !== 'mobile' && (
          <>
            <Menu autoSelect={false}>
              {
                // @ts-ignore: Issue inside ChakraUI
                <MenuButton
                  _active={{}}
                  _hover={{}}
                  as={Button}
                  bg="auditsItems.header.menuButtonBg"
                  fontSize="14px"
                  fontWeight="700"
                  h="40px"
                  ml={['15px', '0']}
                  rightIcon={
                    <ChevronRight
                      color="auditsItems.header.rightIcon"
                      h="12px"
                      mt="3px"
                      transform="rotate(90deg)"
                      w="12px"
                    />
                  }
                  rounded="10px"
                >
                  <Flex align="center" mr="1">
                    {viewIcon[viewMode]}
                  </Flex>
                </MenuButton>
              }
              <MenuList border="none" rounded="lg" w="100px" zIndex={2}>
                <MenuItem
                  _focus={{ color: 'auditsItems.header.menuItemFocus' }}
                  color={
                    viewMode === 'Grid'
                      ? 'auditsItems.header.menuItemFontSelected'
                      : 'auditsItems.header.menuItemFont'
                  }
                  fontSize="14px"
                  onClick={() => changeViewMode('Grid')}
                >
                  <GridIcon mr={3} />
                  Card
                </MenuItem>
                <MenuItem
                  _focus={{ color: 'auditsItems.header.menuItemFocus' }}
                  color={
                    viewMode === 'List'
                      ? 'auditsItems.header.menuItemFontSelected'
                      : 'auditsItems.header.menuItemFont'
                  }
                  fontSize="14px"
                  onClick={() => changeViewMode('List')}
                >
                  <ListIcon mr={3} />
                  List
                </MenuItem>
                <MenuItem
                  _focus={{ color: 'auditsItems.header.menuItemFocus' }}
                  color={
                    viewMode === 'Group'
                      ? 'auditsItems.header.menuItemFontSelected'
                      : 'auditsItems.header.menuItemFont'
                  }
                  fontSize="14px"
                  onClick={() => changeViewMode('Group')}
                >
                  <GroupIcon mr={3} />
                  Group
                </MenuItem>
              </MenuList>
            </Menu>
            <CSVLink
              data={csvData}
              filename="audits.csv"
              headers={csvHeaders}
              target="_blank"
            >
              <Button
                _hover={{
                  bg: 'reasponseHeader.buttonLightBgHover',
                  color: 'reasponseHeader.buttonLightColorHover',
                  cursor: 'pointer',
                  '&:hover svg path': { stroke: 'white' },
                }}
                bg="white"
                borderRadius="10px"
                ml="15px"
                rightIcon={<ExportIcon height="15px" width="15px" />}
              >
                <Text fontSize="smm" fontWeight="bold">
                  Export
                </Text>
              </Button>
            </CSVLink>
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
            {viewMode === 'Grid' && (
              <Grid
                display={['grid', 'grid', 'flex']}
                flexWrap="wrap"
                gap={6}
                h="fit-content"
                pb={[0, 8]}
                pt="3"
                px={[4, 8]}
                templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', '']}
                w="full"
              >
                {filteredAudits.length > 0 ? (
                  filteredAudits?.map((audit) => (
                    <AuditSquare audit={audit} key={audit._id} />
                  ))
                ) : (
                  <Flex fontSize="18px" fontStyle="italic" h="full" w="full">
                    No audits found
                  </Flex>
                )}
              </Grid>
            )}
            {viewMode === 'List' && <AuditsList audits={data.audits} />}
            {viewMode === 'Group' && <AuditsGroup audits={data.audits} />}
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
