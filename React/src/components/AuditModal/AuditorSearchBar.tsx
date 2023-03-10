import { useContext, useMemo, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Collapse, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';

import { IAuditor } from '../../interfaces/IAuditor';
import AuditModalContext from './AuditModalContext';
import Auditor from './Auditor';

const AuditorSearchBar = () => {
  const modalContext = useContext(AuditModalContext);
  const auditors = useMemo(() => modalContext.auditors, [modalContext.auditors]);

  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  return (
    (<Box data-id="3e1bad71cfd2">
      <Box
        bg="auditModal.participants.customSearch.bg"
        border="2px solid"
        borderColor="auditModal.participants.customSearch.border"
        borderRadius="8px"
        data-id="04cd7488cca2"
        h="55px"
        mb="20px"
        overflow="hidden"
        position="relative">
        <Text
          data-id="12947a67a841"
          fontSize="sm"
          fontWeight="700"
          padding="2px 15px"
          position="absolute"
          zIndex="999">
          Auditor name
        </Text>
        <InputGroup data-id="7fdb956d6436">
          <Input
            data-id="e70e539984f7"
            h="55px"
            onBlur={onBlur}
            onChange={(e: any) => modalContext.updateAuditorSearchText(e.target.value)}
            onFocus={onFocus}
            placeholder="Search Here"
            value={modalContext.auditorSearchText}
            variant="auditModalSearchInput" />
          <InputRightElement data-id="28f83aea0590">
            <SearchIcon
              data-id="20aafa84a2a0"
              transform="translate(0px, 7px)"
              transformOrigin="center" />
          </InputRightElement>
        </InputGroup>
      </Box>
      <Collapse animateOpacity={false} data-id="6796fb1c97d7" in={focused}>
        <Box
          bg="white"
          borderRadius="8px"
          boxShadow="0px 10px 30px 0px #0000002E"
          data-id="b10e2d7c26ad"
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
                data-id="4f69a9c9a027"
                onClick={() => {
                  modalContext.updateSelectedAuditors(auditor, 'add');
                  modalContext.updateAuditorSearchText('');
                }}>
                <Auditor
                  data-id="36b02db3c651"
                  designation={auditor.designation}
                  imgSrc={auditor.imgSrc}
                  name={auditor.name} />
              </Box>
            ))
          ) : (
            <Box
              alignItems="center"
              data-id="3a58432e94fa"
              display="flex"
              justifyContent="center"
              p="10px 10px">
              <Text data-id="a2fe4bb40c29">No Auditors In The List</Text>
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>)
  );
};

export default AuditorSearchBar;
