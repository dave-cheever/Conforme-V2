import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { useHistory, useParams } from "react-router-dom";

import { IResponse } from "../interfaces/IResponse";
import { IResponseContext } from "../interfaces/IResponseContext";
import { IUser } from "../interfaces/IUser";
import { toastFailed } from "../bootstrap/config";
import { isEqual } from "date-fns";

export const ResponseContext = createContext({} as IResponseContext);

const GET_RESPONSES = gql`
  query Responses($responsesQuery: ResponsesQuery) {
    responses(responsesQuery: $responsesQuery) {
      _id
      firstCompletionDate
      lastCompletionDate
      nextRenewalDate
      status
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
        outdated
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
        outdated
        requiredAnswer
        notApplicable
      }
      complianceItem {
        _id
        name
        reference
        description
        evidenceItems
        frequency
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
    auditLogs(auditLogsQuery: $HistoricalResponsesQuery) {
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

//Note: The display and id, is used for mentioned mapping

export const useResponseContext = () => {
  const context = useContext(ResponseContext);
  if (!context) {
    throw new Error('useResponseContext must be used within the ResponseProvider');
  }
  return context;
};

const ResponseProvider = (props: any) => {
  const { id }: { id: string } = useParams();
  const history = useHistory();
  const query = new URLSearchParams(history.location.search);
  const snapshot = query.get('snapshot');
  const { data, loading, refetch } = useQuery(GET_RESPONSES, { variables: { responsesQuery: { _id: id } } });
  const { data: snapshotsData, loading: snapshotsLoading } = useQuery(GET_RESPONSE_SNAPSHOTS, {
    variables: {
      HistoricalResponsesQuery: {
        action: 'snapshot',
        elementId: id,
      },
    },
    fetchPolicy: 'network-only',
  });
  const toast = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [getParticipants, { data: participantsData, loading: participantsLoading }] = useLazyQuery(GET_PARTICIPANTS);
  const { isOpen: isShareOpen, onOpen: handleShareOpen, onClose: handleShareClose } = useDisclosure();
  const { isOpen: isConfirmationOpen, onOpen: handleConfirmationOpen, onClose: handleConfirmationClose } = useDisclosure();
  const { isOpen: isRenewalOpen, onOpen: handleRenewalOpen, onClose: handleRenewalClose } = useDisclosure();
  const { isOpen: isDueDateOpen, onOpen: handleDueDateOpen, onClose: handleDueDateClose } = useDisclosure();
  const { isOpen: isOpenMessage, onOpen: handleOpenMessage, onClose: handleCloseMessage } = useDisclosure();

  const snapshots: IResponse[] = snapshotsData?.auditLogs?.reduce((acc, curr) => {
    const responsesRecords = curr.records.filter(({ action }) => action === 'snapshot').map(record => record.values?.response?.old?.value);
    return [...acc, ...responsesRecords];
  }, []) || [];

  let response: IResponse = data?.responses[0];
  if (snapshot) {
    const responseSnapshot = snapshots.find(({ lastRenewalDate }) => lastRenewalDate && isEqual(new Date(lastRenewalDate), new Date(parseInt(snapshot))));
    if (responseSnapshot) {
      response = responseSnapshot;
    }
  }

  if (!loading && !snapshotsLoading && data && !response) {
    toast({
      ...toastFailed,
      title: "Response not found",
      description: "Either response ID or snapshot is not valid.",
    });
    history.push('/');
  }

  const participants: IUser[] = useMemo(() => participantsData?.participants || [], [participantsData]);

  const getUpdatedDisplayName = (userId: string) => {
    return participants?.filter((participant) => participant._id === userId)[0]?.displayName;
  }

  const getParticipantDetailById = (userId: string) => {
    return participants?.filter((participant) => participant._id === userId)[0];
  }

  useEffect(() => {
    if (response) {
      let participants: string[] = [];
      //handle the empty responsible and accountable cases
      if (response.accountableId !== "") {
        participants.push(response?.accountableId);
      }
      if (response.responsibleId !== "") {
        participants.push(response?.responsibleId);
      }
      participants = participants.concat(response.followersIds || []);
      participants = participants.concat(response.contributorsIds || []);
      getParticipants({
        variables: {
          userQuery: { usersIds: participants }
        }
      });
    }
    // eslint-disable-next-line
  }, [response]);

  const value = useMemo(() => ({
    activeTab, setActiveTab,
    response, users: participants, loading, refetch,
    isShareOpen, handleShareOpen, handleShareClose,
    isConfirmationOpen, handleConfirmationOpen, handleConfirmationClose,
    isRenewalOpen, handleRenewalOpen, handleRenewalClose,
    isDueDateOpen, handleDueDateOpen, handleDueDateClose,
    isOpenMessage, handleOpenMessage, handleCloseMessage,
    getUpdatedDisplayName,
    getParticipantDetailById,
    participantsLoading,
    snapshot, snapshots, snapshotsLoading,
  }), [ // eslint-disable-line react-hooks/exhaustive-deps
    loading,
    activeTab,
    response,
    participantsData,
    isShareOpen,
    isConfirmationOpen,
    isRenewalOpen,
    isDueDateOpen,
    isOpenMessage,
    participantsLoading,
    snapshot, snapshots, snapshotsLoading
  ]);

  return (
    <ResponseContext.Provider value={value}>
      {props.children}
    </ResponseContext.Provider>
  )
}

export default ResponseProvider;
