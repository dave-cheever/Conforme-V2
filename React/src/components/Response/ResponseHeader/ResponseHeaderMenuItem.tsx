
import { Box, Flex, MenuItem, Spacer} from '@chakra-ui/react';

const ResponseHeaderMenuItem = ({title, icon, onClick}) => {
   return (
    <MenuItem color="responseHeaderMenuItem.optionsMenuColor">
    <Flex w="100%" onClick={ onClick }>
      <Box p='2' color="responseHeaderMenuItem.optionsMenuColor">
        {title}
      </Box>
      <Spacer />
      <Box p='2'>
        { icon }
      </Box>
    </Flex>
    </MenuItem>
  );
}

export default ResponseHeaderMenuItem;

export const responseHeaderMenuItemStyles = {
    responseHeaderMenuItem: {
      optionsMenuColor: "#818197",
      optionsMenuItemHover: "#F0F0F0",
      buttonLightColor: "#818197",
  }
}