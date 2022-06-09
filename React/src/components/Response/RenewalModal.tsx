import React, { useContext, useEffect, useState } from 'react';

import { gql, useMutation } from '@apollo/client';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import { t } from 'i18next';
import moment from 'moment';

import { ResponseContext } from '../../contexts/ResponseProvider';
import useNavigate from '../../hooks/useNavigate';
import { IResponse } from '../../interfaces/IResponse';
import Loader from '../Loader';

const RENEW_RESPONSE = gql`
  mutation ($_id: ID!) {
    renewResponse(_id: $_id) {
      _id
      nextRenewalDate
    }
  }
`;

const RenewalModal = () => {
  const { navigateTo } = useNavigate();
  const [renewResponse] = useMutation(RENEW_RESPONSE);
  const { response, isRenewalOpen, handleRenewalClose, refetch, setActiveTab } = useContext(ResponseContext);
  const [loading, setLoading] = useState(false);
  const [renewedResponse, setRenewedResponse] = useState<IResponse | undefined>(undefined);

  useEffect(() => {
    if (!isRenewalOpen) setRenewedResponse(undefined);
  }, [isRenewalOpen]);

  const renew = async () => {
    setLoading(true);
    const renewed = await renewResponse({
      variables: {
        _id: response._id,
      },
    });
    await refetch();
    setRenewedResponse(renewed.data.renewResponse);
    setLoading(false);
  };

  const handleViewRenewed = async () => {
    handleRenewalClose();
    setActiveTab(0);
  };

  return (
    <Modal isOpen={isRenewalOpen} onClose={handleRenewalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{loading ? 'Renewing...' : !renewedResponse ? 'Please confirm' : 'Response renewed'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody minH="100px">
          {loading ? (
            <Loader center />
          ) : !renewedResponse ? (
            <Text>
              You are about to renew <b>{response?.complianceItem?.name}</b> {t('complianceItem')} for <b>{response?.businessUnit?.name}</b>
              .&nbsp; That will move existing evidence to history and allow you to fill the response with new data.&nbsp;
            </Text>
          ) : (
            <Text>
              <b>{response?.complianceItem?.name}</b> for <b>{response?.businessUnit?.name}</b> was renewed.&nbsp; Complete it before{' '}
              <b>{moment(renewedResponse?.nextRenewalDate).format('D MMM YYYY')}</b>.
            </Text>
          )}
        </ModalBody>

        {!loading && (
          <ModalFooter bg="renewResponseModal.footer.bg" roundedBottom="0.375rem">
            {!renewedResponse ? (
              <>
                <Button
                  bg="renewResponseModal.buttons.secondary.bg"
                  color="renewResponseModal.buttons.secondary.color"
                  mr={3}
                  onClick={handleRenewalClose}
                >
                  Cancel
                </Button>
                <Button bg="renewResponseModal.buttons.primary.bg" color="renewResponseModal.buttons.primary.color" onClick={renew}>
                  Renew
                </Button>
              </>
            ) : (
              <>
                <Button
                  bg="renewResponseModal.buttons.secondary.bg"
                  color="renewResponseModal.buttons.secondary.color"
                  mr={3}
                  onClick={() => navigateTo('/')}
                >
                  Return to homepage
                </Button>
                <Button colorScheme="purpleHeart" onClick={handleViewRenewed}>
                  View renewed response
                </Button>
              </>
            )}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export const responseRenewalModalStyles = {
  renewResponseModal: {
    footer: {
      bg: 'rgba(242, 242, 242, 0.8)',
    },
    buttons: {
      primary: {
        color: 'white',
        bg: '#462ac4',
      },
      secondary: {
        color: 'black',
        bg: 'white',
      },
    },
  },
};

export default RenewalModal;
