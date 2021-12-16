import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { ArrowDownIcon } from '../../icons';

const AdminTableHeaderElement = ({w, ml, label} : {w: any, ml?: string, label: string}) => {
  return (
    <Flex w={w} ml={ml ? ml : "0"} alignItems="center">
      <Text color="adminTableHeaderElement.fontColor">{label}</Text>
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
