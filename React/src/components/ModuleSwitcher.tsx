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
  const [isTabletWidth] = useMediaQuery('(min-width: 768px) and (max-width: 1279px)', { ssr: false });
  const [isMobile] = useMediaQuery('(max-width: 768px)', { ssr: false });
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
          _active={{ bg: "transparent" }}
          _hover={{  bg: !isMobile && "navigationLeftItem.selectedLabelBg"}}
          as={Button}
          bg={isMobile ? "#FFFFFF" : "#110b30" }
          h="60px"
          minW={isMobile ? "150px" : "200px"}
          px="2"
          textAlign="left"
          variant="ghost"
          w="auto"
          >
          <Flex align="flex-start" gap="2" justify={isMobile ? "flex-start" : "space-between"} w="100%">
            {!isTabletWidth && !showFiltersPanel && (
              <Box alignItems="center" alignSelf="center" display="flex">
                <Icon
                  as={Conforme}
                  data-id="5eff0a6971bc"
                  h="30px"
                  w="30px"/>
              </Box>
            )}

            {!isTabletWidth && !showFiltersPanel && !isMobile && (
            <Box
              alignSelf="center"
              bg="white"
              h="28px"
              ml="3"
              mr="1"
              opacity="44%"
              w="1px"
            />
          )}
              
          <Flex
            align="center"
            flex="1"
            marginLeft={showFiltersPanel || isTabletWidth ? '20' : '2'}
            maxW={isMobile ? "120px" : "145px"}
            minW={isMobile ? '50px' : '120px'}
          >
            <Text
              as="div"
              color={isMobile ? 'navigationLeftItem.selectedLabelBg' : 'white'}
              fontSize={isMobile ? '12px' : '22px'}
              fontWeight="600"
              justifyContent={isMobile ? "center" : "left"}
              lineHeight={isMobile ? '1.2' : '1.15'}
              maxH={isMobile ? "29px" : "58px"}
              overflow="hidden"
              pt={"2px"}
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
              }}
              whiteSpace="normal"
              wordBreak="break-word"
            >
              {showFiltersPanel || isTabletWidth
                  ? <Flex pl={"18px"}>
                     <Icon
                      as={Conforme}
                      data-id="5eff0a6971bc"
                      h="30px"
                      w="30px"/>
                  </Flex>
                : ( isMobile? <Flex pt="6px">{getInitials(module?.name)}</Flex> : module?.name || 'Select Module')}
            </Text>
          </Flex>
          <Box alignItems="center" alignSelf="center" display="flex">
            <ChevronDownIcon color="moduleSwitcher.button.text.active" h="24px" w="24px"/>
          </Box>
        </Flex>
      </MenuButton>

        <MenuList zIndex={100}>
          {modulesInNavigation.map((m) => (
            <MenuItem
              _hover={{ bg: 'moduleSwitcher.button.active', color: 'moduleSwitcher.button.text.active', opacity: 0.8 }}
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
