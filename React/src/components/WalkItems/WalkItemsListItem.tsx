import { Avatar, Box, Flex, HStack, IconButton, Skeleton, Text, useDisclosure } from '@chakra-ui/react';
import { format } from 'date-fns';

import useNavigate from '../../hooks/useNavigate';
import { RedirectIcon, Trashcan } from '../../icons';
import { IAnswer } from '../../interfaces/IAnswer';
import { IAudit } from '../../interfaces/IAudit';
import WalkItemDeleteModal from './WalkItemDeleteModal';

const WalkItemsListItem = ({ answer, audit, refetchAnswers }: { answer: IAnswer; audit: IAudit; refetchAnswers: () => void }) => {
  const { navigateTo } = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <WalkItemDeleteModal answer={answer} isOpen={isOpen} onClose={onClose} refetchAnswers={refetchAnswers} />
      <Box bg="white" borderBottomColor="walkItemsList.headerBorderColor" borderBottomWidth="1px" p="15px 25px" py={[1, 0]} w="full">
        <Flex align="center" h={['full', '73px']} position="relative" w="full">
          <Flex flexDir="column" w="20%">
            <Flex
              align="flex-start"
              color="walkItemsList.fontColor"
              fontSize="14px"
              fontWeight="400"
              h="50%"
              lineHeight="18px"
              noOfLines={1}
              opacity="1"
              pt="3px"
              textOverflow="ellipsis"
            >
              {answer?.question?.questionsCategory?.name}
            </Flex>
          </Flex>
          <Flex flexDir="column" w="25%">
            <Flex
              align="flex-start"
              color="walkItemsList.fontColor"
              fontSize="14px"
              fontWeight="400"
              h="50%"
              lineHeight="18px"
              noOfLines={1}
              opacity="1"
              pt="3px"
              textOverflow="ellipsis"
            >
              {answer?.question?.question ?? 'No description'}
            </Flex>
          </Flex>
          <Flex flexDir="column" w="15%">
            <Flex
              align="flex-start"
              color="walkItemsList.fontColor"
              fontSize="14px"
              fontWeight="400"
              h="50%"
              lineHeight="18px"
              noOfLines={1}
              opacity="1"
              pt="3px"
              textOverflow="ellipsis"
            >
              {audit?.area?.name ?? 'Virtual'}
            </Flex>
          </Flex>
          <Flex flexDir="column" w="15%">
            <Flex
              align="flex-start"
              color="walkItemsList.fontColor"
              fontSize="14px"
              fontWeight="400"
              h="50%"
              lineHeight="18px"
              noOfLines={1}
              opacity="1"
              pt="3px"
              textOverflow="ellipsis"
            >
              {answer?.actions?.length}
            </Flex>
          </Flex>
          <Box w="20%">
            <Skeleton isLoaded={!!answer} rounded="full">
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
          <Flex w="10%">
            <Flex color="walkItemsList.fontColor" fontSize="14px" fontWeight="400" opacity="1">
              {answer?.metatags?.addedAt ? (
                format(new Date(answer?.metatags.addedAt), 'd MMM yyyy')
              ) : (
                <Flex fontStyle="italic">No added date</Flex>
              )}
            </Flex>
          </Flex>
          <Flex w="10%">
            <Flex color="walkItemsList.fontColor" fontSize="14px" fontWeight="400" opacity="1">
              <HStack>
                <IconButton
                  _hover={{ opacity: 0.7 }}
                  aria-label="Audit"
                  bg="none"
                  icon={<RedirectIcon stroke="walkItemsList.iconColor" />}
                  onClick={() => navigateTo(`/audits/${audit._id}?questionId=${answer?.questionId}`)}
                />
                <IconButton
                  _hover={{ opacity: 0.7 }}
                  aria-label="Delete"
                  bg="none"
                  icon={<Trashcan stroke="walkItemsList.iconColor" />}
                  onClick={() => onOpen()}
                />
              </HStack>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default WalkItemsListItem;
