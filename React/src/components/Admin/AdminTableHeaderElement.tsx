import React from 'react';
import { Flex, Text, Tooltip } from '@chakra-ui/react';
import { ArrowDownIcon } from '../../icons';

interface IProps {
  w: any;
  ml?: any;
  label: string;
  tooltip?: string;
}

const AdminTableHeaderElement = ({w, ml, label, tooltip = ""} : IProps) => {
  return (
    <Flex w={w} ml={ml ? ml : "0"} alignItems="center">
      <Tooltip hasArrow label={tooltip} isDisabled={tooltip === ""}>
        <Text color="adminTableHeaderElement.fontColor"  cursor={tooltip === "" ? "auto":"pointer"}>{label}</Text>
      </Tooltip>
      <ArrowDownIcon ml="10px" stroke="adminTableHeaderElement.stroke" />
    </Flex>
  );
};

export default AdminTableHeaderElement;

export const adminTableHeaderElementStyles = {
  adminTableHeaderElement: {
    stroke: "#282F36",
    fontColor: "#818197"
  }
};
