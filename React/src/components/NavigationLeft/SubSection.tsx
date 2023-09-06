import { Box, Flex, Icon, Text } from '@chakra-ui/react';

import { useAdminContext } from '../../contexts/AdminProvider';
import useNavigate from '../../hooks/useNavigate';
import { ISubSection } from '../../interfaces/INavItem';

function SubSection({
  subsection,
  setMenuOpen,
  menuOpen,
  showIcon,
}: {
  subsection: ISubSection;
  menuOpen?: boolean;
  showIcon?: boolean;
  setMenuOpen?: (value: boolean) => void;
}) {
  const { navigateTo, isPathActive } = useNavigate();
  const { setAdminModalState } = useAdminContext();
  const { url, label, icon } = subsection;

  return (
    (<Flex
      alignItems="center"
      color={isPathActive(url, { exact: true }) && !showIcon ? 'subSection.selectedFontColor' : 'subSection.unselectedFontColor'}
      cursor="pointer"
      data-id="f974c37deacd"
      fontSize="14px"
      fontWeight="400"
      key={label}
      lineHeight="40px"
      ml={[menuOpen ? '35px' : '10px', '20px', showIcon ? 6 : '35px']}
      onClick={() => {
        navigateTo(url);
        if (showIcon) setAdminModalState('add');
        if (setMenuOpen) setMenuOpen(!menuOpen);
      }}>
      {!showIcon && (
        <Box
          bg={isPathActive(url, { exact: true }) && !showIcon ? 'subSection.selectedIndicator' : 'subSection.unselectedIndicator'}
          data-id="c332219e1c60"
          h="8px"
          rounded="50%"
          w="8px" />
      )}
      {showIcon && <Icon
        as={icon as any}
        data-id="de7e8b57be59"
        h="16px"
        stroke="subSection.iconStroke"
        w="16px" />}
      <Text data-id="dc05a0f7a116" ml="25px">{label}</Text>
    </Flex>)
  );
}

export default SubSection;

export const subSectionStyles = {
  subSection: {
    selectedFontColor: '#282F36',
    unselectedFontColor: '#818197',
    selectedIndicator: '#462AC4',
    unselectedIndicator: '#ffffff',
    iconStroke: '#818197',
  },
};
