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
    (<Box data-id="688ad6e38783">
      <Box
        bg="auditModal.participants.customSearch.bg"
        border="2px solid"
        borderColor="auditModal.participants.customSearch.border"
        borderRadius="8px"
        data-id="81075209a704"
        h="55px"
        mb="20px"
        overflow="hidden"
        position="relative">
        <Text
          data-id="322f14ef923b"
          fontSize="sm"
          fontWeight="700"
          padding="2px 15px"
          position="absolute"
          zIndex="999">
          Select {capitalize(t('business unit'))}
        </Text>
        <InputGroup data-id="db7a4c012782">
          <Input
            cursor="pointer"
            data-id="2a57c1e59f4a"
            h="55px"
            mb="20px"
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder="Search Here"
            readOnly
            value={modalContext.selectedBusinessUnit}
            variant="auditModalSearchInput" />
          <InputRightElement data-id="cc3860ee12df">
            <OpenMenuArrow
              data-id="e56965736086"
              transform="translate(0px, 8px)"
              transformOrigin="center" />
          </InputRightElement>
        </InputGroup>
      </Box>
      <Collapse animateOpacity={false} data-id="4bcc4132029a" in={focused}>
        <Box
          bg="white"
          borderRadius="8px"
          boxShadow="0px 10px 30px 0px #0000002E"
          data-id="3e11da3f6a3d"
          maxH="120px"
          mt="-15px"
          overflow="auto"
          p="10px 10px"
          position="absolute"
          w="275px"
          zIndex="9999">
          <Box data-id="6fa35af248a0">
            <Box
              _hover={{
                cursor: 'pointer',
                borderRadius: '8px',
                boxShadow: '0px 10px 30px 0px #0000002E',
              }}
              alignItems="center"
              data-id="13cb816c4aa5"
              display="flex"
              justifyContent="start"
              onClick={() => modalContext.setSelectedBusinessUnit('Surgery')}
              p="10px 10px">
              <Text color="grey" data-id="01e5c675e8cd" fontSize="md" fontWeight="400">
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
              data-id="ee75c6334458"
              display="flex"
              justifyContent="start"
              onClick={() => modalContext.setSelectedBusinessUnit('Clinical')}
              p="10px 10px">
              <Text color="grey" data-id="c2c98b7433b1" fontSize="md" fontWeight="400">
                Clinical
              </Text>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Box>)
  );
};

export default AreaToInspect;
