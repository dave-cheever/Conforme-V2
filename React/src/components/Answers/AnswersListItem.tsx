import { Avatar, Box, Flex, IconButton, Skeleton, Text, Tooltip, useDisclosure } from '@chakra-ui/react';
import { format } from 'date-fns';
import { capitalize } from 'lodash';

import { Trashcan } from '../../icons';
import { IAnswer } from '../../interfaces/IAnswer';
import Can from '../can';
import AnswerDeleteModal from './AnswerDeleteModal';

const AnswersListItem = ({
  answer,
  refetchAnswers,
  editAnswer,
}: {
  answer: IAnswer;
  refetchAnswers: () => void;
  editAnswer: (answer: IAnswer) => void;
}) => {
  const { audit } = answer;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (<>
    <AnswerDeleteModal
      answer={answer}
      data-id="1cd611f67cfe"
      isOpen={isOpen}
      onClose={onClose}
      refetchAnswers={refetchAnswers} />
    <Box
      bg="white"
      borderBottomColor="answersList.headerBorderColor"
      borderBottomWidth="1px"
      cursor="pointer"
      data-id="b32f61ecbdf5"
      onClick={() => editAnswer(answer)}
      p="15px 25px"
      py={[1, 0]}
      w="full">
      <Flex
        align="center"
        data-id="e267f937d277"
        h={['full', '73px']}
        position="relative"
        w="full">
        <Tooltip data-id="4930e5d9eb1e" label={answer?.question?.questionsCategory?.name}>
          <Flex data-id="84a14b65ba63" flexDir="column" w="10%">
            <Flex
              align="flex-start"
              color="answersList.fontColor"
              data-id="f9f8d6f0a7cf"
              fontSize="smm"
              fontWeight="400"
              h="50%"
              lineHeight="18px"
              noOfLines={1}
              opacity="1"
              pr={1}
              pt="3px"
              textOverflow="ellipsis">
              {answer?.question?.questionsCategory?.name}
            </Flex>
          </Flex>
        </Tooltip>
        <Tooltip data-id="ce7577602c87" label={answer?.question?.question}>
          <Flex data-id="5f9ed47b8f8f" flexDir="column" w="15%">
            <Flex
              align="flex-start"
              color="answersList.fontColor"
              data-id="919032a37ae7"
              fontSize="smm"
              fontWeight="400"
              h="50%"
              lineHeight="18px"
              noOfLines={1}
              opacity="1"
              pr={1}
              pt="3px"
              textOverflow="ellipsis">
              {answer?.question?.question ?? 'No description'}
            </Flex>
          </Flex>
        </Tooltip>

        <Flex data-id="9ab90fdcdff9" flexDir="column" w="6%">
          <Flex
            align="flex-start"
            color={`answersList.${answer?.status}`}
            data-id="61ef301cf7f0"
            fontSize="smm"
            h="50%"
            lineHeight="18px"
            noOfLines={1}
            opacity="1"
            pr={1}
            pt="3px"
            textOverflow="ellipsis">
            {answer?.question?.questionsCategory?.useStatus ? capitalize(answer?.status) : '-'}
          </Flex>
        </Flex>
        <Tooltip data-id="667b70274b67" label={answer?.audit?.location?.name}>
          <Flex data-id="116b6736af00" flexDir="column" w="19%">
            <Flex
              align="flex-start"
              color="answersList.fontColor"
              data-id="b092ee97c56f"
              fontSize="smm"
              h="50%"
              lineHeight="18px"
              noOfLines={1}
              opacity="1"
              pr={1}
              pt="3px"
              textOverflow="ellipsis">
              {audit?.location?.name ?? '-'}
            </Flex>
          </Flex>
        </Tooltip>
        <Tooltip
          data-id="32a1265d8f58"
          label={
            answer?.audit?.auditType?.businessUnitScope === 'audit'
              ? answer?.audit?.businessUnit?.name ?? '-'
              : answer?.businessUnit?.name ?? '-'
          }>
          <Flex data-id="d3f6872183ee" flexDir="column" w="19%">
            <Flex
              align="flex-start"
              color="answersList.fontColor"
              data-id="2c8087aefc0d"
              fontSize="smm"
              fontWeight="400"
              h="50%"
              lineHeight="18px"
              noOfLines={1}
              opacity="1"
              pr={1}
              pt="3px"
              textOverflow="ellipsis">
              {answer?.audit?.auditType?.businessUnitScope === 'audit'
                ? answer?.audit?.businessUnit?.name ?? '-'
                : answer?.businessUnit?.name ?? '-'}
            </Flex>
          </Flex>
        </Tooltip>
        <Flex data-id="bab817a537a1" flexDir="column" w="5%">
          <Flex
            align="flex-start"
            color="answersList.fontColor"
            data-id="f8a7546c4393"
            fontSize="smm"
            fontWeight="400"
            h="50%"
            lineHeight="18px"
            noOfLines={1}
            opacity="1"
            pr={1}
            pt="3px"
            textOverflow="ellipsis">
            {answer?.actions?.length}
          </Flex>
        </Flex>
        <Tooltip data-id="7efe0d5fc7a6" label={answer.addedBy?.displayName}>
          <Box data-id="cb2d179113f9" w="12%">
            <Skeleton data-id="136093dab47e" isLoaded={!!answer} pr={1} rounded="full">
              {answer.addedBy ? (
                <Flex align="center" data-id="217de9441ce2" direction="row">
                  <Avatar
                    data-id="0ab0e498199c"
                    name={answer.addedBy?.displayName}
                    size="xs"
                    src={answer.addedBy?.imgUrl} />
                  <Text
                    color="answersList.fontColor"
                    data-id="aab06571e7b2"
                    fontSize="13px"
                    lineHeight="17px"
                    opacity="1"
                    overflow="hidden"
                    pl={3}
                    textOverflow="ellipsis"
                    w="full"
                    whiteSpace="nowrap">
                    {answer.addedBy?.displayName}
                  </Text>
                </Flex>
              ) : (
                <Flex data-id="2d8192713b74" fontSize="13px" fontStyle="italic">
                  Unassigned
                </Flex>
              )}
            </Skeleton>
          </Box>
        </Tooltip>
        <Tooltip
          data-id="2dc0b3233fc0"
          label={answer?.metatags?.addedAt && format(new Date(answer?.metatags.addedAt), 'd MMM yyyy')}>
          <Flex data-id="c5f30f2ffb79" w="8%">
            <Flex
              color="answersList.fontColor"
              data-id="5e0975b25aa6"
              fontSize="smm"
              fontWeight="400"
              opacity="1"
              pr={1}>
              {answer?.metatags?.addedAt ? (
                format(new Date(answer?.metatags.addedAt), 'd MMM yyyy')
              ) : (
                <Flex data-id="70fa87811c43" fontStyle="italic" pr={1}>
                  No added date
                </Flex>
              )}
            </Flex>
          </Flex>
        </Tooltip>
        <Flex data-id="e89d2c49ab7b" justify="flex-end" pr={1} w="6%">
          <Can
            action="answers.delete"
            data={{ answer, audit }}
            data-id="4d29e40e07be"
            yes={() => (
              <IconButton
                _hover={{ opacity: 0.7 }}
                aria-label="Delete"
                bg="none"
                data-id="b1c3123d66f9"
                icon={<Trashcan data-id="a4c0dc96c4ba" stroke="answersList.iconColor" />}
                minWidth="none"
                onClick={() => onOpen()}
                p={1} />
            )} />
        </Flex>
      </Flex>
    </Box>
  </>);
};

export default AnswersListItem;
