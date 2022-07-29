import { Flex, Text } from '@chakra-ui/react';

import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import { ErrorSign } from '../../icons';
import { generateTabColors } from '../../utils/helpers';

const NavigationModal = () => {
  const { complianceItem, complianceItemModalSections, errors, selectedSectionIndex, visitedTab, selectSection, trigger } =
    useComplianceItemModalContext();

  return (
    <Flex flexDir="column" w="185px">
      {complianceItemModalSections.map((el, i) => (
        <Flex
          alignItems="center"
          cursor="pointer"
          key={el.name}
          mb="15px"
          onClick={() => {
            trigger(Object.keys(complianceItemModalSections[selectedSectionIndex].fields || []) as any);
            selectSection(i);
          }}
        >
          <Flex
            alignItems="center"
            bg={generateTabColors(i, errors, complianceItem, visitedTab, selectedSectionIndex).bg}
            color={generateTabColors(i, errors, complianceItem, visitedTab, selectedSectionIndex).color}
            flexShrink={0}
            fontSize="11px"
            fontWeight="bold"
            h="28px"
            justifyContent="center"
            mr="15px"
            rounded="10px"
            w="37px"
          >
            {generateTabColors(i, errors, complianceItem, visitedTab, selectedSectionIndex).bg === 'navigationModal.section.error.bg' ? (
              <ErrorSign h="14px" stroke="white" w="16px" />
            ) : (
              i + 1
            )}
          </Flex>
          <Text color="navigationModal.section.label" fontSize="smm" fontWeight={i === selectedSectionIndex ? 'bold' : 'semi_medium'}>
            {el.name}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default NavigationModal;

export const navigationModalStyles = {
  navigationModal: {
    section: {
      label: '#818197',
      selected: {
        bg: '#462AC4',
        color: '#ffffff',
      },
      unselected: {
        bg: '#F0F2F5',
        color: '#818197',
      },
      correct: {
        bg: '#41B916',
        color: '#FFFFFF',
      },
      error: {
        bg: '#E93C44',
        color: '#FFFFFF',
      },
    },
  },
};
