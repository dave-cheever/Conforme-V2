import React, { createContext, useContext, useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import { useDisclosure } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import { IResponse } from "../interfaces/IResponse";
import { IResponseContext } from "../interfaces/IResponseContext";

export const ResponseContext = createContext({} as IResponseContext);

const GET_RESPONSES = gql`
  query Responses($responsesQuery: ResponsesQuery) {
    responses(responsesQuery: $responsesQuery) {
      _id
      nextRenewalDate
      status
      delegateIds
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
        functionalArea {
          name
        }
      }
      businessUnit {
        name
        imgUrl
        ownerId
      }
    }
  }
`;

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
  console.log(data);
  const { isOpen: isShareOpen, onOpen: handleShareOpen, onClose: handleShareClose } = useDisclosure();
  const { isOpen: isConfirmationOpen, onOpen: handleConfirmationOpen, onClose: handleConfirmationClose } = useDisclosure();
  const { isOpen: isRenewalOpen, onOpen: handleRenewalOpen, onClose: handleRenewalClose } = useDisclosure();
  const { isOpen: isDueDateOpen, onOpen: handleDueDateOpen, onClose: handleDueDateClose } = useDisclosure();

  const response: IResponse = useMemo(() => data?.responses[0], [data]);

  const value = useMemo(() => ({
    response, loading, refetch,
    isShareOpen, handleShareOpen, handleShareClose,
    isConfirmationOpen, handleConfirmationOpen, handleConfirmationClose,
    isRenewalOpen, handleRenewalOpen, handleRenewalClose,
    isDueDateOpen, handleDueDateOpen, handleDueDateClose,
  }), [ // eslint-disable-line react-hooks/exhaustive-deps
    loading,
    response,
    isShareOpen,
    isConfirmationOpen,
    isRenewalOpen,
    isDueDateOpen,
  ]);

  return (
    <ResponseContext.Provider value={value}>
      {props.children}
    </ResponseContext.Provider>
  )
}

export default ResponseProvider;
