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
      dueDate
    }
  }
`;

function RenewalModal() {
  const { navigateTo } = useNavigate();
  const [renewResponse] = useMutation(RENEW_RESPONSE);
  const { response, isRenewalOpen, handleRenewalClose, refetch, setActiveTab } = useContext(ResponseContext);
  const [loading, setLoading] = useState(false);
  const [renewedResponse, setRenewedResponse] = useState<IResponse | undefined>(undefined);

  useEffect(() => {
    if (!isRenewalOpen) setRenewedResponse(undefined);
  }, [isRenewalOpen]);

  const handleViewRenewed = async () => {
    handleRenewalClose();
    setActiveTab(1);
  };

  const renew = async () => {
    setLoading(true);
    const renewed = await renewResponse({
      variables: {
        _id: response._id,
      },
    });
    refetch();
    setRenewedResponse(renewed.data.renewResponse);
    setLoading(false);
    handleViewRenewed();
  };

  return (
    <Modal
        data-id="000277"
        isOpen={isRenewalOpen}
        onClose={handleRenewalClose}>
      <ModalOverlay data-id="000278" />
      <ModalContent data-id="000279">
        <ModalHeader data-id="000280">{loading ? 'Renewing...' : !renewedResponse ? 'Please confirm' : 'Response renewed'}</ModalHeader>
        <ModalCloseButton data-id="000281" />
        <ModalBody data-id="000282" minH="100px">
          {loading ? (
            <Loader center data-id="000283" />
          ) : !renewedResponse ? (
            <Text data-id="000284">
              You are about to start new review of <b data-id="000285">{response?.trackerItem?.name}</b> {t('tracker item')} for{' '}
              <b data-id="000286">{response?.businessUnit?.name}</b>
              .&nbsp; That will move existing data to history and allow you to fill the response with new data.&nbsp;
            </Text>
          ) : (
            <Text data-id="000287">
              <b data-id="000288">{response?.trackerItem?.name}</b> for <b data-id="000289">{response?.businessUnit?.name}</b> was renewed.&nbsp; Complete it before{' '}
              <b data-id="000290">{moment(renewedResponse?.dueDate).format('D MMM YYYY')}</b>.
            </Text>
          )}
        </ModalBody>

        {!loading && (
          <ModalFooter
            bg="renewResponseModal.footer.bg"
            data-id="000291"
            roundedBottom="0.375rem">
            {!renewedResponse ? (
              <>
                <Button
                  bg="renewResponseModal.buttons.secondary.bg"
                  color="renewResponseModal.buttons.secondary.color"
                  data-id="000292"
                  mr={3}
                  onClick={handleRenewalClose}>
                  Cancel
                </Button>
                <Button
                  bg="renewResponseModal.buttons.primary.bg"
                  color="renewResponseModal.buttons.primary.color"
                  data-id="000293"
                  onClick={renew}>
                  Start review
                </Button>
              </>
            ) : (
              <>
                <Button
                  bg="renewResponseModal.buttons.secondary.bg"
                  color="renewResponseModal.buttons.secondary.color"
                  data-id="000294"
                  mr={3}
                  onClick={() => navigateTo('/')}>
                  Return to homepage
                </Button>
                <Button
                  colorScheme="purpleHeart"
                  data-id="000295"
                  onClick={handleViewRenewed}>
                  View renewed response
                </Button>
              </>
            )}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}

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
