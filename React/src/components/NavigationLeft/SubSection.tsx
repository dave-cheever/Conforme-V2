import { Flex, Box, Text } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import { ISubsection } from "../../interfaces/IMenu";

const SubSection = ({ subsection, setMenuOpen, menuOpen }: {subsection: ISubsection, menuOpen?: boolean, setMenuOpen?: (value: boolean) => void }) => {
  const history = useHistory();
  const { url, label } = subsection;

  return (
    <Flex
      key={label}
      ml={[menuOpen ? '35px' : '10px', '20px', '35px']}
      fontSize="14px"
      fontWeight="400"
      lineHeight="40px"
      alignItems="center"
      onClick={() => {
        history.push(url);
        setMenuOpen && setMenuOpen(!menuOpen)
      }}
      color={history.location.pathname === url ? "subSection.selectedFontColor" : "subSection.unselectedFontColor"}
      cursor="pointer"
    >
      <Box w="8px" h="8px" rounded="50%" bg={history.location.pathname === url ? "subSection.selectedIndicator" : "subSection.unselectedIndicator"}/>
      <Text ml="25px">{label}</Text>
    </Flex>
  );
};

export default SubSection;

export const subSectionStyles = {
  subSection: {
    selectedFontColor: "#282F36",
    unselectedFontColor: "#818197",
    selectedIndicator: "#462AC4",
    unselectedIndicator: "#ffffff",
  }
};
