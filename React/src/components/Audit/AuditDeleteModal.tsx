import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import { toastSuccess } from '../../bootstrap/config';
import { useAuditContext } from '../../contexts/AuditProvider';
import useNavigate from '../../hooks/useNavigate';

function AuditDeleteModal({ isOpen, onClose }) {
  const { audit, deleteAudit, refetch } = useAuditContext();
  const toast = useToast();
  const { navigateTo } = useNavigate();

  if (!audit) return null;

  return (
    <Modal
        data-id="030925-a0d202"
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size="sm">
      <ModalContent data-id="030925-dab9e9">
        <ModalHeader data-id="030925-45c026">
          <Text data-id="030925-b69736" fontSize="smm" fontWeight="semibold">
            Delete {t('audit')}
          </Text>
          <ModalCloseButton data-id="030925-b6023c" />
        </ModalHeader>
        <ModalBody data-id="030925-08f9da" mb="40px">
          <Stack data-id="030925-894f09">
            <Text data-id="030925-cc5d25">
              Are you sure you want to delete the{' '}
              <Text data-id="030925-0aa498" as="span">
                {t('audit')} in <strong data-id="030925-90b9c4">{audit.businessUnit?.name}</strong>?
              </Text>
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter data-id="030925-d22938">
          <HStack data-id="030925-2e6a9b" justify="center" spacing={4} w="full">
            <Button data-id="030925-914329" _hover={{ opacity: 0.7 }} onClick={onClose}>
              Cancel
            </Button>
            <Button
              data-id="030925-73ae48"
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
              onClick={async () => {
                await deleteAudit({
                  variables: {
                    _id: audit._id,
                  },
                });
                onClose();

                navigateTo('/audits');

                refetch();
                toast({
                  ...toastSuccess,
                  description: `${capitalize(t('audit'))} deleted`,
                });
              }}>
              Delete
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export const auditNewQuestionModalStyles = {
  auditNewQuestionModal: {
    tile: {
      bg: {
        default: '#F4F3F5',
        hover: '#EBEAEF',
      },
      icon: {
        stroke: '#1E1836',
        fill: 'transparent',
      },
    },
  },
};

export default AuditDeleteModal;
