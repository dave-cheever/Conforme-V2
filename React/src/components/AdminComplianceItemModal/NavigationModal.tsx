import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';

const NavigationModal = () => {
  const {
    complianceItemModalSections, selectedSectionIndex, selectSection,
  } = useComplianceItemModalContext();
  return (
    <Flex flexDir="column" w="185px">
      {complianceItemModalSections.map((el, i) => el.name !== "Summary" && 
      <Flex key={el.name} mb="15px" alignItems="center" cursor="pointer" onClick={() => selectSection(i)}>
        <Flex 
          w="37px" 
          h="28px" 
          bg={i === selectedSectionIndex 
            ? "navigationModal.section.selected.bg" 
            : "navigationModal.section.unselected.bg" 
          }
          color={i === selectedSectionIndex 
            ? "navigationModal.section.selected.color" 
            : "navigationModal.section.unselected.color" 
          }
          mr="15px" 
          fontSize="11px"
          fontWeight="bold"
          flexShrink={0} 
          rounded="10px" 
          alignItems="center" 
          justifyContent="center"
        >
          {i+1}
        </Flex>
        <Text fontSize="smm" color="navigationModal.section.label" fontWeight={i === selectedSectionIndex ? "bold" : "semi_medium" }>
          {el.name}
        </Text>
      </Flex> 
      )}
    </Flex>
  );
};

export default NavigationModal;

export const navigationModalStyles = {
  navigationModal: {
    section: {
      label: "#818197",
      selected: {
        bg: "#462AC4",
        color: "#ffffff"
      },
      unselected: {
        bg: "#F0F2F5",
        color: "#818197"
      }
    },
  }
};
