import { useEffect } from 'react';
import { Flex, Text } from '@chakra-ui/react';

import { generateLabelColor } from '../../utils/helpers';
import { ErrorSign } from '../../icons';
import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';

const NavigationModal = () => {
  const {
    complianceItem, 
    complianceItemModalSections, 
    errors, 
    selectedSectionIndex, 
    visitedTab, 
    selectSection, 
    setVisitedTab, 
    trigger
  } = useComplianceItemModalContext();

  useEffect(() => {
    if(selectedSectionIndex > visitedTab) {
      setVisitedTab(selectedSectionIndex);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSectionIndex]);

  return (
    <Flex flexDir="column" w="185px">
      {complianceItemModalSections.map((el, i) => el.name !== "Summary" && 
      <Flex 
        key={el.name} 
        mb="15px" 
        alignItems="center" 
        cursor="pointer" 
        onClick={() => {
          trigger(Object.keys(complianceItemModalSections[selectedSectionIndex].fields || []) as any);
          selectSection(i)}}
      >
        <Flex 
          w="37px" 
          h="28px" 
          bg={generateLabelColor(i, errors, complianceItem, visitedTab, selectedSectionIndex)}
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
          {generateLabelColor(i, errors, complianceItem, visitedTab, selectedSectionIndex) === "navigationModal.section.error.bg" 
            ? <ErrorSign w="16px" h="14px" stroke="white" /> 
            : i + 1 
          }
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
      },
      error: {
        bg: "#E93C44"
      }
    },
  }
};
