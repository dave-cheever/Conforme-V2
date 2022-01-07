import React, { createContext, useContext, useEffect, useMemo } from "react";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useDisclosure } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import { IResponse } from "../interfaces/IResponse";
import { IResponseContext } from "../interfaces/IResponseContext";
import { IUser } from "../interfaces/IUser";

export const ResponseContext = createContext({} as IResponseContext);

const GET_RESPONSES = gql`
  query Responses($responsesQuery: ResponsesQuery) {
    responses(responsesQuery: $responsesQuery) {
      _id
      lastRenewalDate
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
      }
      complianceItem {
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

const GET_PARTICIPANTS = gql`
  query ($userQuery: UserQueryInput) {
    participants: usersById(userQueryInput: $userQuery) {
      id: _id
      display: firstName
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
  const { data, loading, refetch } = useQuery(GET_RESPONSES, { variables: { responsesQuery: { _id: id } } });
  const [getParticipants, { data: participantsData, loading: participantsLoading }] = useLazyQuery(GET_PARTICIPANTS);
  const { isOpen: isShareOpen, onOpen: handleShareOpen, onClose: handleShareClose } = useDisclosure();
  const { isOpen: isConfirmationOpen, onOpen: handleConfirmationOpen, onClose: handleConfirmationClose } = useDisclosure();
  const { isOpen: isRenewalOpen, onOpen: handleRenewalOpen, onClose: handleRenewalClose } = useDisclosure();
  const { isOpen: isDueDateOpen, onOpen: handleDueDateOpen, onClose: handleDueDateClose } = useDisclosure();
  const { isOpen: isOpenMessage, onOpen: handleOpenMessage, onClose: handleCloseMessage } = useDisclosure();

  const response: IResponse = useMemo(() => data?.responses[0], [data]);
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
    response, users: participants, loading, refetch,
    isShareOpen, handleShareOpen, handleShareClose,
    isConfirmationOpen, handleConfirmationOpen, handleConfirmationClose,
    isRenewalOpen, handleRenewalOpen, handleRenewalClose,
    isDueDateOpen, handleDueDateOpen, handleDueDateClose,
    isOpenMessage, handleOpenMessage, handleCloseMessage,
    getUpdatedDisplayName,
    getParticipantDetailById,
    participantsLoading
  }), [ // eslint-disable-line react-hooks/exhaustive-deps
    loading,
    response,
    participantsData,
    isShareOpen,
    isConfirmationOpen,
    isRenewalOpen,
    isDueDateOpen,
    isOpenMessage,
    participantsLoading
  ]);

  return (
    <ResponseContext.Provider value={value}>
      {props.children}
    </ResponseContext.Provider>
  )
}

export default ResponseProvider;
