import reactStringReplace from 'react-string-replace';

import { gql, useQuery } from '@apollo/client';
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import format from 'date-fns/format';

import { useAppContext } from '../../contexts/AppProvider';
import useNavigate from '../../hooks/useNavigate';
import { IAuditLogRecord } from '../../interfaces/IAuditLog';
import { IUser } from '../../interfaces/IUser';
import {
  getFieldNameByAction,
  getFieldNameByValues,
  getLabelByField,
  getPathByCollectionName,
  getSingularCollectionName,
} from '../../utils/helpers';
import { chatMentionRegExp } from '../../utils/regular-expressions';
import ChatMention from '../ChatMention';

const GET_USERS_BY_ID_FROM_DB = gql`
  query ($userQueryInput: UserQueryInput) {
    usersByIdFromDb(userQueryInput: $userQueryInput) {
      _id
      displayName
      imgUrl
    }
  }
`;

function AuditLogRecord({ audit }: { audit: IAuditLogRecord }) {
  const { navigateTo, isPathActive } = useNavigate();
  const { module } = useAppContext();

  const { data: { usersByIdFromDb } = [] } = useQuery(GET_USERS_BY_ID_FROM_DB, {
    variables: {
      userQueryInput: { usersIds: audit.metatags?.addedBy || [] },
    },
  });

  const auditAddedUser: IUser =
    usersByIdFromDb && usersByIdFromDb.length > 0 ? usersByIdFromDb[0] : null;

  const isResponseAudit = isPathActive('/tracker-item');

  if (!audit.values || Object.keys(audit.values).length === 0) return null;

  const goToItem = () => {
    navigateTo(`/${getPathByCollectionName(audit.coll)}/${audit.element._id}`);
  };

  const displayUpdateDetails = (element, i, oldValue, newValue) => {
    if (!oldValue && !newValue) return null;

    return (
      <Flex data-id="030925-0aa246" direction="column" key={i} mt="2">
        <Text
          color="gray.600"
          data-id="030925-aa079b"
          fontSize="xs"
          fontWeight="medium"
          mb="1">
          {getLabelByField(element)}
        </Text>
        <Flex data-id="030925-4f1cbb">
          <Box
            bg={oldValue ? 'red.50' : 'gray.100'}
            borderRadius="md"
            data-id="030925-285d18"
            flex="1"
            fontSize="sm"
            p="2">
            {getFieldNameByValues(oldValue)}
          </Box>
          <Box
            bg={newValue ? 'green.50' : 'gray.100'}
            borderRadius="md"
            data-id="030925-2d275f"
            flex="1"
            fontSize="sm"
            ml="2"
            p="2">
            {getFieldNameByValues(newValue)}
          </Box>
        </Flex>
      </Flex>
    );
  };

  return (
    <Flex
      align="flex-start"
      bg="#F7FAFC"
      border="1px solid #CBD5E0"
      borderRadius="lg"
      boxShadow="sm"
      data-id="030925-6b4ce3"
      direction="row"
      mb="4"
      p="4">
      <Avatar
        data-id="030925-cc6521"
        mt="1"
        name={auditAddedUser?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
        size="sm"
        src={auditAddedUser?.imgUrl} />
      <Box data-id="030925-e0bf2b" flex="1" ml="3">
        <Flex align="center" data-id="030925-edd1e2" justify="space-between">
          <Text color="#4A5568" data-id="030925-d2e7b9" fontSize="16px" fontWeight="600">
            {auditAddedUser ? auditAddedUser.displayName : 'Unknown User'}
          </Text>
          <Text color="#718096" data-id="030925-81120f" fontSize="14px" fontWeight="500">
            {format(new Date(audit?.metatags?.addedAt!), 'dd/MM/yyyy HH:mm')}
          </Text>
        </Flex>

        <Text color="#718096" data-id="030925-2543ed" fontSize="14px" mt="1">
          {getFieldNameByAction(audit.action)} {getSingularCollectionName(audit.coll)}{' '}
          {audit.coll === 'comments' && (audit.action === 'add' || audit.action === 'delete') && (
            <Box as="span" data-id="030925-eb4b50" display="inline" ml="2">
              {reactStringReplace(
                audit.values.text?.[audit.action === 'delete' ? 'old' : 'new']?.value,
                chatMentionRegExp,
                (match, i) => <ChatMention data-id="030925-cd443e" key={i} tag={match} />,
              )}
            </Box>
          )}
          {!isResponseAudit && module?.type === 'tracker' && audit.element?.name && (
            <>
              {' for '}
              <Text
                as="span"
                color="purple.600"
                cursor="pointer"
                data-id="030925-be55dc"
                fontWeight="medium"
                onClick={goToItem}>
                {audit.element.name}
              </Text>
            </>
          )}
        </Text>

        {audit.action === 'update' && (
          <Box data-id="030925-7e4045" mt="3">
            {Object.keys(audit.values).map((element, i) =>
              displayUpdateDetails(
                element,
                i,
                audit.values[element].old?.label,
                audit.values[element].new?.label,
              ),
            )}
          </Box>
        )}
      </Box>
    </Flex>
  );
}

export const auditLogRecordStyles = {
  auditLogRecordStyles: {
    info: {
      color: '#1F1F1F',
      border: '#816ce1',
    },
    userInfo: {
      color: '#282F36',
    },
    title: {
      color: '#282F36',
      action: '#000',
    },
    log: {
      border: '#9A9EA1',
    },
  },
};

export default AuditLogRecord;
