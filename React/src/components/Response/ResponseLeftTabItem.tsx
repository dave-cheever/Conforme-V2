import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Box, Flex, Icon } from '@chakra-ui/react';

import useNavigate from '../../hooks/useNavigate';

function ResponseLeftTabItem({ label, icon, url, isDesktop = true, isMobile = false, enforceDesktop }: {
  readonly label: string;
  readonly icon: any;
  readonly url: string;
  readonly isDesktop?: boolean;
  readonly isMobile?: boolean;
  readonly enforceDesktop?: boolean;
}) {
  const location = useLocation();
  const { navigateTo, isPathActive } = useNavigate();
  const { id } = useParams();

  const active = isPathActive(`/tracker-item/${id}${url}`, { exact: true });

  const redirectPage = () => {
    navigateTo(`/tracker-item/${id}${url}${location.search}`);
  };

  return (
    <Box
      _hover={{
        cursor: 'pointer',
        bg: active ? undefined : 'responseLeftTabItem.hoverLabelBg',
      }}
      alignItems="center"
      bg={
        active
          ? 'responseLeftTabItem.selectedMenuItemBg'
          : 'responseLeftTabItem.unselectedMenuItemBg'
      }
      borderRadius="6px"
      data-id="000299"
      display="flex"
      fontSize="md"
      fontWeight="normal"
      h="42px"
      w={['0', enforceDesktop ? '100%' : '42px', "100%"]}
      justifyContent={['center', enforceDesktop ? 'flex-start' : 'center', 'flex-start']}
      mb={[0, 0, 0]}
      mx={[3, 0]}
      onClick={redirectPage}
      px={[0, enforceDesktop ? '14px' : 0, "14px"]}
      py={[0, enforceDesktop ? '12px' : 0, "12px"]}
      sx={{
        '&:hover': active ? {} : { backgroundColor: 'responseLeftTabItem.hoverLabelBg' },
      }}
      transition="all 0.2s ease-out"
      >
      <Flex align="center" data-id="000300" h="100%" justify="space-between">
        <Flex data-id="002750" align="center">
          <Flex
            alignItems="center"
            bg="transparent"
            data-id="000301"
            h="30px"
            justifyContent="center"
            rounded="8px"
            transition="all 0.2s ease-out"
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
        </Flex>

        {(isDesktop || (isMobile && active)) && (
          <Flex
            align="center"
            data-id="000303"
            justify="space-between"
            w="100%">
            <Box
              data-id="002751"
              color={
                active
                  ? 'responseLeftTabItem.selectedMenuItem'
                  : 'responseLeftTabItem.unselectedMenuItem'
              }
              fontWeight="600"
              fontSize="16px"
              ml="8px">
              {label}
            </Box>
          </Flex>
        )}
      </Flex>
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
