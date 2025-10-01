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
    <Box data-id="000421" pl={2}>
      {hasMultipleModules ? (
        <Menu data-id="000422">
          <MenuButton
            _active={{ bg: 'transparent' }}
            _hover={{ bg: !isMobile && 'navigationLeftItem.selectedLabelBg' }}
            as={Button}
            bg={isMobile ? '#FFFFFF' : '#110b30'}
            data-id="000423"
            h="60px"
            minW={isMobile ? '150px' : '200px'}
            px="2"
            textAlign="left"
            variant="ghost"
            w="auto">
            <Flex
              align="flex-start"
              data-id="000424"
              gap="2"
              justify={isMobile ? 'flex-start' : 'space-between'}
              w="100%">
              {!isTabletWidth && !showFiltersPanel && (
                <Box
                  alignItems="center"
                  alignSelf="center"
                  data-id="000425"
                  display="flex">
                  <Icon as={Conforme} data-id="000426" h="30px" w="30px" />
                </Box>
              )}

              {!isTabletWidth && !showFiltersPanel && !isMobile && (
                <Box
                  alignSelf="center"
                  bg="white"
                  data-id="000427"
                  h="28px"
                  ml="3"
                  mr="1"
                  opacity="44%"
                  w="1px" />
              )}

              <Flex
                align="center"
                data-id="000428"
                flex="1"
                marginLeft={showFiltersPanel || isTabletWidth ? '20' : '2'}
                maxW={isMobile ? '120px' : '145px'}
                minW={isMobile ? '50px' : '120px'}>
                <Text
                  as="div"
                  color={isMobile ? 'navigationLeftItem.selectedLabelBg' : 'white'}
                  data-id="000429"
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
                    <Flex data-id="000430" pl={'18px'}>
                      <Icon as={Conforme} data-id="000431" h="30px" w="30px" />
                    </Flex>
                  ) : isMobile ? (
                    <Flex data-id="000432" pt="6px">{getInitials(module?.name)}</Flex>
                  ) : (
                    module?.name || 'Select Module'
                  )}
                </Text>
              </Flex>
              <Box
                alignItems="center"
                alignSelf="center"
                data-id="000433"
                display="flex">
                <ChevronDownIcon
                  color="moduleSwitcher.button.text.active"
                  data-id="000434"
                  h="24px"
                  w="24px" />
              </Box>
            </Flex>
          </MenuButton>

          <MenuList data-id="000435" zIndex={100}>
            {modulesInNavigation.map((m) => (
              <MenuItem
                _hover={{ bg: 'moduleSwitcher.button.active', color: 'moduleSwitcher.button.text.active', opacity: 0.8 }}
                bg={m.path === module?.path ? 'moduleSwitcher.button.active' : 'transparent'}
                color={m.path === module?.path ? 'moduleSwitcher.button.text.active' : 'inherit'}
                data-id="000436"
                key={m.path}
                onClick={() => chooseModule(m)}>
                <Flex align="center" data-id="000437" gap="2">
                  <Text
                    data-id="000438"
                    fontSize={isMobile ? '12px' : '14px'}
                    fontWeight="bold">
                    {getInitials(m.name)}
                  </Text>
                  <Text data-id="000439" fontSize={isMobile ? '12px' : '14px'}>{m.name}</Text>
                </Flex>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      ) : (
        // Single module display - no dropdown
        (<Flex
          align="flex-start"
          alignItems="center"
          data-id="000440"
          gap="2"
          h="60px"
          justify={isMobile ? 'flex-start' : 'space-between'}
          px="2"
          w="100%">
          {!isTabletWidth && !showFiltersPanel && (
            <Box
              alignItems="center"
              alignSelf="center"
              data-id="000441"
              display="flex">
              <Icon as={Conforme} data-id="000442" h="30px" w="30px" />
            </Box>
          )}
          {!isTabletWidth && !showFiltersPanel && !isMobile && (
            <Box
              alignSelf="center"
              bg="white"
              data-id="000443"
              h="28px"
              ml="3"
              mr="1"
              opacity="44%"
              w="1px" />
          )}
          <Flex
            align="center"
            data-id="000444"
            flex="1"
            marginLeft={showFiltersPanel || isTabletWidth ? '20' : '2'}
            maxW={isMobile ? '120px' : '145px'}
            minW={isMobile ? '50px' : '120px'}
          >
            <Text
              as="div"
              color={isMobile ? 'navigationLeftItem.selectedLabelBg' : 'white'}
              data-id="000445"
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
                <Flex data-id="000446">
                  <Icon as={Conforme} data-id="000447" h="30px" w="30px" />
                </Flex>
              ) : isMobile ? (
                <Flex data-id="000448" pt="6px">{getInitials(module?.name)}</Flex>
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
