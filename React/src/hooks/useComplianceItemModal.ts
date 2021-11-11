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
      name
    }
  }
`;

const useComplianceItemModal = () => {
  const toast = useToast();
  const { setAdminModalState } = useContext(AdminContext);
  const {
    setValue,
    setSavingDialogDetails,
  } = useComplianceItemModalContext();
  const [create] = useMutation(CREATE_COMPLIANCE_ITEM);

  const closeModal = useCallback(() => setAdminModalState('closed'), []);

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

      // const pureComplianceItem = {
      //   name: complianceItem.name,
      //   description: complianceItem.description,
      //   categoryId: complianceItem.categoryId,
      //   regulatoryBodyId: complianceItem.regulatoryBodyId,
      //   functionalAreaId: complianceItem.functionalAreaId,
      //   dueDate: complianceItem.dueDate ? getUTCDate(complianceItem.dueDate).toDate() : complianceItem.dueDate,
      //   frequency: complianceItem.frequency,
      //   businessUnitsIds: complianceItem.businessUnitsIds,
      //   evidenceItems: complianceItem.evidenceItems,
      //   retentionPeriod: complianceItem.retentionPeriod,
      //   questions: complianceItem.questions,
      //   published: complianceItem.published,
      // };
      // console.log('complianceItem', complianceItemInput);
      // console.log('pureComplianceItem', pureComplianceItem);
      

      let savedComplianceItemId: string;
      if (complianceItemInput.hasOwnProperty('_id')) {
        // savedComplianceItemIs = await ComplianceItemsService.update(complianceItem['id'], pureComplianceItem);
      } else {
        const { data } = await create({ variables: { complianceItemInput } });
        savedComplianceItemId = data.createComplianceItem._id;
        setValue('_id', savedComplianceItemId);
      }
      toast({ ...toastSuccess, description: `Compliance item ${complianceItemInput.name} ${complianceItemInput.hasOwnProperty('id') ? 'saved' : 'added'}` });
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setSavingDialogDetails(initialDialogDetails);
    }
  }

  const deleteComplianceItem = async (complianceItem: IComplianceItem) => {
    try {
      // await ComplianceItemsService.remove(complianceItem.id);
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
