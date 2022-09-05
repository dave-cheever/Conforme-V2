import { useContext, useState } from 'react';

import { Box, Collapse, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import { OpenMenuArrow } from '../../icons';
import AuditModalContext from './AuditModalContext';

const AreaToInspect = () => {
  const modalContext = useContext(AuditModalContext);
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
        <Text fontSize="sm" fontWeight="700" padding="2px 15px" position="absolute" zIndex="999">
          Select {capitalize(t('business unit'))}
        </Text>
        <InputGroup>
          <Input
            cursor="pointer"
            h="55px"
            mb="20px"
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder="Search Here"
            readOnly
            value={modalContext.selectedArea}
            variant="auditModalSearchInput"
          />
          <InputRightElement>
            <OpenMenuArrow transform="translate(0px, 8px)" transformOrigin="center" />
          </InputRightElement>
        </InputGroup>
      </Box>
      <Collapse animateOpacity={false} in={focused}>
        <Box
          bg="white"
          borderRadius="8px"
          boxShadow="0px 10px 30px 0px #0000002E"
          maxH="120px"
          mt="-15px"
          overflow="auto"
          p="10px 10px"
          position="absolute"
          w="275px"
          zIndex="9999"
        >
          <Box>
            <Box
              _hover={{
                cursor: 'pointer',
                borderRadius: '8px',
                boxShadow: '0px 10px 30px 0px #0000002E',
              }}
              alignItems="center"
              display="flex"
              justifyContent="start"
              onClick={() => modalContext.setSelectedArea('Surgery')}
              p="10px 10px"
            >
              <Text color="grey" fontSize="md" fontWeight="400">
                Surgery
              </Text>
            </Box>
            <Box
              _hover={{
                cursor: 'pointer',
                borderRadius: '8px',
                boxShadow: '0px 10px 30px 0px #0000002E',
              }}
              alignItems="center"
              display="flex"
              justifyContent="start"
              onClick={() => modalContext.setSelectedArea('Clinical')}
              p="10px 10px"
            >
              <Text color="grey" fontSize="md" fontWeight="400">
                Clinical
              </Text>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default AreaToInspect;
