import { SearchIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/layout'
import { InputGroup, Input, InputRightElement, Text } from '@chakra-ui/react'
import { Collapse } from '@chakra-ui/transition'
import { useContext, useMemo, useState } from 'react'
import { IAuditor } from '../../interfaces/IAuditor'
import AuditModalContext from './AuditModalContext'
import Auditor from './Auditor'

const AuditorSearchBar = () => {

  const modalContext = useContext(AuditModalContext);
  const auditors = useMemo(() =>
    modalContext.auditors, [modalContext.auditors]);

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

        >Auditor name</Text>
        <InputGroup>
          <Input
            variant="auditModalSearchInput"
            onFocus={onFocus}
            onBlur={onBlur}
            value={modalContext.auditorSearchText}
            onChange={(e: any) =>
              modalContext.updateAuditorSearchText(e.target.value)}
            h="55px"
            placeholder="Search Here"
          />
          <InputRightElement children={<SearchIcon
            transformOrigin="center"
            transform="translate(0px, 7px)"
          />} />
        </InputGroup>
      </Box>
      <Collapse in={focused} animateOpacity={false}  >
        <Box bg="white"
          w="560px" maxH="220px" overflow="auto"
          position="absolute" mt="-15px" zIndex="999999"
          boxShadow="0px 10px 30px 0px #0000002E"
          borderRadius="8px" p="10px 10px"
        >
          {auditors.length > 0 ? auditors.map((auditor: IAuditor) => (
            <Box onClick={() => {
              modalContext.updateSelectedAuditors(auditor, "add")
              modalContext.updateAuditorSearchText("")
            }}>
              <Auditor name={auditor.name} designation={auditor.designation}
                imgSrc={auditor.imgSrc} />
            </Box>
          ))
            : <Box display="flex" justifyContent="center"
              alignItems="center" p="10px 10px">
              <Text>No Auditors In The List</Text>
            </Box>
          }
        </Box>
      </Collapse >
    </Box>
  )
}

export default AuditorSearchBar
