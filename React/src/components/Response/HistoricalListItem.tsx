import React, { useEffect } from 'react';

import { gql, useLazyQuery } from '@apollo/client';
import { Avatar, Box, Flex, Skeleton, Text } from '@chakra-ui/react';
import { format, getTime } from 'date-fns';

import { useResponseContext } from '../../contexts/ResponseProvider';
import useNavigate from '../../hooks/useNavigate';
import { IResponse } from '../../interfaces/IResponse';
import { IUser } from '../../interfaces/IUser';

const GET_USERS_BY_ID_FROM_DB = gql`
  query ($userQueryInput: UserQueryInput) {
    usersByIdFromDb(userQueryInput: $userQueryInput) {
      _id
      displayName
      imgUrl
    }
  }
`;

function HistoricalListItem({ response }: { response: IResponse }) {
  const { navigateTo } = useNavigate();
  const { snapshot } = useResponseContext();
  const [getUsers, { data: { usersByIdFromDb: responseUsers = [] } = {}, loading: responsibleLoading }] =
    useLazyQuery(GET_USERS_BY_ID_FROM_DB);

  useEffect(() => {
    const userIds = [response.responsibleId, response.metatags?.updatedBy].filter(Boolean);
    getUsers({
      variables: {
        userQueryInput: {
          usersIds: userIds,
        },
      },
    });
  }, [response]);

  const responsibleUser: IUser = responseUsers.find(({ _id }) => _id === response.responsibleId);
  const lastUpdatedBy: IUser = responseUsers.find(({ _id }) => _id === response.metatags?.updatedBy);
  const active = getTime(new Date(response.lastCompletionDate!)).toString() === snapshot;

  return (
    <Box
        data-id="000303"
        bg="historicalListItem.bg"
        borderBottomColor="historicalListItem.borderColor"
        borderBottomWidth="1px"
        cursor="pointer"
        onClick={() => navigateTo(`/tracker-item/${response._id}?snapshot=${getTime(new Date(response.lastCompletionDate!))}`)}
        p="15px 25px"
        py={[1, 0]}
        w="full">
      <Flex
        data-id="000304"
        align="center"
        h={['full', '73px']}
        position="relative"
        w="full">
        <Flex
          data-id="000305"
          align="flex-start"
          color="historicalListItem.fontColor"
          fontSize="14px"
          fontWeight={active ? '700' : '400'}
          lineHeight="18px"
          noOfLines={1}
          opacity="1"
          textOverflow="ellipsis"
          w="30%">
          {response.trackerItem.name}
        </Flex>
        <Flex
          data-id="000306"
          color="historicalListItem.fontColor"
          fontSize="14px"
          fontWeight={active ? '700' : '400'}
          opacity="1"
          w="20%">
          {format(new Date(response.lastCompletionDate!), 'd MMM yyyy')}
        </Flex>
        <Box data-id="000307" pr="20px" w="25%">
          <Skeleton data-id="000308" isLoaded={!responsibleLoading} rounded="full">
            {responsibleUser ? (
              <Flex data-id="000309" align="center" direction="row">
                <Avatar
                  data-id="000310"
                  name={responsibleUser?.displayName?.replace(/\s*\(.*?\)\s*/g, '')} 
                  size="xs"
                  src={responsibleUser?.imgUrl} />
                <Text
                  data-id="000311"
                  color="historicalListItem.fontColor"
                  fontSize="13px"
                  fontWeight={active ? '700' : '400'}
                  lineHeight="17px"
                  opacity="1"
                  overflow="hidden"
                  pl={3}
                  textOverflow="ellipsis"
                  w="full"
                  whiteSpace="nowrap">
                  {responsibleUser?.displayName}
                </Text>
              </Flex>
            ) : (
              <Flex data-id="000312" fontSize="13px" fontStyle="italic">
                Unassigned
              </Flex>
            )}
          </Skeleton>
        </Box>
        <Box data-id="000313" pr="20px" w="25%">
          <Skeleton data-id="000314" isLoaded={!responsibleLoading} rounded="full">
            {lastUpdatedBy ? (
              <Flex data-id="000315" align="center" direction="row">
                <Avatar data-id="000316" name={lastUpdatedBy?.displayName?.replace(/\s*\(.*?\)\s*/g, '')} size="xs" src={lastUpdatedBy?.imgUrl} />
                <Text
                  data-id="000317"
                  color="historicalListItem.fontColor"
                  fontSize="13px"
                  fontWeight={active ? '700' : '400'}
                  lineHeight="17px"
                  opacity="1"
                  overflow="hidden"
                  pl={3}
                  textOverflow="ellipsis"
                  w="full"
                  whiteSpace="nowrap">
                  {lastUpdatedBy?.displayName}
                </Text>
              </Flex>
            ) : (
                <Flex
                  data-id="000318"
                  fontSize="13px"
                  fontStyle="italic"
                  fontWeight={active ? '700' : '400'}>
                Unassigned
              </Flex>
            )}
          </Skeleton>
        </Box>
      </Flex>
    </Box>
  );
}

export const historicalListItemStyles = {
  historicalListItem: {
    bg: '#FFFFFF',
    borderColor: '#F0F0F0',
    fontColor: '#282F36',
  },
};

export default HistoricalListItem;
