import { Flex, Spinner } from '@chakra-ui/react';

const Loader = ({
  loaderColor,
  size,
  center,
  w,
}: {
  loaderColor?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
  w?: number | string;
}) => {
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
        break;
      default:
        break;
    }
    return thickness;
  };
  return (
    <Flex align={center ? 'center' : 'flex-start'} h="full" justify="center" w={w || 'full'}>
      <Spinner color={loaderColor || 'loader.color'} emptyColor="gray.200" size={size || 'xl'} speed="0.65s" thickness={getThickness()} />
    </Flex>
  );
};

export default Loader;
