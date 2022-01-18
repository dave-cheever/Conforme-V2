import { Flex } from "@chakra-ui/layout";
import { useResponseContext } from "../../contexts/ResponseProvider";
import DocumentUploaded from "./DocumentUploaded";

const EvidenceHistoryList = () => {
  const { response } = useResponseContext();
  return (
    <Flex maxW="342px" direction="column">
      {response?.evidence?.filter(({ outdated }) => outdated).length > 0 && (
        <Flex fontSize="11px" fontWeight="bold" my={3}>
          Evidence history
        </Flex>
      )}

      {response.evidence?.filter(({ outdated }) => outdated).filter(({ uploaded }) => uploaded?.id).map((evidence, i) => (
        <Flex key={i} flexDir="column" mb={3}>
          <DocumentUploaded document={evidence.uploaded} isEvidence={true} outDated />
        </Flex>
      ))}
    </Flex>
  )
}

export default EvidenceHistoryList