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
    <Modal data-id="000523" isCentered isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent data-id="000524">
        <ModalHeader data-id="000525">
          <Text data-id="000526" fontSize="smm" fontWeight="semibold">
            Update {t('audit')} recurring setting
          </Text>
          <ModalCloseButton data-id="000527" />
        </ModalHeader>
        <ModalBody data-id="000528" mb="40px">
          <Stack data-id="000529">
            <Text data-id="000530">
              By changing the {t('audit')} to {audit.recurring ? 'non' : ''}recurring, system will {audit.recurring ? 'not' : ''} create a
              new audit automatically for the next period. Are you sure?
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter data-id="000531">
          <HStack data-id="000532" justify="center" spacing={4} w="full">
            <Button _hover={{ opacity: 0.7 }} data-id="000533" onClick={onClose}>
              Cancel
            </Button>
            <Button
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
              data-id="000534"
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
