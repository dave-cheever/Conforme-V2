import { useDisclosure } from "@chakra-ui/react";
import React, { createContext, useMemo, useState } from "react";

import { IResponse } from "../interfaces/IResponse";
import { IResponseContext } from "../interfaces/IResponseContext";

export const ResponseContext = createContext({} as IResponseContext);

const ResponseProvider = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<IResponse>();
  const { isOpen: isShareOpen, onOpen: handleShareOpen, onClose: handleShareClose } = useDisclosure();
  const { isOpen: isConfirmationOpen, onOpen: handleConfirmationOpen, onClose: handleConfirmationClose } = useDisclosure();
  const { isOpen: isRenewalOpen, onOpen: handleRenewalOpen, onClose: handleRenewalClose } = useDisclosure();
  const { isOpen: isDueDateOpen, onOpen: handleDueDateOpen, onClose: handleDueDateClose } = useDisclosure();

  const value = useMemo(() => ({
    loading, setLoading,
    response, setResponse,
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
