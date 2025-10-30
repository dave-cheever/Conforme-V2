import { Box, Divider, Flex, Text } from '@chakra-ui/react';

import useConfig from '../../hooks/useConfig';
import useNavigate from '../../hooks/useNavigate';
import { BackArrowIcon } from '../../icons';
import AuditLeftTabItem from './AuditLeftTabItem';

function AuditLeftNavigationMobile() {
  const { auditNavigationTabs } = useConfig();
  const { navigateTo } = useNavigate();

  return (
    <Flex
      align="center"
      bg="navigationBottomMobile.bg"
      bottom="0px"
      boxShadow="simple"
      color="auditLeftNavigation.color"
      data-id="000207"
      direction="column"
      display={['block', 'none', 'none']}
      fontWeight="400"
      h="fit-content"
      justifyContent="space-between"
      p="16px 16px"
      position="fixed"
      sx={{
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
      w="full"
      zIndex={12}>
      <Flex align="center" data-id="000208" flexDirection="row" h="full">
        <Flex
          align="center"
          color="auditLeftNavigation.goBackColor"
          cursor="pointer"
          data-id="000209"
          fontSize="14px"
          h="30px"
          mr={3}
          onClick={() => navigateTo('/audits')}>
          <Box
            alignItems="center"
            bg="#E2E8F0"
            borderRadius="7px"
            data-id="002488"
            display="flex"
            flexDirection="column"
            gap="0px"
            height="56px"
            justifyContent="center"
            width="56px">
            <Flex
              align="center"
              borderRadius="8px"
              data-id="000210"
              h="30px"
              justify="center"
              w="30px">
              <BackArrowIcon data-id="002489" dataId="000211" width="18px" height="18px" />
            </Flex>
            <Text
              color="#4A5568"
              data-id="000211"
              fontSize="12px"
              fontWeight="400"
              overflow="hidden"
              textAlign="center"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              width="85%">
              Back
            </Text>
          </Box>
          <Divider data-id="000212" ml={4} orientation="vertical" />
        </Flex>
        <Flex data-id="000213" w="full">
          <Flex data-id="000214" justify="space-between" w="full">
            {auditNavigationTabs.map(({ label, icon, url }) => (
              <AuditLeftTabItem
                data-id="000215"
                icon={icon}
                key={url}
                label={label}
                url={url} />
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default AuditLeftNavigationMobile;
