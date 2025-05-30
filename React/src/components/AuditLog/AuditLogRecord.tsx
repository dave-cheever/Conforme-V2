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

  const auditAddedUser: IUser = usersByIdFromDb && usersByIdFromDb?.length !== 0 && usersByIdFromDb[0];

  const isResponseAudit = isPathActive('/tracker-item');

  const displayUpdateDetails = (element, i, oldValue, newValue) =>
    (oldValue || newValue) && (
      <Flex
        data-id="3a8535aa8063"
        flexDirection={['column', 'row', 'row']}
        key={i}
        mb="2px"
        w="full">
        <Box
          data-id="3e0d4d6162a1"
          mr="20px"
          mt="10px"
          textAlign={['center', 'right']}
          w={['100%', '20%']}>
          {getLabelByField(element)}
        </Box>
        <Box
          bg={oldValue ? '#FFDCD1' : '#fff'}
          data-id="cb028267f731"
          mb={['2px', '0']}
          p="10px"
          w={['100%', '40%']}>
          {getFieldNameByValues(oldValue)}
        </Box>
        <Box
          bg={newValue ? '#CFFED4' : '#fff'}
          data-id="04d908cc8760"
          ml={['0', '20px']}
          p="10px"
          w={['100%', '40%']}>
          {getFieldNameByValues(newValue)}
        </Box>
      </Flex>
    );

  if (!audit.values || Object.keys(audit.values).length === 0) return null;

  const goToItem = () => {
    navigateTo(`/${getPathByCollectionName(audit.coll)}/${audit.element._id}`);
  };

  return (
    (<Flex data-id="b3064c19a983" flexDir="column" mb="18px" ml="20px">
      <Text
        color="auditLogRecordStyles.info.color"
        data-id="64e6dcb87326"
        fontSize="11px">
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain */}
        {format(new Date(audit?.metatags?.addedAt!), 'h:mm a')}
      </Text>
      <Flex align="center" data-id="5a385b0dee7a" mt="3">
        <Avatar
          borderColor="auditLogRecordStyles.info.border"
          data-id="98d604a944dd"
          h="32px"
          name={auditAddedUser?.displayName}
          rounded="full"
          src={auditAddedUser?.imgUrl}
          w="32px" />
        <Flex data-id="417eeae47b29" flexDir="column" ml="3">
          <Text
            color="auditLogRecordStyles.userInfo.color"
            data-id="5c97e4872250"
            fontSize="11px"
            opacity="0.5">
            {auditAddedUser ? `${auditAddedUser?.displayName}` : 'Unknown user'}
          </Text>
          <Text
            color="auditLogRecordStyles.title.action"
            data-id="84129d8e0387"
            fontSize="14px"
            noOfLines={1}>
            {getFieldNameByAction(audit.action)} {getSingularCollectionName(audit.coll)}{' '}
            {audit.action === 'add' && audit.coll === 'comments' && (
              <Text as="span" data-id="bfa3a252416f" fontWeight="light" pl={2}>
                {reactStringReplace(audit.values.text?.new?.value, chatMentionRegExp, (match, i) => (
                  <ChatMention data-id="2e39b89b7775" key={i} tag={match} />
                ))}
              </Text>
            )}
            {audit.action === 'delete' && audit.coll === 'comments' && (
              <Text as="span" data-id="c74ef2220af3" fontWeight="light" pl={2}>
                {reactStringReplace(audit.values.text?.old?.value, chatMentionRegExp, (match, i) => (
                  <ChatMention data-id="c81cb6542b49" key={i} tag={match} />
                ))}
              </Text>
            )}
            {!isResponseAudit && module?.type === 'tracker' && ' for '}
            <Text
              as="span"
              color="#462AC4"
              cursor="pointer"
              data-id="8656270505c2"
              fontWeight="bold"
              onClick={goToItem}
              pl={2}>
              {!isResponseAudit && audit.element.name}{' '}
            </Text>
          </Text>
        </Flex>
      </Flex>
      <Flex data-id="1632107ce266" direction="column" w="full">
        {audit.action === 'update' && (
          <Flex
            border="1px dashed"
            borderColor="auditLogRecordStyles.log.border"
            borderRadius="10px"
            data-id="32aecdf8bd68"
            flexDirection="column"
            ml="17px"
            mt="20px"
            p="25px 20px 20px 20px"
            w={['100%', '100%', '80%']}>
            <Box data-id="4dc0135b4726" maxH="245px" overflow="auto">
              {Object.keys(audit.values).map((element, i) =>
                displayUpdateDetails(element, i, audit.values[element].old?.label, audit.values[element].new?.label),
              )}
            </Box>
          </Flex>
        )}
      </Flex>
    </Flex>)
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
