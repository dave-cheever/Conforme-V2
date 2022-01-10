import React from "react";
import {
  Flex,
  Avatar,
  Spacer,
  Tooltip,
  Text,
} from "@chakra-ui/react";

import useDevice from "../hooks/useDevice";
import { ArrowCount } from "../icons";
import { ILocation } from "../interfaces/ILocation";

const LocationListItem = ({
  location,
  openLocationModal,
}: {
  location: ILocation;
  openLocationModal;
}) => {
  const device = useDevice();

  return (
    <Flex
      flexShrink={0}
      w="calc(100% - 22px)"
      h="73px"
      bg="adminComplianceItems.element.bg"
      color="adminComplianceItems.element.font"
      pl={6}
      align="center"
      mt="0px"
      fontSize="smm"
      cursor="pointer"
      borderBottom="1px solid"
      borderColor="adminTableHeader.border"
      fontWeight="semi_medium"
      overflow="hidden"
      overflowwrap="ellipsis"
      onClick={() => openLocationModal("edit", location)}
    >
      <Flex w={["max-content", "full"]}>{location.name}</Flex>
      {device !== "mobile" && device !== "tablet" && (
        <>
          <Flex w="full">
            <Text noOfLines={1} mr="25px">
              {location.notes || '-'}
            </Text>
          </Flex>
          <Flex w="full">
            <Avatar
              color="userMenu.avatar.color"
              bg="userMenu.avatar.bg"
              rounded="full"
              name={location?.owner?.displayName}
              h="24px"
              w="24px"
              src={location?.owner?.imgUrl}
              mr="10px"
              size="sm"
            />
            {location?.owner?.displayName}
          </Flex>

        </>
      )}
      <Spacer display={["block", "none"]} />
      <Flex w={["97px", "full"]} alignItems="center">
        {location.complianceItemsResponsesCount || "0"}
        <Tooltip label="Show Items" fontSize="md">
          <ArrowCount
            w="10px"
            h="10px"
            stroke="locations.tooltipStroke"
            cursor="pointer"
            ml="13px"
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default LocationListItem;
