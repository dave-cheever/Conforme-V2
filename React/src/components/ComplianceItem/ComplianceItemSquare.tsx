import { useMemo } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Skeleton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import format from "date-fns/format";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { gql, useQuery } from "@apollo/client";

import { LocationIcon, UploadedTick } from "../../icons";
import { responseStatuses } from "../../hooks/useResponseUtils";
import { IResponse } from "../../interfaces/IResponse";
import useResponseUtils from "../../hooks/useResponseUtils";
import { IUser } from "../../interfaces/IUser";

const GET_USERS_BY_ID = gql`
  query ($userQueryInput: UserQueryInput) {
    usersById(userQueryInput: $userQueryInput) {
      _id
      displayName
      imgUrl
    }
  }
`;

const ComplianceItemSquare = ({ response }: { response: IResponse }) => {
  const history = useHistory();
  const { getStatus, getRenewalStatus } = useResponseUtils();
  const responseStatus = useMemo(() => getStatus(response), [getStatus, response]);
  const {
    data: { usersById: responseResponsible } = [],
    loading: responsibleLoading,
  } = useQuery(GET_USERS_BY_ID, {
    variables: {
      userQueryInput: {
        usersIds: response?.responsibleId || [],
      },
    },
  });
  const responsible: IUser = responseResponsible && responseResponsible.length !== 0 && responseResponsible[0];

  return (
    <Box
      _hover={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.18)" }}
      boxShadow="sm"
      bg="white"
      borderRadius="20px"
      w={["full", "full", "350px"]}
      flexShrink={0}
      p="20px 25px 20px 25px"
      h="290px"
    >
      <Flex align="center" justify="space-between">
        <Flex align="center">
          <Flex
            h='12px'
            bgColor={getRenewalStatus(response) === 'comingUp' ? 'complianceSquare.comingUp' : `complianceSquare.${responseStatus}`}
            w='12px'
            rounded="full"
          />
          <Box
            color='complianceSquare.fontColor'
            opacity='1'
            fontSize='11px'
            overflow='hidden'
            textOverflow='ellipsis'
            whiteSpace='nowrap'
            ml={2}
          >
            {response.complianceItem?.category?.name ? response.complianceItem?.category?.name : <Flex fontStyle='italic'>Unassigned</Flex>}
          </Box>
        </Flex>
        <Flex align='center'>
          {response.evidence?.some(({ uploaded }) => !uploaded) ?
            <Tooltip label='Evidence required' placement='top' hasArrow><UploadedTick color='complianceSquare.crossIcon' /></Tooltip> :
            <Tooltip label='Evidence uploaded' placement='top' hasArrow><UploadedTick color='complianceSquare.tickIcon' ml={2} /></Tooltip>
          }
        </Flex>
      </Flex>
      <Flex h="52px" w="full" mt={2} align="center" position="relative">
        <Skeleton rounded="full" isLoaded={!responsibleLoading}>
          <Tooltip label={responsible?.displayName}>
            <Avatar
              boxSize="24px"
              size="sm"
              cursor="pointer"
              name={responsible?.displayName}
              src={responsible?.imgUrl}
            />
          </Tooltip>
        </Skeleton>
        <Text
          w="full"
          fontSize="16px"
          lineHeight="20px"
          color="complianceSquare.nameFontColor"
          fontWeight="700"
          noOfLines={2}
          ml={3}
        >
          {response.complianceItem?.name}
        </Text>
      </Flex>
      <Flex h="40px" w="full" align="center">
        <LocationIcon ml={1} color="complianceSquare.businessUnitFontColor" />
        <Box
          w="200px"
          pl={2}
          lineHeight="20px"
          color="complianceSquare.businessUnitFontColor"
          fontSize="14px"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {response.businessUnit?.name}
        </Box>
      </Flex>
      <Flex h="50px" w="full" py="4" alignItems="flex-start">
        <Box w="50%" color="complianceSquare.categoryFontColor" fontSize="11px">
          <Box>Regulatory body</Box>
          <Box
            color="complianceSquare.nameFontColor"
            fontSize="14px"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {response.complianceItem?.regulatoryBody?.name ? (
              response.complianceItem?.regulatoryBody?.name
            ) : (
              <Flex fontStyle="italic">Unassigned</Flex>
            )}
          </Box>
        </Box>
        <Box
          ml={3}
          w="50%"
          color="complianceSquare.regulatoryFontColor"
          fontSize="11px"
        >
          <Box>Next renewal on</Box>
          <Box
            color="complianceSquare.nameFontColor"
            fontSize="13px"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {response?.nextRenewalDate ? (
              format(new Date(response?.nextRenewalDate), "d MMM yyyy")
            ) : (
              <Flex fontStyle="italic">No due date</Flex>
            )}
          </Box>
        </Box>
      </Flex>
      <Flex pt="50px" w="full" align="center" justify="space-between">
        <Button
          bg={
            responseStatus === "nonCompliant"
              ? "complianceSquare.nonCompliant"
              : "complianceSquare.buttonBg"
          }
          fontSize="11px"
          rightIcon={
            <ChevronRightIcon
              color={
                responseStatus === "nonCompliant"
                  ? "white"
                  : "complianceSquare.fontColor"
              }
              boxSize="20px"
            />
          }
          color={
            responseStatus === "nonCompliant"
              ? "white"
              : "complianceSquare.fontColor"
          }
          w="85px"
          h="28px"
          _hover={{
            bg:
              responseStatus === "nonCompliant"
                ? "complianceSquare.nonCompliant"
                : "complianceSquare.buttonBg",
          }}
          onClick={() => history.push(`/compliance-item/${response._id}`)}
        >
          Details
        </Button>
        <Flex
          align="center"
          justify="center"
          flexDirection="column"
          color="complianceSquare.nameFontColor"
          mr={1}
        >
          <Box fontSize="11px" fontWeight="700">
            {responseStatus && responseStatuses[responseStatus]}
          </Box>
          {getRenewalStatus(response) === 'comingUp' && (
            <Box fontSize="11px" fontWeight="700">
              Coming up
            </Box>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default ComplianceItemSquare;

export const complianceItemsSquareStyles = {
  complianceSquare: {
    compliant: "#62c240",
    nonCompliant: "#FC5960",
    comingUp: "#FFA012",
    statusFontColor: "#FFFFFF",
    imageBg: "#ffffff",
    rightIcon: "#9A9EA1",
    crossIcon: "#F0F0F0",
    tickIcon: "#41BA17",
    fontColor: "#818197",
    regulatoryFontColor: "#818197",
    renewalFontColor: "#424B50",
    evidenceFontColor: "#424B50",
    businessUnitFontColor: "#818197",
    categoryFontColor: "#818197",
    nameFontColor: "#282F36",
    buttonBg: "#F0F2F5",
  },
};
