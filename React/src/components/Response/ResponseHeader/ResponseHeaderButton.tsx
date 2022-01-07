import { Button, IconButton } from '@chakra-ui/react';

const ResponseHeaderButton  = ({icon, name, onClick, loading=false}) => {
   return (
      <>
      <Button
         ml='15px'
         px={4}
         borderRadius="10px"
         fontSize="14px"
         fontWeight="bold"
         isLoading={loading}
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
         display={["none","none","flex"]}
      >
      {name}
      </Button>
      <IconButton
         ml='15px'
         borderRadius="10px" 
         bg="reasponseHeader.buttonLightBg"
         aria-label='Search database'
         icon={icon}
         display={["none","flex","none"]}
         onClick={onClick}
         _hover={{ bg: 'reasponseHeader.buttonLightBgHover', color: 'reasponseHeader.buttonLightColorHover', cursor: 'pointer' }} 
      />
      </>
  );
}

export default ResponseHeaderButton;