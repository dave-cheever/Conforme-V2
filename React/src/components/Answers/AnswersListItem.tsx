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
      <AnswerDeleteModal data-id="000072" answer={answer} isOpen={isOpen} onClose={onClose} refetchAnswers={refetchAnswers} />
      <Box
        data-id="000073"
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
        <Flex data-id="000074" align="center" h={['full', '60px']} position="relative" w="full">
          <Tooltip data-id="000075" label={answer?.question?.questionsCategory?.name}>
            <Flex data-id="000076" flexDir="column" w="11%">
              <Flex
                data-id="000077"
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
          <Tooltip data-id="000078" label={answer?.question?.question}>
            <Flex data-id="000079" flexDir="column" w="15%">
              <Flex
                data-id="000080"
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

          <Flex data-id="000081" flexDir="column" w="7%">
            <Flex
              data-id="000082"
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
          <Tooltip data-id="000083" label={answer?.audit?.location?.name}>
            <Flex data-id="000084" flexDir="column" w="14%">
              <Flex
                data-id="000085"
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
            data-id="000086"
            label={
              answer?.audit?.auditType?.businessUnitScope === 'audit'
                ? answer?.audit?.businessUnit?.name ?? '-'
                : answer?.businessUnit?.name ?? '-'
            }
          >
            <Flex data-id="000087" flexDir="column" w="12%">
              <Flex
                data-id="000088"
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
          <Flex data-id="000089" flexDir="column" w="9%">
            <Flex
              data-id="000090"
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
          <Tooltip data-id="000091" label={answer.addedBy?.displayName}>
            <Box data-id="000092" w="22%">
              <Skeleton data-id="000093" isLoaded={!!answer} pr={1} rounded="full">
                {answer.addedBy ? (
                  <Flex data-id="000094" align="center" direction="row">
                    <Avatar data-id="000095" name={answer?.addedBy?.displayName?.replace(/\s*\(.*?\)\s*/g, '')} size="xs" src={answer.addedBy?.imgUrl} />
                    <Text
                      data-id="000096"
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
                  <Flex data-id="000097" fontSize="14px" fontStyle="italic" fontWeight="500">
                    Unassigned
                  </Flex>
                )}
              </Skeleton>
            </Box>
          </Tooltip>
          <Tooltip data-id="000098" label={answer?.metatags?.addedAt && format(new Date(answer?.metatags.addedAt), 'd MMM yyyy')}>
            <Flex data-id="000099" w="10%">
              <Flex data-id="000100" color="auditsList.fontColor" fontSize="14px" fontWeight="500" opacity="1" pr={1}>
                {answer?.metatags?.addedAt ? (
                  format(new Date(answer?.metatags.addedAt), 'd MMM yyyy')
                ) : (
                  <Flex data-id="000101" fontStyle="italic" pr={1}>
                    No added date
                  </Flex>
                )}
              </Flex>
            </Flex>
          </Tooltip>
          <Flex data-id="000102" justify="flex-end" pr={1} w="6%">
            <Can
              data-id="000103"
              action="answers.delete"
              data={{ answer, audit }}
              // eslint-disable-next-line react/no-unstable-nested-components
              yes={() => (
                <IconButton
                  data-id="000104"
                  _hover={{ opacity: 0.7 }}
                  aria-label="Delete"
                  bg="none"
                  icon={<Trashcan data-id="000105" stroke="auditsList.iconColor" />}
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
