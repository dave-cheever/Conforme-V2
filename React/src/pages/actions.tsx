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
  Tab,
  TabList,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';

import { actionStatuses } from '../bootstrap/config';
import ActionModal from '../components/Actions/ActionModal';
import ActionsList from '../components/Actions/ActionsList';
import ActionSquare from '../components/Actions/ActionSquare';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { useAdminContext } from '../contexts/AdminProvider';
import { useAppContext } from '../contexts/AppProvider';
import useDevice from '../hooks/useDevice';
import {
  ChevronRight,
  ExportIcon,
  GridIcon,
  GroupIcon,
  ListIcon,
} from '../icons';
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
      answer {
        status
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
        }
        question {
          question
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
  const { user } = useAppContext();
  const device = useDevice();
  const { adminModalState, setAdminModalState } = useAdminContext();
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
  const actions = data?.actions || [];
  const tabs = ['inProgress', 'completed'];
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const filteredActions: IAction[] = useMemo(
    () =>
      tabs[selectedTabIndex] === 'inProgress'
        ? actions.filter((action) => !action.done)
        : actions.filter((action) => action.done),
    [JSON.stringify(actions), selectedTabIndex],
  );
  const [selectedAction, setSelectedAction] = useState<IAction>();

  const handleOpenModal = (action: IAction) => {
    setSelectedAction(action);
    setAdminModalState('edit');
  };

  const initialViewMode = useMemo(() => {
    const savedView = localStorage.getItem('viewMode');
    if (savedView && (savedView === 'Grid' || savedView === 'List'))
      return savedView;

    return 'List';
  }, [user]);

  const [viewMode, setViewMode] = useState<'Grid' | 'List'>(initialViewMode);

  useEffect(() => {
    if (device === 'mobile') setViewMode('Grid');
  }, [device]);

  const viewIcon = useMemo(
    () => ({
      Grid: <GridIcon boxSize="18px" stroke="currentColor" />,
      List: <ListIcon boxSize="18px" stroke="currentColor" />,
      Group: <GroupIcon boxSize="18px" stroke="currentColor" />,
    }),
    [],
  );

  const changeViewMode = useCallback((_viewMode: 'Grid' | 'List') => {
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
        dueDate: action?.dueDate
          ? format(new Date(action?.dueDate), 'd MMM yyyy')
          : 'No due date',
        completedDate: action?.completedDate
          ? format(new Date(action?.dueDate), 'd MMM yyyy')
          : 'No completion date',
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
                  rightIcon={
                    <ChevronRight
                      color="actions.header.rightIcon"
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
                  _focus={{ color: 'actions.header.menuItemFocus' }}
                  color={
                    viewMode === 'Grid'
                      ? 'actions.header.menuItemFontSelected'
                      : 'actions.header.menuItemFont'
                  }
                  fontSize="14px"
                  onClick={() => changeViewMode('Grid')}
                >
                  <GridIcon mr={3} />
                  Card
                </MenuItem>
                <MenuItem
                  _focus={{ color: 'actions.header.menuItemFocus' }}
                  color={
                    viewMode === 'List'
                      ? 'actions.header.menuItemFontSelected'
                      : 'actions.header.menuItemFont'
                  }
                  fontSize="14px"
                  onClick={() => changeViewMode('List')}
                >
                  <ListIcon mr={3} />
                  List
                </MenuItem>
              </MenuList>
            </Menu>
            <CSVLink
              data={csvData}
              filename="actions.csv"
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
      <Tabs
        defaultIndex={selectedTabIndex}
        mt={1}
        onChange={(index) => setSelectedTabIndex(index)}
        variant="unstyled"
        w="full"
      >
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
            {viewMode === 'Grid' && (
              <Grid
                display={['grid', 'flex', 'flex']}
                flexWrap="wrap"
                gap={6}
                h="fit-content"
                pb={[0, 8]}
                pt="3"
                px={[4, 8]}
                templateColumns={['repeat(1, 1fr)', '', '']}
                w="full"
              >
                {filteredActions.length > 0 ? (
                  filteredActions?.map((action) => (
                    <ActionSquare
                      action={action}
                      editAction={handleOpenModal}
                      key={action._id}
                    />
                  ))
                ) : (
                  <Flex fontSize="18px" fontStyle="italic" h="full" w="full">
                    No actions found
                  </Flex>
                )}
              </Grid>
            )}
            {viewMode === 'List' && <ActionsList actions={data.actions} />}
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
