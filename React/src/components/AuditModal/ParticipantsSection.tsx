import { Box, Image, SimpleGrid, Text } from '@chakra-ui/react';

import AreaToInspect from './AreaToInspect';
import AuditorSearchBar from './AuditorSearchBar';
import SelectedAuditors from './SelectedAuditors';

function ParticipantsSection() {
  return (
    <>
      <Text
        color="auditModal.participants.text"
        data-id="030925-200e22"
        fontSize="md"
        fontWeight="400"
        mb="10px">
        Audited By
      </Text>
      <AuditorSearchBar data-id="030925-eea742" />
      <SelectedAuditors data-id="030925-bcff83" />

      <SimpleGrid columns={2} data-id="030925-e26967" mb="20px" spacing={2}>
        <Box data-id="030925-e28918">
          <Text
            color="auditModal.participants.inspect.text"
            data-id="030925-f4b6f7"
            fontSize="md"
            fontWeight="400"
            mb="10px">
            You are about to inspect
          </Text>
          <Box
            alignItems="center"
            data-id="030925-cc10c6"
            display="flex"
            justifyContent="start"
            w="250px">
            <Image
              alt="img"
              borderRadius="7px"
              data-id="030925-a9c6cf"
              fallbackSrc="https://via.placeholder.com/150"
              h="56px"
              mr="20px"
              objectFit="cover"
              w="56px" />
            <Box data-id="030925-47b800">
              <Text
                color="auditModal.participants.inspect.businessUnit.text.name"
                data-id="030925-8b5ba5"
                fontSize="md"
                fontWeight="500">
                The Meriden Hospital
              </Text>
              <Text
                color="auditModal.participants.inspect.businessUnit.text.location"
                data-id="030925-0acd7b"
                fontSize="sm"
                fontWeight="400">
                Central and South West
              </Text>
            </Box>
          </Box>
        </Box>
        <Box data-id="030925-d55827">
          <Text
            color="auditModal.participants.inspect.text"
            data-id="030925-4d5740"
            fontSize="md"
            fontWeight="400"
            mb="10px">
            Area to inspect
          </Text>
          <AreaToInspect data-id="030925-97b78b" />
        </Box>
        <Box data-id="030925-76fffa">
          <Text
            color="auditModal.participants.auditType.text"
            data-id="030925-4a7a27"
            fontSize="md"
            fontWeight="400"
            mb="10px">
            Audit Type
          </Text>
          <Text
            color="auditModal.participants.auditType.text"
            data-id="030925-87b53e"
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
