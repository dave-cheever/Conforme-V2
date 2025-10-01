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
      bg="white"
      data-id="000445"
      my={['15px', '25px']}
      overflowX="auto"
      p="15px 25px"
      rounded="20px">
      <Box data-id="000446" mb="30px">
        <Text data-id="000447" fontSize="smm" fontWeight="bold">
          {capitalize(pluralize(t('audit')))} per person
        </Text>
      </Box>
      <Flex data-id="000448" ml="140px">
        {users.map((user, index) => (
          <Flex
            align="center"
            data-id="000449"
            flexDir="column"
            justify="center"
            key={user.userId}
            mb="15px"
            ml={index === 0 ? '10px' : '20px'}
            mr="10px"
            w="80px">
            <UserAvatar data-id="000450" userId={user.userId} />
            <Text
              color="auditsUsersInsights.colors.displayName"
              data-id="000451"
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
      <Flex data-id="000452">
        <Flex data-id="000453" flexDir="column">
          {auditsStatsCounts.map((count) => (
            <Flex
              align="center"
              bg={count.color}
              cursor="pointer"
              data-id="000454"
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
              <Text color="white" data-id="000455" fontSize="smm">
                {auditsInsightsTypes[count.status]}
              </Text>
              {sortOrder !== null && sortOrder === 'desc' ? (
                <ArrowDownIcon
                  color={new RegExp(count.status).test(sortType) ? 'auditsUsersInsights.colors.white' : 'auditsUsersInsights.colors.hidden'}
                  data-id="000456"
                  h="12px"
                  ml="10px"
                  w="12px" />
              ) : (
                <ArrowUpIcon
                  color={new RegExp(count.status).test(sortType) ? 'auditsUsersInsights.colors.white' : 'auditsUsersInsights.colors.hidden'}
                  data-id="000457"
                  h="12px"
                  ml="10px"
                  w="12px" />
              )}
            </Flex>
          ))}
        </Flex>
        {users.map((user) => (
          <Flex data-id="000458" flexDir="column" key={user.userId} ml="10px">
            <Box
              bg="auditsUsersInsights.colors.statCell"
              data-id="000459"
              mb="5px"
              p="8px"
              rounded="10px"
              w="100px">
              <Text data-id="000460" fontSize="smm" textAlign="center">
                {user.totalAuditsCount ?? 0}
              </Text>
            </Box>
            <Box data-id="000461" mb="5px" p="8px" rounded="10px" w="100px">
              <Text data-id="000462" fontSize="smm" textAlign="center">
                {user.completedAuditsCount ?? 0}
              </Text>
            </Box>
            <Box
              bg="auditsUsersInsights.colors.statCell"
              data-id="000463"
              mb="5px"
              p="8px"
              rounded="10px"
              w="100px">
              <Text data-id="000464" fontSize="smm" textAlign="center">
                {user.upcomingAuditsCount ?? 0}
              </Text>
            </Box>
            <Box data-id="000465" mb="5px" p="8px" rounded="10px" w="100px">
              <Text data-id="000466" fontSize="smm" textAlign="center">
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
