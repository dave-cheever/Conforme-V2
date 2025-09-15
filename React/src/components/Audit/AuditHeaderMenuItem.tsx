import { Box, MenuItem, Spacer } from '@chakra-ui/react';

function AuditHeaderMenuItem({ title, icon, onClick, disabled = false }) {
  return (
    <MenuItem
      color="auditHeadeMenuItem.optionsMenuColor"
      data-id="030925-86e85b"
      isDisabled={disabled}
      onClick={onClick}
      w="100%">
      <Box data-id="030925-d0035e" p="2">{title}</Box>
      <Spacer data-id="030925-b34c0c" />
      <Box data-id="030925-94dbe2" p="2">{icon}</Box>
    </MenuItem>
  );
}

export default AuditHeaderMenuItem;

export const auditHeaderMenuItemStyles = {
  auditHeadeMenuItem: {
    optionsMenuColor: '#818197',
    optionsMenuItemHover: '#F0F0F0',
    buttonLightColor: '#818197',
  },
};
