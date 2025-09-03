import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Text, useMediaQuery } from '@chakra-ui/react';

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

  if (!modulesInNavigation) return null;

  const hasMultipleModules = modulesInNavigation.length > 1;

  return (
    <Box data-id="030925-16c3e6" pl={2}>
      {hasMultipleModules ? (
        <Menu data-id="030925-28138a">
          <MenuButton
            data-id="030925-8ebb86"
            _active={{ bg: 'transparent' }}
            _hover={{ bg: !isMobile && 'navigationLeftItem.selectedLabelBg' }}
            as={Button}
            bg={isMobile ? '#FFFFFF' : '#110b30'}
            h="60px"
            minW={isMobile ? '150px' : '200px'}
            px="2"
            textAlign="left"
            variant="ghost"
            w="auto">
            <Flex
              data-id="030925-4f69f4"
              align="flex-start"
              gap="2"
              justify={isMobile ? 'flex-start' : 'space-between'}
              w="100%">
              {!isTabletWidth && !showFiltersPanel && (
                <Box
                  data-id="030925-0cdce3"
                  alignItems="center"
                  alignSelf="center"
                  display="flex">
                  <Icon data-id="030925-16a755" as={Conforme} h="30px" w="30px" />
                </Box>
              )}

              {!isTabletWidth && !showFiltersPanel && !isMobile && (
                <Box
                  data-id="030925-c0a51c"
                  alignSelf="center"
                  bg="white"
                  h="28px"
                  ml="3"
                  mr="1"
                  opacity="44%"
                  w="1px" />
              )}

              <Flex
                data-id="030925-f56de5"
                align="center"
                flex="1"
                marginLeft={showFiltersPanel || isTabletWidth ? '20' : '2'}
                maxW={isMobile ? '120px' : '145px'}
                minW={isMobile ? '50px' : '120px'}>
                <Text
                  data-id="030925-8ecbff"
                  as="div"
                  color={isMobile ? 'navigationLeftItem.selectedLabelBg' : 'white'}
                  fontSize={isMobile ? '18px' : '22px'}
                  fontWeight="600"
                  justifyContent={isMobile ? 'center' : 'left'}
                  lineHeight={isMobile ? '1.2' : '1.15'}
                  maxH={isMobile ? '29px' : '58px'}
                  overflow="hidden"
                  pt={isMobile ? '0px' : '2px'}
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    textOverflow: 'ellipsis',
                  }}
                  whiteSpace="normal"
                  wordBreak="break-word">
                  {showFiltersPanel || isTabletWidth ? (
                    <Flex data-id="030925-325006" pl={'18px'}>
                      <Icon data-id="030925-c7df8a" as={Conforme} h="30px" w="30px" />
                    </Flex>
                  ) : isMobile ? (
                    <Flex data-id="030925-0c41bc" pt="6px">{getInitials(module?.name)}</Flex>
                  ) : (
                    module?.name || 'Select Module'
                  )}
                </Text>
              </Flex>
              <Box
                data-id="030925-5bbf02"
                alignItems="center"
                alignSelf="center"
                display="flex">
                <ChevronDownIcon
                  data-id="030925-7dd703"
                  color="moduleSwitcher.button.text.active"
                  h="24px"
                  w="24px" />
              </Box>
            </Flex>
          </MenuButton>

          <MenuList data-id="030925-628f22" zIndex={100}>
            {modulesInNavigation.map((m) => (
              <MenuItem
                data-id="030925-bd38df"
                _hover={{ bg: 'moduleSwitcher.button.active', color: 'moduleSwitcher.button.text.active', opacity: 0.8 }}
                bg={m.path === module?.path ? 'moduleSwitcher.button.active' : 'transparent'}
                color={m.path === module?.path ? 'moduleSwitcher.button.text.active' : 'inherit'}
                key={m.path}
                onClick={() => chooseModule(m)}>
                <Flex data-id="030925-d6f67b" align="center" gap="2">
                  <Text
                    data-id="030925-bb14a7"
                    fontSize={isMobile ? '12px' : '14px'}
                    fontWeight="bold">
                    {getInitials(m.name)}
                  </Text>
                  <Text data-id="030925-91b906" fontSize={isMobile ? '12px' : '14px'}>{m.name}</Text>
                </Flex>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      ) : (
        // Single module display - no dropdown
        (<Flex
          data-id="030925-3c91fc"
          align="flex-start"
          alignItems="center"
          gap="2"
          h="60px"
          justify={isMobile ? 'flex-start' : 'space-between'}
          px="2"
          w="100%">
          {!isTabletWidth && !showFiltersPanel && (
            <Box
              data-id="030925-efee0f"
              alignItems="center"
              alignSelf="center"
              display="flex">
              <Icon data-id="030925-0b41ea" as={Conforme} h="30px" w="30px" />
            </Box>
          )}
          {!isTabletWidth && !showFiltersPanel && !isMobile && (
            <Box
              data-id="030925-33e532"
              alignSelf="center"
              bg="white"
              h="28px"
              ml="3"
              mr="1"
              opacity="44%"
              w="1px" />
          )}
          <Flex
            data-id="030925-4dd424"
            align="center"
            flex="1"
            marginLeft={showFiltersPanel || isTabletWidth ? '20' : '2'}
            maxW={isMobile ? '120px' : '145px'}
            minW={isMobile ? '50px' : '120px'}
          >
            <Text
              data-id="030925-305e34"
              as="div"
              color={isMobile ? 'navigationLeftItem.selectedLabelBg' : 'white'}
              fontSize={isMobile ? '18px' : '22px'}
              fontWeight="600"
              justifyContent={isMobile ? 'center' : 'left'}
              lineHeight={isMobile ? '1.2' : '1.15'}
              maxH={isMobile ? '29px' : '58px'}
              onClick={() => {
                navigate(`/${module?.path}`);
              }}
              overflow="hidden"
              pt={isMobile ? '0px' : '2px'}
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
              }}
              whiteSpace="normal"
              wordBreak="break-word"
            >
              {showFiltersPanel || isTabletWidth ? (
                <Flex data-id="030925-ed2fc8">
                  <Icon data-id="030925-e459da" as={Conforme} h="30px" w="30px" />
                </Flex>
              ) : isMobile ? (
                <Flex data-id="030925-260b0d" pt="6px">{getInitials(module?.name)}</Flex>
              ) : (
                module?.name
              )}
            </Text>
          </Flex>
        </Flex>)
      )}
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
