import { Box } from '@chakra-ui/layout'
import { InputGroup, Input, InputRightElement, Text } from '@chakra-ui/react'
import { Collapse } from '@chakra-ui/transition'
import { useContext, useState } from 'react'
import { OpenMenuArrow } from '../../icons'
import AuditModalContext from './AuditModalContext'

const AreaToInspect = () => {

  const modalContext = useContext(AuditModalContext);
  const [focused, setFocused] = useState(false)
  const onFocus = () => setFocused(true)
  const onBlur = () => setFocused(false)

  return (
    <Box>
      <Box
        h="55px"
        position="relative"
        mb="20px"
        overflow="hidden"
        bg="auditModal.participants.customSearch.bg"
        border="2px solid"
        borderColor="auditModal.participants.customSearch.border"
        borderRadius="8px"
      >
        <Text
          position="absolute"
          zIndex="999"
          fontSize="sm"
          fontWeight="700"
          padding="2px 15px"

        >Select area</Text>
        <InputGroup>
          <Input
            variant="auditModalSearchInput"
            readOnly
            onFocus={onFocus}
            onBlur={onBlur}
            value={modalContext.selectedArea}
            h="55px"
            cursor="pointer"
            placeholder="Search Here"
            mb="20px"
          />
          <InputRightElement children={<OpenMenuArrow
            transformOrigin="center"
            transform="translate(0px, 8px)"
          />} />
        </InputGroup>
      </Box>
      <Collapse in={focused} animateOpacity={false}  >
        <Box bg="white"
          w="275px" maxH="120px" overflow="auto"
          position="absolute" mt="-15px" zIndex="9999"
          boxShadow="0px 10px 30px 0px #0000002E"
          borderRadius="8px" p="10px 10px"
        >
          <Box>
            <Box display="flex" justifyContent="start"
              alignItems="center" p="10px 10px"
              _hover={{
                cursor: "pointer", borderRadius: "8px",
                boxShadow: "0px 10px 30px 0px #0000002E"
              }}
              onClick={() => modalContext.setSelectedArea("Surgery")}
            >
              <Text fontWeight="400" fontSize="md" color="grey">Surgery</Text>
            </Box>
            <Box display="flex" justifyContent="start"
              alignItems="center" p="10px 10px"
              _hover={{
                cursor: "pointer", borderRadius: "8px",
                boxShadow: "0px 10px 30px 0px #0000002E"
              }}
              onClick={() => modalContext.setSelectedArea("Clinical")}
            >
              <Text fontWeight="400" fontSize="md" color="grey">Clinical</Text>
            </Box>

          </Box>
        </Box>
      </Collapse >
    </Box >
  )
}

export default AreaToInspect
