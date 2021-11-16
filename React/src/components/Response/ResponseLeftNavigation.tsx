import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Avatar,
  Box,
  Flex,
  useToast,
  Image,
  Text
} from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Loader from '../Loader';
import { Building, ChevronRight, Copy } from '../../icons';
import { toastSuccess } from '../../bootstrap/config';


const ResponseLeftNavigation = ({response}) => {
  const history = useHistory();
  const toast = useToast();

  if (!response) {
    return <Loader />;
  }

  return (
    <Flex
      color="#FFFFFF"
      bg='response.leftNavigation.bg'
      fontWeight='400'
      direction='column'
      w='240px'
      h='full'
      overflow='auto'
      flexShrink={0}
      px={6}
      pt={4}
      pb={4}
      display={['none', 'block']}
    >
      <Flex cursor='pointer' align='center' onClick={() => history.push('/compliance-items')} h='30px' mb='34px'>
        <ChevronRight transform='Rotate(180deg)' mr={2} />
        Back
      </Flex>
      <Flex bg='response.leftNavigation.businessUnitBg' align='center' direction='column' minH='145px' rounded='lg' w='full'>
        <Image
          bg="response.leftNavigation.businessUnitImageBg"
          h='103px'
          w='full'
          roundedTop='lg'
          color='response.leftNavigation.businessUnitFont'
          src={`${response.businessUnit?.imgUrl}`}
          fallback={
            <Flex
              align='center'
              justify='center'
              bg='#FFFFFF'
              h='103px'
              w='full'
              roundedTop='lg'
              color="response.leftNavigation.businessUnitFont"
            >
              <Building w='40px' h='40px' color='response.leftNavigation.building' />
            </Flex>} />
        <Flex p={2} textAlign='center' w='full'>
          <Text
            w='full'
            lineHeight='25px'
            fontSize='14px'
            noOfLines={2}
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {response.businessUnit?.name}
          </Text>
        </Flex>
      </Flex>
      <Box h='50px' mt='25px'>
        <Box opacity={0.5} fontSize='12px'>Item ID</Box>
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
            <Copy color="response.leftNavigation.copy" mt={1} h='17px' w='17px' _hover={{ opacity: 0.6, cursor: 'pointer' }} />
          </CopyToClipboard>
        </Flex>
      </Box>
      <Box h='50px' mt={2}>
        <Box opacity={0.5} fontSize='12px'>Responsibility</Box>
        <Flex align='center' fontSize='14px' minH='28px'>
          <Avatar color='#FFFFFF' bg='response.leftNavigation.avatar' name={response.owner?.firstName && response.owner?.lastName ? `${response.owner?.firstName} ${response.owner?.lastName}` : `${response.owner?.displayName}`} src={response.owner?.imgUrl} size='2xs' mr={2} />
          <Flex mr={2}>{response.owner?.firstName && response.owner?.lastName ? `${response.owner?.firstName} ${response.owner?.lastName}` : `${response.owner?.displayName}`}</Flex>
        </Flex>
      </Box>
      <Box h='50px' mt={2}>
        <Box opacity={0.5} fontSize='12px'>Category</Box>
        <Flex align='center' fontSize='14px' minH='28px'>{response.complianceItem?.category?.name || <Box fontStyle='italic'>Unassigned</Box>}</Flex>
      </Box>
      <Box h='50px' mt={2}>
        <Box opacity={0.5} fontSize='12px'>Regulatory body</Box>
        <Flex align='center' fontSize='14px' minH='28px'>{response.complianceItem?.regulatoryBody?.name || <Box fontStyle='italic'>Unassigned</Box>}</Flex>
      </Box>
      <Box h='50px' mt={2}>
        <Box opacity={0.5} fontSize='12px'>Functional area</Box>
        <Flex align='center' fontSize='14px' minH='28px'>{response.complianceItem?.functionalArea?.name || <Box fontStyle='italic'>Unassigned</Box>}</Flex>
      </Box>
      <Box h='50px' mt={2}>
        <Box opacity={0.5} fontSize='12px'>Frequency</Box>
        <Flex align='center' fontSize='14px' minH='28px'>{response.complianceItem?.frequency}</Flex>
      </Box>
    </Flex>
  )
};

export default ResponseLeftNavigation