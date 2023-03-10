import { useMemo } from 'react';

import { Flex, Stack, Text, Tooltip } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import useDevice from '../hooks/useDevice';
import { IModule } from '../interfaces/IModule';
import { getInitials } from '../utils/helpers';

const ModuleSwitcher = () => {
  const { organizationConfig, module, setModule } = useAppContext();
  const device = useDevice();

  const modulesInNavigation = useMemo(
    () => organizationConfig?.modules?.filter(({ showInNavigation }) => !!showInNavigation),
    [organizationConfig],
  );

  const chooseModule = (module: IModule) => {
    setModule(module);
    window.location.assign(`/${module.path}`);
  };

  if (device === 'mobile' || (modulesInNavigation && modulesInNavigation.length < 2)) return null;

  return (
    (<Stack
      backgroundColor="moduleSwitcher.background"
      data-id="fd295d0a3c18"
      p="5px"
      w="50px">
      {organizationConfig?.modules?.map((m) => (
        <Tooltip
          data-id="d16c3126ad75"
          hasArrow
          key={m.path}
          label={m.name}
          placement="right">
          <Flex
            align="center"
            backgroundColor={m.path === module?.path ? 'moduleSwitcher.button.active' : 'moduleSwitcher.button.default'}
            color={m.path === module?.path ? 'moduleSwitcher.button.text.active' : 'moduleSwitcher.button.text.default'}
            cursor={m.path === module?.path ? 'default' : 'pointer'}
            data-id="f0e5e1bb2708"
            fontSize="md"
            h="40px"
            justify="center"
            onClick={() => m.path !== module?.path && chooseModule(m)}
            rounded="md"
            w="40px">
            <Text data-id="37c06144bd61">{getInitials(m.name)}</Text>
          </Flex>
        </Tooltip>
      ))}
    </Stack>)
  );
};

export const moduleSwitcherStyles = {
  moduleSwitcher: {
    background: '#efefef',
    button: {
      default: '#e5e5e5',
      active: '#462AC4',
      text: {
        default: '#000000',
        active: '#ffffff',
      },
    },
  },
};

export default ModuleSwitcher;
