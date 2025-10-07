import { Box, Flex, IconButton, Skeleton, Tooltip, useDisclosure } from '@chakra-ui/react';
import { format } from 'date-fns';
import { capitalize } from 'lodash';

import { Trashcan } from '../../icons';
import { IAnswer } from '../../interfaces/IAnswer';
import Can from '../can';
import AvatarCell from '../Table/Cells/AvatarCell';
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
      <AnswerDeleteModal answer={answer} data-id="000072" isOpen={isOpen} onClose={onClose} refetchAnswers={refetchAnswers} />
      <Box
        _hover={{ bg: '#F5F7FA' }}
        bg={rowBg}
        borderBottomColor="auditsList.headerBorderColor"
        borderBottomWidth="1px"
        color="auditsList.fontColor"
        cursor="pointer"
        data-id="000073"
        fontSize="14px"
        onClick={() => editAnswer(answer)}
        p="15px 25px"
        py={[1, 0]}
        w="full"
      >
        <Flex align="center" data-id="000074" h={['full', '60px']} position="relative" w="full">
          <Tooltip data-id="000075" label={answer?.question?.questionsCategory?.name}>
            <Flex data-id="000076" flexDir="column" w="11%">
              <Flex
                align="flex-start"
                color="auditsList.fontColor"
                data-id="000077"
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
                align="flex-start"
                color="auditsList.fontColor"
                data-id="000080"
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
              align="flex-start"
              color={`auditsList.${answer?.status}`}
              data-id="000082"
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
                align="flex-start"
                color="auditsList.fontColor"
                data-id="000085"
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
                ? (answer?.audit?.businessUnit?.name ?? '-')
                : (answer?.businessUnit?.name ?? '-')
            }
          >
            <Flex data-id="000087" flexDir="column" w="12%">
              <Flex
                align="flex-start"
                color="auditsList.fontColor"
                data-id="000088"
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
                  ? (answer?.audit?.businessUnit?.name ?? '-')
                  : (answer?.businessUnit?.name ?? '-')}
              </Flex>
            </Flex>
          </Tooltip>
          <Flex data-id="000089" flexDir="column" w="9%">
            <Flex
              align="flex-start"
              color="auditsList.fontColor"
              data-id="000090"
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
                <AvatarCell data-id="001205" users={answer.addedBy ? [answer.addedBy] : []} />
              </Skeleton>
            </Box>
          </Tooltip>
          <Tooltip data-id="000098" label={answer?.metatags?.addedAt && format(new Date(answer?.metatags.addedAt), 'd MMM yyyy')}>
            <Flex data-id="000099" w="10%">
              <Flex color="auditsList.fontColor" data-id="000100" fontSize="14px" fontWeight="500" opacity="1" pr={1}>
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
              action="answers.delete"
              data={{ answer, audit }}
              data-id="000103"
              // eslint-disable-next-line react/no-unstable-nested-components
              yes={() => (
                <IconButton
                  _hover={{ opacity: 0.7 }}
                  aria-label="Delete"
                  bg="none"
                  data-id="000104"
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
