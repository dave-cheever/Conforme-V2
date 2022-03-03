import React, { useEffect } from "react";
import { Box, Flex, Text, Avatar, Skeleton } from "@chakra-ui/react";
import { format, getTime } from "date-fns";
import { useHistory } from "react-router-dom";
import { useLazyQuery, gql } from "@apollo/client";

import { IResponse } from "../../interfaces/IResponse";
import { IUser } from "../../interfaces/IUser";
import { useResponseContext } from "../../contexts/ResponseProvider";

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
  const history = useHistory();
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
        userQueryInput: { usersIds: [response.responsibleId, response.metatags?.updatedBy] },
      },
    });
    // eslint-disable-next-line
  }, [response]);

  const lastUpdatedBy: IUser = responseUsers.find(({ _id }) => _id === response.metatags?.updatedBy);
  const active = getTime(new Date(response.lastRenewalDate!)).toString() === snapshot;

  return (
    <Box
      cursor="pointer"
      onClick={() => history.push(`/compliance-item/${response._id}?snapshot=${getTime(new Date(response.lastRenewalDate!))}`)}
      bg="historicalListItem.bg"
      py={[1, 0]}
      w="full"
      borderBottomWidth="1px"
      borderBottomColor="historicalListItem.borderColor"
      p="15px 25px"
    >
      <Flex w="full" h={["full", "73px"]} align="center" position="relative">
        <Flex
          w="30%"
          fontSize="14px"
          lineHeight="18px"
          color="historicalListItem.fontColor"
          opacity="1"
          fontWeight={active ? "700" : "400"}
          align="flex-start"
          noOfLines={1}
          textOverflow="ellipsis"
        >
          {response.complianceItem.name}
        </Flex>
        <Flex
          w="20%"
          color="historicalListItem.fontColor"
          opacity="1"
          fontWeight={active ? "700" : "400"}
          fontSize="14px"
        >
          {format(new Date(response.lastRenewalDate!), "d MMM yyyy")}
        </Flex>
        <Box w="25%" pr='20px'>
          <Skeleton rounded="full" isLoaded={!responsibleLoading}>
            {response.responsible ? (
              <Flex direction="row" align="center">
                <Avatar
                  size="xs"
                  name={response.responsible?.displayName}
                  src={response.responsible?.imgUrl}
                />
                <Text
                  w="full"
                  pl={3}
                  lineHeight="17px"
                  color="historicalListItem.fontColor"
                  opacity="1"
                  fontSize="13px"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  fontWeight={active ? "700" : "400"}
                >
                  {response.responsible?.displayName}
                </Text>
              </Flex>
            ) : (
              <Flex fontStyle="italic" fontSize="13px">
                Unassigned
              </Flex>
            )}
          </Skeleton>
        </Box>
        <Box w='25%' pr='20px'>
          <Skeleton rounded="full" isLoaded={!responsibleLoading}>
            {lastUpdatedBy ? (
              <Flex direction="row" align="center">
                <Avatar
                  size="xs"
                  name={lastUpdatedBy?.displayName}
                  src={lastUpdatedBy?.imgUrl}
                />
                <Text
                  w="full"
                  pl={3}
                  lineHeight="17px"
                  color="historicalListItem.fontColor"
                  opacity="1"
                  fontSize="13px"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  fontWeight={active ? "700" : "400"}
                >
                  {lastUpdatedBy?.displayName}
                </Text>
              </Flex>
            ) : (
              <Flex fontStyle="italic" fontSize="13px" fontWeight={active ? "700" : "400"}>
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
    bg: "#FFFFFF",
    borderColor: "#F0F0F0",
    fontColor: "#282F36",
  },
};

export default HistoricalListItem;
