import { Box, MenuItem, Spacer } from '@chakra-ui/react';

function AuditHeaderMenuItem({ title, icon, onClick, disabled = false }) {
  return (
    <MenuItem
      color="auditHeadeMenuItem.optionsMenuColor"
      data-id="000168"
      isDisabled={disabled}
      onClick={onClick}
      w="100%">
      <Box data-id="000169" p="2">{title}</Box>
      <Spacer data-id="000170" />
      <Box data-id="000171" p="2">{icon}</Box>
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
