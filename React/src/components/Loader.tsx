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
    (<Flex
      align={center ? 'center' : 'flex-start'}
      data-id="ac8cfe8b7513"
      h="full"
      justify="center"
      w="full"
      {...props}>
      <Spinner
        color={loaderColor || 'loader.color'}
        data-id="de21a64742a8"
        emptyColor="gray.200"
        size={size || 'xl'}
        speed="0.65s"
        thickness={getThickness()} />
    </Flex>)
  );
}

export default Loader;
