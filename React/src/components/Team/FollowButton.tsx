import React from "react";
import { useToast, Flex } from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";

import { useResponseContext } from "../../contexts/ResponseProvider";
import { useAppContext } from "../../contexts/AppProvider";
import { toastFailed } from "../../bootstrap/config";
import Can from "../can";
import ResponseHeaderButton from "../Response/ResponseHeader/ResponseHeaderButton";
import { FollowIcon } from "../../icons";

const ADD_PARTICIPANT = gql`
  mutation ($responseParticipantModify: ResponseParticipantModify!) {
    addParticipant(responseParticipantModify: $responseParticipantModify) {
      _id
    }
  }
`;

const REMOVE_PARTICIPANT = gql`
  mutation ($responseParticipantRemove: ResponseParticipantRemove!) {
    removeParticipant(responseParticipantRemove: $responseParticipantRemove)
  }
`;

const FollowButton = () => {
  const { response, refetch } = useResponseContext();
  const { user } = useAppContext();
  const toast = useToast();

  const [addParticipant] = useMutation(ADD_PARTICIPANT);
  const [removeParticipant] = useMutation(REMOVE_PARTICIPANT);

  return (
    <Can
      action="responses.manageFollower"
      yes={() => (
        <Flex>
          {response &&
          user &&
          response.followersIds &&
          !response.followersIds.includes(user._id) ? (
            <ResponseHeaderButton
              name="Follow"
              icon={
                <FollowIcon
                  fontSize="15px"
                  stroke="reasponseHeader.buttonLightColor"
                  _groupHover={{ stroke: 'reasponseHeader.buttonLightColorHover' }}
                />
              }
              onClick={async () => {
                try {
                  await addParticipant({
                    variables: {
                      responseParticipantModify: {
                        _id: response?._id,
                        participantIds: [user?._id],
                        permission: "follower",
                      },
                    },
                  });
                  refetch();
                } catch (error: any) {
                  toast({
                    ...toastFailed,
                    title: "Error",
                    description: error.message,
                  });
                }
              }}
            />
          ) : (
            <ResponseHeaderButton
              name="Unfollow"
              icon={
                <FollowIcon
                  fontSize="15px"
                  stroke="reasponseHeader.buttonLightColor"
                  _groupHover={{ stroke: 'reasponseHeader.buttonLightColorHover' }}
                />
              }
              onClick={async () => {
                try {
                  await removeParticipant({
                    variables: {
                      responseParticipantRemove: {
                        _id: response?._id,
                        participantId: user?._id,
                        permission: "follower",
                      },
                    },
                  });
                  refetch();
                } catch (error: any) {
                  toast({
                    ...toastFailed,
                    title: 'Error',
                    description: error.message
                  })
                }
              }}
            />
          )}
        </Flex>
      )}
    />
  );
};

export default FollowButton;
