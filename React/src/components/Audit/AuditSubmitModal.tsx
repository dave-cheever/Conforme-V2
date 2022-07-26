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

const AuditSubmitModal = ({ isOpen, onClose }) => {
  const { audit, submitAudit, refetch } = useAuditContext();
  const toast = useToast();

  if (!audit) return null;

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent>
        <ModalHeader>
          <Text fontSize="smm" fontWeight="semibold">
            Submit audit
          </Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody mb="40px">
          <Stack>
            <Text>
              Are you sure you want to submit the{' '}
              {audit.walkType === 'virtual' ? (
                'virtual audit'
              ) : (
                <Text as="span">
                  audit in <strong>{audit.area?.name}</strong>
                </Text>
              )}{' '}
              as completed?
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
                await submitAudit({
                  variables: {
                    auditId: audit._id,
                  },
                });
                refetch();
                onClose();
                toast({
                  ...toastSuccess,
                  description: `${capitalize(t('audit'))} completed`,
                });
              }}
            >
              Submit
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

export default AuditSubmitModal;
