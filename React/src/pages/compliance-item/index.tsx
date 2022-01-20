import React from 'react';
import { Button, Flex } from '@chakra-ui/react';

import { responseTabItems } from '../../bootstrap/config';
import Details from '../../components/Response/Details';
import Attachments from '../../components/Response/Attachments';
import ResponseQuestions from '../../components/Response/ResponseQuestions';
import ResponseTabItem from '../../components/Response/ResponseTabItem';
import RenewalModal from '../../components/Response/RenewalModal';
import { useResponseContext } from '../../contexts/ResponseProvider';

const ComplianceItemResponse = () => {
  const { activeTab, setActiveTab } = useResponseContext();

  const renderSection = () => {
    switch (activeTab) {
      case 0:
        return <Details />;

      case 1:
        return <Attachments />;

      case 2:
        return <ResponseQuestions />;

      default:
        break;
    }
  }
  return (
    <>
      <RenewalModal />
      <Flex w="full" h="full" direction="column">
        <Flex flexDir="column" h={["fit-content", "full"]} p={["15px 20px 20px 20px", "25px 30px 25px 30px"]} w="full" borderRadius="20px" bg="complianceItemResponse.bg">
          <Flex align='center' justify="space-between" mb="8">
            <Flex justify={["center", "flex-start"]} w="full">
              {responseTabItems.map(({ index, label, icon }) => <ResponseTabItem setActiveTab={setActiveTab} index={index} active={activeTab === index} key={label} label={label} icon={icon} />)}
            </Flex>
            {activeTab > 0 && <Button mr={activeTab === 2 ? '132px' : '12px'} display={["none", "block"]} flexShrink={0} w='120px' borderRadius="10px" h="28px" fontSize="11px" fontWeight="bold" color="complianceItemResponse.nextButtonColor" onClick={() => setActiveTab(activeTab - 1)}>Previous step</Button>}
            {activeTab < 2 && <Button display={["none", "block"]} w='120px' flexShrink={0} borderRadius="10px" h="28px" fontSize="11px" fontWeight="bold" color="complianceItemResponse.nextButtonColor" onClick={() => setActiveTab(activeTab + 1)}>Next step</Button>}          
          </Flex>
          {renderSection()}
        </Flex>
      </Flex>
    </>
  );
};

export default ComplianceItemResponse;

export const complianceItemResponseStyles = {
  complianceItemResponse: {
    bg: "white",
    nextButtonColor: "#818197",
    labelColor: "#818197",
    expandButtonText: "#462AC4",
    labelTextColor: "#1F1F1F",
    textColor: "#282F36"
  }
}
