import { Flex, Text } from '@chakra-ui/react';

import ConformeLogo from '../../icons/ConformeLogo';

type ViewMode = 'desktop' | 'tablet' | 'default';

function getViewMode(enforceDesktop?: boolean): ViewMode {
  if (enforceDesktop) {
    return 'desktop';
  }
  return 'default';
}

function getNavigationStyles(viewMode: ViewMode) {
  switch (viewMode) {
    case 'desktop':
      return {
        width: ['200px', 'fit-content', 'fit-content'],
        marginBottom: 0,
        marginLeft: ['0px', 0, 0],
        transform: 'none',
        bottom: [0, '18px', '18px'],
        left: [0, '14px', '14px'],
      };
    case 'tablet':
      return {
        width: '200px',
        marginBottom: [0, '84px', '84px'], 
        marginLeft: ['14px', '-74px', '-74px'], 
        transform: ['none', 'rotate(-90deg)', 'rotate(-90deg)'], 
        bottom: 0,
        left: 0, 
      };
    case 'default':
      return {
        width: ['200px', '200px', 'fit-content'],
        marginBottom: [0, '84px', 0],
        marginLeft: ['14px', '-74px', 0],
        transform: ['none', 'rotate(-90deg)', 'none'],
        bottom: [0, 0, '18px'],
        left: [0, 0, '14px'],
      };
  }
}

function NavigationPoweredBy({ enforceDesktop, showFiltersPanel }: { readonly enforceDesktop?: boolean; readonly showFiltersPanel?: boolean }) {
  // When filter panel is open, use tablet view styling (no rotation, simpler layout)
  const viewMode = getViewMode(enforceDesktop);
  const styles = getNavigationStyles(viewMode);

  return (
    <Flex
      data-id="002748"
      width={'full'}
      flexDirection="column"
      gap="4px"
      w={styles.width}
      marginBottom={styles.marginBottom}
      marginLeft={styles.marginLeft}
      transform={styles.transform}
      position={'relative'}
      bottom={styles.bottom}
      left={styles.left}>
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
