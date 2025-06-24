import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import { Conforme } from '../icons';
import { IModule } from '../interfaces/IModule';
import { getInitials } from '../utils/helpers';

function ModuleSwitcher() {
  const { organizationConfig, module, setModule } = useAppContext();
  const { showFiltersPanel } = useFiltersContext();
  const [isTabletWidth] = useMediaQuery('(min-width: 748px) and (max-width: 1279px)');
  const [isMobile] = useMediaQuery('(max-width: 747px)');
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
    <Box data-id="fd295d0a3c18" pl={2}>
      <Menu>
       <MenuButton
          _active={{ bg: "navigationLeftItem.unselectedLabelBg" }}
          _hover={{  bg: !isMobile && "navigationLeftItem.selectedLabelBg"}}
          as={Button}
          bg="navigationLeftItem.unselectedLabelBg"
          minW="200px"
          px="0"
          variant="ghost"
          w="auto"
          >
          <Flex align="center" justify={isMobile ? "flex-start" : "space-between"} w="100%">
            {!isTabletWidth && !showFiltersPanel && (
              <Icon
                as={Conforme}
                data-id="5eff0a6971bc"
                h="30px"
                w="30px"/>
            )}

            {!isTabletWidth && !showFiltersPanel && !isMobile && (
            <Box
              bg="white"
              h="28px"
              ml="3"
              mr="1"
              opacity="44%"
              w="1px"
            />
          )}
              
          <Text
            color={isMobile ? 'navigationLeftItem.selectedLabelBg' : 'white'}
            display="inline-block"
            fontSize={isMobile ? '12px' : '22px'}
            fontWeight="600"
            isTruncated
            marginLeft={showFiltersPanel || isTabletWidth ? '10' : '2'}
            maxW="150px"
            minW={isMobile ? '50px' : '100px'}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {showFiltersPanel || isTabletWidth
                ? <>
                   <Icon
                    as={Conforme}
                    data-id="5eff0a6971bc"
                    h="30px"
                    w="30px"/>
                </>
              : (module?.name || 'Select Module')}
          </Text>
          <ChevronDownIcon ml="2" />
        </Flex>
      </MenuButton>

        <MenuList zIndex={100}>
          {modulesInNavigation.map((m) => (
            <MenuItem
              bg={m.path === module?.path ? 'moduleSwitcher.button.active' : 'transparent'}
              color={m.path === module?.path ? 'moduleSwitcher.button.text.active' : 'inherit'} 
              key={m.path}
              onClick={() => chooseModule(m)}
            >
              <Flex align="center" gap="2">
                <Text fontSize={isMobile ? '10px' : '14px'} fontWeight="bold">{getInitials(m.name)}</Text>
                <Text fontSize={isMobile ? '10px' : '14px'}>{m.name}</Text>
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
    background: '#09051B',
    button: {
      default: '#462AC4',
      active: '#110B30',
      text: {
        default: '#000000',
        active: '#ffffff',
      },
    },
  },
};

export default ModuleSwitcher;
