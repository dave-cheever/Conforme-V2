import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Text, useMediaQuery } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import { Conforme } from '../icons';
import { IModule } from '../interfaces/IModule';
import { getInitials } from '../utils/helpers';

// Helper functions to reduce cognitive complexity
const getDisplayContent = (isTabletWidth: boolean, isMobile: boolean, module: IModule | null, enforceDesktop?: boolean) => {
  
  if (enforceDesktop) {
    return module?.name || 'Select Module';
  }

  if (isTabletWidth) {
    return (
      <Text fontSize='20px' fontWeight='700' data-id="000442" pl={0}>
        {getInitials(module?.name)}
      </Text>
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
};

const getSingleModuleDisplayContent = (isTabletWidth: boolean, isMobile: boolean, module: IModule | null) => {
  if (isTabletWidth) {
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
};

const getTextStyles = (isMobile: boolean) => ({
  color: isMobile ? 'navigationLeftItem.selectedLabelBg' : 'white',
  fontSize: '16px',
  fontWeight: '600',
  justifyContent: isMobile ? 'center' : 'left',
  lineHeight: isMobile ? '1.2' : '1.15',
  maxH: isMobile ? '29px' : '58px',
  pt: isMobile ? '0px' : '2px',
});

const getSingleModuleTextStyles = (isMobile: boolean) => ({
  color: isMobile ? 'navigationLeftItem.selectedLabelBg' : 'white',
  fontSize: isMobile ? '18px' : '22px',
  fontWeight: '600',
  justifyContent: isMobile ? 'center' : 'left',
  lineHeight: isMobile ? '1.2' : '1.15',
  maxH: isMobile ? '29px' : '58px',
  pt: isMobile ? '0px' : '2px',
});

// Component for the Conforme icon
const ConformeIcon = ({ dataId }: { dataId: string }) => (
  <Box
    alignItems="center"
    alignSelf="center"
    data-id={dataId}
    display="flex">
    <Icon as={Conforme} data-id={`${dataId}-icon`} h="30px" w="30px" />
  </Box>
);

// Component for the separator line
const SeparatorLine = ({ dataId, ml = "2" }: { dataId: string; ml?: string }) => (
  <Box
    alignSelf="center"
    bg="white"
    data-id={dataId}
    h="28px"
    ml={ml}
    mr="1"
    opacity="44%"
    w="1px" />
);

// Component for the chevron down icon
const ChevronIcon = () => (
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
);

// Component for module menu items
const ModuleMenuItem = ({
  module,
  currentModule,
  isMobile,
  onChooseModule
}: {
  module: IModule;
  currentModule: IModule | null;
  isMobile: boolean;
  onChooseModule: (module: IModule) => void;
}) => {
  const isActive = module.path === currentModule?.path;

  return (
    <MenuItem
      _hover={{
        bg: isActive ? 'transparent' : 'navigationLeftItem.hoverLabelBg',
        color: 'moduleSwitcher.button.text.active',
        opacity: isActive ? 1 : 0.8
      }}
      bg={isActive ? 'moduleSwitcher.button.active' : 'transparent'}
      color={isActive ? 'moduleSwitcher.button.text.active' : 'inherit'}
      data-id="000436"
      key={module.path}
      onClick={() => onChooseModule(module)}>
      <Flex align="center" data-id="000437" gap="2">
        <Text
          data-id="000438"
          fontSize={isMobile ? '12px' : '14px'}
          fontWeight="bold">
          {getInitials(module.name)}
        </Text>
        <Text data-id="000439" fontSize={isMobile ? '12px' : '14px'}>
          {module.name}
        </Text>
      </Flex>
    </MenuItem>
  );
};

// Helper to get text wrapper styles
const getTextWrapperSx = () => ({
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  textOverflow: 'ellipsis',
});

// Component for MenuButton content
const MenuButtonContent = ({
  showIcon,
  showSeparator,
  isMobile,
  isTabletWidth,
  enforceDesktop,
  displayContent
}: {
  showIcon: boolean;
  showSeparator: boolean;
  isMobile: boolean;
  isTabletWidth: boolean;
  enforceDesktop?: boolean;
  displayContent: React.ReactNode;
}) => (
  <Flex
    align="center"
    data-id="000424"
    flexDirection="row"
    gap="2"
    justify="space-between"
    w="100%">
    <Flex
      align="center"
      data-id="000424-inner"
      gap="2"
      justify={isMobile ? 'flex-start' : 'space-between'}
      w="100%">
      {showIcon && <ConformeIcon dataId="000425" data-id="002840" />}
      {showSeparator && <SeparatorLine dataId="000427" data-id="002841" />}
      <Flex
        align="center"
        data-id="000428"
        flex="1"
        marginLeft={0}
        maxW={isMobile ? '120px' : '145px'}
        minW={isMobile ? '50px' : '120px'}>
        <Text
          as="div"
          data-id="000429"
          overflow="hidden"
          sx={getTextWrapperSx()}
          whiteSpace="normal"
          wordBreak="break-word"
          {...getTextStyles(isMobile)}>
          {displayContent}
        </Text>
      </Flex>
    </Flex>
    {(enforceDesktop || !isTabletWidth) && <ChevronIcon data-id="002842" />}
  </Flex>
);

// Component for single module display
const SingleModuleDisplay = ({
  showIcon,
  showSeparator,
  isTabletWidth,
  isMobile,
  module,
  navigate
}: {
  showIcon: boolean;
  showSeparator: boolean;
  isTabletWidth: boolean;
  isMobile: boolean;
  module: IModule | null;
  navigate: (path: string) => void;
}) => (
  <Flex
    align="flex-start"
    alignItems="center"
    data-id="000440"
    gap="2"
    h="60px"
    justify={isMobile ? 'flex-start' : 'space-between'}
    px="2"
    w="100%">
    {showIcon && <ConformeIcon dataId="000441" data-id="002844" />}
    {showSeparator && <SeparatorLine dataId="000443" data-id="002845" ml="3" />}
    <Flex
      align="center"
      data-id="000444"
      flex="1"
      marginLeft={isTabletWidth ? '20' : '2'}
      maxW={isMobile ? '120px' : '145px'}
      minW={isMobile ? '50px' : '120px'}>
      <Text
        as="div"
        data-id="000445"
        onClick={() => navigate(`/${module?.path}`)}
        overflow="hidden"
        sx={getTextWrapperSx()}
        whiteSpace="normal"
        wordBreak="break-word"
        {...getSingleModuleTextStyles(isMobile)}>
        {getSingleModuleDisplayContent(isTabletWidth, isMobile, module)}
      </Text>
    </Flex>
  </Flex>
);

// Component for multiple modules menu
const MultipleModulesMenu = ({
  modulesInNavigation,
  module,
  isMobile,
  isTabletWidth,
  showIcon,
  showSeparator,
  enforceDesktop,
  displayContent,
  chooseModule
}: {
  modulesInNavigation: IModule[];
  module: IModule | null;
  isMobile: boolean;
  isTabletWidth: boolean;
  showIcon: boolean;
  showSeparator: boolean;
  enforceDesktop?: boolean;
  displayContent: React.ReactNode;
  chooseModule: (module: IModule) => void;
}) => (
  <Menu data-id="000422">
    <MenuButton
      _active={{ bg: 'transparent' }}
      _hover={{
        bg: !isMobile && 'navigationLeftItem.hoverLabelBg',
        cursor: 'pointer'
      }}
      as={Button}
      bg={isMobile ? '#FFFFFF' : '#01173E'}
      data-id="000423"
      h="60px"
      minW={isMobile ? '150px' : '200px'}
      px="2"
      textAlign="left"
      variant="ghost"
      w="full">
      <MenuButtonContent
        data-id="002906"
        displayContent={displayContent}
        enforceDesktop={enforceDesktop}
        isMobile={isMobile}
        isTabletWidth={isTabletWidth}
        showIcon={showIcon}
        showSeparator={showSeparator} />
    </MenuButton>
    <MenuList data-id="000435" zIndex={100}>
      {modulesInNavigation.map((m) => (
        <ModuleMenuItem
          data-id="002843"
          key={m.path}
          module={m}
          currentModule={module}
          isMobile={isMobile}
          onChooseModule={chooseModule}
        />
      ))}
    </MenuList>
  </Menu>
);

function ModuleSwitcher({ enforceDesktop }: { readonly enforceDesktop?: boolean }) {
  const { organizationConfig, module, setModule } = useAppContext();
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
  const showIcon = enforceDesktop ? true : !isTabletWidth;
  const showSeparator = enforceDesktop ? true : (showIcon && !isMobile);
  const displayContent = getDisplayContent(isTabletWidth, isMobile, module || null, enforceDesktop);

  return (
    <Box data-id="000421" width={'full'}>
      {hasMultipleModules ? (
        <MultipleModulesMenu
          data-id="002907"
          chooseModule={chooseModule}
          displayContent={displayContent}
          enforceDesktop={enforceDesktop}
          isMobile={isMobile}
          isTabletWidth={isTabletWidth}
          module={module || null}
          modulesInNavigation={modulesInNavigation}
          showIcon={showIcon}
          showSeparator={showSeparator} />
      ) : (
        <SingleModuleDisplay
          data-id="002908"
          isMobile={isMobile}
          isTabletWidth={isTabletWidth}
          module={module || null}
          navigate={navigate}
          showIcon={showIcon}
          showSeparator={showSeparator} />
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
