import React, { useContext } from 'react';
import { Grid, Flex, Heading, Box, Button } from '@chakra-ui/react';

import useResponseUtils from '../../hooks/useResponseUtils';
import { isPermitted } from '../can';
import { useAppContext } from '../../contexts/AppProvider';
import ResponseStatusBox from './ResponseStatusBox';
import { Share, UploadedCross, UploadedTick } from '../../icons';
import { ResponseContext } from '../../contexts/ResponseProvider';

const ReasponseHeader = ({response}) => {
  const { getStatus, getRenewalStatus } = useResponseUtils();
  const { user } = useAppContext();
  const { handleShareOpen } = useContext(ResponseContext);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentEvidenceItems = response?.complianceItem?.evidenceItems?.filter(({ outdated }) => !outdated);
  const enableRenewalButton =
    response && (
      getRenewalStatus(response) === 'comingUp' ||
      (getRenewalStatus(response) === 'overdue' && response.status === 'completed')
    ) && isPermitted({ user, data: { response }, action: 'responses.edit' });

  return (
    <Flex
      direction='column'
      pl={6}
      w="full"
      minH="100px"
      bg="#2B3236"
      zIndex={3}
    >
      <Grid gridTemplateColumns='1fr 250px'>
        <Flex alignItems='center'>
          <Heading
            color="#FFFFFF"
            fontSize="24px"
            fontWeight="400"
            alignItems={['flex-start', 'center']}
          >
            {response?.complianceItem?.name}
          </Heading>
          <Share 
            h='18px' 
            ml={[0, 4]} 
            mr={2} 
            opacity='0.5' 
            color="white" 
            onClick={handleShareOpen} 
            _hover={{ opacity: 1, color: '#FFFFFF', cursor: 'pointer' }} 
          />
        </Flex>
        <Flex color='white' fontSize='sm' justify='flex-end' h='40px'>
          {currentEvidenceItems?.length > 0 &&
            <Flex h='40px' w='35%' alignItems='center'>
              {currentEvidenceItems.find(({ uploaded }) => uploaded === undefined) ?
                <UploadedCross h='18px' w='22px' mt={1} color='brand.primary' /> :
                <UploadedTick h='18px' w='22px' mt={1} color='brand.compliant' />
              }
              <Box ml={1}>
                <Flex fontWeight='medium'>Evidence</Flex>
                <Flex color='#9A9EA1'>{response?.complianceItem?.evidenceItems?.filter(({ outdated }) => !outdated).find(({ uploaded }) => uploaded === undefined) ? 'Missing' : 'Uploaded'}</Flex>
              </Box>
            </Flex>
          }
          {!['Ad-hoc', 'Variable'].includes(response?.frequency) &&
            <Button
              m='0 20px'
              w='60%'
              bg={enableRenewalButton ? 'brand.primary' : 'brand.secondary'}
              color={enableRenewalButton ? 'white' : 'brand.paleGrey'}
              // onClick={handleRenewalOpen}
              disabled={!enableRenewalButton}
            >Renew</Button>
          }
        </Flex>
      </Grid>
      <ResponseStatusBox status={response && getStatus(response)} />
    </Flex>
  );
};

export default ReasponseHeader;
