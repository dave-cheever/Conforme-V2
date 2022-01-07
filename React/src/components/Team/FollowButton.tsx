import React, { useMemo } from "react";
import { useToast } from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";

import { useResponseContext } from "../../contexts/ResponseProvider";
import { useAppContext } from "../../contexts/AppProvider";
import { toastFailed, toastSuccess } from "../../bootstrap/config";
import Can from "../can";
import ResponseHeaderButton from "../Response/ResponseHeader/ResponseHeaderButton";
import { FollowIcon, UnFollowIcon } from "../../icons";
import ResponseHeaderMenuItem from "../Response/ResponseHeader/ResponseHeaderMenuItem";

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

const FollowButton = ({ isMobile = false }) => {

  const { response, refetch } = useResponseContext();
  const { user } = useAppContext();
  const toast = useToast();
  const [addParticipant, { loading }] = useMutation(ADD_PARTICIPANT);
  const [removeParticipant, { loading: unFollowLoading }] = useMutation(REMOVE_PARTICIPANT);

  const isFollower = useMemo(() => {
    if (!user?._id) {
      return false;
    }
    if (response.followersIds?.length === 0) {
      return false;
    }
    return response?.followersIds?.includes(user?._id);
  }, [response, user]);

  const handleFollow = async () => {
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
      toast({
        ...toastSuccess,
        title: "Success",
        description: "Response follow success",
      });
    } catch (error: any) {
      toast({
        ...toastFailed,
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleUnFollow = async () => {
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
      toast({
        ...toastSuccess,
        title: "Success",
        description: "Response Unfollow success",
      });
    } catch (error: any) {
      toast({
        ...toastFailed,
        title: "Error",
        description: error.message,
      });
    }
  };

  const Icon = useMemo(() => {
    if (isFollower) {
      return (
        <UnFollowIcon
          fontSize="15px"
          stroke="reasponseHeader.buttonLightColor"
          fill="transparent"
          _groupHover={{ stroke: "reasponseHeader.buttonLightColorHover" }}
        />
      );
    }

    return (
      <FollowIcon
        fontSize="15px"
        stroke="reasponseHeader.buttonLightColor"
        fill="transparent"
        _groupHover={{ stroke: "reasponseHeader.buttonLightColorHover" }}
      />
    );
  }, [isFollower]);

  if (isMobile) {
    return (
      <Can
        action="responses.manageFollower"
        yes={() => (
        <ResponseHeaderMenuItem
          title={isFollower ? "Unfollow" : "Follow"}
          icon={Icon}
          onClick={isFollower ? handleUnFollow : handleFollow}
        />)}
      />
    );
  }

  return (
    <Can
      action="responses.manageFollower"
      yes={() => (
        <ResponseHeaderButton
          name={isFollower ? "Unfollow" : "Follow"}
          icon={Icon}
          loading={loading || unFollowLoading}
          onClick={isFollower ? handleUnFollow : handleFollow}
        />
      )}
    />
  );
};

export default FollowButton;
