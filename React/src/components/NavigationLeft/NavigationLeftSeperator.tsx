import { Box, Text } from '@chakra-ui/react';

import { Bar } from '../../icons';
import { INavItem } from '../../interfaces/INavItem';

const NavigationLeftSeperator = ({ label }: INavItem) => (
  <Box alignContent="center" display="flex" flexDirection="row">
    <Bar left="25px" mb="28px" ml="-26px" mr="25px" mt="11px" top="10px" width="46px" />
    <Text color="navigationLeft.menuList.unselectedMenuItem" fontSize="11px" lineHeight="13px" mt="11px">
      {label}
    </Text>
  </Box>
);

export default NavigationLeftSeperator;
