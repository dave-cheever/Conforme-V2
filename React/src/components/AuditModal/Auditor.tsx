import { Avatar, Box, Text } from '@chakra-ui/react';

import { IAuditor } from '../../interfaces/IAuditor';

function Auditor({ name, designation, imgSrc }: IAuditor) {
  return (
    <Box
      data-id="000390"
      _hover={{
        cursor: 'pointer',
        borderRadius: '8px',
        boxShadow: '0px 10px 30px 0px #0000002E',
      }}
      alignItems="center"
      display="flex"
      justifyContent="start"
      p="10px 10px">
      <Avatar
        data-id="000391"
        bg="auditModal.participants.avatar.bg"
        h="36px"
        lineHeight="0px"
        mr="15px"
        name={name?.replace(/\s*\(.*?\)\s*/g, '')} 
        src={imgSrc}
        w="36px" />
      <Box data-id="000392">
        <Text
          data-id="000393"
          color="auditModal.participants.avatar.text.name"
          fontSize="md"
          fontWeight="400">
          {name}
        </Text>
        <Text
          data-id="000394"
          color="auditModal.participants.avatar.text.designation"
          fontSize="sm"
          fontWeight="400">
          {designation}
        </Text>
      </Box>
    </Box>
  );
}

export default Auditor;
