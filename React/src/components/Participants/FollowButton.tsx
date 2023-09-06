import React, { useMemo } from 'react';

import { gql, useMutation } from '@apollo/client';
import { useToast } from '@chakra-ui/react';

import { toastFailed, toastSuccess } from '../../bootstrap/config';
import { useAppContext } from '../../contexts/AppProvider';
import { useResponseContext } from '../../contexts/ResponseProvider';
import { FollowIcon, UnFollowIcon } from '../../icons';
import Can from '../can';
import ResponseHeaderButton from '../Response/ResponseHeader/ResponseHeaderButton';
import ResponseHeaderMenuItem from '../Response/ResponseHeader/ResponseHeaderMenuItem';

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

// TODO: FixMe
// Follow button was hidden and methods used above were removed. Use updateResponse instead.

function FollowButton({ isMobile = false }) {
  const { response, refetch } = useResponseContext();
  const { user } = useAppContext();
  const toast = useToast();
  const [addParticipant, { loading }] = useMutation(ADD_PARTICIPANT);
  const [removeParticipant, { loading: unFollowLoading }] = useMutation(REMOVE_PARTICIPANT);

  const isFollower = useMemo(() => {
    if (!user?._id) return false;

    if (response.followersIds?.length === 0) return false;

    return response?.followersIds?.includes(user?._id);
  }, [response, user]);

  const handleFollow = async () => {
    try {
      await addParticipant({
        variables: {
          responseParticipantModify: {
            _id: response?._id,
            participantIds: [user?._id],
            permission: 'follower',
          },
        },
      });
      refetch();
      toast({
        ...toastSuccess,
        title: 'Success',
        description: 'Response follow success',
      });
    } catch (error: any) {
      toast({
        ...toastFailed,
        title: 'Error',
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
            permission: 'follower',
          },
        },
      });
      refetch();
      toast({
        ...toastSuccess,
        title: 'Success',
        description: 'Response Unfollow success',
      });
    } catch (error: any) {
      toast({
        ...toastFailed,
        title: 'Error',
        description: error.message,
      });
    }
  };

  const Icon = useMemo(() => {
    if (isFollower) {
      return (
        (<UnFollowIcon
          _groupHover={{ stroke: 'reasponseHeader.buttonLightColorHover' }}
          data-id="c13dfcf64268"
          fill="transparent"
          fontSize="15px"
          stroke="reasponseHeader.buttonLightColor" />)
      );
    }

    return (
      (<FollowIcon
        _groupHover={{ stroke: 'reasponseHeader.buttonLightColorHover' }}
        data-id="035525a6a179"
        fill="transparent"
        fontSize="15px"
        stroke="reasponseHeader.buttonLightColor" />)
    );
  }, [isFollower]);

  if (isMobile) {
    return (
      (<Can
        action="responses.manageFollower"
        data-id="6569777318bf"
        // eslint-disable-next-line react/no-unstable-nested-components
        yes={() => (
          <ResponseHeaderMenuItem
            data-id="7d799883554a"
            icon={Icon}
            name={isFollower ? 'Unfollow' : 'Follow'}
            onClick={isFollower ? handleUnFollow : handleFollow} />
        )} />)
    );
  }

  return (
    (<Can
      action="responses.manageFollower"
      data-id="ccb326bd96ac"
      // eslint-disable-next-line react/no-unstable-nested-components
      yes={() => (
        <ResponseHeaderButton
          data-id="55cc28e133b4"
          icon={Icon}
          loading={loading || unFollowLoading}
          name={isFollower ? 'Unfollow' : 'Follow'}
          onClick={isFollower ? handleUnFollow : handleFollow} />
      )} />)
  );
}

export default FollowButton;
