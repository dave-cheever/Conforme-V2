import { Box, Flex, Text } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import { auditsInsightsTypes } from '../../bootstrap/config';
import { ArrowDownIcon, ArrowUpIcon } from '../../icons';
import { IUser } from '../../interfaces/IUser';
import UserAvatar from '../UserAvatar';

function AuditsUsersInsights({
  sortOrder,
  sortType,
  setSortOrder,
  setSortType,
  users,
  auditsStatsCounts,
}: {
  users: IUser[];
  auditsStatsCounts: {
    status: string;
    color: string;
  }[];
  sortOrder: 'asc' | 'desc';
  sortType: string;
  setSortType: (key: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
}) {
  return <Box
    bg="white"
    data-id="dcabdc831794"
    my={['15px', '25px']}
    overflowX="auto"
    p="15px 25px"
    rounded="20px">
    <Box data-id="1bf4bcdc8adb" mb="30px">
      <Text data-id="4c48cc60af62" fontSize="smm" fontWeight="bold">
        {capitalize(pluralize(t('audit')))} per person
      </Text>
    </Box>
    <Flex data-id="7f934202f701" ml="140px">
      {users.map((user, index) => (
        <Flex
          align="center"
          data-id="c1978d7ebadb"
          flexDir="column"
          justify="center"
          key={user.userId}
          mb="15px"
          ml={index === 0 ? '10px' : '20px'}
          mr="10px"
          w="80px">
          <UserAvatar data-id="31ea0d8374c3" userId={user.userId} />
          <Text
            color="auditsUsersInsights.colors.displayName"
            data-id="f37bf3e862d6"
            fontSize="ssm"
            mt="10px"
            overflowX="hidden"
            textAlign="center"
            textOverflow="ellipsis"
            title={user.displayName}
            w="80px"
            whiteSpace="nowrap">
            {user.displayName}
          </Text>
        </Flex>
      ))}
    </Flex>
    <Flex data-id="bd3fed777d8c">
      <Flex data-id="25c9fe359e24" flexDir="column">
        {auditsStatsCounts.map((count) => (
          <Flex
            align="center"
            bg={count.color}
            cursor="pointer"
            data-id="54cd8d7d4f88"
            justify="end"
            key={count.status}
            mb="5px"
            minW="130px"
            onClick={() => {
              setSortType(`${count.status}AuditsCount`);
              setSortOrder(sortOrder === 'asc' && sortType === `${count.status}AuditsCount` ? 'desc' : 'asc');
            }}
            p="8px"
            rounded="10px"
            userSelect="none">
            <Text color="white" data-id="826d4099f522" fontSize="smm">
              {auditsInsightsTypes[count.status]}
            </Text>
            {sortOrder !== null && sortOrder === 'desc' ? (
              <ArrowDownIcon
                color={new RegExp(count.status).test(sortType) ? 'auditsUsersInsights.colors.white' : 'auditsUsersInsights.colors.hidden'}
                data-id="13fcb9ec5142"
                h="12px"
                ml="10px"
                w="12px" />
            ) : (
              <ArrowUpIcon
                color={new RegExp(count.status).test(sortType) ? 'auditsUsersInsights.colors.white' : 'auditsUsersInsights.colors.hidden'}
                data-id="ec00b62a4a6a"
                h="12px"
                ml="10px"
                w="12px" />
            )}
          </Flex>
        ))}
      </Flex>
      {users.map((user) => (
        <Flex data-id="46feef976d49" flexDir="column" key={user.userId} ml="10px">
          <Box
            bg="auditsUsersInsights.colors.statCell"
            data-id="937679324df0"
            mb="5px"
            p="8px"
            rounded="10px"
            w="100px">
            <Text data-id="9824cdd639fe" fontSize="smm" textAlign="center">
              {user.totalAuditsCount ?? 0}
            </Text>
          </Box>
          <Box data-id="d68ebe30c6c6" mb="5px" p="8px" rounded="10px" w="100px">
            <Text data-id="4da3dda2285f" fontSize="smm" textAlign="center">
              {user.completedAuditsCount ?? 0}
            </Text>
          </Box>
          <Box
            bg="auditsUsersInsights.colors.statCell"
            data-id="8be742b0c94f"
            mb="5px"
            p="8px"
            rounded="10px"
            w="100px">
            <Text data-id="2e98733892fb" fontSize="smm" textAlign="center">
              {user.upcomingAuditsCount ?? 0}
            </Text>
          </Box>
          <Box data-id="6b2391dff281" mb="5px" p="8px" rounded="10px" w="100px">
            <Text data-id="fd4ccb8a4b58" fontSize="smm" textAlign="center">
              {user.missedAuditsCount ?? 0}
            </Text>
          </Box>
        </Flex>
      ))}
    </Flex>
  </Box>
}

export default AuditsUsersInsights;

export const auditsUsersInsightsStyles = {
  auditsUsersInsights: {
    colors: {
      hidden: 'transparent',
      white: '#FFFFFF',
      displayName: '#787486',
      statCell: 'rgba(19, 21, 53, 0.05)',
    },
  },
};
