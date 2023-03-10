import { ReactElement } from 'react';

import { Box, MenuItem, Spacer } from '@chakra-ui/react';

const ResponseHeaderMenuItem = ({
  name,
  icon,
  onClick,
  disabled = false,
}: {
  icon?: ReactElement<any, any>;
  name: string;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <MenuItem
    color="responseHeaderMenuItem.optionsMenuColor"
    data-id="6dfd745985b9"
    isDisabled={disabled}
    onClick={onClick}
    w="100%">
    <Box data-id="23e57ea83df3" p="2">{name}</Box>
    <Spacer data-id="fe2b1d66eafc" />
    {icon && <Box data-id="2b2560aff4b0" p="2">{icon}</Box>}
  </MenuItem>
);

export default ResponseHeaderMenuItem;

export const responseHeaderMenuItemStyles = {
  responseHeaderMenuItem: {
    optionsMenuColor: '#818197',
    optionsMenuItemHover: '#F0F0F0',
    buttonLightColor: '#818197',
  },
};
