import { useContext, useMemo, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Collapse, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';

import { IAuditor } from '../../interfaces/IAuditor';
import AuditModalContext from './AuditModalContext';
import Auditor from './Auditor';

function AuditorSearchBar() {
  const modalContext = useContext(AuditModalContext);
  const auditors = useMemo(() => modalContext.auditors, [modalContext.auditors]);

  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  return (
    <Box data-id="000399">
      <Box
        data-id="000400"
        bg="auditModal.participants.customSearch.bg"
        border="2px solid"
        borderColor="auditModal.participants.customSearch.border"
        borderRadius="8px"
        h="55px"
        mb="20px"
        overflow="hidden"
        position="relative">
        <Text
          data-id="000401"
          fontSize="sm"
          fontWeight="700"
          padding="2px 15px"
          position="absolute"
          zIndex="999">
          Auditor name
        </Text>
        <InputGroup data-id="000402">
          <Input
            data-id="000403"
            h="55px"
            onBlur={onBlur}
            onChange={(e: any) => modalContext.updateAuditorSearchText(e.target.value)}
            onFocus={onFocus}
            placeholder="Search Here"
            value={modalContext.auditorSearchText}
            variant="auditModalSearchInput" />
          <InputRightElement data-id="000404">
            <SearchIcon
              data-id="000405"
              transform="translate(0px, 7px)"
              transformOrigin="center" />
          </InputRightElement>
        </InputGroup>
      </Box>
      <Collapse data-id="000406" animateOpacity={false} in={focused}>
        <Box
          data-id="000407"
          bg="white"
          borderRadius="8px"
          boxShadow="0px 10px 30px 0px #0000002E"
          maxH="220px"
          mt="-15px"
          overflow="auto"
          p="10px 10px"
          position="absolute"
          w="560px"
          zIndex="999999">
          {auditors.length > 0 ? (
            auditors.map((auditor: IAuditor) => (
              <Box
                data-id="000408"
                onClick={() => {
                  modalContext.updateSelectedAuditors(auditor, 'add');
                  modalContext.updateAuditorSearchText('');
                }}>
                <Auditor
                  data-id="000409"
                  designation={auditor.designation}
                  imgSrc={auditor.imgSrc}
                  name={auditor.name} />
              </Box>
            ))
          ) : (
            <Box
              data-id="000410"
              alignItems="center"
              display="flex"
              justifyContent="center"
              p="10px 10px">
              <Text data-id="000411">No Auditors In The List</Text>
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}

export default AuditorSearchBar;
