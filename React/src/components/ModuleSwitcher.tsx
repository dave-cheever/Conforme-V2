import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { CheckIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Text, useMediaQuery } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import { Conforme, ConformeNew, ExternalLink } from '../icons';
import ModuleSwitcherIcon from '../icons/ModuleSwitcherIcon';
import { IModule } from '../interfaces/IModule';
import { getInitials } from '../utils/helpers';
import { getIconByName } from '../utils/getIconByName';

interface ModuleSwitcherProps {
  readonly enforceDesktop?: boolean;
}

// Helper function to get display content for multiple modules menu
function getMultipleModulesDisplayContent(
  showFiltersPanel: boolean,
  isTabletWidth: boolean,
  enforceDesktop: boolean | undefined,
  isMobile: boolean,
  module: IModule | null,
): React.ReactNode {
  if (showFiltersPanel || (isTabletWidth && !enforceDesktop)) {
    return (
      <Flex data-id="000430" >
        <Icon as={Conforme} data-id="000431" h="30px" w="30px" />
      </Flex>
    );
  }

  if (isMobile) {
    return (
      <Flex data-id="000432" pt="6px">
        {getInitials(module?.name)}
      </Flex>
    );
  }

  return module?.name || 'Select Module';
}

// Helper function to get display content for single module
function getSingleModuleDisplayContent(
  showFiltersPanel: boolean,
  isTabletWidth: boolean,
  enforceDesktop: boolean | undefined,
  isMobile: boolean,
  module: IModule | null,
): React.ReactNode {
  if (showFiltersPanel || (isTabletWidth && !enforceDesktop)) {
    return (
      <Flex data-id="000446">
        <Icon as={Conforme} data-id="000447" h="30px" w="30px" />
      </Flex>
    );
  }

  if (isMobile) {
    return (
      <Flex data-id="000448" pt="6px">
        {getInitials(module?.name)}
      </Flex>
    );
  }

  return module?.name;
}

// Component for module menu item
function ModuleMenuItem({
  module,
  currentModule,
  isMobile,
  isDashboardPath,
  onChooseModule,
}: {
  readonly module: IModule;
  readonly currentModule: IModule | null;
  readonly isMobile: boolean;
  readonly isDashboardPath: boolean;
  readonly onChooseModule: (module: IModule) => void;
}) {
  const isActive = module.path === currentModule?.path && !isDashboardPath;

  return (
    <MenuItem
      _hover={{ bg: '#EDF2F7' }}
      key={module.path}
      bg={isActive ? '#EBF3F8' : 'transparent'}
      color={isActive ? 'gray.800' : 'inherit'}
      borderColor={isActive ? '#015F9D' : 'transparent'}
      borderWidth={isActive ? '1px' : '0'}
      data-id="000436"
      borderRadius={8}
      px={3}
      py={2}
      mb={2}
      onClick={() => onChooseModule(module)}
    >
      <Flex data-id="003080" align="center" justify="space-between" w="100%">
        <Flex data-id="003081" align="center" gap="3" flex="1" minW="0">
          <Icon as={getIconByName(module.icon)} data-id="000447" h="20px" w="20px" fontWeight="400" flexShrink={0} />
          <Text
            data-id="000439"
            fontSize={isMobile ? '12px' : '14px'}
            fontWeight="400"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {module.name}
          </Text>
        </Flex>
        {isActive && (
          <Box
            data-id="003082"
            bg="#015F9D"
            borderRadius="9999px"
            h="14px"
            w="14px"
            display="flex"
            alignItems="center"
            justifyContent="center">
            <CheckIcon data-id="003083" color="white" boxSize="7px" />
          </Box>
        )}
        {module.path.startsWith('http') && <Icon data-id="003084" as={ExternalLink} h="16px" w="16px" fontWeight="400" />}
      </Flex>
    </MenuItem>
  );
}

// Component for global view menu item
function GlobalViewMenuItem({ isDashboardPath, isMobile, navigate }: { readonly isDashboardPath: boolean; readonly isMobile: boolean; readonly navigate: (path: string) => void }) {
  return (
    <MenuItem
      _hover={{ bg: '#EDF2F7' }}
      bg={isDashboardPath ? '#EBF3F8' : 'transparent'}
      color={isDashboardPath ? 'gray.800' : 'inherit'}
      borderColor={isDashboardPath ? '#015F9D' : 'transparent'}
      borderWidth={isDashboardPath ? '1px' : '0'}
      data-id="000436"
      borderRadius={8}
      px={3}
      py={2}
      mb={2}
      onClick={() => { navigate('/overview'); }}
    >
      <Flex data-id="003074" align="center" justify="space-between" w="100%">
        <Flex data-id="003075" align="center" gap="3" flex="1" minW="0">
          <Icon as={ConformeNew} data-id="000447" h="20px" w="20px" fontWeight="400" flexShrink={0} />
          <Text
            data-id="000439"
            fontSize={isMobile ? '12px' : '14px'}
            fontWeight="400"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap">
            Governance Suite
          </Text>
        </Flex>
        {isDashboardPath && (
          <Box
            data-id="003076"
            bg="#015F9D"
            borderRadius="9999px"
            h="14px"
            w="14px"
            display="flex"
            alignItems="center"
            justifyContent="center">
            <CheckIcon data-id="003077" color="white" boxSize="7px" />
          </Box>
        )}
      </Flex>
    </MenuItem>
  );
}

// Component for multiple modules menu button content
function MultipleModulesMenuButtonContent({
  showFiltersPanel,
  isTabletWidth,
  enforceDesktop,
  isMobile,
  module,
  showIcon,
  showSeparator,
}: {
  readonly showFiltersPanel: boolean;
  readonly isTabletWidth: boolean;
  readonly enforceDesktop: boolean | undefined;
  readonly isMobile: boolean;
  readonly module: IModule | null;
  readonly showIcon: boolean;
  readonly showSeparator: boolean;
}) {
  const displayContent = getMultipleModulesDisplayContent(showFiltersPanel, isTabletWidth, enforceDesktop, isMobile, module);
  const shouldShowIcon = (!isTabletWidth || enforceDesktop) && !showFiltersPanel;
  const shouldShowSeparator = shouldShowIcon && !isMobile;

  return (
    <Flex align="flex-start" data-id="000424" gap="10px" justify={isMobile ? 'flex-start' : 'space-between'} w="100%">
      {shouldShowIcon && (
        <Box alignItems="center" alignSelf="center" data-id="000425" display="flex">
          <Icon as={Conforme} data-id="000426" h="30px" w="30px" />
        </Box>
      )}

      {shouldShowSeparator && (
        <Box alignSelf="center" bg="white" data-id="000427" h="28px" opacity="44%" w="1px" />
      )}

      <Flex
        align="center"
        data-id="000428"
        flex="1"
      >
        <Text
          as="div"
          color={isMobile ? '#16456F' : 'white'}
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
          wordBreak="break-word"
        >
          {displayContent}
        </Text>
      </Flex>
      {(!isTabletWidth || enforceDesktop) && (
        <Box alignItems="center" alignSelf="center" data-id="000433" display="flex">
          <Icon as={ModuleSwitcherIcon} color="moduleSwitcher.button.text.active" data-id="000434" h="24px" w="24px" />
        </Box>
      )}
    </Flex>
  );
}

// Component for multiple modules menu
function MultipleModulesMenu({
  modulesInNavigation,
  module,
  isMobile,
  isTabletWidth,
  showFiltersPanel,
  enforceDesktop,
  chooseModule,
  isDashboardPath,
  navigate,
}: {
  readonly modulesInNavigation: IModule[];
  readonly module: IModule | null;
  readonly isMobile: boolean;
  readonly isTabletWidth: boolean;
  readonly showFiltersPanel: boolean;
  readonly enforceDesktop: boolean | undefined;
  readonly chooseModule: (module: IModule) => void;
  readonly isDashboardPath: boolean;
  readonly navigate: (path: string) => void;
}) {
  const showIcon = Boolean((!isTabletWidth || enforceDesktop) && !showFiltersPanel);
  const showSeparator = Boolean(showIcon && !isMobile);

  return (
    <Menu data-id="000422">
      <MenuButton
        _active={{ bg: 'transparent' }}
        _hover={{ bg: !isMobile && '#16456F' }}
        as={Button}
        bg={isMobile ? '#FFFFFF' : '#01173E'}
        data-id="000423"
        h="60px"
        textAlign="left"
        variant="ghost"
        w="auto"
      >
        <MultipleModulesMenuButtonContent
          data-id="003340"
          showFiltersPanel={showFiltersPanel}
          isTabletWidth={isTabletWidth}
          enforceDesktop={enforceDesktop}
          isMobile={isMobile}
          module={module}
          showIcon={showIcon}
          showSeparator={showSeparator} />
      </MenuButton>
      <MenuList data-id="000435" zIndex={100} p={2} borderRadius="12px" w="260px">
        <Box data-id="003071" py={2} mb={3}>
          <Text
            data-id="003072"
            fontSize={isMobile ? '12px' : '14px'}
            color="gray.600"
            mb={2}
            px={3}>
            Global view
          </Text>
          <Box data-id="003073" px={3}>
            <GlobalViewMenuItem
              data-id="003341"
              isDashboardPath={isDashboardPath}
              isMobile={isMobile}
              navigate={navigate} />
          </Box>
        </Box>

        <Text
          data-id="003078"
          fontSize={isMobile ? '12px' : '14px'}
          color="gray.600"
          mb={2}
          px={3}>
          Modules
        </Text>
        <Box data-id="003079" px={3}>
          {modulesInNavigation.map((m) => (
            <ModuleMenuItem
              data-id="003342"
              key={m.path}
              module={m}
              currentModule={module}
              isMobile={isMobile}
              isDashboardPath={isDashboardPath}
              onChooseModule={chooseModule} />
          ))}
        </Box>
      </MenuList>
    </Menu>
  );
}

// Component for single module display
function SingleModuleDisplay({
  module,
  isMobile,
  isTabletWidth,
  showFiltersPanel,
  enforceDesktop,
  navigate,
}: {
  readonly module: IModule | null;
  readonly isMobile: boolean;
  readonly isTabletWidth: boolean;
  readonly showFiltersPanel: boolean;
  readonly enforceDesktop: boolean | undefined;
  readonly navigate: (path: string) => void;
}) {
  const displayContent = getSingleModuleDisplayContent(showFiltersPanel, isTabletWidth, enforceDesktop, isMobile, module);
  const shouldShowIcon = (!isTabletWidth || enforceDesktop) && !showFiltersPanel;
  const shouldShowSeparator = shouldShowIcon && !isMobile;

  return (
    <Flex
      align="flex-start"
      alignItems="center"
      data-id="000440"
      gap="2"
      h="60px"
      justify={isMobile ? 'flex-start' : 'space-between'}
      px="2"
      w="100%"
    >
      {shouldShowIcon && (
        <Box alignItems="center" alignSelf="center" data-id="000441" display="flex">
          <Icon as={Conforme} data-id="000442" h="30px" w="30px" />
        </Box>
      )}
      {shouldShowSeparator && (
        <Box alignSelf="center" bg="white" data-id="000443" h="28px" ml="3" mr="1" opacity="44%" w="1px" />
      )}
      <Flex
        align="center"
        data-id="000444"
        flex="1"
        
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
          {displayContent}
        </Text>
      </Flex>
    </Flex>
  );
}

function ModuleSwitcher({ enforceDesktop }: ModuleSwitcherProps) {
  const { organizationConfig, module, setModule } = useAppContext();
  const { showFiltersPanel } = useFiltersContext();
  const [isTabletWidth] = useMediaQuery('(min-width: 768px) and (max-width: 1279px)', { ssr: false });
  const [isMobile] = useMediaQuery('(max-width: 768px)', { ssr: false });
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboardPath = location.pathname === '/overview';

  const modulesInNavigation = useMemo(
    () => organizationConfig?.modules?.filter(({ showInNavigation }) => !!showInNavigation),
    [organizationConfig],
  );

  const chooseModule = (selectedModule: IModule) => {
    // handle external links/modules
    if (selectedModule.type === 'external') {
      window.open(selectedModule.path, '_blank', 'noopener,noreferrer');
      return;
    }

    setModule(selectedModule);
    navigate(`/${selectedModule.path}/dashboard`);
  };

  if (!modulesInNavigation) return null;

  const hasMultipleModules = modulesInNavigation.length > 1;
  const currentModule = module ?? null;

  return (
    <Box data-id="000421">
      {hasMultipleModules ? (
        <MultipleModulesMenu
          data-id="003343"
          modulesInNavigation={modulesInNavigation}
          module={currentModule}
          isMobile={isMobile}
          isTabletWidth={isTabletWidth}
          showFiltersPanel={showFiltersPanel}
          enforceDesktop={enforceDesktop}
          chooseModule={chooseModule}
          isDashboardPath={isDashboardPath}
          navigate={navigate} />
      ) : (
        <SingleModuleDisplay
          data-id="003344"
          module={currentModule}
          isMobile={isMobile}
          isTabletWidth={isTabletWidth}
          showFiltersPanel={showFiltersPanel}
          enforceDesktop={enforceDesktop}
          navigate={navigate} />
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
