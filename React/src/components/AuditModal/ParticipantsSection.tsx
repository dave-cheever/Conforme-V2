import { Box, Image, SimpleGrid, Text } from '@chakra-ui/react';

import AreaToInspect from './AreaToInspect';
import AuditorSearchBar from './AuditorSearchBar';
import SelectedAuditors from './SelectedAuditors';

function ParticipantsSection() {
  return (
    <>
      <Text
        color="auditModal.participants.text"
        data-id="000412"
        fontSize="md"
        fontWeight="400"
        mb="10px">
        Audited By
      </Text>
      <AuditorSearchBar data-id="000413" />
      <SelectedAuditors data-id="000414" />
      <SimpleGrid columns={2} data-id="000415" mb="20px" spacing={2}>
        <Box data-id="000416">
          <Text
            color="auditModal.participants.inspect.text"
            data-id="000417"
            fontSize="md"
            fontWeight="400"
            mb="10px">
            You are about to inspect
          </Text>
          <Box
            alignItems="center"
            data-id="000418"
            display="flex"
            justifyContent="start"
            w="250px">
            <Image
              alt="img"
              borderRadius="7px"
              data-id="000419"
              fallbackSrc="https://via.placeholder.com/150"
              h="56px"
              mr="20px"
              objectFit="cover"
              w="56px" />
            <Box data-id="000420">
              <Text
                color="auditModal.participants.inspect.businessUnit.text.name"
                data-id="000421"
                fontSize="md"
                fontWeight="500">
                The Meriden Hospital
              </Text>
              <Text
                color="auditModal.participants.inspect.businessUnit.text.location"
                data-id="000422"
                fontSize="sm"
                fontWeight="400">
                Central and South West
              </Text>
            </Box>
          </Box>
        </Box>
        <Box data-id="000423">
          <Text
            color="auditModal.participants.inspect.text"
            data-id="000424"
            fontSize="md"
            fontWeight="400"
            mb="10px">
            Area to inspect
          </Text>
          <AreaToInspect data-id="000425" />
        </Box>
        <Box data-id="000426">
          <Text
            color="auditModal.participants.auditType.text"
            data-id="000427"
            fontSize="md"
            fontWeight="400"
            mb="10px">
            Audit Type
          </Text>
          <Text
            color="auditModal.participants.auditType.text"
            data-id="000428"
            fontSize="md"
            fontWeight="700">
            Clinical
          </Text>
        </Box>
      </SimpleGrid>
    </>
  );
}

export default ParticipantsSection;
