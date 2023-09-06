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
    (<Modal
      data-id="93f8c810c02a"
      isOpen={isRenewalOpen}
      onClose={handleRenewalClose}>
      <ModalOverlay data-id="9a6de1576a73" />
      <ModalContent data-id="2217ce737745">
        <ModalHeader data-id="72819343bed4">{loading ? 'Renewing...' : !renewedResponse ? 'Please confirm' : 'Response renewed'}</ModalHeader>
        <ModalCloseButton data-id="b1161374d939" />
        <ModalBody data-id="76c4bce418bf" minH="100px">
          {loading ? (
            <Loader center data-id="58f0abc10aa2" />
          ) : !renewedResponse ? (
            <Text data-id="c2076f542a2f">
              You are about to start new review of <b data-id="009c26811993">{response?.trackerItem?.name}</b> {t('tracker item')} for{' '}
              <b data-id="c95bf2b28cd1">{response?.businessUnit?.name}</b>
              .&nbsp; That will move existing data to history and allow you to fill the response with new data.&nbsp;
            </Text>
          ) : (
            <Text data-id="af3cd686d57d">
              <b data-id="6ad4bd0bc66e">{response?.trackerItem?.name}</b> for <b data-id="7674c80ca3a2">{response?.businessUnit?.name}</b> was renewed.&nbsp; Complete it before{' '}
              <b data-id="76555c7e9b5b">{moment(renewedResponse?.dueDate).format('D MMM YYYY')}</b>.
            </Text>
          )}
        </ModalBody>

        {!loading && (
          <ModalFooter
            bg="renewResponseModal.footer.bg"
            data-id="3c16edad38ac"
            roundedBottom="0.375rem">
            {!renewedResponse ? (
              <>
                <Button
                  bg="renewResponseModal.buttons.secondary.bg"
                  color="renewResponseModal.buttons.secondary.color"
                  data-id="dd5d3633cc0d"
                  mr={3}
                  onClick={handleRenewalClose}>
                  Cancel
                </Button>
                <Button
                  bg="renewResponseModal.buttons.primary.bg"
                  color="renewResponseModal.buttons.primary.color"
                  data-id="4ddf5ef7a3ba"
                  onClick={renew}>
                  Start review
                </Button>
              </>
            ) : (
              <>
                <Button
                  bg="renewResponseModal.buttons.secondary.bg"
                  color="renewResponseModal.buttons.secondary.color"
                  data-id="ec7ca37ef2d3"
                  mr={3}
                  onClick={() => navigateTo('/')}>
                  Return to homepage
                </Button>
                <Button
                  colorScheme="purpleHeart"
                  data-id="b41b89b77350"
                  onClick={handleViewRenewed}>
                  View renewed response
                </Button>
              </>
            )}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>)
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
