import { Avatar, Box, Button, Flex, HStack, Skeleton, Stack, Text, Tooltip } from '@chakra-ui/react';
import { formatDistanceToNow, isBefore } from 'date-fns';

import useNavigate from '../../hooks/useNavigate';
import { ChevronRight, OpenExternalIcon, WarningIcon } from '../../icons';
import { IAction } from '../../interfaces/IAction';

function ActionSquare({ action, editAction }: { action: IAction; editAction: (action: IAction) => void }) {
  const { openInNewTab } = useNavigate();

  const isOverdue = action.dueDate && action.status === 'open' && isBefore(new Date(action.dueDate), new Date());

  return (
    (<Stack
      _hover={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.18)' }}
      bg="white"
      borderRadius="20px"
      boxShadow="sm"
      cursor="pointer"
      data-id="c183bb49dbf2"
      flexShrink={0}
      h="290px"
      onClick={() => editAction(action)}
      p="20px 25px 20px 25px"
      spacing={6}
      w={['full', 'full', '350px']}>
      <Flex align="center" data-id="8ff8e7b553a1" justify="space-between">
        <Box
          color="actionSquare.audit"
          data-id="f80fabbc8028"
          fontSize="ssm"
          opacity="1"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap">
          <Flex data-id="01b42a547347">{action?.answer?.audit?.auditType?.name}</Flex>
        </Box>
        {!action?.metatags?.updatedAt && (
          <Box
            bg="actionSquare.badge.bg"
            color="actionSquare.badge.color"
            data-id="33d156b035ec"
            fontSize="ssm"
            px={2}
            py="1px"
            rounded="full">
            New
          </Box>
        )}
      </Flex>
      {/* eslint-disable-next-line react/jsx-max-props-per-line */}
      <Flex data-id="fad37ada3c13" w="full">
        <Skeleton data-id="cd4cbf19cc19" isLoaded={!!action} rounded="full">
          <Tooltip
            data-id="01a1cd7a7e9a"
            label={action?.assignee?.displayName ?? 'No assignee'}>
            <Avatar
              boxSize="24px"
              cursor="pointer"
              data-id="02bc017105fd"
              name={action?.assignee?.displayName}
              size="sm"
              src={action?.assignee?.imgUrl} />
          </Tooltip>
        </Skeleton>
        <Text
          color="actionSquare.title"
          data-id="a020a4b78b8d"
          fontSize="md"
          fontWeight="bold"
          ml={3}
          noOfLines={1}
          w="calc(100% - 24px)">
          {action?.title}
        </Text>
      </Flex>
      <Flex data-id="aaba7aeba271" w="full">
        <Box
          data-id="0d7f81443288"
          overflow="hidden"
          textOverflow="ellipsis"
          w="200px"
          whiteSpace="nowrap">
          <Text
            color="actionSquare.section.title"
            data-id="e1ea5964506f"
            fontSize={['smm', 'ssm']}>
            Priority
          </Text>
          <Text
            color="actionSquare.section.text"
            data-id="3600a90aea56"
            fontSize="ssm"
            textTransform="capitalize">
            {action?.priority}
          </Text>
        </Box>
        {action?.dueDate && (
          <Box
            data-id="d5368487d206"
            overflow="hidden"
            textOverflow="ellipsis"
            w="200px"
            whiteSpace="nowrap">
            <Text
              color="actionSquare.section.title"
              data-id="3b6c01cc03c0"
              fontSize={['smm', 'ssm']}>
              Due in
            </Text>
            <Text color="actionSquare.section.text" data-id="73ef0e3249c6" fontSize="ssm">
              {formatDistanceToNow(new Date(action.dueDate))}
            </Text>
          </Box>
        )}
      </Flex>
      <Box data-id="7d072c317876" w="full">
        <Text
          color="actionSquare.section.title"
          data-id="51d58e6f255a"
          fontSize={['smm', 'ssm']}>
          Linked to
        </Text>
        <Stack
          _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
          align="center"
          data-id="94b7cb9d3d5e"
          direction="row"
          onClick={() => openInNewTab(`/audits/${action?.answer?.audit?._id}`)}
          spacing={2}>
          <Text
            color="actionSquare.section.text"
            data-id="7d858fa06e38"
            fontSize="ssm"
            noOfLines={1}>
            {action?.answer?.question?.question},{' '}
            {action?.answer?.audit?.auditType?.businessUnitScope === 'audit'
              ? action?.answer?.audit?.businessUnit?.name ?? '-'
              : action?.answer?.businessUnit?.name ?? '-'}
          </Text>
          <OpenExternalIcon data-id="46925e0859eb" fill="transparent" stroke="black" />
        </Stack>
      </Box>
      <Flex align="center" data-id="e3dc8efaacab" justify="space-between" w="full">
        <Button
          _hover={{
            bg: `actionSquare.button.${isOverdue ? 'missed' : 'default'}.bg`,
          }}
          bg={`actionSquare.button.${isOverdue ? 'missed' : 'default'}.bg`}
          color={`actionSquare.button.${isOverdue ? 'missed' : 'default'}.color`}
          data-id="9e94cb369ecd"
          fontSize="ssm"
          h="28px"
          onClick={() => editAction(action)}
          rightIcon={<ChevronRight
            boxSize="15px"
            color={`actionSquare.button.${isOverdue ? 'missed' : 'default'}.color`}
            data-id="137cbad8b61b" />}
          w="85px">
          More
        </Button>
        {isOverdue && (
          <HStack align="center" data-id="97a8026dc449" spacing={2}>
            <WarningIcon
              data-id="9370ac121b56"
              fill="actionSquare.missed.icon.fill"
              h="22px"
              stroke="actionSquare.missed.icon.stroke"
              w="18px" />
            <Text
              color="actionSquare.missed.color"
              data-id="9de502775ba4"
              fontSize="ssm"
              fontWeight="bold">
              Overdue
            </Text>
          </HStack>
        )}
      </Flex>
    </Stack>)
  );
}

export default ActionSquare;

export const actionSquareStyles = {
  actionSquare: {
    badge: {
      bg: '#41B916',
      color: '#FFF',
    },
    audit: '#1E183670',
    title: '#1E1836',
    section: {
      title: '#1E183670',
      text: '#1E1836',
    },
    button: {
      default: {
        bg: '#1315351A',
        color: '#1E1836',
      },
      missed: {
        bg: '#DC0043',
        color: '#FFFFFF',
      },
    },
    missed: {
      icon: {
        stroke: '#DC0043',
        fill: 'transparent',
      },
      color: '#DC0043',
    },
  },
};
