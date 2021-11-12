import { useCallback, useContext } from "react";
import { useToast } from "@chakra-ui/react";

import { toastFailed, toastSuccess } from "../bootstrap/config";
import { AdminContext } from "../contexts/AdminProvider";
import { initialDialogDetails, useComplianceItemModalContext } from "../contexts/ComplianceItemModalProvider";
import { IComplianceItem } from "../interfaces/IComplianceItem";
import { gql, useMutation } from "@apollo/client";

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
  mutation ($_id: String!) {
    deleteComplianceItem(_id: $_id)
  }
`;

const useComplianceItemModal = (refetch = () => { }) => {
  const toast = useToast();
  const { setAdminModalState } = useContext(AdminContext);
  const {
    reset, setValue,
    selectedSectionIndex,
    setSavingDialogDetails,
  } = useComplianceItemModalContext();
  const [create] = useMutation(CREATE_COMPLIANCE_ITEM);
  const [update] = useMutation(UPDATE_COMPLIANCE_ITEM);
  const [remove] = useMutation(DELETE_COMPLIANCE_ITEM);

  const closeModal = useCallback(() => setAdminModalState('closed'), []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveComplianceItem = async (complianceItemInput: Partial<IComplianceItem>) => {
    try {
      setSavingDialogDetails(details => ({
        ...details,
        state: 'Saving compliance item',
      }));
      const changeState = setTimeout(() => {
        setSavingDialogDetails(details => ({
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
        setValue('_id', savedComplianceItemId);
      }
      refetch();
      toast({ ...toastSuccess, description: `Compliance item ${complianceItemInput.name} ${complianceItemInput.hasOwnProperty('_id') ? 'saved' : 'added'}` });
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setSavingDialogDetails(initialDialogDetails);
    }
  }

  const deleteComplianceItem = async (complianceItem: Partial<IComplianceItem>) => {
    try {
      await remove({ variables: { _id: complianceItem._id } });
      refetch();
      toast({ ...toastSuccess, description: `${complianceItem.name} was deleted` });
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      closeModal();
    }
  };

  return {
    saveComplianceItem,
    deleteComplianceItem,
    closeModal,
  };
};

export default useComplianceItemModal;
