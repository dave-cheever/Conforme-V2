import { Box, MenuItem, Spacer } from "@chakra-ui/react";

const ResponseHeaderMenuItem = ({ title, icon, onClick, disabled = false }) => {
  return (
    <MenuItem
      w="100%"
      onClick={onClick}
      isDisabled={disabled}
      color="responseHeaderMenuItem.optionsMenuColor"
    >
      <Box p="2">{title}</Box>
      <Spacer />
      <Box p="2">{icon}</Box>
    </MenuItem>
  );
};

export default ResponseHeaderMenuItem;

export const responseHeaderMenuItemStyles = {
  responseHeaderMenuItem: {
    optionsMenuColor: "#818197",
    optionsMenuItemHover: "#F0F0F0",
    buttonLightColor: "#818197",
  },
};
