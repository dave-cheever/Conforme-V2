import { Flex, Text } from '@chakra-ui/react';

import { useTrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import { ErrorSign } from '../../icons';
import { generateTabColors } from '../../utils/helpers';

const NavigationModal = () => {
  const { trackerItem, trackerItemModalSections, errors, selectedSectionIndex, visitedTab, selectSection, trigger } =
    useTrackerItemModalContext();

  return (
    (<Flex data-id="5443cb5c380c" flexDir="column" w="185px">
      {trackerItemModalSections.map((el, i) => (
        <Flex
          alignItems="center"
          cursor="pointer"
          data-id="206dc8a78d97"
          key={el.name}
          mb="15px"
          onClick={() => {
            trigger(Object.keys(trackerItemModalSections[selectedSectionIndex].fields || []) as any);
            selectSection(i);
          }}>
          <Flex
            alignItems="center"
            bg={generateTabColors(i, errors, trackerItem, visitedTab, selectedSectionIndex).bg}
            color={generateTabColors(i, errors, trackerItem, visitedTab, selectedSectionIndex).color}
            data-id="7476a31268d4"
            flexShrink={0}
            fontSize="11px"
            fontWeight="bold"
            h="28px"
            justifyContent="center"
            mr="15px"
            rounded="10px"
            w="37px">
            {generateTabColors(i, errors, trackerItem, visitedTab, selectedSectionIndex).bg === 'navigationModal.section.error.bg' ? (
              <ErrorSign data-id="3d5fa2b57625" h="14px" stroke="white" w="16px" />
            ) : (
              i + 1
            )}
          </Flex>
          <Text
            color="navigationModal.section.label"
            data-id="87ea0f229808"
            fontSize="smm"
            fontWeight={i === selectedSectionIndex ? 'bold' : 'semi_medium'}>
            {el.name}
          </Text>
        </Flex>
      ))}
    </Flex>)
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
