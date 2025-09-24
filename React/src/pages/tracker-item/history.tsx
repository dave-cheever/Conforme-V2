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
      data-id="000736"
      _hover={{ bg: '#F5F7FA' }}
      align="center"
      bg={rowBg}
      borderBottom="1px solid"
      borderColor="historyPage.border"
      cursor="pointer"
      fontWeight={active ? '700' : '400'}
      minH="60px"
      onClick={() => navigateTo(`/tracker-item/${response._id}?snapshot=${getTime(new Date(response.lastCompletionDate!))}`)}
      px={['5px', '25px']}
      transition="background 0.2s"
      w="full"
    >
      {/* Item name */}
      <Flex data-id="000737" align="center" minW={0} w="30%">
        <Text
          data-id="000738"
          color="historyPage.font"
          fontSize={['12px', '14px']}
          isTruncated>
          {response.trackerItem.name}
        </Text>
      </Flex>
      {/* Renewed date */}
      <Flex data-id="000739" align="center" w="20%">
        <Text
          data-id="000740"
          color="historyPage.font"
          fontSize={['12px', '14px']}>
          {format(new Date(response.lastCompletionDate!), 'd MMM yyyy')}
        </Text>
      </Flex>
      {/* Responsible */}
      <Flex data-id="000741" align="center" minW={0} w="25%">
        {responsibleUser ? (
          <Flex data-id="000742" align="center" minW={0} w="full">
            <Avatar
              data-id="000743"
              name={responsibleUser?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
              size="xs"
              src={responsibleUser.imgUrl} />
            <Tooltip data-id="000744" label={responsibleUser.displayName}>
              <Text
                data-id="000745"
                color="historyPage.font"
                fontSize={['11px', '13px']}
                isTruncated
                maxW="calc(100% - 32px)"
                noOfLines={1}
                pl={2}>
                {responsibleUser.displayName}
              </Text>
            </Tooltip>
          </Flex>
        ) : (
          <Text
            data-id="000746"
            color="historyPage.font"
            fontSize={['11px', '13px']}
            fontStyle="italic">
            Unassigned
          </Text>
        )}
      </Flex>
      {/* Last updated by */}
      <Flex data-id="000747" align="center" minW={0} w="25%">
        <Skeleton
          data-id="000748"
          isLoaded={!lastUpdatedUserLoading}
          rounded="full"
          w="full">
          {lastUpdatedUser ? (
            <Flex data-id="000749" align="center" minW={0} w="full">
              <Avatar
                data-id="000750"
                name={lastUpdatedUser.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
                size="xs"
                src={lastUpdatedUser.imgUrl} />
              <Tooltip data-id="000751" label={lastUpdatedUser.displayName}>
                <Text
                  data-id="000752"
                  color="historyPage.font"
                  fontSize={['11px', '13px']}
                  isTruncated
                  maxW="calc(100% - 32px)"
                  noOfLines={1}
                  pl={2}>
                  {lastUpdatedUser.displayName}
                </Text>
              </Tooltip>
            </Flex>
          ) : (
            <Text
              data-id="000753"
              color="historyPage.font"
              fontSize={['11px', '13px']}
              fontStyle="italic">
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
      <Flex data-id="000754" bg="historyPage.bg" h="full" rounded="20px" w="full">
        <Loader data-id="000755" center />
      </Flex>
    );
  }

  return (
    <Box data-id="000756" bg="historyPage.bg" w="full">
      <Box
        data-id="000757"
        bg="white"
        border="1px solid"
        borderColor="historyPage.border"
        borderRadius="8px"
        overflow="hidden">
        <AdminTableHeader data-id="000758">
          <AdminTableHeaderElement data-id="000759" label="Item name" w="30%" />
          <AdminTableHeaderElement data-id="000760" label="Renewed" w="20%" />
          <AdminTableHeaderElement data-id="000761" label="Responsible" w="25%" />
          <AdminTableHeaderElement data-id="000762" label="Last updated by" w="25%" />
        </AdminTableHeader>
        <Flex
          data-id="000763"
          flexDir="column"
          h={['full', 'calc(100vh - 280px)', 'calc(100vh - 270px)']}
          overflowY="auto"
          w="full">
          {snapshots.map((response, idx) => (
            <HistoricalTableRow
              data-id="000764"
              index={idx}
              key={getTime(new Date(response.lastCompletionDate!))}
              response={response} />
          ))}
          {snapshots.length === 0 && (
            <Flex
              data-id="000765"
              fontSize="18px"
              fontStyle="italic"
              h="full"
              justify="center"
              mt={4}
              w="full">
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
