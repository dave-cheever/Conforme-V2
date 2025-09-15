import { Box, Text } from '@chakra-ui/react';

import { Bar } from '../../icons';
import { INavItem } from '../../interfaces/INavItem';

function NavigationLeftSeperator({ label }: INavItem) {
  return (
    <Box
      alignContent="center"
      data-id="030925-c45322"
      display="flex"
      flexDirection="row">
      <Bar
        data-id="030925-479685"
        left="25px"
        mb="28px"
        ml="-26px"
        mr="25px"
        mt="11px"
        top="10px"
        width="46px" />
      <Text
        color="navigationLeft.menuList.unselectedMenuItem"
        data-id="030925-60de76"
        fontSize="11px"
        lineHeight="13px"
        mt="11px">
        {label}
      </Text>
    </Box>
  );
}

export default NavigationLeftSeperator;
