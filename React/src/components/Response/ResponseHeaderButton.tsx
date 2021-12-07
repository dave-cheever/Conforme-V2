import { Button } from '@chakra-ui/react';

const ResponseHeaderButton = ({ icon, name, onClick }) => {
  return (
    <Button
      ml='15px'
      px={4}
      borderRadius="10px"
      fontSize="14px"
      fontWeight="bold"
      bg="reasponseHeader.buttonLightBg"
      color="reasponseHeader.buttonLightColor"
      leftIcon={icon}
      _hover={{
        bg: 'reasponseHeader.buttonLightBgHover',
        color: 'reasponseHeader.buttonLightColorHover',
        cursor: 'pointer',
        stroke: 'green',
      }}
      role="group"
      onClick={onClick}
    >
      {name}
    </Button>
  );
}

export default ResponseHeaderButton;