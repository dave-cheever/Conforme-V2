import { Box, MenuItem, Spacer } from '@chakra-ui/react';

const AuditHeaderMenuItem = ({ title, icon, onClick, disabled = false }) => (
  <MenuItem
    color="auditHeadeMenuItem.optionsMenuColor"
    data-id="fea53ed5ae61"
    isDisabled={disabled}
    onClick={onClick}
    w="100%">
    <Box data-id="4425c75a4443" p="2">{title}</Box>
    <Spacer data-id="8029ffbd8692" />
    <Box data-id="db917d220753" p="2">{icon}</Box>
  </MenuItem>
);

export default AuditHeaderMenuItem;

export const auditHeaderMenuItemStyles = {
  auditHeadeMenuItem: {
    optionsMenuColor: '#818197',
    optionsMenuItemHover: '#F0F0F0',
    buttonLightColor: '#818197',
  },
};
