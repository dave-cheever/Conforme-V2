import React, { useState } from 'react';

import { Flex, Text } from '@chakra-ui/react';

import { useTrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import { ArrowRight, ErrorSign } from '../../icons';

function NavigationMobileModal() {
  const { trackerItemModalSections, selectedSectionIndex, selectSection, errors, trigger } = useTrackerItemModalContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Flex
        data-id="030925-c5427f"
        alignItems="center"
        justifyContent="space-between"
        mb="30px"
        mt="8px"
        onClick={() => setIsOpen(!isOpen)}
        pos="relative">
      <Flex data-id="030925-bdbcb2" alignItems="center">
        <Flex
          data-id="030925-ec6293"
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
          w="37px">
          {selectedSectionIndex + 1}
        </Flex>
        <Text
          data-id="030925-2e3cc5"
          color="navigationMobileModal.section.label"
          fontSize="14px"
          fontWeight="bold">
          {trackerItemModalSections[selectedSectionIndex].name}
        </Text>
      </Flex>
      <Flex data-id="030925-8058a3" alignItems="center">
        {Object.keys(errors).length > 0 && (
          <Flex
            data-id="030925-2b2fc6"
            alignItems="center"
            bg="navigationMobileModal.errorBg"
            flexShrink={0}
            h="28px"
            justifyContent="center"
            mr="20px"
            rounded="10px"
            w="34px">
            <ErrorSign data-id="030925-e3f817" stroke="navigationMobileModal.icon.error" />
          </Flex>
        )}
        <ArrowRight
          data-id="030925-75421c"
          stroke="navigationMobileModal.icon.arrow"
          transform="rotate(90deg)" />
      </Flex>
      {isOpen && (
        <Flex
          data-id="030925-b18bd1"
          bg="navigationMobileModal.bg"
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
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
              data-id="030925-ab82a5"
              alignItems="center"
              bg={i === selectedSectionIndex ? 'navigationMobileModal.section.selectedBg' : 'navigationMobileModal.section.unselectedBg'}
              key={i}
              onClick={() => {
                trigger(Object.keys(trackerItemModalSections[selectedSectionIndex].fields || []) as any);
                selectSection(i);
              }}
              p="10px">
              <Flex
                data-id="030925-876995"
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
                w="37px">
                {i + 1}
              </Flex>
              <Text
                data-id="030925-67ce3b"
                color="navigationMobileModal.section.label"
                fontSize="ssm"
                fontWeight="bold">
                {section.name}
              </Text>
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
}

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
