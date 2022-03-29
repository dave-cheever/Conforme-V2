import { Button, IconButton } from '@chakra-ui/react';

const ResponseHeaderButton = ({ icon, name, onClick, loading = false }) => (
  <>
    <Button
      _hover={{
        bg: 'reasponseHeader.buttonLightBgHover',
        color: 'reasponseHeader.buttonLightColorHover',
        cursor: 'pointer',
        stroke: 'green',
      }}
      bg="reasponseHeader.buttonLightBg"
      borderRadius="10px"
      color="reasponseHeader.buttonLightColor"
      display={['none', 'none', 'flex']}
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
        bg: 'reasponseHeader.buttonLightBgHover',
        color: 'reasponseHeader.buttonLightColorHover',
        cursor: 'pointer',
      }}
      aria-label="Search database"
      bg="reasponseHeader.buttonLightBg"
      borderRadius="10px"
      display={['none', 'flex', 'none']}
      icon={icon}
      ml="15px"
      onClick={onClick}
    />
  </>
);

export default ResponseHeaderButton;
