import React from "react";
import { Box, Flex, Text, Avatar } from "@chakra-ui/react";
import { format } from "date-fns";
import { useHistory } from "react-router-dom";

import useResponseUtils from "../../hooks/useResponseUtils";
import { Close, TickIcon, LocationIcon } from "../../icons";
import { IResponse } from "../../interfaces/IResponse";
import BriefcaseIcon from "../BriefcaseIcon";

const ComplianceListItem = ({ response }: { response: IResponse }) => {

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
        <Flex w="12%" >
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
        <Flex w="10%">
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
        <Box w="18%">
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
        <Box w="20%">
          {response?.responsible ?
            <Flex direction="row" align="center">
              <Avatar size="xs" name={response?.responsible?.displayName}
                src={response?.responsible?.imgUrl} />
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
                {response?.responsible?.displayName}
              </Text>
            </Flex> : <Flex fontStyle="italic" fontSize="13px">Unassigned</Flex>}
        </Box>
        <Box w="20%">
          <Flex>
            <LocationIcon boxSize="12px" mt="2px"/>
            <Text
              w="full"
              pl={2}
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
