import { Avatar, Box, Text } from '@chakra-ui/react';

import { IAuditor } from '../../interfaces/IAuditor';

function Auditor({ name, designation, imgSrc }: IAuditor) {
  return (
    <Box
      _hover={{
        cursor: 'pointer',
        borderRadius: '8px',
        boxShadow: '0px 10px 30px 0px #0000002E',
      }}
      alignItems="center"
      data-id="000390"
      display="flex"
      justifyContent="start"
      p="10px 10px">
      <Avatar
        bg="auditModal.participants.avatar.bg"
        data-id="000391"
        h="36px"
        lineHeight="0px"
        mr="15px"
        name={name?.replace(/\s*\(.*?\)\s*/g, '')} 
        src={imgSrc}
        w="36px" />
      <Box data-id="000392">
        <Text
          color="auditModal.participants.avatar.text.name"
          data-id="000393"
          fontSize="md"
          fontWeight="400">
          {name}
        </Text>
        <Text
          color="auditModal.participants.avatar.text.designation"
          data-id="000394"
          fontSize="sm"
          fontWeight="400">
          {designation}
        </Text>
      </Box>
    </Box>
  );
}

export default Auditor;
