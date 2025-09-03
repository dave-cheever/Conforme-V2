import { useContext, useState } from 'react';

import { Box, Collapse, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import { OpenMenuArrow } from '../../icons';
import AuditModalContext from './AuditModalContext';

function AreaToInspect() {
  const modalContext = useContext(AuditModalContext);
  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  return (
    <Box data-id="030925-2f8194">
      <Box
        data-id="030925-8eb5f3"
        bg="auditModal.participants.customSearch.bg"
        border="2px solid"
        borderColor="auditModal.participants.customSearch.border"
        borderRadius="8px"
        h="55px"
        mb="20px"
        overflow="hidden"
        position="relative">
        <Text
          data-id="030925-635b76"
          fontSize="sm"
          fontWeight="700"
          padding="2px 15px"
          position="absolute"
          zIndex="999">
          Select {capitalize(t('business unit'))}
        </Text>
        <InputGroup data-id="030925-c02fe8">
          <Input
            data-id="030925-6c9251"
            cursor="pointer"
            h="55px"
            mb="20px"
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder="Search Here"
            readOnly
            value={modalContext.selectedBusinessUnit}
            variant="auditModalSearchInput" />
          <InputRightElement data-id="030925-855bcf">
            <OpenMenuArrow
              data-id="030925-17bd33"
              transform="translate(0px, 8px)"
              transformOrigin="center" />
          </InputRightElement>
        </InputGroup>
      </Box>
      <Collapse data-id="030925-f5e411" animateOpacity={false} in={focused}>
        <Box
          data-id="030925-5e7a5e"
          bg="white"
          borderRadius="8px"
          boxShadow="0px 10px 30px 0px #0000002E"
          maxH="120px"
          mt="-15px"
          overflow="auto"
          p="10px 10px"
          position="absolute"
          w="275px"
          zIndex="9999">
          <Box data-id="030925-71b4e6">
            <Box
              data-id="030925-245c12"
              _hover={{
                cursor: 'pointer',
                borderRadius: '8px',
                boxShadow: '0px 10px 30px 0px #0000002E',
              }}
              alignItems="center"
              display="flex"
              justifyContent="start"
              onClick={() => modalContext.setSelectedBusinessUnit('Surgery')}
              p="10px 10px">
              <Text data-id="030925-f4c408" color="grey" fontSize="md" fontWeight="400">
                Surgery
              </Text>
            </Box>
            <Box
              data-id="030925-d6fb12"
              _hover={{
                cursor: 'pointer',
                borderRadius: '8px',
                boxShadow: '0px 10px 30px 0px #0000002E',
              }}
              alignItems="center"
              display="flex"
              justifyContent="start"
              onClick={() => modalContext.setSelectedBusinessUnit('Clinical')}
              p="10px 10px">
              <Text data-id="030925-16cdf8" color="grey" fontSize="md" fontWeight="400">
                Clinical
              </Text>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}

export default AreaToInspect;
