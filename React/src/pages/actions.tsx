import { useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useLocation, useNavigate } from 'react-router-dom';

import { gql, useQuery } from '@apollo/client';
import { Box, Button, Flex, Grid, HStack, Modal, ModalOverlay, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { t } from 'i18next';
import { capitalize, isEmpty } from 'lodash';

import { actionStatuses } from '../bootstrap/config';
import ActionModal from '../components/Actions/ActionModal';
import ActionsList from '../components/Actions/ActionsList';
import ActionSquare from '../components/Actions/ActionSquare';
import ChangeViewButton from '../components/ChangeViewButton';
import Header from '../components/Header';
import Loader from '../components/Loader';
import SortButton from '../components/SortButton';
import { useAdminContext } from '../contexts/AdminProvider';
import { useAppContext } from '../contexts/AppProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';
import useSort from '../hooks/useSort';
import { ExportIcon } from '../icons';
import { IAction } from '../interfaces/IAction';
import { TViewMode } from '../interfaces/TViewMode';

const GET_ACTIONS = gql`
  query ($actionQueryInput: ActionQueryInput) {
    actions(actionQueryInput: $actionQueryInput) {
      _id
      title
      dueDate
      completedDate
      priority
      description
      assigneeId
      status
      attachments {
        id
        name
        addedAt
        thumbnail
      }
      scope {
        type
      }
      answer {
        status
        questionId
        businessUnit {
          name
        }
        scope {
          type
        }
        audit {
          _id
          walkType
          auditType {
            name
            businessUnitScope
          }
          businessUnit {
            name
          }
          location {
            name
          }
          auditorId
          participantsIds
        }
        question {
          question
          questionsCategoryId
        }
        attachments {
          id
        }
      }
      assignee {
        displayName
        imgUrl
      }
      creator {
        displayName
        imgUrl
      }
      metatags {
        addedBy
        addedAt
        updatedAt
      }
    }
  }
`;

function Actions() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(0);
  const {
    filtersValues,
    setUsedFilters,
    setFilters,
    cleanFilters,
    setShowFiltersPanel,
    actionFiltersValue,
    setActionFiltersValue,
    usedFilters,
  } = useFiltersContext();
  const { user } = useAppContext();
  const device = useDevice();
  const { adminModalState, setAdminModalState } = useAdminContext();
  const closeModal = () => {
    // If id is in URL params, clean it
    if (queryParams.has('id')) {
      queryParams.delete('id');
      navigate({
        search: queryParams.toString(),
      });
    }
    setAdminModalState('closed');
  };
  const [filteredActions, setFilteredActions] = useState<IAction[]>([]);
  const { data, loading, error, refetch } = useQuery(GET_ACTIONS, {
    variables: {
      actionQueryInput: {
        scope: {
          type: 'answer',
        },
      },
    },
    fetchPolicy: 'no-cache',
  });

  const { sortedData: sortedActions, sortOrder, sortType, setSortType, setSortOrder } = useSort(filteredActions);
  const sortBy = [
    { label: 'Title', key: 'title' },
    { label: 'Priority', key: 'priority' },
    { label: 'Due date', key: 'dueDate' },
    { label: 'Completed date', key: 'completedDate' },
    { label: 'Status', key: 'status' },
    { label: 'Assignee', key: 'assignee.displayName' },
    { label: 'Created by', key: 'creator.displayName' },
    { label: capitalize(t('location')), key: 'answer.audit.location.name' },
    { label: capitalize(t('business unit')), key: 'answer.businessUnit.name' },
  ];
  const [viewMode, setViewMode] = useState<TViewMode>('grid');
  const allowedFilters = useMemo(() => ['status', 'priority', 'locationsIds', 'businessUnitsIds', 'usersIds', 'dueDate'], []);

  useEffect(() => {
    setUsedFilters(allowedFilters);
    return () => {
      setShowFiltersPanel(false);
      setUsedFilters([]);
    };
  }, []);

  // Set pre-defined filters
  useEffect(() => {
    if (actionFiltersValue && !isEmpty(actionFiltersValue) && !isEmpty(filtersValues) && !isEmpty(usedFilters)) {
      // Delay setting filters by 100ms to make sure that other useEffects finished and filters won't be cleared
      const delayFilters = setTimeout(() => {
        setFilters(Object.entries(actionFiltersValue).reduce((acc, [key, value]) => ({ ...acc, [key]: value.value }), {}));
        setActionFiltersValue({});
        clearTimeout(delayFilters);
      }, 100);
    }
  }, [filtersValues, usedFilters, setActionFiltersValue, actionFiltersValue, setFilters]);

  useEffect(() => {
    // Parse filters to format expected by GraphQL Query
    const parsedFilters = Object.entries(filtersValues).reduce((acc, filter) => {
      if (!filter || !filter[1] || !allowedFilters.includes(filter[0])) return { ...acc };

      const [key, value] = filter;
      if (
        !value.value ||
        (Array.isArray(value.value) && value.value.length === 0) ||
        (key === 'usersIds' && value.value?.assigneesIds?.length === 0)
      )
        return acc;

      return {
        ...acc,
        [key]: value.value,
      };
    }, {});

    if (parsedFilters) {
      refetch({
        actionQueryInput: {
          ...parsedFilters,
          scope: {
            type: 'answer',
          },
        },
      });
    }
  }, [filtersValues]);

  useEffect(() => {
    if (data && data?.actions && !error) {
      const items = [...(data?.actions || [])];

      setFilteredActions(items);
    }
  }, [data?.actions, user]);

  const setQuickFilter = (filterName: string, filterValue) => {
    cleanFilters();
    setFilters({ [filterName]: filterValue });
  };

  useEffect(() => {
    if (!filtersValues || !filtersValues?.status || !filtersValues?.status?.value) return;
    if (filtersValues?.status?.value?.length > 1) {
      setActiveTab(-1);
      return;
    }
    switch (filtersValues?.status?.value?.[0]) {
      case 'open':
        setActiveTab(0);
        break;
      case 'closed':
        setActiveTab(1);
        break;
      case 'overdue':
        setActiveTab(2);
        break;

      default:
        break;
    }
    return () => {
      setActiveTab(0);
    };
  }, [JSON.stringify(filtersValues)]);

  const [selectedAction, setSelectedAction] = useState<IAction>();
  const handleOpenModal = (action: IAction) => {
    setSelectedAction(action);
    setAdminModalState('edit');
  };

  useEffect(() => {
    if (data && data?.actions && !error) {
      const items = [...(data?.actions || [])];
      setFilteredActions(items);

      // Open modal with action from the URL params
      if (queryParams.has('id')) {
        const action = items.find(({ _id }) => _id === queryParams.get('id'));
        if (action) handleOpenModal(action);
      }
    }
  }, [data?.actions, user]);

  const csvHeaders = [
    { label: '_id', key: '_id' },
    { label: 'Title', key: 'title' },
    { label: 'Due Date', key: 'dueDate' },
    { label: 'Assignee', key: 'assignee.displayName' },
    { label: 'Created by', key: 'creator.displayName' },
    { label: capitalize(t('location')), key: 'answer.audit.location.name' },
    { label: capitalize(t('business unit')), key: 'answer.businessUnit.name' },
    { label: 'Status', key: 'status' },
    { label: 'Completed Date', key: 'completedDate' },
  ];

  const csvData = useMemo(
    () =>
      (data?.actions ?? []).map(({ typename, metatags, ...action }) => ({
        ...action,
        dueDate: action?.dueDate ? format(new Date(action?.dueDate), 'd MMM yyyy') : 'No due date',
        completedDate: action?.completedDate ? format(new Date(action?.dueDate), 'd MMM yyyy') : 'No completion date',
        status: action.done ? 'closed' : 'open',
      })),
    [JSON.stringify(data?.actions)],
  );

  return (<>
    <Modal
      data-id="c33d7968cfa5"
      isOpen={adminModalState !== 'closed'}
      onClose={closeModal}
      size={device === 'desktop' || device === 'tablet' ? 'md' : 'full'}
      variant="adminModal">
      <ModalOverlay data-id="b1549d4e1839" />
      <ActionModal
        action={selectedAction}
        closeModal={closeModal}
        data-id="74634141a96b"
        refetch={refetch} />
    </Modal>
    <Header
      breadcrumbs={['Actions']}
      data-id="9805ccc04797"
      mobileBreadcrumbs={['Actions']}>
      <ChangeViewButton
        data-id="ad24b37f6046"
        setViewMode={setViewMode}
        viewMode={viewMode}
        views={['grid', 'list']} />
      {device !== 'mobile' && (
        <CSVLink
          data={csvData}
          data-id="b48e84287463"
          filename="actions.csv"
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
            data-id="d7abc5e71d44"
            display="none"
            ml="15px"
            rightIcon={<ExportIcon data-id="ea0f6b5ff60c" height="15px" width="15px" />}>
            <Text data-id="e56aeaf3231f" fontSize="smm" fontWeight="bold">
              Export
            </Text>
          </Button>
        </CSVLink>
      )}
      <SortButton
        data-id="19893118c24d"
        setSortOrder={setSortOrder}
        setSortType={setSortType}
        sortBy={sortBy}
        sortOrder={sortOrder}
        sortType={sortType} />
    </Header>
    <HStack data-id="4c7c8ee914c9" px={[4, 8]} spacing={2}>
      {Object.keys(actionStatuses).map((status, index) => (
        <Button
          _active={{
            bg: 'actions.quickFilter.active.bg',
            color: 'actions.quickFilter.active.color',
          }}
          _hover={{
            opacity: 0.8,
          }}
          bg="actions.quickFilter.default.bg"
          borderRadius="10px"
          color="actions.quickFilter.default.color"
          data-id="b0058513c4f6"
          fontSize="14px"
          fontWeight="500"
          h="32px"
          isActive={index === activeTab}
          key={status}
          onClick={() => {
            setQuickFilter('status', [status]);
            setActiveTab(index);
          }}>
          {capitalize(status)}
        </Button>
      ))}
    </HStack>
    <Flex
      data-id="d467252e648c"
      h={['calc(100vh - 80px)', 'full']}
      overflow="auto"
      pb={[4, 0]}>
      {error ? (
        <Text data-id="e41bc3ff6368">{error.message}</Text>
      ) : loading ? (
        <Loader center data-id="ac708cbffb19" />
      ) : (
        <>
          {viewMode === 'grid' && (
            <Grid
              data-id="8bf250808148"
              display={['grid', 'grid', 'flex']}
              flexWrap="wrap"
              gap={[4, 4, 6]}
              h="fit-content"
              pb={[14, 8]}
              pt="3"
              px={[4, 8]}
              templateColumns={['repeat(auto-fill, minmax(250px, 1fr))', '']}
              w="full">
              {sortedActions.length > 0 ? (
                sortedActions?.map((action) => <ActionSquare
                  action={action}
                  data-id="12e61a185e1e"
                  editAction={handleOpenModal}
                  key={action._id} />)
              ) : (
                <Flex
                  data-id="dad222c8f90c"
                  fontSize="18px"
                  fontStyle="italic"
                  h="full"
                  w="full">
                  No actions found
                </Flex>
              )}
            </Grid>
          )}
          {viewMode === 'list' && (
            <Box p="6" w="full">
              <ActionsList
                actions={sortedActions}
                data-id="0207bec9b9a2"
                editAction={handleOpenModal}
                setSortOrder={setSortOrder}
                setSortType={setSortType}
                sortOrder={sortOrder}
                sortType={sortType} />
            </Box>
              
          )}
        </>
      )}
    </Flex>
  </>);
}

export default Actions;

export const actionsStyles = {
  actions: {
    header: {
      menuButtonBg: 'white',
      rightIcon: '#9A9EA1',
      menuItemFocus: '#462AC4',
      menuItemFontSelected: '#462AC4',
      menuItemFont: '#9A9EA1',
    },
    quickFilter: {
      default: {
        bg: 'transparent',
        color: '#1E1836',
      },
      active: {
        bg: '#462AC4',
        color: '#FFFFFF',
      },
    },
  },
};
