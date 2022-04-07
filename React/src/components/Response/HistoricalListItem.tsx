import React, { useEffect } from 'react';

import { gql, useLazyQuery } from '@apollo/client';
import { Avatar, Box, Flex, Skeleton, Text } from '@chakra-ui/react';
import { format, getTime } from 'date-fns';

import { useResponseContext } from '../../contexts/ResponseProvider';
import useNavigate from '../../hooks/useNavigate';
import { IResponse } from '../../interfaces/IResponse';
import { IUser } from '../../interfaces/IUser';

const GET_USERS_BY_ID = gql`
  query ($userQueryInput: UserQueryInput) {
    usersById(userQueryInput: $userQueryInput) {
      _id
      displayName
      imgUrl
    }
  }
`;

const HistoricalListItem = ({ response }: { response: IResponse }) => {
  const { navigateTo } = useNavigate();
  const { snapshot } = useResponseContext();
  const [
    getUsers,
    {
      data: { usersById: responseUsers = [] } = [],
      loading: responsibleLoading,
    },
  ] = useLazyQuery(GET_USERS_BY_ID);

  useEffect(() => {
    getUsers({
      variables: {
        userQueryInput: {
          usersIds: [response.responsibleId, response.metatags?.updatedBy],
        },
      },
    });
  }, [response]);

  const lastUpdatedBy: IUser = responseUsers.find(
    ({ _id }) => _id === response.metatags?.updatedBy,
  );
  const active =
    getTime(new Date(response.lastRenewalDate!)).toString() === snapshot;

  return (
    <Box
      bg="historicalListItem.bg"
      borderBottomColor="historicalListItem.borderColor"
      borderBottomWidth="1px"
      cursor="pointer"
      onClick={() =>
        navigateTo(
          `/compliance-item/${response._id}?snapshot=${getTime(
            new Date(response.lastRenewalDate!),
          )}`,
        )
      }
      p="15px 25px"
      py={[1, 0]}
      w="full"
    >
      <Flex align="center" h={['full', '73px']} position="relative" w="full">
        <Flex
          align="flex-start"
          color="historicalListItem.fontColor"
          fontSize="14px"
          fontWeight={active ? '700' : '400'}
          lineHeight="18px"
          noOfLines={1}
          opacity="1"
          textOverflow="ellipsis"
          w="30%"
        >
          {response.complianceItem.name}
        </Flex>
        <Flex
          color="historicalListItem.fontColor"
          fontSize="14px"
          fontWeight={active ? '700' : '400'}
          opacity="1"
          w="20%"
        >
          {format(new Date(response.lastRenewalDate!), 'd MMM yyyy')}
        </Flex>
        <Box pr="20px" w="25%">
          <Skeleton isLoaded={!responsibleLoading} rounded="full">
            {response.responsible ? (
              <Flex align="center" direction="row">
                <Avatar
                  name={response.responsible?.displayName}
                  size="xs"
                  src={response.responsible?.imgUrl}
                />
                <Text
                  color="historicalListItem.fontColor"
                  fontSize="13px"
                  fontWeight={active ? '700' : '400'}
                  lineHeight="17px"
                  opacity="1"
                  overflow="hidden"
                  pl={3}
                  textOverflow="ellipsis"
                  w="full"
                  whiteSpace="nowrap"
                >
                  {response.responsible?.displayName}
                </Text>
              </Flex>
            ) : (
              <Flex fontSize="13px" fontStyle="italic">
                Unassigned
              </Flex>
            )}
          </Skeleton>
        </Box>
        <Box pr="20px" w="25%">
          <Skeleton isLoaded={!responsibleLoading} rounded="full">
            {lastUpdatedBy ? (
              <Flex align="center" direction="row">
                <Avatar
                  name={lastUpdatedBy?.displayName}
                  size="xs"
                  src={lastUpdatedBy?.imgUrl}
                />
                <Text
                  color="historicalListItem.fontColor"
                  fontSize="13px"
                  fontWeight={active ? '700' : '400'}
                  lineHeight="17px"
                  opacity="1"
                  overflow="hidden"
                  pl={3}
                  textOverflow="ellipsis"
                  w="full"
                  whiteSpace="nowrap"
                >
                  {lastUpdatedBy?.displayName}
                </Text>
              </Flex>
            ) : (
              <Flex
                fontSize="13px"
                fontStyle="italic"
                fontWeight={active ? '700' : '400'}
              >
                Unassigned
              </Flex>
            )}
          </Skeleton>
        </Box>
      </Flex>
    </Box>
  );
};

export const historicalListItemStyles = {
  historicalListItem: {
    bg: '#FFFFFF',
    borderColor: '#F0F0F0',
    fontColor: '#282F36',
  },
};

export default HistoricalListItem;
