import { SimpleGrid, Image, Box, Text } from "@chakra-ui/react";
import AreaToInspect from "./AreaToInspect";
import AuditorSearchBar from "./AuditorSearchBar";
import SelectedAuditors from "./SelectedAuditors";

const ParticipantsSection = () => {

  return (
    <>
      <Text fontWeight="400" fontSize="md"
        color="auditModal.participants.text" mb="10px"
      >Audited By</Text>
      <AuditorSearchBar />
      <SelectedAuditors />

      <SimpleGrid columns={2} spacing={2} mb="20px">
        <Box>
          <Text fontWeight="400"
            fontSize="md"
            color="auditModal.participants.inspect.text"
            mb="10px" >You are about to inspect</Text>
          <Box display="flex" justifyContent="start" alignItems="center" w="250px">
            <Image
              h="56px"
              w="56px"
              fallbackSrc="https://via.placeholder.com/150"
              objectFit="cover"
              borderRadius="7px" mr="20px"
              alt="img"
            />
            <Box>
              <Text fontWeight="500" fontSize="md"
                color="auditModal.participants.inspect.area.text.name" >
                The Meriden Hospital</Text>
              <Text fontWeight="400" fontSize="sm"
                color="auditModal.participants.inspect.area.text.location">
                Central and South West</Text>
            </Box>
          </Box>
        </Box>
        <Box>
          <Text fontWeight="400" fontSize="md"
            color="auditModal.participants.inspect.text" mb="10px" >Area to inspect</Text>
          <AreaToInspect />
        </Box>
        <Box>
          <Text fontWeight="400" fontSize="md"
            color="auditModal.participants.auditType.text" mb="10px" >Audit Type</Text>
          <Text fontWeight="700" fontSize="md"
            color="auditModal.participants.auditType.text" >Clinical</Text>
        </Box>
      </SimpleGrid>
    </>
  )
}

export default ParticipantsSection;
