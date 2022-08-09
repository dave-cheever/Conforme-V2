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
import ChatMention from '../Response/ChatMention';

const GET_USERS_BY_ID = gql`
  query ($userQueryInput: UserQueryInput) {
    usersById(userQueryInput: $userQueryInput) {
      _id
      displayName
      imgUrl
    }
  }
`;

const AuditLogRecord = ({ audit }: { audit: IAuditLogRecord }) => {
  const { navigateTo, isPathActive } = useNavigate();
  const { module } = useAppContext();

  const { data: { usersById } = [] } = useQuery(GET_USERS_BY_ID, {
    variables: {
      userQueryInput: { usersIds: audit.metatags?.addedBy || [] },
    },
  });

  const auditAddedUser: IUser = usersById && usersById?.length !== 0 && usersById[0];

  const isResponseAudit = isPathActive('/compliance-item');

  const displayUpdateDetails = (element, i, oldValue, newValue) =>
    (oldValue || newValue) && (
      <Flex flexDirection={['column', 'row', 'row']} key={i} mb="2px" w="full">
        <Box mr="20px" mt="10px" textAlign={['center', 'right']} w={['100%', '20%']}>
          {getLabelByField(element)}
        </Box>
        <Box bg={oldValue ? '#FFDCD1' : '#fff'} mb={['2px', '0']} p="10px" w={['100%', '40%']}>
          {getFieldNameByValues(oldValue)}
        </Box>
        <Box bg={newValue ? '#CFFED4' : '#fff'} ml={['0', '20px']} p="10px" w={['100%', '40%']}>
          {getFieldNameByValues(newValue)}
        </Box>
      </Flex>
    );

  if (!audit.values || Object.keys(audit.values).length === 0) return null;

  const goToItem = () => {
    navigateTo(`/${getPathByCollectionName(audit.coll)}/${audit.element._id}`);
  };

  return (
    <Flex flexDir="column" mb="18px" ml="20px">
      <Text color="auditLogRecordStyles.info.color" fontSize="11px">
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain */}
        {format(new Date(audit?.metatags?.addedAt!), 'h:mm a')}
      </Text>
      <Flex align="center" mt="3">
        <Avatar borderColor="auditLogRecordStyles.info.border" h="32px" rounded="full" src={auditAddedUser?.imgUrl} w="32px" />
        <Flex flexDir="column" ml="3">
          <Text color="auditLogRecordStyles.userInfo.color" fontSize="11px" opacity="0.5">
            {auditAddedUser ? `${auditAddedUser?.displayName}` : 'Unknown user'}
          </Text>
          <Text color="auditLogRecordStyles.title.action" fontSize="14px">
            {getFieldNameByAction(audit.action)} {getSingularCollectionName(audit.coll)}{' '}
            {audit.action === 'add' && audit.coll === 'comments' && (
              <Text as="span" fontWeight="light" pl={2}>
                {reactStringReplace(audit.values.text?.new?.value, /(@@@\([\w+( +\w+)*$]+\)\[[\w-]+\])/g, (match, i) => (
                  <ChatMention key={i} tag={match} />
                ))}
              </Text>
            )}
            {audit.action === 'delete' && audit.coll === 'comments' && (
              <Text as="span" fontWeight="light" pl={2}>
                {reactStringReplace(audit.values.text?.new?.value, /(@@@\([\w+( +\w+)*$]+\)\[[\w-]+\])/g, (match, i) => (
                  <ChatMention key={i} tag={match} />
                ))}
              </Text>
            )}
            {!isResponseAudit && module?.type === 'tracker' && ' for '}
            <Text as="span" color="#462AC4" cursor="pointer" fontWeight="bold" onClick={goToItem}>
              {!isResponseAudit && audit.element.name}{' '}
            </Text>
          </Text>
        </Flex>
      </Flex>
      <Flex direction="column" w="full">
        {audit.action === 'update' && (
          <Flex
            border="1px dashed"
            borderColor="auditLogRecordStyles.log.border"
            borderRadius="10px"
            flexDirection="column"
            ml="17px"
            mt="20px"
            p="25px 20px 20px 20px"
            w={['100%', '100%', '80%']}
          >
            <Box maxH="245px" overflow="auto">
              {Object.keys(audit.values).map((element, i) =>
                displayUpdateDetails(element, i, audit.values[element].old?.label, audit.values[element].new?.label),
              )}
            </Box>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

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
