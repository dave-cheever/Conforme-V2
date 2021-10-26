import { Avatar, Box, Text } from '@chakra-ui/react'
import { IAuditor } from '../../interfaces/IAuditor'



const Auditor = ({ name, designation, imgSrc }: IAuditor) => {
  return (
    <Box display="flex" justifyContent="start" alignItems="center" p="10px 10px"
      _hover={{ cursor: "pointer", borderRadius: "8px", boxShadow: "0px 10px 30px 0px #0000002E" }}>
      <Avatar w="36px" h="36px" bg="auditModal.participants.avatar.bg"
        lineHeight="0px"
        name={name}
        src={imgSrc}
        mr="15px" />
      <Box>
        <Text fontWeight="400" fontSize="md"
          color="auditModal.participants.avatar.text.name" >{name}</Text>
        <Text fontWeight="400" fontSize="sm"
          color="auditModal.participants.avatar.text.designation">{designation}</Text>
      </Box>
    </Box>
  )
}

export default Auditor
