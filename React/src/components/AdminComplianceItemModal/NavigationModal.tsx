import { Flex, Text } from '@chakra-ui/react';

import { generateTabColors } from '../../utils/helpers';
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
    trigger
  } = useComplianceItemModalContext();

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
            selectSection(i);
          }}
        >
          <Flex
            w="37px"
            h="28px"
            bg={generateTabColors(i, errors, complianceItem, visitedTab, selectedSectionIndex).bg}
            color={generateTabColors(i, errors, complianceItem, visitedTab, selectedSectionIndex).color}
            mr="15px"
            fontSize="11px"
            fontWeight="bold"
            flexShrink={0}
            rounded="10px"
            alignItems="center"
            justifyContent="center"
          >
            {generateTabColors(i, errors, complianceItem, visitedTab, selectedSectionIndex).bg === "navigationModal.section.error.bg"
              ? <ErrorSign w="16px" h="14px" stroke="white" />
              : i + 1
            }
          </Flex>
          <Text fontSize="smm" color="navigationModal.section.label" fontWeight={i === selectedSectionIndex ? "bold" : "semi_medium"}>
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
      correct: {
        bg: "#41B916",
        color: "#FFFFFF",
      },
      error: {
        bg: "#E93C44",
        color: "#FFFFFF",
      }
    },
  }
};
