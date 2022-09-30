import { useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useHistory, useLocation } from 'react-router-dom';

import { gql, useQuery } from '@apollo/client';
import { Button, Flex, Grid, HStack, Modal, ModalOverlay, Text } from '@chakra-ui/react';
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
        scope {
          type
        }
        audit {
          _id
          walkType
          auditType {
            name
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

const Actions = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const history = useHistory();
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
      history.replace({
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
    { label: capitalize(t('business unit')), key: 'answer.audit.businessUnit.name' },
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

      // console.log('filter', filter);
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
    // console.log('parsedFilters', parsedFilters);

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
      const items = [...data?.actions];

      setFilteredActions(items);
    }
  }, [data?.actions, user]);

  const setQuickFilter = (filterName: string, filterValue) => {
    cleanFilters();
    setFilters({ [filterName]: filterValue });
  };

  const isQuickFilterActive = (filterName: string) => {
    if (filtersValues?.status?.value && Array.isArray(filtersValues?.status?.value)) {
      if (filtersValues.status.value.length > 1) return false;
      if (filtersValues.status.value.find((status) => status === filterName)) return true;
    }
    return false;
  };

  const [selectedAction, setSelectedAction] = useState<IAction>();
  const handleOpenModal = (action: IAction) => {
    setSelectedAction(action);
    setAdminModalState('edit');
  };

  useEffect(() => {
    if (data && data?.actions && !error) {
      const items = [...data?.actions];
      setFilteredActions(items);

      // Open modal with action from the URL params
      if (queryParams.has('id')) {
        const action = items.find(({ _id }) => _id === queryParams.get('id'));
        if (action) handleOpenModal(action);
      }
    }
  }, [data?.actions, user]);

  useEffect(() => {
    setTimeout(() => {
      setQuickFilter('status', ['open']);
    }, 101);
  }, []);

  const csvHeaders = [
    { label: '_id', key: '_id' },
    { label: 'Title', key: 'title' },
    { label: 'Due Date', key: 'dueDate' },
    { label: 'Assignee', key: 'assignee.displayName' },
    { label: 'Created by', key: 'creator.displayName' },
    { label: capitalize(t('location')), key: 'answer.audit.location.name' },
    { label: capitalize(t('business unit')), key: 'answer.audit.businessUnit.name' },
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

  return (
    <>
      <Modal
        isOpen={adminModalState !== 'closed'}
        onClose={closeModal}
        size={device === 'desktop' || device === 'tablet' ? 'md' : 'full'}
        variant="adminModal"
      >
        <ModalOverlay />
        <ActionModal action={selectedAction} closeModal={closeModal} refetch={refetch} />
      </Modal>
      <Header breadcrumbs={['Actions']} mobileBreadcrumbs={['Actions']}>
        <ChangeViewButton setViewMode={setViewMode} viewMode={viewMode} views={['grid', 'list']} />
        {device !== 'mobile' && (
          <>
            <CSVLink data={csvData} filename="actions.csv" headers={csvHeaders} target="_blank">
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
          </>
        )}
        <SortButton setSortOrder={setSortOrder} setSortType={setSortType} sortBy={sortBy} sortOrder={sortOrder} sortType={sortType} />
      </Header>
      <HStack px={[4, 8]} spacing={2}>
        {Object.keys(actionStatuses).map((status) => (
          <Button
            _active={{
              bg: 'actions.quickFilter.active.bg',
              color: 'actions.quickFilter.active.color',
            }}
            _hover={{
              bg: 'none',
            }}
            bg="actions.quickFilter.default.bg"
            borderRadius="10px"
            color="actions.quickFilter.default.color"
            fontSize="smm"
            fontWeight="bold"
            h="32px"
            isActive={isQuickFilterActive(status)}
            key={status}
            onClick={() => setQuickFilter('status', [status])}
          >
            {capitalize(status)}
          </Button>
        ))}
      </HStack>
      <Flex h={['calc(100vh - 80px)', 'full']} overflow="auto" pb={[4, 0]}>
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
                pb={[14, 8]}
                pt="3"
                px={[4, 8]}
                templateColumns={['repeat(auto-fill, minmax(250px, 1fr))', '']}
                w="full"
              >
                {sortedActions.length > 0 ? (
                  sortedActions?.map((action) => <ActionSquare action={action} editAction={handleOpenModal} key={action._id} />)
                ) : (
                  <Flex fontSize="18px" fontStyle="italic" h="full" w="full">
                    No actions found
                  </Flex>
                )}
              </Grid>
            )}
            {viewMode === 'list' && (
              <ActionsList
                actions={sortedActions}
                editAction={handleOpenModal}
                setSortOrder={setSortOrder}
                setSortType={setSortType}
                sortOrder={sortOrder}
                sortType={sortType}
              />
            )}
          </>
        )}
      </Flex>
    </>
  );
};

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
        bg: '#1E1836',
        color: '#FFFFFF',
      },
    },
  },
};
