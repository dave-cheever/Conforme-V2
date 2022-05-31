import React, { useEffect, useMemo, useState } from 'react';
import Confetti from 'react-confetti';

import { Button, Flex } from '@chakra-ui/react';

import { responseTabItems } from '../../bootstrap/config';
import Attachments from '../../components/Response/Attachments';
import Details from '../../components/Response/Details';
import RenewalModal from '../../components/Response/RenewalModal';
import ResponseQuestions from '../../components/Response/ResponseQuestions';
import ResponseTabItem from '../../components/Response/ResponseTabItem';
import { useResponseContext } from '../../contexts/ResponseProvider';
import useDevice from '../../hooks/useDevice';
import useResponseUtils from '../../hooks/useResponseUtils';

const ComplianceItemResponse = () => {
  const { activeTab, setActiveTab:updateActiveTab, response, snapshot, isQuestionFormDirty, setIsQuestionFormDirty } = useResponseContext();
  const { getStatus } = useResponseUtils();
  const [run, setRun] = useState(false);
  const device = useDevice();

  useEffect(() => {
    if (getStatus(response) === 'compliant' && !snapshot) setRun(false); // TODO: needs to be updated, fix dimensions and trigger
  }, [response]);

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
  };

  const setActiveTab = (activeTab: number) => {
    if(isQuestionFormDirty){
      const confirm = window.confirm('You have unsaved changes, you will lose all of your changes. Are you sure you want to navigate away?'); // eslint-disable-line no-alert
      if(!confirm) return;
      setIsQuestionFormDirty(false);
    }
    updateActiveTab(activeTab);
  }

  const confettiHeight = useMemo(() => {
    if(device === "desktop") return window.innerHeight - 100;

    if(device === "tablet") return window.innerHeight - 100;

    return window.innerHeight - 200;

  }, [device, window]);

  const confettiWidth = useMemo(() => {
    if(device === "desktop") return window.innerWidth - 300;

    if(device === "tablet") return window.innerWidth - 200;

    return window.innerWidth - 80;

  }, [device, window]);

  return (
    <>
      <RenewalModal />
      <Confetti
        height={confettiHeight}
        recycle={false}
        run={run}
        width={confettiWidth}
      />
      <Flex direction="column" h="full" w="full">
        <Flex
          bg="complianceItemResponse.bg"
          borderRadius="20px"
          flexDir="column"
          h={['fit-content', 'full']}
          p={['15px 20px 20px 20px', '25px 30px 25px 30px']}
          w="full"
        >
          <Flex align="center" justify="space-between" mb={["0", "8"]}>
            <Flex justify={['center', 'flex-start']} w="full">
              {responseTabItems.map(({ index, label, icon }) => (
                <ResponseTabItem
                  active={activeTab === index}
                  icon={icon}
                  index={index}
                  key={label}
                  label={label}
                  setActiveTab={setActiveTab}
                />
              ))}
            </Flex>
            {activeTab > 0 && (
              <Button
                borderRadius="10px"
                color="complianceItemResponse.nextButtonColor"
                display={['none', 'block']}
                flexShrink={0}
                fontSize="11px"
                fontWeight="bold"
                h="28px"
                mr={activeTab === 2 ? '132px' : '12px'}
                onClick={() => setActiveTab(activeTab - 1)}
                w="120px"
              >
                Previous step
              </Button>
            )}
            {activeTab < 2 && (
              <Button
                borderRadius="10px"
                color="complianceItemResponse.nextButtonColor"
                display={['none', 'block']}
                flexShrink={0}
                fontSize="11px"
                fontWeight="bold"
                h="28px"
                onClick={() => setActiveTab(activeTab + 1)}
                w="120px"
              >
                Next step
              </Button>
            )}
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
    bg: 'white',
    nextButtonColor: '#818197',
    labelColor: '#818197',
    expandButtonText: '#462AC4',
    labelTextColor: '#1F1F1F',
    textColor: '#282F36',
  },
};
