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
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';

import { actionStatuses } from '../bootstrap/config';
import ActionModal from '../components/Actions/ActionModal';
import ActionsList from '../components/Actions/ActionsList';
import ActionSquare from '../components/Actions/ActionSquare';
import Header from '../components/Header';
import Icon from '../components/Icon';
import Loader from '../components/Loader';
import SortButton from '../components/SortButton';
import { useAdminContext } from '../contexts/AdminProvider';
import { useAppContext } from '../contexts/AppProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';
import useSort from '../hooks/useSort';
import { ChevronRight, ExportIcon, GridIcon, ListIcon } from '../icons';
import { IAction } from '../interfaces/IAction';

const GET_ACTIONS = gql`
  query ($actionQueryInput: ActionQueryInput) {
    actions(actionQueryInput: $actionQueryInput) {
      _id
      title
      dueDate
      completedDate
      done
      priority
      description
      assigneeId
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
          area {
            name
          }
          site {
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
      metatags {
        updatedAt
      }
    }
  }
`;

const Actions = () => {
  const { filtersValues, setUsedFilters, setFilters, setShowFiltersPanel, actionFiltersValue, setActionFiltersValue, usedFilters } =
    useFiltersContext();
  const { user } = useAppContext();
  const device = useDevice();
  const { adminModalState, setAdminModalState } = useAdminContext();
  const tabs = ['inProgress', 'completed'];
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [filteredActions, setFilteredActions] = useState<IAction[]>([]);
  const { data, loading, error, refetch } = useQuery(GET_ACTIONS, {
    variables: {
      actionQueryInput: {
        scope: {
          type: 'answer',
        },
        status: tabs[selectedTabIndex],
      },
    },
    fetchPolicy: 'no-cache',
  });
  const { sortedData: sortedActions, sortOrder, sortType, setSortType, setSortOrder } = useSort(filteredActions);
  const sortBy = [
    { label: 'Assignee', key: 'assignee.displayName' },
    { label: 'Due date', key: 'dueDate' },
    { label: 'Completed date', key: 'completedDate' },
    { label: 'Site', key: 'answer.audit.site.name' },
    { label: 'Area', key: 'answer.audit.area.name' },
  ];

  useEffect(() => {
    setUsedFilters(['status', 'sitesIds', 'areasIds', 'usersIds']);
    return () => {
      setShowFiltersPanel(false);
      setUsedFilters([]);
    };
  }, []);

  useEffect(() => {
    setFilters({ status: tabs[selectedTabIndex] });
  }, [selectedTabIndex]);

  useEffect(() => {
    if (actionFiltersValue && !isEmpty(actionFiltersValue) && !isEmpty(filtersValues) && !isEmpty(usedFilters)) {
      setFilters(actionFiltersValue);
      setActionFiltersValue({});
    }
  }, [filtersValues, usedFilters, setActionFiltersValue, actionFiltersValue, setFilters]);

  useEffect(() => {
    // Parse filters to format expected by GraphQL Query
    const parsedFilters = Object.entries(filtersValues).reduce((acc, filter) => {
      if (!filter || !filter[1]) return { ...acc };

      const [key, value] = filter;

      if (
        !value.value ||
        (Array.isArray(value.value) && value.value.length === 0) ||
        (key === 'usersIds' && value.value?.assigneesIds?.length === 0)
      )
        return acc;

      return {
        ...acc,
        [key]: value?.value,
      };
    }, {});

    if (parsedFilters) {
      refetch({
        actionQueryInput: {
          ...parsedFilters,
          status: tabs[selectedTabIndex],
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

  const [selectedAction, setSelectedAction] = useState<IAction>();

  const handleOpenModal = (action: IAction) => {
    setSelectedAction(action);
    setAdminModalState('edit');
  };

  const initialViewMode = useMemo(() => {
    const savedView = localStorage.getItem('viewMode');
    if (savedView && (savedView === 'grid' || savedView === 'list')) return savedView;

    return 'list';
  }, [user]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);

  useEffect(() => {
    if (device === 'mobile') setViewMode('grid');
  }, [device]);

  const changeViewMode = useCallback((_viewMode: 'grid' | 'list') => {
    setViewMode(_viewMode);
    localStorage.setItem('viewMode', _viewMode);
  }, []);

  const csvHeaders = [
    { label: '_id', key: '_id' },
    { label: 'Title', key: 'title' },
    { label: 'Due Date', key: 'dueDate' },
    { label: 'Assignee', key: 'assignee.displayName' },
    { label: 'Site', key: 'answer.audit.site.name' },
    { label: 'Area', key: 'answer.audit.area.name' },
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
        onClose={() => setAdminModalState('closed')}
        size={device === 'desktop' || device === 'tablet' ? 'md' : 'full'}
        variant="adminModal"
      >
        <ModalOverlay />
        <ActionModal action={selectedAction} refetch={refetch} />
      </Modal>
      <Header breadcrumbs={['Actions']} mobileBreadcrumbs={['Actions']}>
        {device !== 'mobile' && (
          <>
            <Menu autoSelect={false}>
              {
                // @ts-ignore: Issue inside ChakraUI
                // eslint-disable-next-line react/jsx-no-undef
                <MenuButton
                  _active={{}}
                  _hover={{}}
                  as={Button}
                  bg="actions.header.menuButtonBg"
                  fontSize="14px"
                  fontWeight="700"
                  h="40px"
                  ml={['15px', '0']}
                  rightIcon={<ChevronRight color="actions.header.rightIcon" h="12px" mt="3px" transform="rotate(90deg)" w="12px" />}
                  rounded="10px"
                >
                  <Stack direction="row" spacing={2}>
                    <Icon boxSize="18px" icon={viewMode} stroke="currentColor" />
                    <Text fontSize="smm" fontWeight="semi_medium">
                      Change views
                    </Text>
                  </Stack>
                </MenuButton>
              }
              <MenuList border="none" rounded="lg" w="100px" zIndex={2}>
                <MenuItem
                  _focus={{ color: 'actions.header.menuItemFocus' }}
                  color={viewMode === 'grid' ? 'actions.header.menuItemFontSelected' : 'actions.header.menuItemFont'}
                  fontSize="14px"
                  onClick={() => changeViewMode('grid')}
                >
                  <GridIcon mr={3} stroke="currentColor" />
                  Card
                </MenuItem>
                <MenuItem
                  _focus={{ color: 'actions.header.menuItemFocus' }}
                  color={viewMode === 'list' ? 'actions.header.menuItemFontSelected' : 'actions.header.menuItemFont'}
                  fontSize="14px"
                  onClick={() => changeViewMode('list')}
                >
                  <ListIcon mr={3} stroke="currentColor" />
                  List
                </MenuItem>
              </MenuList>
            </Menu>
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
            <SortButton setSortOrder={setSortOrder} setSortType={setSortType} sortBy={sortBy} sortOrder={sortOrder} sortType={sortType} />
          </>
        )}
      </Header>
      <Tabs defaultIndex={selectedTabIndex} mt={1} onChange={(index) => setSelectedTabIndex(index)} variant="unstyled" w="full">
        <TabList pb={[0, 5]} px={[4, 8]}>
          {tabs.map((tab) => (
            <Tab
              _selected={{
                bg: 'actions.quickFilter.active.bg',
                color: 'actions.quickFilter.active.color',
              }}
              bg="actions.quickFilter.default.bg"
              borderRadius="10px"
              color="actions.quickFilter.default.color"
              fontSize="smm"
              fontWeight="bold"
              h="32px"
              key={tab}
              mr={2}
            >
              {actionStatuses[tab]}
            </Tab>
          ))}
        </TabList>
      </Tabs>
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
