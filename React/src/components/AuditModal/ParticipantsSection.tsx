import { Box, Image, SimpleGrid, Text } from '@chakra-ui/react';

import AreaToInspect from './AreaToInspect';
import AuditorSearchBar from './AuditorSearchBar';
import SelectedAuditors from './SelectedAuditors';

function ParticipantsSection() {
  return (
    <>
      <Text
        data-id="000412"
        color="auditModal.participants.text"
        fontSize="md"
        fontWeight="400"
        mb="10px">
        Audited By
      </Text>
      <AuditorSearchBar data-id="000413" />
      <SelectedAuditors data-id="000414" />
      <SimpleGrid data-id="000415" columns={2} mb="20px" spacing={2}>
        <Box data-id="000416">
          <Text
            data-id="000417"
            color="auditModal.participants.inspect.text"
            fontSize="md"
            fontWeight="400"
            mb="10px">
            You are about to inspect
          </Text>
          <Box
            data-id="000418"
            alignItems="center"
            display="flex"
            justifyContent="start"
            w="250px">
            <Image
              data-id="000419"
              alt="img"
              borderRadius="7px"
              fallbackSrc="https://via.placeholder.com/150"
              h="56px"
              mr="20px"
              objectFit="cover"
              w="56px" />
            <Box data-id="000420">
              <Text
                data-id="000421"
                color="auditModal.participants.inspect.businessUnit.text.name"
                fontSize="md"
                fontWeight="500">
                The Meriden Hospital
              </Text>
              <Text
                data-id="000422"
                color="auditModal.participants.inspect.businessUnit.text.location"
                fontSize="sm"
                fontWeight="400">
                Central and South West
              </Text>
            </Box>
          </Box>
        </Box>
        <Box data-id="000423">
          <Text
            data-id="000424"
            color="auditModal.participants.inspect.text"
            fontSize="md"
            fontWeight="400"
            mb="10px">
            Area to inspect
          </Text>
          <AreaToInspect data-id="000425" />
        </Box>
        <Box data-id="000426">
          <Text
            data-id="000427"
            color="auditModal.participants.auditType.text"
            fontSize="md"
            fontWeight="400"
            mb="10px">
            Audit Type
          </Text>
          <Text
            data-id="000428"
            color="auditModal.participants.auditType.text"
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
