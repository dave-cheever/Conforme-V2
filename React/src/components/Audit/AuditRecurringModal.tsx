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

const AuditRecurringModal = ({ isOpen, onClose }) => {
  const { audit, updateAudit, refetch } = useAuditContext();
  const toast = useToast();

  if (!audit) return null;

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent>
        <ModalHeader>
          <Text fontSize="smm" fontWeight="semibold">
            Update {t('audit')} recurring setting
          </Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody mb="40px">
          <Stack>
            <Text>
              By changing the {t('audit')} to {audit.recurring ? 'non' : ''}recurring, system will {audit.recurring ? 'not' : ''} create a
              new audit automatically for the next period. Are you sure?
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <HStack justify="center" spacing={4} w="full">
            <Button _hover={{ opacity: 0.7 }} onClick={onClose}>
              Cancel
            </Button>
            <Button
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
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
};

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
