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
      data-id="030925-81d4b3"
      color="responseHeaderMenuItem.optionsMenuColor"
      isDisabled={disabled}
      onClick={onClick}
      w="100%">
      <Box data-id="030925-e8a580" p="2">{name}</Box>
      <Spacer data-id="030925-98ddc7" />
      {icon && <Box data-id="030925-9ea376" p="2">{icon}</Box>}
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
