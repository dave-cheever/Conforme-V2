import { Box, Flex, Icon, Text } from '@chakra-ui/react';

import { useAdminContext } from '../../contexts/AdminProvider';
import useNavigate from '../../hooks/useNavigate';
import { ISubSection } from '../../interfaces/INavItem';

function SubSection({
  subsection,
  setMenuOpen,
  menuOpen,
  showIcon,
  isPopover,
  onClick,
}: {
  subsection: ISubSection;
  menuOpen?: boolean;
  showIcon?: boolean;
  setMenuOpen?: (value: boolean) => void;
  isPopover?: boolean;
  onClick?: () => void;
}) {
  const { navigateTo, isPathActive } = useNavigate();
  const { setAdminModalState } = useAdminContext();
  const { url, label, icon } = subsection;

  return (
    <Flex
        data-id="030925-9a0646"
        alignItems="center"
        bg={
          isPopover
            ? isPathActive(url, { exact: true }) ? '#462AC4' : 'white'
            : isPathActive(url, { exact: true }) && !showIcon
            ? 'subSectionBG.selectedFontColor'
            : 'subSectionBG.unselectedFontColor'
        }
        borderRadius="md"
        color={
          isPopover
            ? isPathActive(url, { exact: true }) ? 'white' : 'black'
            : isPathActive(url, { exact: true }) && !showIcon
            ? 'subSection.selectedFontColor'
            : 'subSection.unselectedFontColor'
        }
        cursor="pointer"
        fontSize="14px"
        fontWeight="400"
        key={label}
        lineHeight="40px"
       ml={
          !isPopover
            ? [menuOpen ? '0px' : '10px', '20px', showIcon ? 6 : '0px']
            : '0px'
        }
        onClick={() => {
          navigateTo(url);
          if (showIcon) setAdminModalState('add');
          if (setMenuOpen) setMenuOpen(!menuOpen);
          if (onClick) onClick();
        }}
        pl={9}
        pr={9}
      >
      {!showIcon && (
      <Box
        data-id="030925-8211c5"
        bg={
           isPopover
        ? isPathActive(url, { exact: true }) ? 'white' : 'black'
        : isPathActive(url, { exact: true }) && !showIcon
        ? 'subSection.selectedIndicator'
            :'subSection.unselectedIndicator'
        }
        h="8px"
        rounded="50%"
        w="8px" />
      )}
      {showIcon && (
        <Icon
          data-id="030925-a1f222"
          as={icon as any}
          h="16px"
          stroke={
            isPopover && isPathActive(url, { exact: true })
              ? 'white'
              : isPopover
              ? 'black'
              : 'subSection.iconStroke'
          }
          w="16px" />
  )}
      <Text data-id="030925-b7295f" ml="25px">{label}</Text>
    </Flex>
  );
}

export default SubSection;

export const subSectionStyles = {
  subSection: {
    selectedFontColor: '#ffffff',
    unselectedFontColor: '#CBD5E0',
    selectedIndicator: '#ffffff',
    unselectedIndicator: '#ffffff',
    iconStroke: '#ffffff',
  },
  subSectionBG: {
    selectedFontColor: '#462AC4',
    unselectedFontColor: '#110B30',
    selectedIndicator: '#462AC4',
    unselectedIndicator: '#ffffff',
    iconStroke: '#ffffff',
  },
};
