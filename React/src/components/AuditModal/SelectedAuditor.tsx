import { useContext } from 'react';

import { Avatar, Box, Tag, TagCloseButton, TagLabel, Text } from '@chakra-ui/react';

import { IAuditor } from '../../interfaces/IAuditor';
import AuditModalContext from './AuditModalContext';

function SelectedAuditor({ name, designation, imgSrc }: IAuditor) {
  const modalContext = useContext(AuditModalContext);

  const auditor: IAuditor = {
    name,
    designation,
    imgSrc,
  };

  return (
    <Tag
        data-id="000471"
        bg="white"
        borderRadius="10px"
        boxShadow="0px 10px 30px 0px #42424214"
        h="62px"
        p="0px 20px"
        size="lg"
        w="280px">
      <Box
        data-id="000472"
        alignItems="center"
        display="flex"
        justifyContent="start"
        w="250px">
        <Avatar
          data-id="000473"
          bg="auditModal.participants.avatar.bg"
          h="36px"
          lineHeight="0px"
          mr="15px"
          name={name?.replace(/\s*\(.*?\)\s*/g, '')} 
          src={imgSrc}
          w="36px" />
        <TagLabel data-id="000474">
          <Text
            data-id="000475"
            color="auditModal.participants.avatar.text.name"
            fontSize="md"
            fontWeight="400">
            {name}
          </Text>
          <Text
            data-id="000476"
            color="auditModal.participants.avatar.text.designation"
            fontSize="sm"
            fontWeight="400">
            {designation}
          </Text>
        </TagLabel>
      </Box>
      <TagCloseButton
        data-id="000477"
        onClick={() => modalContext.updateSelectedAuditors(auditor, 'remove')}
        w="20px" />
    </Tag>
  );
}

export default SelectedAuditor;
