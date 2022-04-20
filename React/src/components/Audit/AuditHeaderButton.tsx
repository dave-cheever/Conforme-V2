import { Button, IconButton } from '@chakra-ui/react';

const AuditHeaderButton = ({ icon, name, onClick, loading = false }) => (
  <>
    <Button
      _hover={{
        bg: 'auditHeader.buttonLightBgHover',
        color: 'auditHeader.buttonLightColorHover',
        cursor: 'pointer',
        stroke: 'green',
      }}
      bg="auditHeader.buttonLightBg"
      borderRadius="10px"
      color="auditHeader.buttonLightColor"
      display={['none', icon ? 'none' : 'flex', 'flex']}
      fontSize="14px"
      fontWeight="bold"
      isLoading={loading}
      leftIcon={icon}
      ml="15px"
      onClick={onClick}
      px={4}
      role="group"
    >
      {name}
    </Button>
    <IconButton
      _hover={{
        bg: 'auditHeader.buttonLightBgHover',
        color: 'auditHeader.buttonLightColorHover',
        cursor: 'pointer',
      }}
      aria-label="Search database"
      bg="auditHeader.buttonLightBg"
      borderRadius="10px"
      display={['none', icon ? 'flex' : 'none', 'none']}
      icon={icon}
      ml="15px"
      onClick={onClick}
    />
  </>
);

export default AuditHeaderButton;
