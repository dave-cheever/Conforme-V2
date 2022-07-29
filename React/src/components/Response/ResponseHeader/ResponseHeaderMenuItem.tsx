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
  <MenuItem color="responseHeaderMenuItem.optionsMenuColor" isDisabled={disabled} onClick={onClick} w="100%">
    <Box p="2">{name}</Box>
    <Spacer />
    {icon && <Box p="2">{icon}</Box>}
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
