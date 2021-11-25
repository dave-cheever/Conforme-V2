import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { ArrowRight } from '../../icons';

const AdminTableHeaderElement = ({w, label}) => {
  return (
    <Flex w={w} alignItems="center ">
      <Text>{label}</Text>
      <ArrowRight ml="10px" stroke="adminTableHeaderElement.stroke" transform="rotate(90deg)" />
    </Flex>
  );
};

export default AdminTableHeaderElement;

export const adminTableHeaderElementStyles = {
  adminTableHeaderElement: {
    stroke: "#282F36"
  }
};
