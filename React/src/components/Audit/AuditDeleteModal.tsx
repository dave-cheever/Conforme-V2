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

const AuditDeleteModal = ({ isOpen, onClose }) => {
  const { audit, deleteAudit, refetch } = useAuditContext();
  const toast = useToast();
  const { navigateTo } = useNavigate();

  if (!audit) return null;

  return (
    (<Modal
      data-id="90f059e01c71"
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      size="sm">
      <ModalContent data-id="8ca68d3e64cd">
        <ModalHeader data-id="d14590ffbc43">
          <Text data-id="2056d7b1203a" fontSize="smm" fontWeight="semibold">
            Delete {t('audit')}
          </Text>
          <ModalCloseButton data-id="2d00b5f1d2f3" />
        </ModalHeader>
        <ModalBody data-id="1ba7e7837c44" mb="40px">
          <Stack data-id="d70e232b0d01">
            <Text data-id="40feb1fe79b7">
              Are you sure you want to delete the{' '}
              <Text as="span" data-id="fae1882eaa3e">
                {t('audit')} in <strong data-id="ed2af8a97083">{audit.businessUnit?.name}</strong>?
              </Text>
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter data-id="1f910cb1506d">
          <HStack data-id="d5ea8167e8ad" justify="center" spacing={4} w="full">
            <Button _hover={{ opacity: 0.7 }} data-id="0fe065b38d51" onClick={onClose}>
              Cancel
            </Button>
            <Button
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
              data-id="433a3415e783"
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

export default AuditDeleteModal;
