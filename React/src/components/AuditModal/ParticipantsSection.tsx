import { Box, Image, SimpleGrid, Text } from '@chakra-ui/react';

import AreaToInspect from './AreaToInspect';
import AuditorSearchBar from './AuditorSearchBar';
import SelectedAuditors from './SelectedAuditors';

function ParticipantsSection() {
  return <>
    <Text
      color="auditModal.participants.text"
      data-id="aba1fcd888bb"
      fontSize="md"
      fontWeight="400"
      mb="10px">
      Audited By
    </Text>
    <AuditorSearchBar data-id="53ec0455340e" />
    <SelectedAuditors data-id="2ea8ac50563b" />

    <SimpleGrid columns={2} data-id="a5c3c875393a" mb="20px" spacing={2}>
      <Box data-id="98c48ecafbb2">
        <Text
          color="auditModal.participants.inspect.text"
          data-id="1d2a01139fc2"
          fontSize="md"
          fontWeight="400"
          mb="10px">
          You are about to inspect
        </Text>
        <Box
          alignItems="center"
          data-id="2558e553bbd8"
          display="flex"
          justifyContent="start"
          w="250px">
          <Image
            alt="img"
            borderRadius="7px"
            data-id="00aa351c76fd"
            fallbackSrc="https://via.placeholder.com/150"
            h="56px"
            mr="20px"
            objectFit="cover"
            w="56px" />
          <Box data-id="704d666d7800">
            <Text
              color="auditModal.participants.inspect.businessUnit.text.name"
              data-id="60dbc6f1eaf2"
              fontSize="md"
              fontWeight="500">
              The Meriden Hospital
            </Text>
            <Text
              color="auditModal.participants.inspect.businessUnit.text.location"
              data-id="5757df28591a"
              fontSize="sm"
              fontWeight="400">
              Central and South West
            </Text>
          </Box>
        </Box>
      </Box>
      <Box data-id="53c77cff4678">
        <Text
          color="auditModal.participants.inspect.text"
          data-id="d73c03a200a5"
          fontSize="md"
          fontWeight="400"
          mb="10px">
          Area to inspect
        </Text>
        <AreaToInspect data-id="d86015759ee3" />
      </Box>
      <Box data-id="ebc5b84ab195">
        <Text
          color="auditModal.participants.auditType.text"
          data-id="05c8fd255b48"
          fontSize="md"
          fontWeight="400"
          mb="10px">
          Audit Type
        </Text>
        <Text
          color="auditModal.participants.auditType.text"
          data-id="af81bec06dbb"
          fontSize="md"
          fontWeight="700">
          Clinical
        </Text>
      </Box>
    </SimpleGrid>
  </>
}

export default ParticipantsSection;
