import React, { createContext, useContext, useMemo, useState } from 'react';

import { useDisclosure } from '@chakra-ui/react';

import { IShareContext } from '../interfaces/IShareContext';

export const ShareContext = createContext({} as IShareContext);

export const useShareContext = () => {
  const context = useContext(ShareContext);
  if (!context) throw new Error('useShareContext must be used within the ShareProvider');

  return context;
};

function ShareProvider({ children }) {
  const { isOpen: isShareOpen, onOpen: handleShareOpen, onClose: handleShareClose } = useDisclosure();
  const [shareItemUrl, setShareItemUrl] = useState<string | undefined>();
  const [shareItemName, setShareItemName] = useState<string | undefined>();

  const value = useMemo(
    () => ({
      isShareOpen,
      handleShareOpen,
      handleShareClose,
      shareItemUrl,
      setShareItemUrl,
      shareItemName,
      setShareItemName,
    }),
    [isShareOpen, shareItemUrl, shareItemName],
  );

  return <ShareContext.Provider data-id="000015" value={value}>{children}</ShareContext.Provider>;
}

export default ShareProvider;
