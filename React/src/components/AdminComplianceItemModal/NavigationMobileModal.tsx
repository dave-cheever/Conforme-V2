import React, { useState } from 'react';
import { Flex, Text } from '@chakra-ui/react';

import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import { ArrowRight, ErrorSign } from '../../icons';

const NavigationMobileModal = () => {
  const {
    complianceItemModalSections, selectedSectionIndex, selectSection, errors, trigger
  } = useComplianceItemModalContext();
  const [ isOpen, setIsOpen ] = useState(false);
  
  return (
    <Flex mb="30px" mt="8px" pos="relative" justifyContent="space-between" alignItems="center" onClick={() => setIsOpen(!isOpen) }>
      <Flex alignItems="center">
        <Flex 
          w="37px" 
          h="28px" 
          bg="navigationMobileModal.section.bg"
          color="navigationMobileModal.section.color"
          mr="15px" 
          fontSize="11px"
          fontWeight="bold"
          flexShrink={0} 
          rounded="10px" 
          alignItems="center" 
          justifyContent="center"
        >
          {selectedSectionIndex + 1}
        </Flex>
        <Text fontSize="ssm" fontWeight="bold" color="navigationMobileModal.section.label">
          {complianceItemModalSections[selectedSectionIndex].name}
        </Text>
      </Flex>
      <Flex alignItems="center">
        {Object.keys(errors).length > 0 && 
          <Flex 
            w="34px" 
            h="28px" 
            bg="navigationMobileModal.errorBg"
            mr="20px" 
            flexShrink={0} 
            rounded="10px" 
            alignItems="center" 
            justifyContent="center"
          >
            <ErrorSign stroke="navigationMobileModal.icon.error" />
          </Flex>
        }
        <ArrowRight stroke="navigationMobileModal.icon.arrow" transform="rotate(90deg)" />
      </Flex>
      {isOpen && 
        <Flex 
          w="full" 
          h="260px" 
          py="10px" 
          top="40px" 
          flexDir="column" 
          pos="absolute" 
          bg="navigationMobileModal.bg" 
          rounded="10px" 
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)" 
          zIndex="5"
        >
          {complianceItemModalSections.map((section, i) => 
            <Flex 
              key={i} 
              p="10px" 
              alignItems="center" 
              bg={i === selectedSectionIndex ? "navigationMobileModal.section.selectedBg" : "navigationMobileModal.section.unselectedBg"} 
              onClick={() => {
                trigger(Object.keys(complianceItemModalSections[selectedSectionIndex].fields || []) as any);
                selectSection(i);
              }}
            >
              <Flex 
                w="37px" 
                h="28px" 
                bg="navigationMobileModal.section.bg"
                color="navigationMobileModal.section.color"
                mr="15px" 
                fontSize="11px"
                fontWeight="bold"
                flexShrink={0} 
                rounded="10px" 
                alignItems="center" 
                justifyContent="center"
              >
                {i + 1}
              </Flex>
              <Text fontSize="ssm" fontWeight="bold" color="navigationMobileModal.section.label">{section.name}</Text>
            </Flex>
          )}
        </Flex>
      }
    </Flex>
  );
};

export default NavigationMobileModal;

export const navigationMobileModalStyles = {
  navigationMobileModal: {
    bg: "#FFFFFF",
    section: {
      bg: "#462AC4",
      color: "#FFFFFF",
      label: "#818197",
      selectedBg: "#F0F2F5",
      unselectedBg: "#FFFFFF"
    },
    errorBg: "#E93C44",
    icon: {
      error: "#FFFFFF",
      arrow: "#818197"
    }
  }
};
