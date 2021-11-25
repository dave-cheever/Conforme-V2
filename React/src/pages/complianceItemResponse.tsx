import React, { useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';

import Loader from '../components/Loader';
import ReasponseHeader from '../components/Response/ResponseHeader';
import ResponseLeftNavigation from '../components/Response/ResponseLeftNavigation';
import ResponseProvider, { useResponseContext } from '../contexts/ResponseProvider';
import Details from '../components/Response/Details';
import Attachments from '../components/Response/Attachments';
import ResponseTabItem from '../components/Response/ResponseTabItem';
import { responseTabItems } from '../bootstrap/config';
import ResponseQuestions from '../components/Response/ResponseQuestions';

const ComplianceItemResponse = () => {
  const {
    loading,
    response,
  } = useResponseContext();

  const [activeTab,setActiveTab] = useState(0);

  const renderSection = () => {
    switch (activeTab) {
      case 0:
        return <Details/>;
      
      case 1:
        return <Attachments/>;
      
      case 2:
        return <ResponseQuestions />;
    
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
              <Flex flexDir="column" h="calc(100vh - 190px)" p="25px 30px 25px 30px" w="calc(100% - 300px)" borderRadius="20px" bg="complianceItemResponse.bg">
                <Flex align='center' justify="space-between" mb="8">
                  <Flex>
                    {responseTabItems.map(({index,label,icon}) => <ResponseTabItem setActiveTab={setActiveTab} index={index} active={activeTab === index} key={label} label={label} icon={icon}/>)}
                    </Flex>
                  {activeTab <2 && <Button borderRadius="10px" w="80px" h="28px" fontSize="11px" fontWeight="bold" color="complianceItemResponse.nextButtonColor" onClick={() => setActiveTab(activeTab+1)}>Next step</Button>}
                </Flex>
                {renderSection()}
              </Flex>
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
    expandButtonText: "#462AC4",
    labelTextColor: "#1F1F1F"
  }
}
