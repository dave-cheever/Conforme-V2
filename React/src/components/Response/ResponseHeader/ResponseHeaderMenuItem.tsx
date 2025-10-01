import { ReactElement } from 'react';

import { Box, MenuItem, Spacer } from '@chakra-ui/react';

function ResponseHeaderMenuItem({
  name,
  icon,
  onClick,
  disabled = false,
}: {
  icon?: ReactElement<any, any>;
  name: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <MenuItem
      color="responseHeaderMenuItem.optionsMenuColor"
      data-id="000859"
      isDisabled={disabled}
      onClick={onClick}
      w="100%">
      <Box data-id="000860" p="2">{name}</Box>
      <Spacer data-id="000861" />
      {icon && <Box data-id="000862" p="2">{icon}</Box>}
    </MenuItem>
  );
}

export default ResponseHeaderMenuItem;

export const responseHeaderMenuItemStyles = {
  responseHeaderMenuItem: {
    optionsMenuColor: '#818197',
    optionsMenuItemHover: '#F0F0F0',
    buttonLightColor: '#818197',
  },
};
