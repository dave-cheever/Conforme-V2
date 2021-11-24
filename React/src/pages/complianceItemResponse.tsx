import React, { useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';

import Loader from '../components/Loader';
import ReasponseHeader from '../components/Response/ResponseHeader';
import ResponseLeftNavigation from '../components/Response/ResponseLeftNavigation';
import ResponseProvider, { useResponseContext } from '../contexts/ResponseProvider';
import Details from '../components/Response/Details';
import ResponseTabItem from '../components/Response/ResponseTabItem';
import { responseTabItems } from '../bootstrap/config';

const ComplianceItemResponse = () => {
  const {
    loading,
    response,
  } = useResponseContext();

  const [activeTab,setActiveTab] = useState(0);

  const renderSection = () => {
    switch (activeTab) {
      case 0:
        return <Details  response={response}/>;
      
      case 1:
        return <p>Attachements</p>;
      
      case 2:
        return <p>Questions</p>;
    
      default:
        break;
    }
  }

  return (
    <>
      {/* <ShareModal /> */}
      {/* <ConfirmationModal /> */}
      {/* <RenewalModal renewResponse={renewResponse} /> */}
      {loading && !response && <Loader center={true} />}
      <Flex direction={['column', 'row']} position={['relative', 'absolute']} left='0px' w='full' h='calc(100% - 80px)'>
        <ResponseLeftNavigation response={response} />
        {response &&
          (
            <Flex w="full" direction='column' pb={['100px', '0px']} >
              <ReasponseHeader response={response} />
              <Flex flexDir="column" p="25px 30px 25px 30px" w="calc(100% - 300px)" h="full" borderRadius="20px" bg="complianceItemResponse.bg">
                <Flex align='center' justify="space-between" mb="8">
                  <Flex>
                    {responseTabItems.map(({index,label,icon}) => <ResponseTabItem setActiveTab={setActiveTab} index={index} active={activeTab === index} key={label} label={label} icon={icon}/>)}
                    </Flex>
                  {activeTab <2 && <Button borderRadius="10px" w="80px" h="28px" fontSize="11px" fontWeight="bold" color="complianceItemResponse.nextButtonColor" onClick={() => setActiveTab(activeTab+1)}>Next step</Button>}
                </Flex>
                {renderSection()}
              </Flex>
              {/* <Flex direction='column' h='full' overflow={['visible', 'auto']} mt='0' w={['full', 'calc(100% - 400px)']} fontSize='14px'>
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
                  <Flex w={['100%', '50%']} direction='column' pr={2}>
                    {response?.evidence.filter(({ outdated }) => !outdated).length > 0 ? (
                      <Box mt={12}>
                        <Flex align='center'>
                          <Box fontWeight='700'>Evidence expected <Text as='span' color='red.500' fontSize="11px">(required)</Text></Box>
                        </Flex>
                        <Flex maxWidth='350px' fontStyle='italic' color='#434B4F' my={2}>
                          Upload all expected evidence and complete any required questions to record this compliance item as complete.
                        </Flex>
                        {response?.evidence.filter(({ outdated }) => !outdated).map((evidence, i) =>
                          <Evidence key={i} evidence={evidence} />
                        )}
                      </Box>
                    ) : (
                      <Box mt={12}>No documentary evidence expected</Box>
                    )}
                    <Attachments />
                  </Flex>
                  <Flex w={['100%', '50%']} direction='column' pl={2}>
                    <Box display={['none', 'block']} mt={12}>
                      <Flex fontWeight='700'>Description</Flex>
                      <DescriptionText response={response} />
                    </Box>
                    <Box fontWeight='700' mt={12}>
                      <Delegates />
                    </Box>
                  </Flex>
                  <Box w='full'>
                    <Text fontSize='12px' fontWeight='700' color='brand.paleGrey' mt='40px' mb='25px'>Audit log</Text>
                  </Box>
                </Flex>
                {response && <Flex position={['relative', 'absolute']} right='0px'>
                </Flex>}
              </Flex> */}
            </Flex>
          )
        }
      </Flex>
    </>
  );
};

const ComplianceItemResponseWithContext = () => <ResponseProvider><ComplianceItemResponse /></ResponseProvider>;

export default ComplianceItemResponseWithContext;


export const complianceItemResponseStyles = {
  complianceItemResponse:{
    bg: "white",
    nextButtonColor:"#818197",
    labelColor:"#818197",
    expandButtonText: "#462AC4"
  }
}
