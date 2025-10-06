import { useCallback, useEffect, useMemo } from 'react';

import { IconButton, Stack, Tooltip } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import useDevice from '../hooks/useDevice';
import { GridIcon, GroupIcon, ListIcon } from '../icons';
import { TViewMode } from '../interfaces/TViewMode';
import PanelIcon from '../icons/PanelIcon';

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
    const savedView = localStorage.getItem('viewMode') as TViewMode;
    if (savedView && ['grid', 'list', 'group'].includes(savedView) && views.includes(savedView))
      setViewMode(savedView);
    else if (user?.role === 'admin') setViewMode('list');
    else setViewMode(viewMode);
  }, [user]);

  useEffect(() => {
    if (device === 'mobile') setViewMode('grid');
  }, [device]);

  const changeViewMode = useCallback((_viewMode: TViewMode) => {
    setViewMode(_viewMode);
    localStorage.setItem('viewMode', _viewMode);
  }, []);

  const viewIcon = useMemo(
    () => ({
      grid: GridIcon,
      list: ListIcon,
      group: GroupIcon,
      panel: PanelIcon
    }),
    [],
  );

  if (device === 'mobile') return null;

  return (
    <Stack
      align="center"
      data-id="000213"
      direction="row"
      ml={['15px', '0']}
      spacing={2}>
      {views.map((mode) => {
        const Icon = viewIcon[mode];
        return (
          <Tooltip
            data-id="000214"
            key={mode}
            label={`Switch to ${mode} view`}
            placement="top">
            <IconButton
              _hover={{ bg: 'gray.100' }}
              aria-label={mode}
              bg={viewMode === mode ? '#F3F0FE' : 'trackerItems.header.menuButtonBg'}
              border={viewMode === mode ?"1px solid #462AC4 ":"1px solid #CBD5E0 "}
              borderRadius={"md"}
              color={viewMode === mode ? '#462AC4' : 'gray.500'}
              data-id="000215"
              icon={<Icon boxSize="18px" data-id="000216" stroke="currentColor" />}
              onClick={() => changeViewMode(mode)}
              rounded="md"
              size="md"
              variant="ghost" />
          </Tooltip>
        );
      })}
    </Stack>
  );
}

export default ChangeViewButton;
