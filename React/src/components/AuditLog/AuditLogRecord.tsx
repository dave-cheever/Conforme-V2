import React from "react";
import {
  Flex,
  Box,
  Avatar,
  Text,
} from "@chakra-ui/react";
import moment from "moment";

import { getCollectionNameByAction, getFieldNameByAction, getFieldNameByValues, getLabelByField } from "../../utils/helpers";
import { IAuditLogRecord } from "../../interfaces/IAuditLog";
import { useAppContext } from "../../contexts/AppProvider";

const AuditLogRecord = ({ audit }: { audit: IAuditLogRecord }) => {
  const {
    user,
  } = useAppContext();

  const displayUpdateDetails = (element, i, oldValue, newValue) => {
    return (
      (oldValue || newValue) && <Flex key={i} w='full' mb='2px' flexDirection={['column', 'row', 'row']}>
        <Box w={['100%', '20%']} mt='10px' textAlign={['center', 'right']} mr='20px'>{getLabelByField(element)}</Box>
        <Box w={['100%', '40%']} bg={oldValue ? '#FFDCD1' : '#fff'} p='10px' mb={['2px', '0']}>{getFieldNameByValues(oldValue)}</Box>
        <Box w={['100%', '40%']} bg={newValue ? '#CFFED4' : '#fff'} p='10px' ml={['0', '20px']}>{getFieldNameByValues(newValue)}</Box>
      </Flex>
    );
  };

  if (!audit.values || Object.keys(audit.values).length === 0) {
    return null;
  }

  return (
    <Flex mb="18px">
      <Flex h="36px" w="145px" bg="auditLogRecordStyles.info.bg" rounded="10px" alignItems="center">
        <Box ml="33px" justifySelf="end" fontSize="sm" color="auditLogRecordStyles.info.color" opacity="50%">{moment(audit?.metatags?.addedAt).format('HH:mm A')}</Box>
        <Box>
          <Avatar
            borderColor='auditLogRecordStyles.info.border'
            rounded='full'
            size='xs'
            ml="10px"
          />
        </Box>
      </Flex>
      <Flex direction='column' w='full'>
        <Flex ml="17px" mt="5px" color="auditLogRecordStyles.title.color">
          <Text> {audit?.metatags?.addedBy !== user?._id ? (`${user?.firstName} ${user?.lastName}` || 'Unknown user') : "You"}</Text>
          <Text color="auditLogRecordStyles.title.action">&nbsp;{getFieldNameByAction(audit.action)} {getCollectionNameByAction(audit.coll)}</Text>
          <Text>&nbsp;{audit.element.name}</Text>
        </Flex>
        {audit.action === 'delete' && audit.coll === 'comments' &&
          <Flex
            ml="17px"
            border='1px dashed'
            borderColor='auditLogRecordStyles.log.border'
            borderRadius='10px'
            w={['100%', '100%', '80%']}
            mt='20px'
            p='25px 20px 20px 20px'
            flexDirection="column"
          >
            <Box maxH='245px' overflow='auto'>
              {audit.values?.text?.old?.value}
            </Box>
          </Flex>}
        {audit.action === 'add' && audit.coll === 'comments' &&
          <Flex
            ml="17px"
            border='1px dashed'
            borderColor='auditLogRecordStyles.log.border'
            borderRadius='10px'
            w={['100%', '100%', '80%']}
            mt='20px'
            p='25px 20px 20px 20px'
            flexDirection="column"
          >
            <Box maxH='245px' overflow='auto'>
              {audit.values?.text?.new?.value}
            </Box>
          </Flex>}
        {audit.action === 'update' &&
          <Flex
            ml="17px"
            border='1px dashed'
            borderColor='auditLogRecordStyles.log.border'
            borderRadius='10px'
            w={['100%', '100%', '80%']}
            mt='20px'
            p='25px 20px 20px 20px'
            flexDirection="column"
          >
            <Box maxH='245px' overflow='auto'>
              {Object.keys(audit.values).map((element, i) => displayUpdateDetails(element, i, audit.values[element].old?.label, audit.values[element].new?.label))}
            </Box>
          </Flex>}
      </Flex>
    </Flex>
  );
};

export const auditLogRecordStyles = {
  auditLogRecordStyles: {
    info: {
      bg: '#F2F2F2',
      color: '#2B3236',
      border: '#816ce1',
    },
    title: {
      color: '#2B3236',
      action: '#000',
    },
    log: {
      border: '#9A9EA1',
    },
  },
};

export default AuditLogRecord;