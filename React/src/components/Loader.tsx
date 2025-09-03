import { Flex, Spinner } from '@chakra-ui/react';

function Loader({
  loaderColor,
  size,
  center,
  ...props
}: {
  loaderColor?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
  [x: string]: any;
}) {
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
    <Flex
        data-id="030925-a9d2fa"
        align={center ? 'center' : 'flex-start'}
        h="full"
        justify="center"
        w="full"
        {...props}>
      <Spinner
        data-id="030925-ef0905"
        color={loaderColor || 'loader.color'}
        emptyColor="gray.200"
        size={size || 'xl'}
        speed="0.65s"
        thickness={getThickness()} />
    </Flex>
  );
}

export default Loader;
