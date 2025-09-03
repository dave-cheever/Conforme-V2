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
  return (
    <Box
      data-id="030925-079d4c"
      bg="white"
      my={['15px', '25px']}
      overflowX="auto"
      p="15px 25px"
      rounded="20px">
      <Box data-id="030925-67f0ce" mb="30px">
        <Text data-id="030925-341e77" fontSize="smm" fontWeight="bold">
          {capitalize(pluralize(t('audit')))} per person
        </Text>
      </Box>
      <Flex data-id="030925-82f4f7" ml="140px">
        {users.map((user, index) => (
          <Flex
            data-id="030925-ee249f"
            align="center"
            flexDir="column"
            justify="center"
            key={user.userId}
            mb="15px"
            ml={index === 0 ? '10px' : '20px'}
            mr="10px"
            w="80px">
            <UserAvatar data-id="030925-90e051" userId={user.userId} />
            <Text
              data-id="030925-3869a0"
              color="auditsUsersInsights.colors.displayName"
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
      <Flex data-id="030925-22ef94">
        <Flex data-id="030925-eda138" flexDir="column">
          {auditsStatsCounts.map((count) => (
            <Flex
              data-id="030925-50f3d6"
              align="center"
              bg={count.color}
              cursor="pointer"
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
              <Text data-id="030925-e055d8" color="white" fontSize="smm">
                {auditsInsightsTypes[count.status]}
              </Text>
              {sortOrder !== null && sortOrder === 'desc' ? (
                <ArrowDownIcon
                  data-id="030925-f18e25"
                  color={new RegExp(count.status).test(sortType) ? 'auditsUsersInsights.colors.white' : 'auditsUsersInsights.colors.hidden'}
                  h="12px"
                  ml="10px"
                  w="12px" />
              ) : (
                <ArrowUpIcon
                  data-id="030925-538f4a"
                  color={new RegExp(count.status).test(sortType) ? 'auditsUsersInsights.colors.white' : 'auditsUsersInsights.colors.hidden'}
                  h="12px"
                  ml="10px"
                  w="12px" />
              )}
            </Flex>
          ))}
        </Flex>
        {users.map((user) => (
          <Flex data-id="030925-810d9a" flexDir="column" key={user.userId} ml="10px">
            <Box
              data-id="030925-d235b6"
              bg="auditsUsersInsights.colors.statCell"
              mb="5px"
              p="8px"
              rounded="10px"
              w="100px">
              <Text data-id="030925-78442c" fontSize="smm" textAlign="center">
                {user.totalAuditsCount ?? 0}
              </Text>
            </Box>
            <Box data-id="030925-b0085b" mb="5px" p="8px" rounded="10px" w="100px">
              <Text data-id="030925-781fc3" fontSize="smm" textAlign="center">
                {user.completedAuditsCount ?? 0}
              </Text>
            </Box>
            <Box
              data-id="030925-c76b5a"
              bg="auditsUsersInsights.colors.statCell"
              mb="5px"
              p="8px"
              rounded="10px"
              w="100px">
              <Text data-id="030925-99499c" fontSize="smm" textAlign="center">
                {user.upcomingAuditsCount ?? 0}
              </Text>
            </Box>
            <Box data-id="030925-f746ef" mb="5px" p="8px" rounded="10px" w="100px">
              <Text data-id="030925-dc4fac" fontSize="smm" textAlign="center">
                {user.missedAuditsCount ?? 0}
              </Text>
            </Box>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
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
