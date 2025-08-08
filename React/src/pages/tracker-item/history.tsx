import { useEffect } from 'react';

import { gql, useLazyQuery } from '@apollo/client';
import { Avatar, Box, Flex, Skeleton, Text, Tooltip } from '@chakra-ui/react';
import { format, getTime } from 'date-fns';
import { t } from 'i18next';

import AdminTableHeader from '../../components/Admin/AdminTableHeader';
import AdminTableHeaderElement from '../../components/Admin/AdminTableHeaderElement';
import Loader from '../../components/Loader';
import { useResponseContext } from '../../contexts/ResponseProvider';
import useNavigate from '../../hooks/useNavigate';
import { IResponse } from '../../interfaces/IResponse';
import { IUser } from '../../interfaces/IUser';

const GET_LAST_UPDATED_USER = gql`
  query ($userQueryInput: UserQueryInput) {
    usersById(userQueryInput: $userQueryInput) {
      _id
      displayName
      imgUrl
    }
  }
`;

function HistoricalTableRow({ response, index }: { response: IResponse; index: number }) {
  const { navigateTo } = useNavigate();
  const { snapshot } = useResponseContext();
  const lastUpdatedById = response?.metatags?.updatedBy;

  // Fetch the last updated user details
  const [getLastUpdatedUser, { data: lastUpdatedUserData, loading: lastUpdatedUserLoading }] = useLazyQuery(GET_LAST_UPDATED_USER);

  useEffect(() => {
    if (lastUpdatedById) {
      getLastUpdatedUser({
        variables: {
          userQueryInput: { usersIds: [lastUpdatedById] },
        },
      });
    }
  }, [lastUpdatedById, getLastUpdatedUser]);

  const lastUpdatedUser: IUser | null = lastUpdatedUserData?.usersById?.[0] || null;
  const responsibleUser: IUser | null = response?.responsible || null;

  const active = getTime(new Date(response.lastCompletionDate!)).toString() === snapshot;
  const rowBg = active ? '#F5F7FA' : index % 2 === 0 ? 'white' : 'gray.50';

  return (
    <Flex
      _hover={{ bg: '#F5F7FA' }}
      align="center"
      bg={rowBg}
      borderBottom="1px solid"
      borderColor="historyPage.border"
      cursor="pointer"
      data-id="history-table-row"
      fontWeight={active ? '700' : '400'}
      minH="60px"
      onClick={() => navigateTo(`/tracker-item/${response._id}?snapshot=${getTime(new Date(response.lastCompletionDate!))}`)}
      px={['5px', '25px']}
      transition="background 0.2s"
      w="full"
    >
      {/* Item name */}
      <Flex align="center" minW={0} w="30%">
        <Text color="historyPage.font" fontSize={['12px', '14px']} isTruncated>
          {response.trackerItem.name}
        </Text>
      </Flex>

      {/* Renewed date */}
      <Flex align="center" w="20%">
        <Text color="historyPage.font" fontSize={['12px', '14px']}>
          {format(new Date(response.lastCompletionDate!), 'd MMM yyyy')}
        </Text>
      </Flex>

      {/* Responsible */}
      <Flex align="center" minW={0} w="25%">
        {responsibleUser ? (
          <Flex align="center" minW={0} w="full">
            <Avatar name={responsibleUser?.displayName?.replace(/\s*\(.*?\)\s*/g, '')} size="xs" src={responsibleUser.imgUrl} />
            <Tooltip label={responsibleUser.displayName}>
              <Text color="historyPage.font" fontSize={['11px', '13px']} isTruncated maxW="calc(100% - 32px)" noOfLines={1} pl={2}>
                {responsibleUser.displayName}
              </Text>
            </Tooltip>
          </Flex>
        ) : (
          <Text color="historyPage.font" fontSize={['11px', '13px']} fontStyle="italic">
            Unassigned
          </Text>
        )}
      </Flex>

      {/* Last updated by */}
      <Flex align="center" minW={0} w="25%">
        <Skeleton isLoaded={!lastUpdatedUserLoading} rounded="full" w="full">
          {lastUpdatedUser ? (
            <Flex align="center" minW={0} w="full">
              <Avatar name={lastUpdatedUser.displayName?.replace(/\s*\(.*?\)\s*/g, '')} size="xs" src={lastUpdatedUser.imgUrl} />
              <Tooltip label={lastUpdatedUser.displayName}>
                <Text color="historyPage.font" fontSize={['11px', '13px']} isTruncated maxW="calc(100% - 32px)" noOfLines={1} pl={2}>
                  {lastUpdatedUser.displayName}
                </Text>
              </Tooltip>
            </Flex>
          ) : (
            <Text color="historyPage.font" fontSize={['11px', '13px']} fontStyle="italic">
              Unassigned
            </Text>
          )}
        </Skeleton>
      </Flex>
    </Flex>
  );
}

function Team() {
  const { snapshotsLoading, snapshots } = useResponseContext();

  if (snapshotsLoading) {
    return (
      <Flex bg="historyPage.bg" data-id="975dd01acb6d" h="full" rounded="20px" w="full">
        <Loader center data-id="0b2119ced720" />
      </Flex>
    );
  }

  return (
    <Box bg="historyPage.bg" data-id="8e9704fcdad7" w="full">
      <Box bg="white" border="1px solid" borderColor="historyPage.border" borderRadius="8px" overflow="hidden">
        <AdminTableHeader>
          <AdminTableHeaderElement label="Item name" w="30%" />
          <AdminTableHeaderElement label="Renewed" w="20%" />
          <AdminTableHeaderElement label="Responsible" w="25%" />
          <AdminTableHeaderElement label="Last updated by" w="25%" />
        </AdminTableHeader>
        <Flex flexDir="column" h={['full', 'calc(100vh - 280px)', 'calc(100vh - 270px)']} overflowY="auto" w="full">
          {snapshots.map((response, idx) => (
            <HistoricalTableRow index={idx} key={getTime(new Date(response.lastCompletionDate!))} response={response} />
          ))}
          {snapshots.length === 0 && (
            <Flex fontSize="18px" fontStyle="italic" h="full" justify="center" mt={4} w="full">
              No historical {t('tracker item')} responses found
            </Flex>
          )}
        </Flex>
      </Box>
    </Box>
  );
}

export const historyPageStyles = {
  historyPage: {
    bg: '#FFFFFF',
    border: '#CBD5E0',
    font: '#818197',
  },
};

export default Team;
