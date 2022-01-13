import React from 'react';
import { Flex, Text, Tooltip } from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon } from '../../icons';

const AdminTableHeaderElement = ({ w, ml, label, onClick, sortOrder, showSortingIcon, tooltip = "" }: { w: any, ml?: string, label: string, onClick?, sortOrder?: boolean, showSortingIcon?: boolean, tooltip?: string }) => {
  return (
    <Flex w={w} ml={ml ? ml : "0"} cursor="pointer" alignItems="center" onClick={onClick} >
      <Tooltip hasArrow label={tooltip} isDisabled={tooltip === ""}>
        <Text color="adminTableHeaderElement.fontColor" >{label}</Text>
      </Tooltip>
      {
        sortOrder != null && !sortOrder
          ? <ArrowDownIcon
            ml="10px"
            color={showSortingIcon ? "adminTableHeaderElement.colorEnabled" : "adminTableHeaderElement.colorDisabled"}
            _hover={{ color: onClick ? "#282F36" : "#FFFFFF" }}
          />
          : <ArrowUpIcon
            ml="10px"
            color={showSortingIcon ? "adminTableHeaderElement.colorEnabled" : "adminTableHeaderElement.colorDisabled"}
            _hover={{ color: onClick ? "#282F36" : "#FFFFFF" }}
          />
      }
    </Flex>
  );
};

export default AdminTableHeaderElement;

export const adminTableHeaderElementStyles = {
  adminTableHeaderElement: {
    colorEnabled: "#282F36",
    colorDisabled: "#FFFFFF",
    fontColor: "#818197"
  }
};
