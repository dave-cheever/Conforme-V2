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
      data-id="030925-0511d3"
      display="flex"
      justifyContent="start"
      p="10px 10px">
      <Avatar
        bg="auditModal.participants.avatar.bg"
        data-id="030925-c4679c"
        h="36px"
        lineHeight="0px"
        mr="15px"
        name={name?.replace(/\s*\(.*?\)\s*/g, '')} 
        src={imgSrc}
        w="36px" />
      <Box data-id="030925-0eb3ec">
        <Text
          color="auditModal.participants.avatar.text.name"
          data-id="030925-a1d476"
          fontSize="md"
          fontWeight="400">
          {name}
        </Text>
        <Text
          color="auditModal.participants.avatar.text.designation"
          data-id="030925-48e2a4"
          fontSize="sm"
          fontWeight="400">
          {designation}
        </Text>
      </Box>
    </Box>
  );
}

export default Auditor;
