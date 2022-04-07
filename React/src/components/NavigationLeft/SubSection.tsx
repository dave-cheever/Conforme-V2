import { Box, Flex, Text } from '@chakra-ui/react';

import useNavigate from '../../hooks/useNavigate';
import { ISubsection } from '../../interfaces/IMenu';

const SubSection = ({
  subsection,
  setMenuOpen,
  menuOpen,
}: {
  subsection: ISubsection;
  menuOpen?: boolean;
  setMenuOpen?: (value: boolean) => void;
}) => {
  const { navigateTo, isPathActive } = useNavigate();
  const { url, label } = subsection;

  return (
    <Flex
      alignItems="center"
      color={
        isPathActive(url, { exact: true })
          ? 'subSection.selectedFontColor'
          : 'subSection.unselectedFontColor'
      }
      cursor="pointer"
      fontSize="14px"
      fontWeight="400"
      key={label}
      lineHeight="40px"
      ml={[menuOpen ? '35px' : '10px', '20px', '35px']}
      onClick={() => {
        navigateTo(url);
        if (setMenuOpen) setMenuOpen(!menuOpen);
      }}
    >
      <Box
        bg={
          isPathActive(url, { exact: true })
            ? 'subSection.selectedIndicator'
            : 'subSection.unselectedIndicator'
        }
        h="8px"
        rounded="50%"
        w="8px"
      />
      <Text ml="25px">{label}</Text>
    </Flex>
  );
};

export default SubSection;

export const subSectionStyles = {
  subSection: {
    selectedFontColor: '#282F36',
    unselectedFontColor: '#818197',
    selectedIndicator: '#462AC4',
    unselectedIndicator: '#ffffff',
  },
};
