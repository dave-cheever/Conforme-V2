import { useCallback, useContext } from 'react';

import { gql, useApolloClient, useMutation } from '@apollo/client';
import { useToast } from '@chakra-ui/react';
import { t } from 'i18next';

import { toastFailed, toastSuccess } from '../bootstrap/config';
import { AdminContext } from '../contexts/AdminProvider';
import { initialDialogDetails, useTrackerItemModalContext } from '../contexts/TrackerItemModalProvider';
import { ITrackerItem } from '../interfaces/ITrackerItem';

const CREATE_TRACKER_ITEM = gql`
  mutation ($trackerItemInput: TrackerItemInput!) {
    createTrackerItem(trackerItemInput: $trackerItemInput) {
      _id
    }
  }
`;
const UPDATE_TRACKER_ITEM = gql`
  mutation ($trackerItemInput: TrackerItemModifyInput!) {
    updateTrackerItem(trackerItemModifyInput: $trackerItemInput) {
      _id
    }
  }
`;
const DELETE_TRACKER_ITEM = gql`
  mutation ($_id: ID!) {
    deleteTrackerItem(_id: $_id)
  }
`;
const CLONE_TRACKER_ITEM = gql`
  mutation ($_id: ID!) {
    cloneTrackerItem(_id: $_id) {
      _id
    }
  }
`;

// Add responses query
const GET_RESPONSES_BY_TRACKER_ITEM_ID = gql`
  query ($trackerItemsIds: [ID!]) {
    responses(responsesQuery: { trackerItemsIds: $trackerItemsIds }) {
      responses {
        _id
        trackerItemId
        businessUnitId
      }
    }
  }
`;

const useTrackerItemModal = (refetch = () => {}) => {
  const toast = useToast();
  const { setAdminModalState } = useContext(AdminContext);
  const { reset, setValue, selectedSectionIndex, setSavingDialogDetails } = useTrackerItemModalContext();
  const [create] = useMutation(CREATE_TRACKER_ITEM);
  const [update] = useMutation(UPDATE_TRACKER_ITEM);
  const [remove] = useMutation(DELETE_TRACKER_ITEM);
  const [clone] = useMutation(CLONE_TRACKER_ITEM);
  const client = useApolloClient();

  // Helper to poll for the response after tracker item save
  const waitForResponseId = async (trackerItemId, maxAttempts = 5, delayMs = 500) => {
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const { data: responsesData } = await client.query({
        query: GET_RESPONSES_BY_TRACKER_ITEM_ID,
        variables: { trackerItemsIds: [trackerItemId] },
        fetchPolicy: 'network-only',
      });
      const responses = responsesData?.responses?.responses || [];
      if (responses.length > 0) return responses[0]._id;
      await new Promise((resolve) => {
        setTimeout(resolve, delayMs);
      });
    }
    return null;
  };

  const closeModal = useCallback(() => setAdminModalState('closed'), []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveTrackerItem = async (trackerItemInput: Partial<ITrackerItem>) => {
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

      let savedTrackerItemId: string;

      if (trackerItemInput.hasOwnProperty('_id')) {
        const { data } = await update({ variables: { trackerItemInput } });
        savedTrackerItemId = data.updateTrackerItem._id;
        reset(trackerItemInput, selectedSectionIndex);
      } else {
        const { data } = await create({ variables: { trackerItemInput } });
        savedTrackerItemId = data.createTrackerItem._id;
        reset({ ...trackerItemInput, _id: savedTrackerItemId }, selectedSectionIndex);
      }
      refetch();

      // Wait for the response(s) for this tracker item to be available
      const responseId = await waitForResponseId(savedTrackerItemId);
      toast({
        ...toastSuccess,
        description: `${trackerItemInput.name} ${trackerItemInput.hasOwnProperty('_id') ? 'saved' : 'added'}`,
      });
      return responseId;
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setSavingDialogDetails(initialDialogDetails);
    }
  };

  const deleteTrackerItem = async (trackerItem: Partial<ITrackerItem>) => {
    try {
      await remove({ variables: { _id: trackerItem._id } });
      refetch();
      toast({
        ...toastSuccess,
        description: `${trackerItem.name} was deleted`,
      });
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      closeModal();
    }
  };

  const cloneTrackerItem = async (trackerItem: Partial<ITrackerItem>) => {
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

      const { data } = await clone({ variables: { _id: trackerItem._id } });
      const savedTrackerItemId = data.cloneTrackerItem._id;
      setValue('_id', savedTrackerItemId);
      refetch();
      toast({
        ...toastSuccess,
        description: `${trackerItem.name} was cloned`,
      });
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      closeModal();
    }
  };

  return {
    saveTrackerItem,
    deleteTrackerItem,
    cloneTrackerItem,
    closeModal,
  };
};

export default useTrackerItemModal;
