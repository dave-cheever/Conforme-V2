import { Box, Image, SimpleGrid, Text } from '@chakra-ui/react';

import AreaToInspect from './AreaToInspect';
import AuditorSearchBar from './AuditorSearchBar';
import SelectedAuditors from './SelectedAuditors';

function ParticipantsSection() {
  return (
    <>
      <Text
        data-id="030925-200e22"
        color="auditModal.participants.text"
        fontSize="md"
        fontWeight="400"
        mb="10px">
        Audited By
      </Text>
      <AuditorSearchBar data-id="030925-eea742" />
      <SelectedAuditors data-id="030925-bcff83" />

      <SimpleGrid data-id="030925-e26967" columns={2} mb="20px" spacing={2}>
        <Box data-id="030925-e28918">
          <Text
            data-id="030925-f4b6f7"
            color="auditModal.participants.inspect.text"
            fontSize="md"
            fontWeight="400"
            mb="10px">
            You are about to inspect
          </Text>
          <Box
            data-id="030925-cc10c6"
            alignItems="center"
            display="flex"
            justifyContent="start"
            w="250px">
            <Image
              data-id="030925-a9c6cf"
              alt="img"
              borderRadius="7px"
              fallbackSrc="https://via.placeholder.com/150"
              h="56px"
              mr="20px"
              objectFit="cover"
              w="56px" />
            <Box data-id="030925-47b800">
              <Text
                data-id="030925-8b5ba5"
                color="auditModal.participants.inspect.businessUnit.text.name"
                fontSize="md"
                fontWeight="500">
                The Meriden Hospital
              </Text>
              <Text
                data-id="030925-0acd7b"
                color="auditModal.participants.inspect.businessUnit.text.location"
                fontSize="sm"
                fontWeight="400">
                Central and South West
              </Text>
            </Box>
          </Box>
        </Box>
        <Box data-id="030925-d55827">
          <Text
            data-id="030925-4d5740"
            color="auditModal.participants.inspect.text"
            fontSize="md"
            fontWeight="400"
            mb="10px">
            Area to inspect
          </Text>
          <AreaToInspect data-id="030925-97b78b" />
        </Box>
        <Box data-id="030925-76fffa">
          <Text
            data-id="030925-4a7a27"
            color="auditModal.participants.auditType.text"
            fontSize="md"
            fontWeight="400"
            mb="10px">
            Audit Type
          </Text>
          <Text
            data-id="030925-87b53e"
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
