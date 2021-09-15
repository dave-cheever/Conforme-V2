import { Spinner, Flex } from '@chakra-ui/react';

const Loader = ({ loaderColor, size, center }: { loaderColor?: string, size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl', center?: boolean }) => {
  const getThickness = () => {
    let thickness = '4px';
    switch (size) {
      case 'xs':
      case 'sm':
        thickness = '2px';
        break;

      case 'md':
      case 'lg':
        thickness = '3px';
    }
    return thickness;
  }
  return (
    <Flex w='full' h='full' justify='center' align={center ? 'center' : 'flex-start'}>
      <Spinner
        thickness={getThickness()}
        speed="0.65s"
        emptyColor="gray.200"
        color={loaderColor || 'loader.color'}
        size={size || 'xl'}
      />
    </Flex>
  );
}

export default Loader;
