import { Box, Flex, Text } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import { auditsInsightsTypes } from '../../bootstrap/config';
import { ArrowDownIcon, ArrowUpIcon } from '../../icons';
import { IUser } from '../../interfaces/IUser';
import UserAvatar from '../UserAvatar';

const AuditsUsersInsights = ({
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
}) => (
  <Box bg="white" my={['15px', '25px']} overflowX="auto" p="15px 25px" rounded="20px">
    <Box mb="30px">
      <Text fontSize="smm" fontWeight="bold">
        {capitalize(pluralize(t('audit')))} per person
      </Text>
    </Box>
    <Flex ml="140px">
      {users.map((user, index) => (
        <Flex
          align="center"
          flexDir="column"
          justify="center"
          key={user._id}
          mb="15px"
          ml={index === 0 ? '10px' : '20px'}
          mr="10px"
          w="80px"
        >
          <UserAvatar userId={user._id} />
          <Text
            color="auditsUsersInsights.colors.displayName"
            fontSize="ssm"
            mt="10px"
            overflowX="hidden"
            textAlign="center"
            textOverflow="ellipsis"
            title={user.displayName}
            w="80px"
            whiteSpace="nowrap"
          >
            {user.displayName}
          </Text>
        </Flex>
      ))}
    </Flex>
    <Flex>
      <Flex flexDir="column">
        {auditsStatsCounts.map((count) => (
          <Flex
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
            userSelect="none"
          >
            <Text color="white" fontSize="smm">
              {auditsInsightsTypes[count.status]}
            </Text>
            {sortOrder !== null && sortOrder === 'desc' ? (
              <ArrowDownIcon
                color={new RegExp(count.status).test(sortType) ? 'auditsUsersInsights.colors.white' : 'auditsUsersInsights.colors.hidden'}
                h="12px"
                ml="10px"
                w="12px"
              />
            ) : (
              <ArrowUpIcon
                color={new RegExp(count.status).test(sortType) ? 'auditsUsersInsights.colors.white' : 'auditsUsersInsights.colors.hidden'}
                h="12px"
                ml="10px"
                w="12px"
              />
            )}
          </Flex>
        ))}
      </Flex>
      {users.map((user) => (
        <Flex flexDir="column" key={user._id} ml="10px">
          <Box bg="auditsUsersInsights.colors.statCell" mb="5px" p="8px" rounded="10px" w="100px">
            <Text fontSize="smm" textAlign="center">
              {user.totalAuditsCount ?? 0}
            </Text>
          </Box>
          <Box mb="5px" p="8px" rounded="10px" w="100px">
            <Text fontSize="smm" textAlign="center">
              {user.completedAuditsCount ?? 0}
            </Text>
          </Box>
          <Box bg="auditsUsersInsights.colors.statCell" mb="5px" p="8px" rounded="10px" w="100px">
            <Text fontSize="smm" textAlign="center">
              {user.upcomingAuditsCount ?? 0}
            </Text>
          </Box>
          <Box mb="5px" p="8px" rounded="10px" w="100px">
            <Text fontSize="smm" textAlign="center">
              {user.missedAuditsCount ?? 0}
            </Text>
          </Box>
        </Flex>
      ))}
    </Flex>
  </Box>
);

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
