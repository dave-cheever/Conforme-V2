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
    (<Modal
      data-id="8b09c691284b"
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      size="sm">
      <ModalContent data-id="f053f053e41a">
        <ModalHeader data-id="c912f4f637e6">
          <Text data-id="0fb43c34ad9a" fontSize="smm" fontWeight="semibold">
            Submit {t('audit')}
          </Text>
          <ModalCloseButton data-id="bebcea6fdcb6" />
        </ModalHeader>
        <ModalBody data-id="df13cc131790" mb="40px">
          <Stack data-id="767bb179e6d3">
            <Text data-id="bf16ab4152e0">
              Are you sure you want to submit the{' '}
              {audit.walkType === 'virtual' ? (
                `virtual ${t('audit')}`
              ) : (
                <Text as="span" data-id="9b684da16c1b">
                  {t('audit')} in <strong data-id="30411e5769e6">{audit.businessUnit?.name}</strong>
                </Text>
              )}{' '}
              as completed?
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter data-id="87bdc92a54f6">
          <HStack data-id="fd9f30419818" justify="center" spacing={4} w="full">
            <Button _hover={{ opacity: 0.7 }} data-id="7e2fc839e7e3" onClick={onClose}>
              Cancel
            </Button>
            <Button
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
              data-id="698a39e39917"
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
    </Modal>)
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
