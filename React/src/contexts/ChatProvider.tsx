import { createContext, useContext, useEffect, useMemo } from 'react';

import { gql, useLazyQuery } from '@apollo/client';
import { useDisclosure } from '@chakra-ui/react';

import { IChatContext } from '../interfaces/IChatContext';
import { IUser } from '../interfaces/IUser';
import { useAuditContext } from './AuditProvider';
import { useResponseContext } from './ResponseProvider';

export const ChatContext = createContext({} as IChatContext);

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

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useComplianceItemModalContext must be used within the ComplianceItemModalProvider');

  return context;
};

const ChatProvider = ({ children, component }: { children: React.ReactNode, component: 'audit' | 'response' }) => {
  const { isOpen: isOpenMessage, onOpen: handleOpenMessage, onClose: handleCloseMessage } = useDisclosure();
  const [getParticipants, { data: participantsData, loading: participantsLoading }] = useLazyQuery(GET_PARTICIPANTS);
  const { audit } = useAuditContext()
  const { response } = useResponseContext()

  useEffect(() => {
    let participants: string[] = [];
    if (component === 'audit' && audit) {
      // handle the empty auditor and participants cases
      if (audit.auditorId !== '') participants.push(audit.auditorId);

      participants = participants.concat(audit.participantsIds || []);
      getParticipants({
        variables: {
          userQuery: { usersIds: participants },
        },
      });
    }
    if (component === 'response' && response) {
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
  }, [JSON.stringify(audit), JSON.stringify(response)]);

  const chatParticipants: IUser[] = useMemo(() => participantsData?.participants || [], [participantsData]);

  const value = useMemo(
    () => ({ isOpenMessage, handleOpenMessage, handleCloseMessage, participantsLoading, chatParticipants }),
    [isOpenMessage, participantsData, participantsLoading],
  ) as IChatContext;

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatProvider
