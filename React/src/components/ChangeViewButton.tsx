import { useCallback, useEffect, useMemo } from 'react';

import { Button, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import useDevice from '../hooks/useDevice';
import { ChevronRight, GridIcon, GroupIcon, ListIcon } from '../icons';
import { TViewMode } from '../interfaces/TViewMode';

function ChangeViewButton({
  viewMode,
  setViewMode,
  views = [],
}: {
  viewMode: TViewMode;
  setViewMode: (mode: TViewMode) => void;
  views: TViewMode[];
}) {
  const { user } = useAppContext();
  const device = useDevice();
  useEffect(() => {
    const savedView = localStorage.getItem('viewMode');
    if (savedView && (savedView === 'grid' || savedView === 'list' || savedView === 'group') && views.includes(savedView))
      setViewMode(savedView);
    else if (user?.role === 'admin') setViewMode('list');
    else setViewMode(viewMode);
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
      grid: <GridIcon boxSize="18px" data-id="bf88f490ef88" stroke="currentColor" />,
      list: <ListIcon boxSize="18px" data-id="c92a1943e3e6" stroke="currentColor" />,
      group: <GroupIcon boxSize="18px" data-id="c9cc7bcea6bb" stroke="currentColor" />,
    }),
    [],
  );

  if (device === 'mobile') return null;

  return (
    (<Menu autoSelect={false} data-id="6b479c3a5755">
      {
        // @ts-ignore: Issue inside ChakraUI
        <MenuButton
          _active={{}}
          _hover={{}}
          as={Button}
          bg="trackerItems.header.menuButtonBg"
          data-id="337c917c53b7"
          fontSize="14px"
          fontWeight="700"
          h="40px"
          ml={['15px', '0']}
          rightIcon={<ChevronRight
            color="trackerItems.header.rightIcon"
            data-id="bf9f6640f3e8"
            h="12px"
            mt="3px"
            transform="rotate(90deg)"
            w="12px" />}
          rounded="10px">
          <Stack data-id="6b5cd6efffee" direction="row" spacing={2}>
            {viewIcon[viewMode]}
            <Text data-id="69ccc97d8b32" fontSize="smm" fontWeight="semi_medium">
              Change view
            </Text>
          </Stack>
        </MenuButton>
      }
      <MenuList
        border="none"
        boxShadow="simple"
        data-id="52b9e0a30437"
        rounded="lg"
        w="100px"
        zIndex={2}>
        {views.includes('grid') && (
          <MenuItem
            _focus={{ color: 'trackerItems.header.menuItemFocus' }}
            color={viewMode === 'grid' ? 'trackerItems.header.menuItemFontSelected' : 'trackerItems.header.menuItemFont'}
            data-id="6bf9a5ee78fa"
            fontSize="14px"
            onClick={() => changeViewMode('grid')}>
            <GridIcon data-id="3631e5eeb11b" mr={3} stroke="currentColor" />
            Card
          </MenuItem>
        )}
        {views.includes('list') && (
          <MenuItem
            _focus={{ color: 'trackerItems.header.menuItemFocus' }}
            color={viewMode === 'list' ? 'trackerItems.header.menuItemFontSelected' : 'trackerItems.header.menuItemFont'}
            data-id="05fb47eb9c5f"
            fontSize="14px"
            onClick={() => changeViewMode('list')}>
            <ListIcon data-id="9b1222c076df" mr={3} stroke="currentColor" />
            List
          </MenuItem>
        )}
        {views.includes('group') && (
          <MenuItem
            _focus={{ color: 'trackerItems.header.menuItemFocus' }}
            color={viewMode === 'group' ? 'trackerItems.header.menuItemFontSelected' : 'trackerItems.header.menuItemFont'}
            data-id="052355fe6905"
            fontSize="14px"
            onClick={() => changeViewMode('group')}>
            <GroupIcon data-id="11e425c7cdd0" mr={3} stroke="currentColor" />
            Group
          </MenuItem>
        )}
      </MenuList>
    </Menu>)
  );
}

export default ChangeViewButton;
