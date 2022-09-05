import { Box, Image, SimpleGrid, Text } from '@chakra-ui/react';

import AreaToInspect from './AreaToInspect';
import AuditorSearchBar from './AuditorSearchBar';
import SelectedAuditors from './SelectedAuditors';

const ParticipantsSection = () => (
  <>
    <Text color="auditModal.participants.text" fontSize="md" fontWeight="400" mb="10px">
      Audited By
    </Text>
    <AuditorSearchBar />
    <SelectedAuditors />

    <SimpleGrid columns={2} mb="20px" spacing={2}>
      <Box>
        <Text color="auditModal.participants.inspect.text" fontSize="md" fontWeight="400" mb="10px">
          You are about to inspect
        </Text>
        <Box alignItems="center" display="flex" justifyContent="start" w="250px">
          <Image alt="img" borderRadius="7px" fallbackSrc="https://via.placeholder.com/150" h="56px" mr="20px" objectFit="cover" w="56px" />
          <Box>
            <Text color="auditModal.participants.inspect.businessUnit.text.name" fontSize="md" fontWeight="500">
              The Meriden Hospital
            </Text>
            <Text color="auditModal.participants.inspect.businessUnit.text.location" fontSize="sm" fontWeight="400">
              Central and South West
            </Text>
          </Box>
        </Box>
      </Box>
      <Box>
        <Text color="auditModal.participants.inspect.text" fontSize="md" fontWeight="400" mb="10px">
          Area to inspect
        </Text>
        <AreaToInspect />
      </Box>
      <Box>
        <Text color="auditModal.participants.auditType.text" fontSize="md" fontWeight="400" mb="10px">
          Audit Type
        </Text>
        <Text color="auditModal.participants.auditType.text" fontSize="md" fontWeight="700">
          Clinical
        </Text>
      </Box>
    </SimpleGrid>
  </>
);

export default ParticipantsSection;
