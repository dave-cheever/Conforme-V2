import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
 useMediaQuery } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import { IModule } from '../interfaces/IModule';
import { getInitials } from '../utils/helpers';

function ModuleSwitcher() {
  const { organizationConfig, module, setModule } = useAppContext();
  const { showFiltersPanel } = useFiltersContext();
  const [isTabletWidth] = useMediaQuery('(min-width: 748px) and (max-width: 1279px)');
  const navigate = useNavigate();

  const modulesInNavigation = useMemo(
    () => organizationConfig?.modules?.filter(({ showInNavigation }) => !!showInNavigation),
    [organizationConfig],
  );

  const chooseModule = (selectedModule: IModule) => {
    setModule(selectedModule);
    navigate(`/${selectedModule.path}`);
  };

  if (!modulesInNavigation || modulesInNavigation.length < 2) return null;

  return (
    <Box data-id="fd295d0a3c18">
      <Menu>
      <MenuButton as={Button} minW="200px" px="4" variant="ghost" w="auto">
        <Flex align="center" justify="space-between" w="100%">
          <Text
            display="inline-block"
            isTruncated
            marginLeft={showFiltersPanel || isTabletWidth ? '10' : '2'}
            maxW="150px"
            minW="100px"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {showFiltersPanel || isTabletWidth
              ? getInitials(module?.name)
              : (module?.name || 'Select Module')}
          </Text>
          <ChevronDownIcon ml="2" />
        </Flex>
      </MenuButton>

        <MenuList zIndex={100}>
          {modulesInNavigation.map((m) => (
            <MenuItem
              _hover={{ bg: 'gray.100', color: 'black' }}
              bg={m.path === module?.path ? 'moduleSwitcher.button.active' : 'transparent'}
              color={m.path === module?.path ? 'moduleSwitcher.button.text.active' : 'inherit'} 
              key={m.path}
              onClick={() => chooseModule(m)}
            >
              <Flex align="center" gap="2">
                <Text fontWeight="bold">{getInitials(m.name)}</Text>
                <Text>{m.name}</Text>
              </Flex>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
}

export const moduleSwitcherStyles = {
  moduleSwitcher: {
    background: '#efefef',
    button: {
      default: '#f5f5f5',
      active: '#462AC4',
      text: {
        default: '#000000',
        active: '#ffffff',
      },
    },
  },
};

export default ModuleSwitcher;
