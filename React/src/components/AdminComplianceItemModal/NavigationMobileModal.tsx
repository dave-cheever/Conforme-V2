import React, { useState } from 'react';

import { Flex, Text } from '@chakra-ui/react';

import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import { ArrowRight, ErrorSign } from '../../icons';

const NavigationMobileModal = () => {
  const { complianceItemModalSections, selectedSectionIndex, selectSection, errors, trigger } = useComplianceItemModalContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Flex alignItems="center" justifyContent="space-between" mb="30px" mt="8px" onClick={() => setIsOpen(!isOpen)} pos="relative">
      <Flex alignItems="center">
        <Flex
          alignItems="center"
          bg="navigationMobileModal.section.bg"
          color="navigationMobileModal.section.color"
          flexShrink={0}
          fontSize="14px"
          fontWeight="bold"
          h="28px"
          justifyContent="center"
          mr="15px"
          rounded="10px"
          w="37px"
        >
          {selectedSectionIndex + 1}
        </Flex>
        <Text color="navigationMobileModal.section.label" fontSize="14px" fontWeight="bold">
          {complianceItemModalSections[selectedSectionIndex].name}
        </Text>
      </Flex>
      <Flex alignItems="center">
        {Object.keys(errors).length > 0 && (
          <Flex
            alignItems="center"
            bg="navigationMobileModal.errorBg"
            flexShrink={0}
            h="28px"
            justifyContent="center"
            mr="20px"
            rounded="10px"
            w="34px"
          >
            <ErrorSign stroke="navigationMobileModal.icon.error" />
          </Flex>
        )}
        <ArrowRight stroke="navigationMobileModal.icon.arrow" transform="rotate(90deg)" />
      </Flex>
      {isOpen && (
        <Flex
          bg="navigationMobileModal.bg"
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
          flexDir="column"
          h="260px"
          pos="absolute"
          py="10px"
          rounded="10px"
          top="40px"
          w="full"
          zIndex="5"
        >
          {complianceItemModalSections.map((section, i) => (
            <Flex
              alignItems="center"
              bg={i === selectedSectionIndex ? 'navigationMobileModal.section.selectedBg' : 'navigationMobileModal.section.unselectedBg'}
              key={i}
              onClick={() => {
                trigger(Object.keys(complianceItemModalSections[selectedSectionIndex].fields || []) as any);
                selectSection(i);
              }}
              p="10px"
            >
              <Flex
                alignItems="center"
                bg="navigationMobileModal.section.bg"
                color="navigationMobileModal.section.color"
                flexShrink={0}
                fontSize="11px"
                fontWeight="bold"
                h="28px"
                justifyContent="center"
                mr="15px"
                rounded="10px"
                w="37px"
              >
                {i + 1}
              </Flex>
              <Text color="navigationMobileModal.section.label" fontSize="ssm" fontWeight="bold">
                {section.name}
              </Text>
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default NavigationMobileModal;

export const navigationMobileModalStyles = {
  navigationMobileModal: {
    bg: '#FFFFFF',
    section: {
      bg: '#462AC4',
      color: '#FFFFFF',
      label: '#818197',
      selectedBg: '#F0F2F5',
      unselectedBg: '#FFFFFF',
    },
    errorBg: '#E93C44',
    icon: {
      error: '#FFFFFF',
      arrow: '#818197',
    },
  },
};
