import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';

import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { isEqual } from 'date-fns';

import { toastFailed } from '../bootstrap/config';
import useNavigate from '../hooks/useNavigate';
import { IResponse } from '../interfaces/IResponse';
import { IResponseContext } from '../interfaces/IResponseContext';
import { IUser } from '../interfaces/IUser';

export const ResponseContext = createContext({} as IResponseContext);

const GET_RESPONSE = gql`
  query Responses($responsesQuery: ResponsesQuery) {
    responses(responsesQuery: $responsesQuery) {
      _id
      lastCompletionDate
      dueDate
      status
      calculatedStatus
      accountableId
      responsibleId
      contributorsIds
      followersIds
      daysToDueDate
      published
      evidence {
        name
        uploaded {
          id
          name
          addedAt
          thumbnail
          path
        }
      }
      attachments {
        id
        name
        addedAt
        thumbnail
        path
      }
      questions {
        type
        name
        description
        value
        required
        requiredAnswer
        notApplicable
        options {
          label
          value
        }
      }
      trackerItem {
        _id
        name
        reference
        description
        evidenceItems
        frequency
        allowAttachments
        category {
          name
        }
        regulatoryBody {
          name
        }
      }
      businessUnit {
        name
        imgUrl
      }
      metatags {
        addedAt
      }
    }
  }
`;

const GET_RESPONSE_SNAPSHOTS = gql`
  query HistoricalResponses($HistoricalResponsesQuery: AuditLogsQuery) {
    auditLog(auditLogsQuery: $HistoricalResponsesQuery) {
      _id
      auditLogs {
        _id
        records {
          action
          coll
          element {
            _id
            name
          }
          values
          metatags {
            addedAt
            addedBy
          }
        }
      }
    }
  }
`;

const GET_PARTICIPANTS = gql`
  query ($userQuery: UserQueryInput) {
    participants: usersById(userQueryInput: $userQuery) {
      id: _id
      display: displayName
      _id
      firstName
      lastName
      displayName
      imgUrl
    }
  }
`;

const UPDATE_QUESTIONS = gql`
  mutation ($updateResponseQuestionsModify: UpdateResponseQuestionsModify!) {
    updateResponseQuestions(updateResponseQuestionsModify: $updateResponseQuestionsModify)
  }
`;

const SUBMIT_RESPONSE = gql`
  mutation ($_id: ID!) {
    submitResponse(_id: $_id)
  }
`;

// Note: The display and id, is used for mentioned mapping

export const useResponseContext = () => {
  const context = useContext(ResponseContext);
  if (!context) throw new Error('useResponseContext must be used within the ResponseProvider');
  return context;
};

const ResponseProvider = ({ children }) => {
  const toast = useToast();
  const { id }: { id: string } = useParams();
  const history = useHistory();
  const { navigateTo } = useNavigate();
  const query = new URLSearchParams(history.location.search);

  const snapshot = query.get('snapshot');
  const { data, loading, refetch } = useQuery(GET_RESPONSE, {
    variables: { responsesQuery: { _id: id } },
  });
  const { data: snapshotsData, loading: snapshotsLoading } = useQuery(GET_RESPONSE_SNAPSHOTS, {
    variables: {
      HistoricalResponsesQuery: {
        actions: ['snapshot'],
        elementId: id,
      },
    },
    fetchPolicy: 'network-only',
  });
  const [updateQuestions] = useMutation(UPDATE_QUESTIONS);
  const [submitResponse] = useMutation(SUBMIT_RESPONSE);

  const [activeTab, setActiveTab] = useState(0);
  const [isQuestionFormDirty, setIsQuestionFormDirty] = useState(false);
  const [getParticipants, { data: participantsData, loading: participantsLoading }] = useLazyQuery(GET_PARTICIPANTS);
  const { isOpen: isShareOpen, onOpen: handleShareOpen, onClose: handleShareClose } = useDisclosure();
  const { isOpen: isConfirmationOpen, onOpen: handleConfirmationOpen, onClose: handleConfirmationClose } = useDisclosure();
  const { isOpen: isRenewalOpen, onOpen: handleRenewalOpen, onClose: handleRenewalClose } = useDisclosure();
  const { isOpen: isDueDateOpen, onOpen: handleDueDateOpen, onClose: handleDueDateClose } = useDisclosure();

  const questionsForm = useForm({ mode: 'all' });

  const snapshots: IResponse[] =
    snapshotsData?.auditLog?.auditLogs?.reduce((acc, curr) => {
      const responsesRecords = curr.records
        .filter(({ action }) => action === 'snapshot')
        .map((record) => record.values?.response?.old?.value);
      return [...acc, ...responsesRecords];
    }, []) || [];

  let response: IResponse = data?.responses[0];
  if (snapshot) {
    const responseSnapshot = snapshots.find(
      ({ lastCompletionDate }) => lastCompletionDate && isEqual(new Date(lastCompletionDate), new Date(parseInt(snapshot, 10))),
    );
    if (responseSnapshot) response = responseSnapshot;
  }

  if (!loading && !snapshotsLoading && data && !response) {
    toast({
      ...toastFailed,
      title: 'Response not found',
      description: 'Either response ID or snapshot is not valid.',
    });
    navigateTo('/');
  }

  const participants: IUser[] = useMemo(() => participantsData?.participants || [], [participantsData]);

  const getUpdatedDisplayName = (userId: string) => participants?.filter((participant) => participant._id === userId)[0]?.displayName;

  const getParticipantDetailById = (userId: string) => participants?.filter((participant) => participant._id === userId)[0];

  useEffect(() => {
    if (response) {
      let participants: string[] = [];
      // handle the empty responsible and accountable cases
      if (response.accountableId !== '') participants.push(response?.accountableId);

      if (response.responsibleId !== '') participants.push(response?.responsibleId);

      participants = participants.concat(response.followersIds || []);
      participants = participants.concat(response.contributorsIds || []);
      getParticipants({
        variables: {
          userQuery: { usersIds: participants },
        },
      });
    }
  }, [JSON.stringify(response)]);

  // Set active tab to new review if it wasn't yet submitted
  useEffect(() => {
    if (snapshotsData?.auditLog?.auditLogs?.length === 0 && response?.status === 'draft') setActiveTab(1);
  }, [JSON.stringify(response), JSON.stringify(snapshotsData)]);

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      response,
      users: participants,
      loading,
      refetch,
      isShareOpen,
      handleShareOpen,
      handleShareClose,
      isConfirmationOpen,
      handleConfirmationOpen,
      handleConfirmationClose,
      isQuestionFormDirty,
      setIsQuestionFormDirty,
      isRenewalOpen,
      handleRenewalOpen,
      handleRenewalClose,
      isDueDateOpen,
      handleDueDateOpen,
      handleDueDateClose,
      getUpdatedDisplayName,
      getParticipantDetailById,
      participantsLoading,
      snapshot,
      snapshots,
      snapshotsLoading,
      questionsForm,
      updateQuestions,
      submitResponse,
    }),

    [
      loading,
      activeTab,
      response,
      participantsData,
      isShareOpen,
      isConfirmationOpen,
      isQuestionFormDirty,
      isRenewalOpen,
      isDueDateOpen,
      participantsLoading,
      snapshot,
      snapshots,
      snapshotsLoading,
    ],
  );

  return <ResponseContext.Provider value={value}>{children}</ResponseContext.Provider>;
};

export default ResponseProvider;
