import { Box, Flex, Icon, Text } from '@chakra-ui/react';

import { useAdminContext } from '../../contexts/AdminProvider';
import useNavigate from '../../hooks/useNavigate';
import { ISubSection } from '../../interfaces/INavItem';

// Helper functions to reduce cognitive complexity
const getBackgroundColor = (isPopover: boolean, isPathActive: (url: string, options?: { exact: boolean }) => boolean, url: string, showIcon?: boolean) => {
  if (isPopover) {
    return isPathActive(url, { exact: true }) ? '#0068A3' : 'white';
  }
  if (isPathActive(url, { exact: true }) && !showIcon) {
    return '#0067a345';
  }
  return 'subSectionBG.unselectedSubMenuItemBg';
};

const getTextColor = (isPopover: boolean, isPathActive: (url: string, options?: { exact: boolean }) => boolean, url: string, showIcon?: boolean) => {
  if (isPopover) {
    return isPathActive(url, { exact: true }) ? 'white' : 'black';
  }
  if (isPathActive(url, { exact: true }) && !showIcon) {
    return 'white';
  }
  return 'subSection.unselectedFontColor';
};

const getIndicatorColor = (isPopover: boolean, isPathActive: (url: string, options?: { exact: boolean }) => boolean, url: string, showIcon?: boolean) => {
  if (isPopover) {
    return isPathActive(url, { exact: true }) ? 'white' : 'black';
  }
  if (isPathActive(url, { exact: true }) && !showIcon) {
    return 'white';
  }
  return 'subSection.unselectedIndicator';
};

const getIconStrokeColor = (isPopover: boolean, isPathActive: (url: string, options?: { exact: boolean }) => boolean, url: string) => {
  if (isPopover && isPathActive(url, { exact: true })) {
    return 'white';
  }
  if (isPopover) {
    return 'black';
  }
  return 'subSection.iconStroke';
};

const getMarginLeft = (isPopover: boolean, menuOpen?: boolean, showIcon?: boolean) => {
  if (isPopover) {
    return '0px';
  }
  return [menuOpen ? '0px' : '10px', '20px', showIcon ? 6 : '0px'];
};

const handleSubSectionClick = (
  url: string,
  navigateTo: (url: string) => void,
  showIcon?: boolean,
  setAdminModalState?: (state: any) => void,
  onClick?: () => void,
  setMenuOpen?: (value: boolean) => void
) => {
  navigateTo(url);
  if (showIcon && setAdminModalState) {
    setAdminModalState('add');
  }
  if (setMenuOpen) {
    setMenuOpen(false);
  }
  if (onClick) {
    onClick();
  }
};

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

  const handleClick = () => {
    handleSubSectionClick(
      url,
      navigateTo,
      showIcon,
      setAdminModalState,
      onClick,
      setMenuOpen
    );
  };

  return (
    <Flex
        alignItems="center"
        bg={getBackgroundColor(isPopover || false, isPathActive, url, showIcon)}
        borderRadius="md"
        color={getTextColor(isPopover || false, isPathActive, url, showIcon)}
        cursor="pointer"
        data-id="000586"
        data-testid="subsection"
        fontSize="14px"
        fontWeight="400"
        key={label}
        lineHeight="40px"
        ml={getMarginLeft(isPopover || false, menuOpen, showIcon)}
        onClick={handleClick}
        pl={9}
        pr={9}>
      
      {!showIcon && (
        <Box
          bg={getIndicatorColor(isPopover || false, isPathActive, url, showIcon)}
          data-id="000587"
          data-testid="000587"
          h="8px"
          rounded="50%"
          w="8px" />
      )}
      
      {showIcon && (
        <Icon
          as={icon as any}
          data-id="000588"
          data-testid="000588"
          h="16px"
          stroke={getIconStrokeColor(isPopover || false, isPathActive, url)}
          w="16px" />
      )}
      
      <Text data-id="000589" ml="25px">{label}</Text>
    </Flex>
  );
}

export default SubSection;

export const subSectionStyles = {
  subSection: {
    selectedFontColor: '#ffffff',
    unselectedFontColor: '#CBD5E0',
    unselectedSubMenuItemBg: '##01173E',
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
