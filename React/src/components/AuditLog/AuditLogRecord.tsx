import React, { useMemo } from "react";
import { Flex, Box, Avatar, Text } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import format from "date-fns/format";
import { useHistory } from "react-router-dom";
import reactStringReplace from "react-string-replace";

import {
  getCollectionNameByAction,
  getFieldNameByAction,
  getFieldNameByValues,
  getLabelByField,
} from "../../utils/helpers";
import { IAuditLogRecord } from "../../interfaces/IAuditLog";
import { IUser } from "../../interfaces/IUser";
import ChatMention from "../Response/ChatMention";

const GET_USERS_BY_ID = gql`
  query ($userQueryInput: UserQueryInput) {
    usersById(userQueryInput: $userQueryInput) {
      _id
      firstName
      lastName
      imgUrl
    }
  }
`;

const AuditLogRecord = ({ audit }: { audit: IAuditLogRecord }) => {
  const history = useHistory();

  const { data: { usersById } = [] } = useQuery(GET_USERS_BY_ID, {
    variables: {
      userQueryInput: { usersIds: audit.metatags?.addedBy || [] },
    },
  });

  const auditAddedUser: IUser =
    usersById && usersById?.length !== 0 && usersById[0];

  const isResponseAudit = useMemo(() => {
    return history.location.pathname.includes("/compliance-item");
  }, [history]);

  const displayUpdateDetails = (element, i, oldValue, newValue) => {
    return (
      (oldValue || newValue) && (
        <Flex
          key={i}
          w="full"
          mb="2px"
          flexDirection={["column", "row", "row"]}
        >
          <Box
            w={["100%", "20%"]}
            mt="10px"
            textAlign={["center", "right"]}
            mr="20px"
          >
            {getLabelByField(element)}
          </Box>
          <Box
            w={["100%", "40%"]}
            bg={oldValue ? "#FFDCD1" : "#fff"}
            p="10px"
            mb={["2px", "0"]}
          >
            {getFieldNameByValues(oldValue)}
          </Box>
          <Box
            w={["100%", "40%"]}
            bg={newValue ? "#CFFED4" : "#fff"}
            p="10px"
            ml={["0", "20px"]}
          >
            {getFieldNameByValues(newValue)}
          </Box>
        </Flex>
      )
    );
  };

  if (!audit.values || Object.keys(audit.values).length === 0) {
    return null;
  }

  const goToItem = () => {
    history.push(`/compliance-item/${audit.element._id}`);
  };

  return (
    <Flex mb="18px" flexDir="column" ml="20px">
      <Text fontSize="11px" color="auditLogRecordStyles.info.color">
        {format(new Date(audit?.metatags?.addedAt!), "h:mm a")}
      </Text>
      <Flex align="center" mt="3">
        <Avatar
          borderColor="auditLogRecordStyles.info.border"
          rounded="full"
          src={auditAddedUser?.imgUrl}
          w="32px"
          h="32px"
        />
        <Flex flexDir="column" ml="3">
          <Text
            fontSize="11px"
            color="auditLogRecordStyles.userInfo.color"
            opacity="0.5"
          >
            {auditAddedUser
              ? `${auditAddedUser?.firstName} ${auditAddedUser?.lastName}`
              : "Unknown user"}
          </Text>
          <Text color="auditLogRecordStyles.title.action" fontSize="14px">
            {getFieldNameByAction(audit.action)}{" "}
            {getCollectionNameByAction(audit.coll)}{" "}
            {audit.action === "add" && audit.coll === "comments" && (
              <Text as="span" pl={2} fontWeight="light">
                {reactStringReplace(audit.values.text?.new?.value, /(@@@\([\w]+\)\[[\w-]+\])/g, (match, i) => (
                  <ChatMention key={i} tag={match} />
                ))}
              </Text>
            )}
            {audit.action === "delete" && audit.coll === "comments" && (
              <Text as="span" pl={2} fontWeight="light">
                {reactStringReplace(audit.values.text?.new?.value, /(@@@\([\w]+\)\[[\w-]+\])/g, (match, i) => (
                  <ChatMention key={i} tag={match} />
                ))}
              </Text>
            )}
            {!isResponseAudit && " for "}
            <Text
              as="span"
              cursor="pointer"
              color="#462AC4"
              fontWeight="bold"
              onClick={goToItem}
            >
              {!isResponseAudit && audit.element.name}{" "}
            </Text>
          </Text>
        </Flex>
      </Flex>
      <Flex direction="column" w="full">
        {audit.action === "update" && (
          <Flex
            ml="17px"
            border="1px dashed"
            borderColor="auditLogRecordStyles.log.border"
            borderRadius="10px"
            w={["100%", "100%", "80%"]}
            mt="20px"
            p="25px 20px 20px 20px"
            flexDirection="column"
          >
            <Box maxH="245px" overflow="auto">
              {Object.keys(audit.values).map((element, i) =>
                displayUpdateDetails(
                  element,
                  i,
                  audit.values[element].old?.label,
                  audit.values[element].new?.label
                )
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
      color: "#1F1F1F",
      border: "#816ce1",
    },
    userInfo: {
      color: "#282F36",
    },
    title: {
      color: "#282F36",
      action: "#000",
    },
    log: {
      border: "#9A9EA1",
    },
  },
};

export default AuditLogRecord;
