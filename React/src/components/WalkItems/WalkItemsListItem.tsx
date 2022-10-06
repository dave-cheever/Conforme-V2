import { Avatar, Box, Flex, IconButton, Skeleton, Text, Tooltip, useDisclosure } from '@chakra-ui/react';
import { format } from 'date-fns';
import { capitalize } from 'lodash';

import { Trashcan } from '../../icons';
import { IAnswer } from '../../interfaces/IAnswer';
import WalkItemDeleteModal from './WalkItemDeleteModal';

const WalkItemsListItem = ({
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

  return (
    <>
      <WalkItemDeleteModal answer={answer} isOpen={isOpen} onClose={onClose} refetchAnswers={refetchAnswers} />
      <Box
        bg="white"
        borderBottomColor="walkItemsList.headerBorderColor"
        borderBottomWidth="1px"
        cursor="pointer"
        onClick={() => editAnswer(answer)}
        p="15px 25px"
        py={[1, 0]}
        w="full"
      >
        <Flex align="center" h={['full', '73px']} position="relative" w="full">
          <Tooltip label={answer?.question?.questionsCategory?.name}>
            <Flex flexDir="column" w="10%">
              <Flex
                align="flex-start"
                color="walkItemsList.fontColor"
                fontSize="smm"
                fontWeight="400"
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
          <Tooltip label={answer?.question?.question}>
            <Flex flexDir="column" w="15%">
              <Flex
                align="flex-start"
                color="walkItemsList.fontColor"
                fontSize="smm"
                fontWeight="400"
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

          <Flex flexDir="column" w="6%">
            <Flex
              align="flex-start"
              color={`walkItemsList.${answer?.status}`}
              fontSize="smm"
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
          <Tooltip label={answer?.audit?.location?.name}>
            <Flex flexDir="column" w="19%">
              <Flex
                align="flex-start"
                color="walkItemsList.fontColor"
                fontSize="smm"
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
            label={
              answer?.audit?.auditType?.businessUnitScope === 'audit'
                ? answer?.audit?.businessUnit?.name ?? '-'
                : answer?.businessUnit?.name ?? '-'
            }
          >
            <Flex flexDir="column" w="19%">
              <Flex
                align="flex-start"
                color="walkItemsList.fontColor"
                fontSize="smm"
                fontWeight="400"
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
          <Flex flexDir="column" w="5%">
            <Flex
              align="flex-start"
              color="walkItemsList.fontColor"
              fontSize="smm"
              fontWeight="400"
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
          <Tooltip label={answer.addedBy?.displayName}>
            <Box w="12%">
              <Skeleton isLoaded={!!answer} pr={1} rounded="full">
                {answer.addedBy ? (
                  <Flex align="center" direction="row">
                    <Avatar name={answer.addedBy?.displayName} size="xs" src={answer.addedBy?.imgUrl} />
                    <Text
                      color="walkItemsList.fontColor"
                      fontSize="13px"
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
                  <Flex fontSize="13px" fontStyle="italic">
                    Unassigned
                  </Flex>
                )}
              </Skeleton>
            </Box>
          </Tooltip>
          <Tooltip label={answer?.metatags?.addedAt && format(new Date(answer?.metatags.addedAt), 'd MMM yyyy')}>
            <Flex w="8%">
              <Flex color="walkItemsList.fontColor" fontSize="smm" fontWeight="400" opacity="1" pr={1}>
                {answer?.metatags?.addedAt ? (
                  format(new Date(answer?.metatags.addedAt), 'd MMM yyyy')
                ) : (
                  <Flex fontStyle="italic" pr={1}>
                    No added date
                  </Flex>
                )}
              </Flex>
            </Flex>
          </Tooltip>
          <Flex justify="flex-end" pr={1} w="6%">
            <IconButton
              _hover={{ opacity: 0.7 }}
              aria-label="Delete"
              bg="none"
              icon={<Trashcan stroke="walkItemsList.iconColor" />}
              minWidth="none"
              onClick={() => onOpen()}
              p={1}
            />
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default WalkItemsListItem;
