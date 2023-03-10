import { Avatar, Box, Button, Flex, Skeleton, Stack, Text, Tooltip } from '@chakra-ui/react';
import { format } from 'date-fns';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import useNavigate from '../../hooks/useNavigate';
import { ChevronRight, OpenExternalIcon } from '../../icons';
import { IAnswer } from '../../interfaces/IAnswer';

const WalkItemSquare = ({ answer, editAnswer }: { answer: IAnswer; editAnswer: (answer: IAnswer) => void }) => {
  const { openInNewTab } = useNavigate();
  return (
    (<Stack
      _hover={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.18)' }}
      bg="white"
      borderRadius="20px"
      boxShadow="sm"
      cursor="pointer"
      data-id="274beff484fa"
      flexShrink={0}
      h="290px"
      onClick={() => editAnswer(answer)}
      p="20px 25px 20px 25px"
      spacing={6}
      w={['full', 'full', '350px']}>
      <Flex align="center" data-id="2c889d94a85b" justify="space-between">
        <Box
          color="walkItemSquare.audit"
          data-id="0f0235b6ddf9"
          fontSize="ssm"
          opacity="1"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap">
          <Flex data-id="d49ff9383e9c">{answer?.audit?.auditType?.name}</Flex>
        </Box>
      </Flex>
      <Flex data-id="28f6a5207e80" w="full">
        <Skeleton data-id="8290d16a7df0" isLoaded={!!answer} rounded="full">
          <Tooltip data-id="3e6175a8cd23" label={answer?.addedBy?.displayName}>
            <Avatar
              boxSize="24px"
              cursor="pointer"
              data-id="5bb67ed36331"
              name={answer?.addedBy?.displayName}
              size="sm"
              src={answer?.addedBy?.imgUrl} />
          </Tooltip>
        </Skeleton>
        <Text
          color="walkItemSquare.title"
          data-id="3af3897093d1"
          fontSize="md"
          fontWeight="bold"
          isTruncated
          ml={3}
          w="calc(100% - 24px)">
          {answer?.question?.question}
        </Text>
      </Flex>
      <Flex data-id="d0efb9d5eb5c" w="full">
        {answer?.question?.questionsCategory?.useStatus && (
          <Box
            data-id="823264d5d481"
            fontSize={['smm', 'ssm']}
            overflow="hidden"
            textOverflow="ellipsis"
            w="200px"
            whiteSpace="nowrap">
            <Text color="walkItemSquare.section.title" data-id="502f6aef842f">Status</Text>
            <Text
              color="walkItemSquare.section.text"
              data-id="dc2d8310a61c"
              fontSize="ssm"
              textTransform="capitalize">
              {answer?.status ?? '-'}
            </Text>
          </Box>
        )}
        <Box
          data-id="d0ed74e8fe89"
          fontSize={['smm', 'ssm']}
          lineHeight="20px"
          overflow="hidden"
          pl={answer?.question?.questionsCategory?.useStatus ? 2 : 0}
          textOverflow="ellipsis"
          w="200px"
          whiteSpace="nowrap">
          <Text color="walkItemSquare.section.title" data-id="88d2eecb0e37">Date</Text>
          <Tooltip
            data-id="f4862e819372"
            label={format(new Date(answer?.metatags?.addedAt!), 'LLL-y') ?? '-'}>
            <Text
              color="walkItemSquare.section.text"
              data-id="ab2c975b0463"
              fontSize="ssm"
              textTransform="capitalize">
              {format(new Date(answer?.metatags?.addedAt!), 'LLL-y') ?? '-'}
            </Text>
          </Tooltip>
        </Box>
      </Flex>
      <Flex data-id="0d601a490618" w="full">
        <Box
          data-id="00e5ecabe6b5"
          fontSize={['smm', 'ssm']}
          lineHeight="20px"
          overflow="hidden"
          textOverflow="ellipsis"
          w="200px"
          whiteSpace="nowrap">
          <Text color="walkItemSquare.section.title" data-id="4aab2771a2fa">{capitalize(t('location'))}</Text>
          <Tooltip data-id="9997c3146caf" label={answer?.audit?.location?.name ?? '-'}>
            <Text
              color="walkItemSquare.section.text"
              data-id="1db069d7268a"
              fontSize="ssm"
              isTruncated
              textTransform="capitalize">
              {answer?.audit?.location?.name ?? '-'}
            </Text>
          </Tooltip>
        </Box>
        <Box
          data-id="1222f526cf7f"
          fontSize={['smm', 'ssm']}
          lineHeight="20px"
          overflow="hidden"
          pl={2}
          textOverflow="ellipsis"
          w="200px"
          whiteSpace="nowrap">
          <Text color="walkItemSquare.section.title" data-id="cf610698ec09">{capitalize(t('business unit'))}</Text>
          <Tooltip
            data-id="0310d2e5b32a"
            label={
              answer?.audit?.auditType?.businessUnitScope === 'audit'
                ? answer?.audit?.businessUnit?.name ?? '-'
                : answer?.businessUnit?.name ?? '-'
            }>
            <Text
              color="walkItemSquare.section.text"
              data-id="1025026a498a"
              fontSize="ssm"
              textTransform="capitalize">
              {answer?.audit?.auditType?.businessUnitScope === 'audit'
                ? answer?.audit?.businessUnit?.name ?? '-'
                : answer?.businessUnit?.name ?? '-'}
            </Text>
          </Tooltip>
        </Box>
      </Flex>
      <Flex align="center" data-id="fb22c917a78c" justify="space-between" w="full">
        <Box
          data-id="f117f8ae1113"
          fontSize={['smm', 'ssm']}
          lineHeight="20px"
          overflow="hidden"
          textOverflow="ellipsis"
          w="200px"
          whiteSpace="nowrap">
          <Text
            color="walkItemSquare.section.title"
            data-id="2dd84df43800"
            fontSize="ssm">
            Linked to
          </Text>
          <Stack
            _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
            align="center"
            data-id="f278de8c9661"
            direction="row"
            onClick={() => openInNewTab(`/audits/${answer?.audit?._id}`)}
            spacing={2}>
            <Text
              color="walkItemSquare.section.text"
              data-id="1b47d4da4fa8"
              fontSize="ssm"
              isTruncated
              maxWidth="250px">
              {`${answer?.audit?.auditor?.displayName} - ${answer?.audit?.reference}`}
            </Text>
            <OpenExternalIcon data-id="97f80f97cc2c" fill="transparent" stroke="black" />
          </Stack>
        </Box>
        <Button
          _hover={{
            bg: 'walkItemSquare.button.default.bg',
          }}
          alignSelf="flex-end"
          bg="walkItemSquare.button.default.bg"
          color="walkItemSquare.button.default.color"
          data-id="dd63a6455c67"
          fontSize="ssm"
          h="28px"
          onClick={() => editAnswer(answer)}
          rightIcon={<ChevronRight
            boxSize="15px"
            color="walkItemSquare.button.default.color"
            data-id="30084d3fd275" />}
          w="85px">
          {answer?.audit?.status === 'upcoming' ? 'Update' : 'View'}
        </Button>
      </Flex>
    </Stack>)
  );
};

export default WalkItemSquare;

export const walkItemSquareStyles = {
  walkItemSquare: {
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
    },
  },
};
