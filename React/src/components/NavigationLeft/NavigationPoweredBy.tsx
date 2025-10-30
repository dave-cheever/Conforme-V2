import { Flex, Text } from '@chakra-ui/react';

import ConformeLogo from '../../icons/ConformeLogo';

function NavigationPoweredBy({ enforceDesktop }: { readonly enforceDesktop?: boolean }) {

  const width = enforceDesktop 
    ? ['200px', 'fit-content', 'fit-content']
    : ['200px', '200px', 'fit-content'];

  const marginBottom = enforceDesktop
    ? [0, 0, 0]
    : [0, '84px', 0];

  const marginLeft = enforceDesktop
    ? ['14px', 0, 0]
    : ['14px', '-74px', 0];

  const transform = enforceDesktop
    ? ['none', 'none', 'none']
    : ['none', 'rotate(-90deg)', 'none'];

  const position = enforceDesktop
    ? ['relative', 'absolute', 'absolute'] as Array<'relative' | 'absolute'>
    : ['relative', 'relative', 'absolute'] as Array<'relative' | 'absolute'>;

  const bottom = enforceDesktop
    ? [0, '18px', '18px']
    : [0, 0, '18px'];

  const left = enforceDesktop
    ? [0, '14px', '14px']
    : [0, 0, '14px'];

  return (
    <Flex
      data-id="002748"
      width={'full'}
      justifyContent={'flex-start'}
      alignItems={'flex-start'}
      flexDirection="column"
      gap="4px"
      w={width}
      marginBottom={marginBottom}
      marginLeft={marginLeft}
      transform={transform}
      position={position}
      bottom={bottom}
      left={left}>
      <Text
        color="rgba(255, 255, 255, 0.36)"
        data-id="000600"
        fontSize="12px"
        fontWeight="500"
        w="fit-content">
        Powered By
      </Text>
      <ConformeLogo data-id="002749" dataId="000601" />
    </Flex>
  );
}

export default NavigationPoweredBy;
