import { useEffect, useMemo, useState } from 'react';
import reactStringReplace from 'react-string-replace';

import { gql, useLazyQuery } from '@apollo/client';
import { DeleteIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Flex, Skeleton, SkeletonCircle, Text, useDisclosure } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import { IComment } from '../interfaces/IComment';
import { chatMentionRegExp } from '../utils/regular-expressions';
import Can from './can';
import ChatMention from './ChatMention';
import ChatConfirmDeleteModal from './ConfirmDeleteModal';

interface IChatItem {
  comment: IComment;
  onAction: (id: string) => void;
}

const GET_USERS_BY_ID_FROM_DB = gql`
  query ($userQueryInput: UserQueryInput) {
    author: usersByIdFromDb(userQueryInput: $userQueryInput) {
      displayName
      imgUrl
    }
  }
`;

function ChatItem({ onAction, comment }: IChatItem) {
  const { authorId, _id, text } = comment;
  const [getParticipantDetailById, { data, loading }] = useLazyQuery(GET_USERS_BY_ID_FROM_DB);
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);
  const { user } = useAppContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const chatAuthor = useMemo(() => {
    if (authorId === user?._id) return user;
    return data?.author[0];
  }, [data, user, authorId]);

  useEffect(() => {
    if (authorId && authorId !== user?._id) {
      getParticipantDetailById({
        variables: { userQueryInput: { usersIds: [authorId] } },
      });
    }
  }, [authorId]);

  const isChatOwner = useMemo(() => user?._id === chatAuthor?._id, [user, chatAuthor]);

  return (
    <>
      <ChatConfirmDeleteModal data-id="dc472a4b9517" isOpen={isOpen} message={text} messageId={_id} onAction={onAction} onClose={onClose} />
      <Flex align={isChatOwner ? 'flex-end' : 'flex-start'} data-id="14e8c7b098e3" flexDirection="column" mb={3} w="full">
        <Flex alignItems="end" flexDirection="row" justify={isChatOwner ? 'flex-end' : 'flex-start'} w="full">
          {!isChatOwner &&
            (loading ? (
              <SkeletonCircle mr={2} size="8" />
            ) : (
              <Avatar
                data-id="95819a8477ae"
                loading="lazy"
                mr={2}
                name={chatAuthor?.displayName}
                p="2px"
                rounded="full"
                size="sm"
                src={chatAuthor?.imgUrl}
              />
            ))}
          <Flex alignItems="end" direction="column">
            {!isChatOwner &&
              (loading ? (
                <Skeleton height="14px" mb={1} width="80px" />
              ) : (
                <Text color="#718096" fontSize="10px" fontWeight="500" mb={1}>
                  {chatAuthor?.displayName}
                </Text>
              ))}
            <Box
              bg={isChatOwner ? '#462AC4' : '#EDF2F7'}
              borderRadius={isChatOwner ? '8px 8px 2px 8px' : '8px 8px 8px 4px'}
              boxShadow={isChatOwner ? '0 2px 8px #462AC420' : 'none'}
              color={isChatOwner ? '#FFFFFF' : '#2D3748'}
              data-id="17b1f009ed87"
              maxW="75%"
              minW="120px"
              onMouseEnter={() => setShowDeleteBtn(true)}
              onMouseLeave={() => setShowDeleteBtn(false)}
              position="relative"
              px={5}
              py={3}
            >
              <Text fontSize="sm" mb={1}>
                {reactStringReplace(text, chatMentionRegExp, (match, i) => (
                  <ChatMention data-id="1e14aba604d6" key={i} tag={match} />
                ))}
              </Text>
              <Flex align="center" justify={isChatOwner ? 'flex-end' : 'flex-start'}>
                <Can
                  action="comments.delete"
                  data={{ comment }}
                  data-id="37a0dc23ef23"
                  yes={() => (
                    <Button
                      colorScheme="red"
                      data-id="1eb4608d282d"
                      display={showDeleteBtn ? 'block' : 'none'}
                      mb={2}
                      ml={2}
                      onClick={() => onOpen()}
                      rightIcon={<DeleteIcon data-id="b213fabd621a" />}
                      size="xs"
                    >
                      Delete
                    </Button>
                  )}
                />
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default ChatItem;

export const chatItemStyles = {
  chatItem: {
    sentBg: '#462AC4',
    receivedBg: '#EDF2F7',
    receivedBgTM: '#F0F0F0',
    sentColor: '#FFFFFF',
    receivedColor: '#2D3748',
    dateColor: '#818197',
    mentionColor: '#FF9A00',
    delete: {
      bg: 'red',
      color: '#ffffff',
    },
  },
};
