import React, { useMemo } from 'react';
import { Box, Flex } from '@chakra-ui/react';

import { useResponseContext } from '../../contexts/ResponseProvider';
import Attachment from './Attachment';
import Evidence from './Evidence';
import DocumentUploaded from './DocumentUploaded';

const Attachments = () => {
    const { response } = useResponseContext();

    const uploadedEvidences = useMemo(() => {
        return response?.evidence.filter(({outdated, uploaded}) => outdated && uploaded) || [];
    },[response]);

    return (
    <Flex w="full" h="full" overflow="auto">
        <Flex flexDirection="column" mr={2} h="full" w="full">
            <Box>
                {response?.evidence.filter(({ outdated }) => !outdated).map((evidence, i) =>
                    <Evidence key={i} evidence={evidence} />
                )}
            </Box>
            <Box>
            {uploadedEvidences?.length > 0 && 
            <Box maxW="342px">
            <Flex  color="complianceItemResponse.labelTextColor" fontWeight="700" fontSize="12px" my={2}>
                Uploaded evidence
            </Flex>
             {uploadedEvidences.map((evidence, i) => <DocumentUploaded key={i} document={evidence?.uploaded} isEvidence={true} enableDownload={true} /> )} 
            </Box>}
            </Box>
        </Flex>
        <Flex ml={2} h="full" w="full">
            <Attachment/>
        </Flex>
    </Flex>
    )
}

export default Attachments;
