import { useContext, useMemo, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Collapse,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';

import { IAuditor } from '../../interfaces/IAuditor';
import AuditModalContext from './AuditModalContext';
import Auditor from './Auditor';

const AuditorSearchBar = () => {
  const modalContext = useContext(AuditModalContext);
  const auditors = useMemo(
    () => modalContext.auditors,
    [modalContext.auditors],
  );

  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  return (
    <Box>
      <Box
        bg="auditModal.participants.customSearch.bg"
        border="2px solid"
        borderColor="auditModal.participants.customSearch.border"
        borderRadius="8px"
        h="55px"
        mb="20px"
        overflow="hidden"
        position="relative"
      >
        <Text
          fontSize="sm"
          fontWeight="700"
          padding="2px 15px"
          position="absolute"
          zIndex="999"
        >
          Auditor name
        </Text>
        <InputGroup>
          <Input
            h="55px"
            onBlur={onBlur}
            onChange={(e: any) =>
              modalContext.updateAuditorSearchText(e.target.value)
            }
            onFocus={onFocus}
            placeholder="Search Here"
            value={modalContext.auditorSearchText}
            variant="auditModalSearchInput"
          />
          <InputRightElement>
            <SearchIcon
              transform="translate(0px, 7px)"
              transformOrigin="center"
            />
          </InputRightElement>
        </InputGroup>
      </Box>
      <Collapse animateOpacity={false} in={focused}>
        <Box
          bg="white"
          borderRadius="8px"
          boxShadow="0px 10px 30px 0px #0000002E"
          maxH="220px"
          mt="-15px"
          overflow="auto"
          p="10px 10px"
          position="absolute"
          w="560px"
          zIndex="999999"
        >
          {auditors.length > 0 ? (
            auditors.map((auditor: IAuditor) => (
              <Box
                onClick={() => {
                  modalContext.updateSelectedAuditors(auditor, 'add');
                  modalContext.updateAuditorSearchText('');
                }}
              >
                <Auditor
                  designation={auditor.designation}
                  imgSrc={auditor.imgSrc}
                  name={auditor.name}
                />
              </Box>
            ))
          ) : (
            <Box
              alignItems="center"
              display="flex"
              justifyContent="center"
              p="10px 10px"
            >
              <Text>No Auditors In The List</Text>
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default AuditorSearchBar;
