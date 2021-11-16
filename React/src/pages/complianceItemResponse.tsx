import React, { useMemo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useParams } from 'react-router';
import { gql, useQuery } from '@apollo/client';
import Loader from '../components/Loader';
import ReasponseHeader from '../components/Response/ResponseHeader';
import DescriptionText from '../components/Response/DescriptionText';
import ResponseLeftNavigation from '../components/Response/ResponseLeftNavigation';
import Delegates from '../components/Response/Delegates';

const GET_RESPONSES = gql`
    query Responses($responsesQueryInput: ResponsesQueryInput) {
      responses(responsesQueryInput: $responsesQueryInput) {
        _id
        nextRenewalDate
        status
        delegateIds
        complianceItem {
          name
          reference
          description
          evidenceItems
          frequency
          category {
            name
          }
          regulatoryBody {
            name
          }
          functionalArea {
            name
          }
        }
        businessUnit {
          name
          imgUrl
          ed {
            _id
          }
        }
      }
    }
  `


const ComplianceItemResponse = () => {
  const { id }: {id: string} = useParams();
  const {data, loading} = useQuery(GET_RESPONSES, {variables: {responsesQueryInput: {_id: id}}});

  const response = useMemo(() => data?.responses[0], [data]);
  
  return (
    <>
      {/* <ShareModal /> */}
      {/* <ConfirmationModal /> */}
      {/* <RenewalModal renewResponse={renewResponse} /> */}
      {loading && !response && <Loader center={true} />}
      <Flex direction={['column', 'row']} position={['relative', 'absolute']} left='0px' w='full' h='calc(100% - 80px)' bg='#FFFFFF'>
        <ResponseLeftNavigation response={response} />
        {response &&
          (
            <Flex w="full" direction='column' pb={['100px', '0px']} >
              <ReasponseHeader response={response[0]}/>
              <Flex direction='column' h='full' overflow={['visible', 'auto']} mt='0' w={['full', 'calc(100% - 400px)']} fontSize='14px'>
                <Flex
                  direction={['column', 'row']}
                  p='1.75rem 1.5rem'
                  bg='#FFFFFF'
                  w='full'
                  h='full'
                  justify='space-between'
                  color='brand.darkGrey'
                  flexWrap='wrap'
                  overflow='auto'
                  alignContent='flex-start'
                >
                  {/* <RenewalInfo updateResponse={updateResponse} /> */}
                  <Flex w={['100%', '50%']} direction='column' pr={2}>
                    {/* {response?.actionExpected && <ActionExpected updateResponse={updateResponse} />} */}
                    {response?.evidence?.filter(({ outdated }) => !outdated).length > 0 ?
                      <Box mt={12}>
                        <Flex align='center'>
                          <Box fontWeight='700'>Evidence expected <Text as='span' color='red.500' fontSize="11px">(required)</Text></Box>
                        </Flex>
                        <Flex maxWidth='350px' fontStyle='italic' color='#434B4F' my={2}>
                          Upload all expected evidence and complete any required questions to record this compliance item as complete.
                        </Flex>
                        {/* {response && response.evidence.map((evidence, i) =>
                          !evidence.outdated && <EvidenceExpected
                            evidence={evidence}
                            key={i}
                            i={i}
                            updateResponse={updateResponse}
                            evidenceUploading={evidenceUploading}
                            uploadFile={uploadFile}
                            rejectedFile={rejectedFile}
                          />)
                        } */}
                      </Box>
                      : <Box mt={12}>No documentary evidence expected</Box>
                    }
                    {/* {previousEvidence.length > 0 && <Box mt={2} position='relative'>
                      <Flex align='center' w="fit-content" cursor='pointer' onClick={() => setShowPreviousEvidence(!showPreviousEvidence)}>
                        <Box fontWeight='700' color="brand.cornFlowerBlue" mb={3}>
                          View previous evidence <ChevronDownIcon boxSize={5} ml="1" color="brand.cornFlowerBlue" />
                        </Box>
                      </Flex>
                      <Box bg="white" position="absolute" zIndex="10" top="30px" boxShadow="0px 10px 30px rgba(0, 0, 0, 0.18)" w="250px" borderRadius="lg">
                        {showPreviousEvidence && previousEvidence.map((evidence, i) =>
                          <PreviousEvidence evidence={evidence} key={i} response={response} />)
                        }
                      </Box>
                    </Box>}
                    <Attachments
                      updateResponse={updateResponse}
                      attachmentUploading={attachmentUploading}
                      uploadFile={uploadFile}
                      rejectedFile={rejectedFile}
                    /> */}
                  </Flex>
                  <Flex w={['100%', '50%']} direction='column' pl={2}>
                    <Box display={['none', 'block']} mt={12}>
                      <Flex fontWeight='700'>Description</Flex>
                      <DescriptionText response={response}/>
                    </Box>
                    <Box fontWeight='700' mt={12}>
                      {response && <Delegates response={response} />}
                    </Box>
                  </Flex>
                  {/* <ResponseQuestions updateResponse={updateResponse} /> */}
                  <Box w='full'>
                    <Text fontSize='12px' fontWeight='700' color='brand.paleGrey' mt='40px' mb='25px'>Audit log</Text>
                    {/* <AuditLogButton viewMode={viewMode} setViewMode={setViewMode} />
                    <AuditLogComponent auditLogData={auditLogData} setOffset={setOffset} count={count} offset={offset} loadMore={loadMore} padding={'0'} /> */}
                  </Box>
                </Flex>
                {response && <Flex position={['relative', 'absolute']} right='0px'>
                  {/* <Comments reloadAuditLog={reloadAuditLog} /> */}
                </Flex>}
              </Flex>
            </Flex>
          )
        }
      </Flex>
    </>
  );
};

export default ComplianceItemResponse;
