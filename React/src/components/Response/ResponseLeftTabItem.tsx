import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Box, Flex, Icon, Text, useMediaQuery } from '@chakra-ui/react';

import useNavigate from '../../hooks/useNavigate';

interface ResponseLeftTabItemProps {
  readonly label: string;
  readonly icon: React.ComponentType;
  readonly url: string;
  readonly enforceDesktop?: boolean;
}

// Helper to compute desktop view state
const shouldShowDesktopView = (enforceDesktop: boolean | undefined, isDesktop: boolean): boolean => {
  return enforceDesktop === true || (enforceDesktop !== false && isDesktop);
};

// Helper to compute background colors
const getBackgroundColors = (active: boolean) => ({
  hoverBg: active ? undefined : 'responseLeftTabItem.hoverLabelBg',
  bg: active
    ? 'responseLeftTabItem.selectedMenuItemBg'
    : 'responseLeftTabItem.unselectedMenuItemBg',
  hoverStyle: active ? {} : { backgroundColor: 'responseLeftTabItem.hoverLabelBg' },
});

// Desktop view component
const DesktopView = ({
  label,
  icon,
  active,
}: {
  label: string;
  icon: React.ComponentType;
  active: boolean;
}) => (
  <Flex align="center" data-id="000300" h="100%" gap="8px" w="100%">
    <Flex
      alignItems="center"
      bg="transparent"
      data-id="000301"
      h="30px"
      justifyContent="center"
      rounded="8px"
      transition="all 0.2s ease-out"
      flexShrink={0}
      w="30px">
      <Icon
        as={icon}
        color="#fff"
        data-id="000302"
        fill="#ffffff"
        h="18px"
        stroke="#ffffff"
        w="18px" />
    </Flex>
    <Text
      data-id="002751"
      color={
        active
          ? 'responseLeftTabItem.selectedMenuItem'
          : 'responseLeftTabItem.unselectedMenuItem'
      }
      fontWeight="600"
      fontSize="16px"
      flex="1"
      minWidth="0"
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis">
      {label}
    </Text>
  </Flex>
);

// Mobile/tablet view component
const MobileView = ({
  label,
  icon,
  active,
}: {
  label: string;
  icon: React.ComponentType;
  active: boolean;
}) => {

  const [isTabletWidth] = useMediaQuery('(min-width: 768px) and (max-width: 1023px)', { ssr: false });

  // Icon color is white when active or on tablet, otherwise gray
  const iconColor = (() => {
    if (active || isTabletWidth) {
      return '#ffffff';
    }
    return '#4A5568';
  })();
  const textColor = '#4A5568';
  return (
    <Flex
      align="center"
      direction="column"
      justify="center"
      gap="6px"
      data-id="002910-mobile-view"
      w="75px">
      <Flex
        align="center"
        bg={active ? '#0068A3' : 'none'}
        borderRadius="8px"
        data-id="000301"
        h="30px"
        justify="center"
        w="30px">
        <Icon
          as={icon}
          data-id="000302"
          fill={iconColor}
          color={iconColor}
          h="18px"
          stroke={iconColor}
          w="18px" />
      </Flex>
      <Text
        display={['block', 'none', 'block']}
        data-id="002910-label"
        color={textColor}
        fontSize="12px"
        fontWeight={active ? "600" : "400"}
        textAlign="center"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        maxW="100%">
        {label}
      </Text>
    </Flex>
  );
};

function ResponseLeftTabItem({ 
  label, 
  icon, 
  url,
  enforceDesktop,
}: ResponseLeftTabItemProps) {
  const location = useLocation();
  const { isPathActive, navigateTo } = useNavigate(); 
  const { id } = useParams();
  const [isDesktop] = useMediaQuery('(min-width: 1024px)', { ssr: false });
  const active = useMemo(() => isPathActive(`/tracker-item/${id}${url}`, { exact: true }), [id, url, isPathActive]);
  
  const showDesktopView = shouldShowDesktopView(enforceDesktop, isDesktop);
  const { hoverBg, bg, hoverStyle } = getBackgroundColors(active);

  const redirectPage = () => {
    navigateTo(`/tracker-item/${id}${url}${location.search}`);
  };

  return (
    <Box
      _hover={{
        cursor: 'pointer',
        bg: hoverBg,
      }}
      bg={showDesktopView ? bg : 'transparent'}
      borderRadius="6px"
      data-id="000299"
      display="flex"
      fontSize="md"
      fontWeight="normal"
      alignItems="center"
      mb={[0, 0, 0]}
      mx={[3, 0]}
      onClick={redirectPage}
      sx={{
        '&:hover': hoverStyle,
      }}
      transition="all 0.2s ease-out"
      pos="relative"
      flexDirection={showDesktopView ? 'row' : 'column'}
      gap={showDesktopView ? undefined : '6px'}
      h={['100%', enforceDesktop ? '56px' : '42px', '42px']}
      w={['fit-content', enforceDesktop ? '100%' : '42px', '100%']}
      maxW={['54px', enforceDesktop ? '100%' : '42px', '100%']}
      justifyContent={['center', showDesktopView ? 'flex-start' : 'center', 'flex-start']}
      px={[0, showDesktopView ? '14px' : 0, '14px']}
      py={[0, showDesktopView ? '12px' : 0, '12px']}>
      {showDesktopView ? (
        <DesktopView data-id="002909" label={label} icon={icon} active={active} />
      ) : (
        <MobileView data-id="002910" label={label} icon={icon} active={active} />
      )}
    </Box>
  );
}

export default ResponseLeftTabItem;

export const responseLeftTabItemStyles = {
  responseLeftTabItem: {
    selectedMenuItem: '#ffffff',
    unselectedMenuItem: '#ffffff',
    selectedLabelBg: '#0068A3',
    selectedMenuItemBg: '#0068A3',
    unselectedMenuItemBg: '#01173E',
    unselectedLabelBg: '#01173E',
    hoverLabelBg: '#2A3B6C',
    selectedIconStroke: '#ffffff',
    unselectedIconStroke: '#818197',
    activeIconBg: '#462AC4',
    activeTextColor: '#ffffff',
    textColor: '#818197',
    activeIconColor: 'white',
    iconColor: '#818197',
  },
};
