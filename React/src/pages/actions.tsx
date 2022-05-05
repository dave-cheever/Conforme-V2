import { useMemo, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import {
  Flex,
  Grid,
  Modal,
  ModalOverlay,
  Tab,
  TabList,
  Tabs,
  Text,
} from '@chakra-ui/react';

import { actionStatuses } from '../bootstrap/config';
import ActionModal from '../components/Actions/ActionModal';
import ActionSquare from '../components/Actions/ActionSquare';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { useAdminContext } from '../contexts/AdminProvider';
import useDevice from '../hooks/useDevice';
import { IAction } from '../interfaces/IAction';

const GET_ACTIONS = gql`
  query ($actionQueryInput: ActionQueryInput) {
    actions(actionQueryInput: $actionQueryInput) {
      _id
      title
      dueDate
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
      <Header breadcrumbs={['Actions']} mobileBreadcrumbs={['Actions']} />
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
          </>
        )}
      </Flex>
    </>
  );
};

export default Actions;

export const actionsStyles = {
  actions: {
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
