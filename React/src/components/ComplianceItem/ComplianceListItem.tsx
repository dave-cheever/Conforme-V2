import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Box, Flex, Text, Avatar, SkeletonCircle, Skeleton } from "@chakra-ui/react";
import { format } from "date-fns";
import { useHistory } from "react-router-dom";

import useResponseUtils from "../../hooks/useResponseUtils";
import { Close, TickIcon, LocationIcon } from "../../icons";
import { IResponse } from "../../interfaces/IResponse";
import { IUser } from "../../interfaces/IUser";
import BriefcaseIcon from "../BriefcaseIcon";

const GET_USERS_BY_ID = gql`
  query ($userQueryInput: UserQueryInput) {
    usersById(userQueryInput: $userQueryInput) {
      _id
      displayName
      imgUrl
    }
  }
`;

const ComplianceListItem = ({ response }: { response: IResponse }) => {
  const { data: { usersById: responseResponsible } = [], loading:responsibleLoading } = useQuery(
    GET_USERS_BY_ID,
    {
      variables: {
        userQueryInput: { usersIds: response?.responsibleId || [] },
      },
    }
  );
  const responsible: IUser =
    responseResponsible &&
    responseResponsible?.length !== 0 &&
    responseResponsible[0];

  const history = useHistory();
  const { getStatus } = useResponseUtils();

  return (
    <Box
      cursor="pointer"
      onClick={() => history.push(`/compliance-item/${response._id}`)}
      bg="white"
      py={[1, 0]}
      w="full"
      borderBottomWidth="1px"
      borderBottomColor="complianceList.headerBorderColor"
      p="15px 25px"
    >
      <Flex w="full" h={["full", "73px"]} align="center" position="relative">
        <Flex w="20%" flexDir="column">
          <Flex
            fontSize="14px"
            lineHeight="18px"
            color="complianceList.fontColor"
            opacity="1"
            fontWeight="400"
            h="50%"
            align="flex-start"
            pt="3px"
            noOfLines={1}
            textOverflow="ellipsis"
          >
            {response.complianceItem?.name}
            {response.businessUnit?.type === "Corporate" && (
              <Box ml={3}>
                <BriefcaseIcon />
              </Box>
            )}
          </Flex>
        </Flex>
        <Flex w="10%" ml={2}>
          <Flex
            color="complianceList.fontColor"
            opacity="1"
            fontWeight="400"
            fontSize="14px"
          >
            {response?.nextRenewalDate ? (
              format(new Date(response?.nextRenewalDate), "d MMM yyyy")
            ) : (
              <Flex fontStyle="italic">No due date</Flex>
            )}
          </Flex>
        </Flex>
        <Flex w="10%" ml={2}>
          {response && getStatus(response) === "nonCompliant" ? (
            <Flex align="center">
              <Close stroke="complianceList.crossIcon" mr={2} />
              <Flex
                fontWeight="700"
                fontSize="14px"
                color="complianceList.crossIcon"
              >
                No
              </Flex>
            </Flex>
          ) : (
            <Flex align="flex-end">
              <TickIcon stroke="complianceList.tickIcon" mr={2} />
              <Flex
                fontWeight="700"
                fontSize="14px"
                color="complianceList.tickIcon"
              >
                Yes
              </Flex>
            </Flex>
          )}
        </Flex>
        <Box w="10%" ml={2}>
          {response?.evidence?.find(
            ({ uploaded }) => uploaded === undefined
          ) ? (
            <Flex align="center">
              <Close stroke="complianceList.crossIcon" mr={2} />
              <Flex
                fontWeight="700"
                fontSize="14px"
                color="complianceList.crossIcon"
              >
                Missing
              </Flex>
            </Flex>
          ) : (
            <Flex align="flex-end">
              <TickIcon stroke="complianceList.tickIcon" mr={2} />
              <Flex
                fontWeight="700"
                fontSize="14px"
                color="complianceList.tickIcon"
              >
                Uploaded
              </Flex>
            </Flex>
          )}
        </Box>
        <Box w="10%" ml={2}>
          <Flex
              fontSize="14px"
              lineHeight="18px"
              color="complianceList.fontColor"
              opacity="1"
              fontWeight="400"
              h="50%"
              align="flex-start"
              pt="3px"
            >
              {response?.complianceItem?.category?.name || "N/A"}
            </Flex>
        </Box>
        <Box w="10%" ml={2}>
          <Box
            color="complianceList.fontColor"
            opacity="1"
            fontSize="14px"
            fontWeight="400"
          >
            {response.complianceItem?.regulatoryBody?.name ? (
              response.complianceItem?.regulatoryBody?.name
            ) : (
              <Flex fontStyle="italic">Unassigned</Flex>
            )}
          </Box>
        </Box>
        <Box w="15%" ml={2}>
          {responsibleLoading ? <Flex align="center">
            <SkeletonCircle boxSize="24px" />
            <Skeleton ml={3} w="50%" height="10px" />
          </Flex>:
          <Flex direction="row" align="center">
            <Avatar boxSize="24px" name={responsible?.displayName}
              src={responsible?.imgUrl} />
            <Text
              w="full"
              pl={3}
              lineHeight="17px"
              color="complianceList.fontColor"
              opacity="1"
              fontSize="13px"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {responsible?.displayName}
            </Text>
          </Flex>}
        </Box>
        <Box w="15%" ml={3}>
          <Flex>
            <LocationIcon boxSize="12px" />
            <Text
              w="full"
              pl={3}
              lineHeight="17px"
              color="complianceList.fontColor"
              opacity="1"
              fontSize="13px"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {response.businessUnit?.name}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default ComplianceListItem;
