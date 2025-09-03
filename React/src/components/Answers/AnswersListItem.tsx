import { Avatar, Box, Flex, IconButton, Skeleton, Text, Tooltip, useDisclosure } from '@chakra-ui/react';
import { format } from 'date-fns';
import { capitalize } from 'lodash';

import { Trashcan } from '../../icons';
import { IAnswer } from '../../interfaces/IAnswer';
import Can from '../can';
import AnswerDeleteModal from './AnswerDeleteModal';

function AnswersListItem({
  answer,
  refetchAnswers,
  editAnswer,
  index,
}: {
  answer: IAnswer;
  refetchAnswers: () => void;
  editAnswer: (answer: IAnswer) => void;
  index: number;
}) {
  const { audit } = answer;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const rowBg = index % 2 === 0 ? 'white' : 'gray.50';

  return (
    <>
      <AnswerDeleteModal data-id="030925-c1efec" answer={answer} isOpen={isOpen} onClose={onClose} refetchAnswers={refetchAnswers} />
      <Box
        data-id="030925-c7d3ca"
        _hover={{ bg: '#F5F7FA' }}
        bg={rowBg}
        borderBottomColor="auditsList.headerBorderColor"
        borderBottomWidth="1px"
        color="auditsList.fontColor"
        cursor="pointer"
        fontSize="14px"
        onClick={() => editAnswer(answer)}
        p="15px 25px"
        py={[1, 0]}
        w="full"
      >
        <Flex data-id="030925-5ace8a" align="center" h={['full', '60px']} position="relative" w="full">
          <Tooltip data-id="030925-082e61" label={answer?.question?.questionsCategory?.name}>
            <Flex data-id="030925-433e4d" flexDir="column" w="11%">
              <Flex
                data-id="030925-520715"
                align="flex-start"
                color="auditsList.fontColor"
                fontSize="14px"
                fontWeight="500"
                h="50%"
                lineHeight="18px"
                noOfLines={1}
                opacity="1"
                pr={1}
                pt="3px"
                textOverflow="ellipsis"
              >
                {answer?.question?.questionsCategory?.name}
              </Flex>
            </Flex>
          </Tooltip>
          <Tooltip data-id="030925-ecefc4" label={answer?.question?.question}>
            <Flex data-id="030925-d2d3f3" flexDir="column" w="15%">
              <Flex
                data-id="030925-1a55ed"
                align="flex-start"
                color="auditsList.fontColor"
                fontSize="14px"
                fontWeight="500"
                h="50%"
                lineHeight="18px"
                noOfLines={1}
                opacity="1"
                pr={1}
                pt="3px"
                textOverflow="ellipsis"
              >
                {answer?.question?.question ?? 'No description'}
              </Flex>
            </Flex>
          </Tooltip>

          <Flex data-id="030925-e22345" flexDir="column" w="7%">
            <Flex
              data-id="030925-d9d8cb"
              align="flex-start"
              color={`auditsList.${answer?.status}`}
              fontSize="14px"
              h="50%"
              lineHeight="18px"
              noOfLines={1}
              opacity="1"
              pr={1}
              pt="3px"
              textOverflow="ellipsis"
            >
              {answer?.question?.questionsCategory?.useStatus ? capitalize(answer?.status) : '-'}
            </Flex>
          </Flex>
          <Tooltip data-id="030925-46d8af" label={answer?.audit?.location?.name}>
            <Flex data-id="030925-fef470" flexDir="column" w="14%">
              <Flex
                data-id="030925-fcf4c2"
                align="flex-start"
                color="auditsList.fontColor"
                fontSize="14px"
                h="50%"
                lineHeight="18px"
                noOfLines={1}
                opacity="1"
                pr={1}
                pt="3px"
                textOverflow="ellipsis"
              >
                {audit?.location?.name ?? '-'}
              </Flex>
            </Flex>
          </Tooltip>
          <Tooltip
            data-id="030925-407d53"
            label={
              answer?.audit?.auditType?.businessUnitScope === 'audit'
                ? answer?.audit?.businessUnit?.name ?? '-'
                : answer?.businessUnit?.name ?? '-'
            }
          >
            <Flex data-id="030925-c9b19f" flexDir="column" w="12%">
              <Flex
                data-id="030925-fee70e"
                align="flex-start"
                color="auditsList.fontColor"
                fontSize="14px"
                fontWeight="500"
                h="50%"
                lineHeight="18px"
                noOfLines={1}
                opacity="1"
                pr={1}
                pt="3px"
                textOverflow="ellipsis"
              >
                {answer?.audit?.auditType?.businessUnitScope === 'audit'
                  ? answer?.audit?.businessUnit?.name ?? '-'
                  : answer?.businessUnit?.name ?? '-'}
              </Flex>
            </Flex>
          </Tooltip>
          <Flex data-id="030925-7c30d0" flexDir="column" w="9%">
            <Flex
              data-id="030925-280b38"
              align="flex-start"
              color="auditsList.fontColor"
              fontSize="14px"
              fontWeight="500"
              h="50%"
              lineHeight="18px"
              noOfLines={1}
              opacity="1"
              pr={1}
              pt="3px"
              textOverflow="ellipsis"
            >
              {answer?.actions?.length}
            </Flex>
          </Flex>
          <Tooltip data-id="030925-99b6b5" label={answer.addedBy?.displayName}>
            <Box data-id="030925-df511a" w="22%">
              <Skeleton data-id="030925-c8767d" isLoaded={!!answer} pr={1} rounded="full">
                {answer.addedBy ? (
                  <Flex data-id="030925-ebc46a" align="center" direction="row">
                    <Avatar data-id="030925-51ba6d" name={answer?.addedBy?.displayName?.replace(/\s*\(.*?\)\s*/g, '')} size="xs" src={answer.addedBy?.imgUrl} />
                    <Text
                      data-id="030925-56ddac"
                      color="auditsList.fontColor"
                      fontSize="14px"
                      fontWeight="500"
                      lineHeight="17px"
                      opacity="1"
                      overflow="hidden"
                      pl={3}
                      textOverflow="ellipsis"
                      w="full"
                      whiteSpace="nowrap"
                    >
                      {answer.addedBy?.displayName}
                    </Text>
                  </Flex>
                ) : (
                  <Flex data-id="030925-df4895" fontSize="14px" fontStyle="italic" fontWeight="500">
                    Unassigned
                  </Flex>
                )}
              </Skeleton>
            </Box>
          </Tooltip>
          <Tooltip data-id="030925-c3361b" label={answer?.metatags?.addedAt && format(new Date(answer?.metatags.addedAt), 'd MMM yyyy')}>
            <Flex data-id="030925-beff3c" w="10%">
              <Flex data-id="030925-4bbe5d" color="auditsList.fontColor" fontSize="14px" fontWeight="500" opacity="1" pr={1}>
                {answer?.metatags?.addedAt ? (
                  format(new Date(answer?.metatags.addedAt), 'd MMM yyyy')
                ) : (
                  <Flex data-id="030925-905a56" fontStyle="italic" pr={1}>
                    No added date
                  </Flex>
                )}
              </Flex>
            </Flex>
          </Tooltip>
          <Flex data-id="030925-99444b" justify="flex-end" pr={1} w="6%">
            <Can
              data-id="030925-41d819"
              action="answers.delete"
              data={{ answer, audit }}
              // eslint-disable-next-line react/no-unstable-nested-components
              yes={() => (
                <IconButton
                  data-id="030925-a2bae7"
                  _hover={{ opacity: 0.7 }}
                  aria-label="Delete"
                  bg="none"
                  icon={<Trashcan data-id="030925-0dab6b" stroke="auditsList.iconColor" />}
                  minWidth="none"
                  onClick={() => onOpen()}
                  p={1}
                />
              )}
            />
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default AnswersListItem;
