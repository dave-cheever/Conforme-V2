import { useCallback, useContext } from 'react';

import { gql, useMutation } from '@apollo/client';
import { useToast } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import { toastFailed, toastSuccess } from '../bootstrap/config';
import { AdminContext } from '../contexts/AdminProvider';
import { useAppContext } from '../contexts/AppProvider';
import { useAuditModalContext } from '../contexts/AuditModalProvider';
import { IAudit } from '../interfaces/IAudit';

const CREATE_AUDIT = gql`
  mutation ($audit: AuditCreateInput!) {
    createAudit(audit: $audit) {
      _id
    }
  }
`;

const useAuditModal = (refetch = () => { }) => {
  const toast = useToast();
  const { module } = useAppContext();
  const { setAdminModalState } = useContext(AdminContext);
  const { reset } = useAuditModalContext();
  const [create] = useMutation(CREATE_AUDIT);

  const closeModal = useCallback(() => setAdminModalState('closed'), []);

  const saveAudit = async (audit: Partial<IAudit>) => {
    try {
      const { data } = await create({
        variables: {
          audit: {
            ...audit,
            scope: {
              moduleId: module?._id,
            },
          },
        },
      });
      const auditId = data.createAudit._id;
      reset({ ...audit, _id: auditId });

      refetch();
      toast({
        ...toastSuccess,
        description: `${capitalize(t('audit'))} ${audit.hasOwnProperty('_id') ? 'saved' : 'added'}`,
      });

      return auditId;
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    }
  };

  return {
    saveAudit,
    closeModal,
  };
};

export default useAuditModal;
