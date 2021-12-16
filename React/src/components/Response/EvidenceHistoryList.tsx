import { Flex } from "@chakra-ui/layout";
import { useResponseContext } from "../../contexts/ResponseProvider";
import DocumentUploaded from "./DocumentUploaded";

const EvidenceHistoryList = () => {
  const { response } = useResponseContext();
  return (
    <Flex maxW="342px" direction="column">
      {response?.evidence?.filter(({ outdated }) => outdated).length > 0 &&
        <Flex fontSize="sm" fontWeight="bold" my={3}>
          Evidence history
        </Flex>
      }

      {response.evidence?.filter(({ outdated }) => outdated).map((evidence, i) => (
        <>
          {evidence.uploaded?.id &&
            <Flex key={i} flexDir="column" mb={3}>
              <DocumentUploaded document={evidence.uploaded} isEvidence={true} enableDownload={true} />
            </Flex>}
        </>
      ))}
    </Flex>
  )
}

export default EvidenceHistoryList