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

function AuditRecurringModal({ isOpen, onClose }) {
  const { audit, updateAudit, refetch, updateAuditLoading } = useAuditContext();
  const toast = useToast();

  if (!audit) return null;

  return (
    <Modal data-id="70affd0aa87b" isCentered isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent data-id="9eeb837341f5">
        <ModalHeader data-id="38c0cd6b6396">
          <Text data-id="8486d034fc53" fontSize="smm" fontWeight="semibold">
            Update {t('audit')} recurring setting
          </Text>
          <ModalCloseButton data-id="d2cd3d9616fc" />
        </ModalHeader>
        <ModalBody data-id="b303a6d13011" mb="40px">
          <Stack data-id="1c2e1a4bfac6">
            <Text data-id="e579303d72e6">
              By changing the {t('audit')} to {audit.recurring ? 'non' : ''}recurring, system will {audit.recurring ? 'not' : ''} create a
              new audit automatically for the next period. Are you sure?
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter data-id="222c742b949d">
          <HStack data-id="950a075b8000" justify="center" spacing={4} w="full">
            <Button _hover={{ opacity: 0.7 }} data-id="7eb868e7c0b1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
              data-id="94c348131f72"
              isLoading={updateAuditLoading}
              loadingText="Updating..."
              onClick={async () => {
                await updateAudit({
                  variables: {
                    audit: {
                      _id: audit._id,
                      recurring: !audit.recurring,
                    },
                  },
                });
                onClose();
                refetch();
                toast({
                  ...toastSuccess,
                  description: `${capitalize(t('audit'))} updated`,
                });
              }}
            >
              Update
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

export default AuditRecurringModal;
