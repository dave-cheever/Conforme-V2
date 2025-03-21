import { useBreakpointValue } from '@chakra-ui/react';

const useDevice = () => {
  const device: 'mobile' | 'tablet' | 'desktop' =
    useBreakpointValue({
      base: 'mobile',
      tablet: 'tablet',
      desktop: 'desktop',
    }, { 
      ssr: false,
    }) || 'desktop';
  return device;
};

export default useDevice;
