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
        data-id="000106"
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size="sm">
      <ModalContent data-id="000107">
        <ModalHeader data-id="000108">
          <Text data-id="000109" fontSize="smm" fontWeight="semibold">
            Delete {t('audit')}
          </Text>
          <ModalCloseButton data-id="000110" />
        </ModalHeader>
        <ModalBody data-id="000111" mb="40px">
          <Stack data-id="000112">
            <Text data-id="000113">
              Are you sure you want to delete the{' '}
              <Text as="span" data-id="000114">
                {t('audit')} in <strong data-id="000115">{audit.businessUnit?.name}</strong>?
              </Text>
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter data-id="000116">
          <HStack data-id="000117" justify="center" spacing={4} w="full">
            <Button _hover={{ opacity: 0.7 }} data-id="000118" onClick={onClose}>
              Cancel
            </Button>
            <Button
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
              data-id="000119"
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
