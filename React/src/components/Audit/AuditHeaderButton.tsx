import { Button, IconButton } from '@chakra-ui/react';

const AuditHeaderButton = ({
  icon,
  name,
  onClick,
  loading = false,
  bgColor = 'auditHeader.buttonLightBg',
  fontColor = 'auditHeader.buttonLightColor',
  disabled = false,
}) => (
  <>
    <Button
      _hover={
        disabled
          ? {}
          : {
              bg: 'auditHeader.buttonLightBgHover',
              color: 'auditHeader.buttonLightColorHover',
              cursor: 'pointer',
              stroke: 'green',
            }
      }
      bg={bgColor}
      borderRadius="10px"
      color={fontColor}
      disabled={disabled}
      display={['flex', icon ? 'none' : 'flex', 'flex']}
      fontSize="14px"
      fontWeight="bold"
      isLoading={loading}
      leftIcon={icon}
      ml="15px"
      onClick={() => !disabled && onClick()}
      px={4}
      role="group"
      w={['calc(100% - 1rem - 15px)', 'auto']}
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
