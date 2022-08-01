import { useCallback, useEffect, useMemo } from 'react';

import { Button, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import useDevice from '../hooks/useDevice';
import { ChevronRight, GridIcon, GroupIcon, ListIcon } from '../icons';
import { TViewMode } from '../interfaces/TViewMode';

const ChangeViewButton = ({
  viewMode,
  setViewMode,
  views = [],
}: {
  viewMode: TViewMode;
  setViewMode: (mode: TViewMode) => void;
  views: TViewMode[];
}) => {
  const { user } = useAppContext();
  const device = useDevice();
  useEffect(() => {
    const savedView = localStorage.getItem('viewMode');
    if (savedView && (savedView === 'grid' || savedView === 'list' || savedView === 'group')) setViewMode(savedView);
    else if (user?.role === 'admin') setViewMode('list');
  }, [user]);

  // use Memo not working for hook, used this for mobile
  useEffect(() => {
    if (device === 'mobile') setViewMode('grid');
  }, [device]);

  const changeViewMode = useCallback((_viewMode: TViewMode) => {
    setViewMode(_viewMode);
    localStorage.setItem('viewMode', _viewMode);
  }, []);

  const viewIcon = useMemo(
    () => ({
      grid: <GridIcon boxSize="18px" stroke="currentColor" />,
      list: <ListIcon boxSize="18px" stroke="currentColor" />,
      group: <GroupIcon boxSize="18px" stroke="currentColor" />,
    }),
    [],
  );

  if (device === 'mobile') return null;

  return (
    <Menu autoSelect={false}>
      {
        // @ts-ignore: Issue inside ChakraUI
        <MenuButton
          _active={{}}
          _hover={{}}
          as={Button}
          bg="complianceItems.header.menuButtonBg"
          fontSize="14px"
          fontWeight="700"
          h="40px"
          ml={['15px', '0']}
          rightIcon={<ChevronRight color="complianceItems.header.rightIcon" h="12px" mt="3px" transform="rotate(90deg)" w="12px" />}
          rounded="10px"
        >
          <Stack direction="row" spacing={2}>
            {viewIcon[viewMode]}
            <Text fontSize="smm" fontWeight="semi_medium">
              Change view
            </Text>
          </Stack>
        </MenuButton>
      }
      <MenuList border="none" boxShadow="simple" rounded="lg" w="100px" zIndex={2}>
        {views.includes('grid') && (
          <MenuItem
            _focus={{ color: 'complianceItems.header.menuItemFocus' }}
            color={viewMode === 'grid' ? 'complianceItems.header.menuItemFontSelected' : 'complianceItems.header.menuItemFont'}
            fontSize="14px"
            onClick={() => changeViewMode('grid')}
          >
            <GridIcon mr={3} stroke="currentColor" />
            Card
          </MenuItem>
        )}
        {views.includes('list') && (
          <MenuItem
            _focus={{ color: 'complianceItems.header.menuItemFocus' }}
            color={viewMode === 'list' ? 'complianceItems.header.menuItemFontSelected' : 'complianceItems.header.menuItemFont'}
            fontSize="14px"
            onClick={() => changeViewMode('list')}
          >
            <ListIcon mr={3} stroke="currentColor" />
            List
          </MenuItem>
        )}
        {views.includes('group') && (
          <MenuItem
            _focus={{ color: 'complianceItems.header.menuItemFocus' }}
            color={viewMode === 'group' ? 'complianceItems.header.menuItemFontSelected' : 'complianceItems.header.menuItemFont'}
            fontSize="14px"
            onClick={() => changeViewMode('group')}
          >
            <GroupIcon mr={3} stroke="currentColor" />
            Group
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

export default ChangeViewButton;
