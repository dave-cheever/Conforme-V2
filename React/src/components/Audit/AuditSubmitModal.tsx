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
        data-id="030925-923aa7"
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size="sm">
      <ModalContent data-id="030925-4a994f">
        <ModalHeader data-id="030925-1fafab">
          <Text data-id="030925-3e4c0e" fontSize="smm" fontWeight="semibold">
            Submit {t('audit')}
          </Text>
          <ModalCloseButton data-id="030925-d6fe2d" />
        </ModalHeader>
        <ModalBody data-id="030925-90eb28" mb="40px">
          <Stack data-id="030925-1082c3">
            <Text data-id="030925-42dd1d">
              Are you sure you want to submit the{' '}
              {audit.walkType === 'virtual' ? (
                `virtual ${t('audit')}`
              ) : (
                <Text as="span" data-id="030925-125a01">
                  {t('audit')} in <strong data-id="030925-b4f32b">{audit.businessUnit?.name}</strong>
                </Text>
              )}{' '}
              as completed?
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter data-id="030925-869d74">
          <HStack data-id="030925-943bce" justify="center" spacing={4} w="full">
            <Button _hover={{ opacity: 0.7 }} data-id="030925-c4738f" onClick={onClose}>
              Cancel
            </Button>
            <Button
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
              data-id="030925-82bde5"
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
