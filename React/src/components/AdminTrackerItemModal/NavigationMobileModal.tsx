import React, { useState } from 'react';

import { Flex, Text } from '@chakra-ui/react';

import { useTrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import { ArrowRight, ErrorSign } from '../../icons';

const NavigationMobileModal = () => {
  const { trackerItemModalSections, selectedSectionIndex, selectSection, errors, trigger } = useTrackerItemModalContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    (<Flex
      alignItems="center"
      data-id="42a7fed2ee50"
      justifyContent="space-between"
      mb="30px"
      mt="8px"
      onClick={() => setIsOpen(!isOpen)}
      pos="relative">
      <Flex alignItems="center" data-id="267732b23ff7">
        <Flex
          alignItems="center"
          bg="navigationMobileModal.section.bg"
          color="navigationMobileModal.section.color"
          data-id="735015395a16"
          flexShrink={0}
          fontSize="14px"
          fontWeight="bold"
          h="28px"
          justifyContent="center"
          mr="15px"
          rounded="10px"
          w="37px">
          {selectedSectionIndex + 1}
        </Flex>
        <Text
          color="navigationMobileModal.section.label"
          data-id="7d3da0feaf02"
          fontSize="14px"
          fontWeight="bold">
          {trackerItemModalSections[selectedSectionIndex].name}
        </Text>
      </Flex>
      <Flex alignItems="center" data-id="633dfa7c5050">
        {Object.keys(errors).length > 0 && (
          <Flex
            alignItems="center"
            bg="navigationMobileModal.errorBg"
            data-id="1772c531ccad"
            flexShrink={0}
            h="28px"
            justifyContent="center"
            mr="20px"
            rounded="10px"
            w="34px">
            <ErrorSign data-id="dc2dc6ab5d98" stroke="navigationMobileModal.icon.error" />
          </Flex>
        )}
        <ArrowRight
          data-id="9e71d183947d"
          stroke="navigationMobileModal.icon.arrow"
          transform="rotate(90deg)" />
      </Flex>
      {isOpen && (
        <Flex
          bg="navigationMobileModal.bg"
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
          data-id="e029b07126a7"
          flexDir="column"
          h="260px"
          pos="absolute"
          py="10px"
          rounded="10px"
          top="40px"
          w="full"
          zIndex="5">
          {trackerItemModalSections.map((section, i) => (
            <Flex
              alignItems="center"
              bg={i === selectedSectionIndex ? 'navigationMobileModal.section.selectedBg' : 'navigationMobileModal.section.unselectedBg'}
              data-id="0263e4d69a6c"
              key={i}
              onClick={() => {
                trigger(Object.keys(trackerItemModalSections[selectedSectionIndex].fields || []) as any);
                selectSection(i);
              }}
              p="10px">
              <Flex
                alignItems="center"
                bg="navigationMobileModal.section.bg"
                color="navigationMobileModal.section.color"
                data-id="cb5168b0d1ec"
                flexShrink={0}
                fontSize="11px"
                fontWeight="bold"
                h="28px"
                justifyContent="center"
                mr="15px"
                rounded="10px"
                w="37px">
                {i + 1}
              </Flex>
              <Text
                color="navigationMobileModal.section.label"
                data-id="6b7950f790b1"
                fontSize="ssm"
                fontWeight="bold">
                {section.name}
              </Text>
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>)
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
