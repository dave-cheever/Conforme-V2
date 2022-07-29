import { useCallback, useContext } from 'react';

import { gql, useMutation } from '@apollo/client';
import { useToast } from '@chakra-ui/react';
import { t } from 'i18next';

import { toastFailed, toastSuccess } from '../bootstrap/config';
import { AdminContext } from '../contexts/AdminProvider';
import { initialDialogDetails, useComplianceItemModalContext } from '../contexts/ComplianceItemModalProvider';
import { IComplianceItem } from '../interfaces/IComplianceItem';

const CREATE_COMPLIANCE_ITEM = gql`
  mutation ($complianceItemInput: ComplianceItemInput!) {
    createComplianceItem(complianceItemInput: $complianceItemInput) {
      _id
    }
  }
`;
const UPDATE_COMPLIANCE_ITEM = gql`
  mutation ($complianceItemInput: ComplianceItemModifyInput!) {
    updateComplianceItem(complianceItemModifyInput: $complianceItemInput) {
      _id
    }
  }
`;
const DELETE_COMPLIANCE_ITEM = gql`
  mutation ($_id: ID!) {
    deleteComplianceItem(_id: $_id)
  }
`;
const CLONE_COMPLIANCE_ITEM = gql`
  mutation ($_id: ID!) {
    cloneComplianceItem(_id: $_id) {
      _id
    }
  }
`;

const useComplianceItemModal = (refetch = () => {}) => {
  const toast = useToast();
  const { setAdminModalState } = useContext(AdminContext);
  const { reset, setValue, selectedSectionIndex, setSavingDialogDetails } = useComplianceItemModalContext();
  const [create] = useMutation(CREATE_COMPLIANCE_ITEM);
  const [update] = useMutation(UPDATE_COMPLIANCE_ITEM);
  const [remove] = useMutation(DELETE_COMPLIANCE_ITEM);
  const [clone] = useMutation(CLONE_COMPLIANCE_ITEM);

  const closeModal = useCallback(() => setAdminModalState('closed'), []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveComplianceItem = async (complianceItemInput: Partial<IComplianceItem>) => {
    try {
      setSavingDialogDetails((details) => ({
        ...details,
        state: `Saving ${t('tracker item')}`,
      }));
      const changeState = setTimeout(() => {
        setSavingDialogDetails((details) => ({
          ...details,
          state: 'Saving responses',
        }));
        clearTimeout(changeState);
      }, 1000);

      let savedComplianceItemId: string;

      if (complianceItemInput.hasOwnProperty('_id')) {
        const { data } = await update({ variables: { complianceItemInput } });
        savedComplianceItemId = data.updateComplianceItem._id;
        reset(complianceItemInput, selectedSectionIndex);
      } else {
        const { data } = await create({ variables: { complianceItemInput } });
        savedComplianceItemId = data.createComplianceItem._id;
        reset({ ...complianceItemInput, _id: savedComplianceItemId }, selectedSectionIndex);
      }
      refetch();
      toast({
        ...toastSuccess,
        description: `${complianceItemInput.name} ${complianceItemInput.hasOwnProperty('_id') ? 'saved' : 'added'}`,
      });
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setSavingDialogDetails(initialDialogDetails);
    }
  };

  const deleteComplianceItem = async (complianceItem: Partial<IComplianceItem>) => {
    try {
      await remove({ variables: { _id: complianceItem._id } });
      refetch();
      toast({
        ...toastSuccess,
        description: `${complianceItem.name} was deleted`,
      });
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      closeModal();
    }
  };

  const cloneComplianceItem = async (complianceItem: Partial<IComplianceItem>) => {
    try {
      setSavingDialogDetails((details) => ({
        ...details,
        state: `Saving ${t('tracker item')}`,
      }));
      const changeState = setTimeout(() => {
        setSavingDialogDetails((details) => ({
          ...details,
          state: 'Saving responses',
        }));
        clearTimeout(changeState);
      }, 1000);

      const { data } = await clone({ variables: { _id: complianceItem._id } });
      const savedComplianceItemId = data.cloneComplianceItem._id;
      setValue('_id', savedComplianceItemId);
      refetch();
      toast({
        ...toastSuccess,
        description: `${complianceItem.name} was cloned`,
      });
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      closeModal();
    }
  };

  return {
    saveComplianceItem,
    deleteComplianceItem,
    cloneComplianceItem,
    closeModal,
  };
};

export default useComplianceItemModal;
