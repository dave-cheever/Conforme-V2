import { Button, IconButton } from '@chakra-ui/react';

function AuditHeaderButton({
  icon,
  name,
  onClick,
  loading = false,
  bgColor = 'auditHeader.buttonLightBg',
  fontColor = 'auditHeader.buttonLightColor',
  disabled = false,
}) {
  return (
    <>
      <Button
        _hover={
          disabled ? {
            color: 'auditHeader.buttonLightColorHover',
            cursor: 'not-allowed',
          } : {
            bg: 'auditHeader.buttonLightBgHover',
            color: 'auditHeader.buttonLightColorHover',
            cursor: 'pointer',
            stroke: 'green',
          }
        }
        bg={disabled ? 'auditHeader.buttonLightBgHover' : bgColor}
        border="1px solid #CBD5E0"
        borderRadius="10px"
        color={disabled ? 'auditHeader.buttonLightColorHover' : fontColor}
        data-id="030925-da88f1"
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
        w={['calc(100% - 1rem - 15px)', 'auto']}>
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
        data-id="030925-4729a5"
        display={['none', icon ? 'flex' : 'none', 'none']}
        icon={icon}
        ml="15px"
        onClick={onClick} />
    </>
  );
}

export default AuditHeaderButton;
