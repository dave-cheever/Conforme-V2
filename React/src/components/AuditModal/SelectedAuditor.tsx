import { Avatar, Box, Tag, TagCloseButton, TagLabel, Text } from '@chakra-ui/react'
import { useContext } from 'react';
import { IAuditor } from '../../interfaces/IAuditor'
import AuditModalContext from './AuditModalContext';



const SelectedAuditor = ({ name, designation, imgSrc }: IAuditor) => {

  const modalContext = useContext(AuditModalContext);

  let auditor: IAuditor = {
    name: name,
    designation: designation,
    imgSrc: imgSrc
  }

  return (
    <Tag h="62px" w="280px" size="lg" bg="white" borderRadius="10px" p="0px 20px"
      boxShadow="0px 10px 30px 0px #42424214">
      <Box display="flex" justifyContent="start"
        alignItems="center" w="250px">
        <Avatar w="36px" h="36px" bg="auditModal.participants.avatar.bg"
          lineHeight="0px"
          name={name} src={imgSrc}
          mr="15px" />
        <TagLabel>
          <Text fontWeight="400" fontSize="md"
            color="auditModal.participants.avatar.text.name" >{name}</Text>
          <Text fontWeight="400" fontSize="sm"
            color="auditModal.participants.avatar.text.designation">{designation}</Text>
        </TagLabel>
      </Box>
      <TagCloseButton w="20px" onClick={() => modalContext.updateSelectedAuditors(auditor, "remove")} />
    </Tag>
  )
}

export default SelectedAuditor
