import React from "react";
import { useHistory } from "react-router-dom";
import { Avatar, Box, Flex, Icon, useToast, Text } from "@chakra-ui/react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { ChevronRight, Conforme, Copy } from "../../../icons";
import { navigationTabs, toastSuccess } from "../../../bootstrap/config";
import ResponseLeftTabItem from "../ResponseLeftTabItem";
import ResponseLeftItem from "../ResponseLeftItem";
import { useResponseContext } from "../../../contexts/ResponseProvider";
import { useFiltersContext } from "../../../contexts/FiltersProvider";
import { gql, useQuery } from "@apollo/client";
import { IUser } from "../../../interfaces/IUser";
import { useAppContext } from "../../../contexts/AppProvider";

const GET_USERS_BY_ID = gql`
  query ($userQueryInput: UserQueryInput) {
    usersById(userQueryInput: $userQueryInput) {
      _id
      firstName
      lastName
      displayName
      imgUrl
    }
  }
`;

const ResponseLeftNavigation = () => {
  const history = useHistory();
  const toast = useToast();
  const { organizationConfig } = useAppContext();

  const {
    showFiltersPanel
  } = useFiltersContext();

  const { response } = useResponseContext();
  const { data: { usersById: responseResponsible } = [] } = useQuery(GET_USERS_BY_ID, { variables: { userQueryInput: { usersIds: response?.responsibleId || [] } } });

  const responsible: IUser = responseResponsible && responseResponsible?.length !== 0 && responseResponsible[0];


  return (
    <Flex
      color="responseLeftNavigation.color"
      bg="responseLeftNavigation.bg"
      fontWeight="400"
      direction="column"
      w="240px"
      overflow="auto"
      px={6}
      justifyContent="space-between"
      display={["none", "none", "flex"]}
    >
      <Flex flexDirection="column">
        <Box
          display="flex"
          alignItems="center"
          h="80px"
          onClick={() => history.push('/')}
          cursor="pointer"
        >
          <Text
            w="80px"
            fontWeight="bold"
            fontSize="16px"
            color="navigationLeft.organizationNameFontColor"
          >
            {showFiltersPanel ? organizationConfig?.name.charAt(0) : organizationConfig?.name}
          </Text>
        </Box>
        <Flex
          cursor="pointer"
          align="center"
          onClick={() => history.push("/compliance-items")}
          color="responseLeftNavigation.goBackColor"
          fontSize="14px"
          h="30px"
          mb="30px"
        >
          <ChevronRight transform="Rotate(180deg)" mr={2} />
          Go Back
        </Flex>
        <Flex flexDirection="column" mb={2}>
          {navigationTabs.map(({ label, icon, url }) => (
            <ResponseLeftTabItem
              key={url}
              label={label}
              icon={icon}
              url={url}
            />
          ))}
        </Flex>
        <Box h="50px">
          <Box opacity={0.5} fontSize="11px">
            Item ID
          </Box>
          <Flex align="center" fontSize="14px" minH="28px">
            <Flex mr={2}>{response?.complianceItem.reference}</Flex>
            <CopyToClipboard
              text={response?.complianceItem.reference}
              onCopy={() =>
                toast({
                  ...toastSuccess,
                  title: "Item ID copied",
                  description: `${response?.complianceItem.reference} was copied to clipboard`,
                })
              }
            >
              <Copy
                color="responseLeftNavigation.copy"
                mt={1}
                h="17px"
                w="17px"
                _hover={{ opacity: 0.6, cursor: "pointer" }}
              />
            </CopyToClipboard>
          </Flex>
        </Box>
        <ResponseLeftItem
          heading="Business unit"
          value={response?.businessUnit?.name || "-"}
        />
        <Box h="50px" mt={2}>
          <Box opacity={0.5} fontSize="11px">
            Responsible
          </Box>
          <Flex align="center" fontSize="14px" minH="28px">
            <Avatar
              color="white"
              bg="responseLeftNavigation.avatar"
              name={
                responsible && responsible.firstName && responsible.lastName
                  ? `${responsible.firstName} ${responsible.lastName}`
                  : `${responsible?.displayName}`
              }
              src={responsible && responsible.imgUrl}
              size="xs"
              mr={2}
            />
            <Flex mr={2}>
              {responsible && responsible.firstName && responsible.lastName
                ? `${responsible.firstName} ${responsible.lastName}`
                : `${responsible?.displayName || "-"}`}
            </Flex>
          </Flex>
        </Box>
        <ResponseLeftItem
          heading="Category"
          value={response?.complianceItem?.category?.name || "-"}
        />
        <ResponseLeftItem
          heading="Regulatory body"
          value={response?.complianceItem?.regulatoryBody?.name || "-"}
        />
        <ResponseLeftItem
          heading="Frequency"
          value={response?.complianceItem?.frequency || "-"}
        />
      </Flex>
      <Flex>
        <Icon as={Conforme} w="103px" h="35px" mb="20px" />
      </Flex>
    </Flex>
  );
};

export default ResponseLeftNavigation;

export const responseLeftNavigationStyles = {
  responseLeftNavigation: {
    bg: "#E5E5E5",
    goBackColor: "#818197",
    color: "#282F36",
    building: "#2B3236",
    copy: "#FF9A00",
    avatar: "#462AC4",
    responseDetailActiveColor: "#F0F0F0"
  },
};
