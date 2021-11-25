import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Avatar,
  Box,
  Flex,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Loader from '../Loader';
import { ChevronRight, Conforme, Copy } from '../../icons';
import { navigationTabs, toastSuccess } from '../../bootstrap/config';
import ResponseLeftTabItem from './ResponseLeftTabItem';


const ResponseLeftNavigation = ({response}) => {
  const history = useHistory();
  const toast = useToast();

  if (!response) {
    return <Loader />;
  }

  return (
    <Flex
      color="responseLeftNavigation.color"
      bg='responseLeftNavigation.bg'
      fontWeight='400'
      direction='column'
      w='240px'
      h='full'
      overflow='auto'
      flexShrink={0}
      px={6}
      display={['none', 'flex']}
      justifyContent="space-between"
    >
      <Flex flexDirection="column">
      <Flex cursor='pointer' align='center' onClick={() => history.push('/compliance-items')} color="responseLeftNavigation.goBackColor" fontSize="14px" h='30px' mb='20px'>
        <ChevronRight transform='Rotate(180deg)' mr={2} />
        Go Back
      </Flex>
      <Flex flexDirection="column" mb={2}>
        {navigationTabs.map(({label, icon, url}) => <ResponseLeftTabItem key={url} label={label} icon={icon} url={url}/>)}
      </Flex>
      <Box h='50px'>
        <Box opacity={0.5} fontSize='11px'>Item ID</Box>
        <Flex align='center' fontSize='14px' minH='28px'>
          <Flex mr={2}>{response.complianceItem.reference}</Flex>
          <CopyToClipboard
            text={response.complianceItem.reference}
            onCopy={() => toast({
              ...toastSuccess,
              title: 'Item ID copied',
              description: `${response.complianceItem.reference} was copied to clipboard`
            })
            }>
            <Copy color="responseLeftNavigation.copy" mt={1} h='17px' w='17px' _hover={{ opacity: 0.6, cursor: 'pointer' }} />
          </CopyToClipboard>
        </Flex>
      </Box>
      <Box h='50px' mt={2}>
        <Box opacity={0.5} fontSize='11px'>Business unit</Box>
        <Flex align='center' fontSize='14px' minH='28px'>{response.businessUnit.name || "-"}</Flex>
      </Box>
      <Box h='50px' mt={2}>
        <Box opacity={0.5} fontSize='11px'>Responsible</Box>
        <Flex align='center' fontSize='14px' minH='28px'>
          <Avatar color='#FFFFFF' bg='responseLeftNavigation.avatar' name={response.owner?.firstName && response.owner?.lastName ? `${response.owner?.firstName} ${response.owner?.lastName}` : `${response.owner?.displayName}`} src={response.owner?.imgUrl} size="xs" mr={2} />
          <Flex mr={2}>{response.owner?.firstName && response.owner?.lastName ? `${response.owner?.firstName} ${response.owner?.lastName}` : `${response.owner?.displayName || "-"}`}</Flex>
        </Flex>
      </Box>
      <Box h='50px' mt={2}>
        <Box opacity={0.5} fontSize='11px'>Category</Box>
        <Flex align='center' fontSize='14px' minH='28px'>{response.complianceItem?.category?.name || "-"}</Flex>
      </Box>
      <Box h='50px' mt={2}>
        <Box opacity={0.5} fontSize='11px'>Regulatory body</Box>
        <Flex align='center' fontSize='14px' minH='28px'>{response.complianceItem?.regulatoryBody?.name || "-"}</Flex>
      </Box>
      <Box h='50px' mt={2}>
        <Box opacity={0.5} fontSize='11px'>Functional area</Box>
        <Flex align='center' fontSize='14px' minH='28px'>{response.complianceItem?.functionalArea?.name || "-"}</Flex>
      </Box>
      <Box h='50px' mt={2}>
        <Box opacity={0.5} fontSize='11px'>Frequency</Box>
        <Flex align='center' fontSize='14px' minH='28px'>{response.complianceItem?.frequency || "-"}</Flex>
      </Box>
      </Flex>
      <Flex>
        <Icon as={Conforme} w="103px" h="35px" mb="20px" />
      </Flex>
    </Flex>
  )
};

export default ResponseLeftNavigation

export const responseLeftNavigationStyles = {
  responseLeftNavigation: {
    bg: "#E5E5E5",
    goBackColor:"#818197",
    color:"#282F36",
    building: "#2B3236",
    copy: "#FF9A00",
    avatar: "#462AC4",
  },
}