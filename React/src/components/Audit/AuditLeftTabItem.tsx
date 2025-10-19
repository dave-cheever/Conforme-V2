import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Box, Flex, Icon, Text } from '@chakra-ui/react';

import useNavigate from '../../hooks/useNavigate';

function AuditLeftTabItem({ 
  label, 
  icon, 
  url,
}: {
  readonly label: string;
  readonly icon: any;
  readonly url: string;
}) {
  const location = useLocation();
  const { isPathActive, navigateTo } = useNavigate(); 
  const { id } = useParams();
  const active = useMemo(() => isPathActive(`/audits/${id}${url}`, { exact: true }), [id, url]);

  const redirectPage = () => {
    navigateTo(`/audits/${id}${url}${location.search}`);
  };

  return (
    <Box
      data-id="000203"
      display="flex"
      width="85.8px"
      height="56px"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap="6px"
      onClick={redirectPage}
      cursor="pointer"
      pos="relative">
      <Flex
        align="center"
        bg={active ? '#0068A3' : 'none'}
        borderRadius="8px"
        data-id="000204"
        h="30px"
        justify="center"
        w="30px">
        <Icon
          as={icon}
          data-id="000205"
          fill={active ? '#ffffff' : '#4A5568'}
          color={active ? '#ffffff' : '#4A5568'}
          h="18px"
          stroke={active ? '#ffffff' : '#4A5568'}
          w="18px" />
      </Flex>
      <Text 
        color="#4A5568"
        data-id="000206" 
        fontSize="12px"
        fontWeight={active ? "600" : "400"}
        textAlign="center"
        textOverflow="ellipsis"
        overflow="hidden"
        whiteSpace="nowrap"
        width="85%">
        {label}
      </Text>
    </Box>
  );
}

export default AuditLeftTabItem;

export const auditLeftTabItemStyles = {
  auditLeftTabItem: {
    iconBg: '#DDDDDD',
    activeIconBg: '#462AC4',
    activeTextColor: '#462AC4',
    textColor: '#818197',
    activeIconColor: 'white',
    iconColor: '#818197',
    selectedLabelBg: '#1e1836',
  },
};
