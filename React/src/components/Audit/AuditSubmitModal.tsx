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

function AuditSubmitModal({ isOpen, onClose }) {
  const { audit, submitAudit, refetch } = useAuditContext();
  const toast = useToast();

  if (!audit) return null;

  return (
    <Modal
        data-id="000243"
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size="sm">
      <ModalContent data-id="000244">
        <ModalHeader data-id="000245">
          <Text data-id="000246" fontSize="smm" fontWeight="semibold">
            Submit {t('audit')}
          </Text>
          <ModalCloseButton data-id="000247" />
        </ModalHeader>
        <ModalBody data-id="000248" mb="40px">
          <Stack data-id="000249">
            <Text data-id="000250">
              Are you sure you want to submit the{' '}
              {audit.walkType === 'virtual' ? (
                `virtual ${t('audit')}`
              ) : (
                <Text as="span" data-id="000251">
                  {t('audit')} in <strong data-id="000252">{audit.businessUnit?.name}</strong>
                </Text>
              )}{' '}
              as completed?
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter data-id="000253">
          <HStack data-id="000254" justify="center" spacing={4} w="full">
            <Button _hover={{ opacity: 0.7 }} data-id="000255" onClick={onClose}>
              Cancel
            </Button>
            <Button
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
              data-id="000256"
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
              }}>
              Submit
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

export default AuditSubmitModal;
