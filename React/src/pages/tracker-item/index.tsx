import { useRef } from 'react';
import DatePicker from 'react-datepicker';

import { gql, useMutation } from '@apollo/client';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Stack, Text, VStack } from '@chakra-ui/react';
import { format } from 'date-fns';

import Can from '../../components/can';
import Attachments from '../../components/Response/Attachments';
import DescriptionText from '../../components/Response/DescriptionText';
import EditButton from '../../components/Response/EditButton';
import RenewalModal from '../../components/Response/RenewalModal';
import ResponseQuestions from '../../components/Response/ResponseQuestions';
import { useResponseContext } from '../../contexts/ResponseProvider';
import { Asterisk } from '../../icons';

const UPDATE_RESPONSE = gql`
  mutation ($updateResponseModify: UpdateResponseModify!) {
    updateResponse(updateResponseModify: $updateResponseModify) {
      dueDate
    }
  }
`;

const TrackerItemResponse = () => {
  const {
    response,
    snapshot,
    snapshots,
    refetch,
    activeTab,
    setActiveTab: updateActiveTab,
    handleRenewalOpen,
    isQuestionFormDirty,
    setIsQuestionFormDirty,
  } = useResponseContext();
  const [updateResponse] = useMutation(UPDATE_RESPONSE);
  const dueDatePickerRef = useRef<DatePicker>();
  const inProgress = response.status === 'draft';
  const neverReviewed = snapshots?.length === 0;

  const setActiveTab = (index: number) => {
    if (isQuestionFormDirty) {
      // eslint-disable-next-line no-alert
      const confirm = window.confirm(
        'You have unsaved changes, you will lose all of your changes. Are you sure you want to navigate away?',
      );
      if (!confirm) return;
      setIsQuestionFormDirty(false);
    }
    updateActiveTab(index);
  };

  // TODO: Fix confetti
  // const confettiHeight = useMemo(() => {
  //   if (device === 'desktop') return window.innerHeight - 100;
  //   if (device === 'tablet') return window.innerHeight - 100;
  //   return window.innerHeight - 200;
  // }, [device, window]);

  // const confettiWidth = useMemo(() => {
  //   if (device === 'desktop') return window.innerWidth - 300;
  //   if (device === 'tablet') return window.innerWidth - 200;
  //   return window.innerWidth - 80;
  // }, [device, window]);

  const updateResponseDate = async (date) => {
    await updateResponse({
      variables: {
        updateResponseModify: {
          _id: response._id,
          dueDate: date,
        },
      },
    });
    dueDatePickerRef.current.setOpen(false);
    refetch();
  };

  return (
    <>
      <RenewalModal data-id="7f05297e6ef7" />
      {/* <Confetti height={confettiHeight} recycle={false} run={run} width={confettiWidth} /> */}
      <VStack
        bg="trackerItemResponse.bg"
        borderRadius="20px"
        data-id="480bd5641c9b"
        h={['fit-content', 'full']}
        p={[4, 6]}
        spacing={8}
        w="full"
      >
        {response?.trackerItem?.description && (
          <VStack align="flex-start" data-id="ba4e31687f1a" w="full">
            <Text color="responseRenewalDetails.labelColor" data-id="3fdcbbbd24bc" fontSize="14px">
              Description
            </Text>
            <DescriptionText data-id="5aead750267f" />
          </VStack>
        )}
        <Stack align="center" data-id="5c5be4db9311" direction={['column', 'row']} spacing={4} w="full">
          <Flex cursor={neverReviewed ? 'default' : 'pointer'} data-id="3e2945759d8b" justify="space-between" w={['full', '30%']}>
            <Flex
              align={['center', 'flex-start']}
              bg="responseRenewalDetails.bg"
              border={activeTab === 0 ? '1px solid #ccc' : 'null'}
              borderRadius="10px"
              boxShadow={activeTab === 0 ? 'simple' : 'null'}
              data-id="2075e9644aa1"
              flexDir="column"
              onClick={() => !neverReviewed && setActiveTab(0)}
              p="10px 20px"
              w="full"
            >
              <Text color="responseRenewalDetails.labelColor" data-id="16c9ff646474" fontSize="11px">
                {snapshot ? 'Review date' : 'Last reviewed'}
              </Text>
              <Text color="responseRenewalDetails.textColor" data-id="532c9f15a7f0" fontSize="14px">
                {response.lastCompletionDate ? format(new Date(response.lastCompletionDate), 'dd MMMM yyyy') : 'Never reviewed before'}
              </Text>
            </Flex>
          </Flex>
          {!snapshot && (
            <ArrowDownIcon color="responseRenewalDetails.labelColor" data-id="ddb22a55938b" transform={['', 'rotate(270deg)']} />
          )}
          {!snapshot && (
            <Flex
              align="center"
              bg="responseRenewalDetails.bg"
              border={activeTab === 1 ? '1px solid #ccc' : 'null'}
              borderRadius="10px"
              boxShadow={activeTab === 1 ? 'simple' : 'null'}
              cursor="pointer"
              data-id="e3b50e7b47c4"
              onClick={() => {
                if (!inProgress) handleRenewalOpen();
                else setActiveTab(1);
              }}
              p="10px 20px"
              position="relative"
              w={['full', '30%']}
            >
              <Flex align="center" data-id="83803140aa0a" flexDir={['column', 'row']} justifyContent="space-between" w="full">
                <VStack align={['center', 'flex-start']} data-id="a43275b82b29" spacing={0} w="full">
                  <Text color="responseRenewalDetails.labelColor" data-id="7659892ee14c" fontSize="11px">
                    Perform new review by
                  </Text>
                  <Text color="responseRenewalDetails.textColor" data-id="cfe0d57bc939" fontSize="14px">
                    {response.dueDate ? format(new Date(response.dueDate), 'dd MMMM yyyy') : 'No due date'}
                  </Text>
                </VStack>
                {!snapshot && response?.trackerItem?.dueDateEditable && (
                  <Can
                    action="responses.edit"
                    data={{ response }}
                    data-id="40bf98993fac"
                    yes={() => (
                      <Flex data-id="9b78196a361d" onClick={(e) => e.stopPropagation()}>
                        <DatePicker
                          customInput={<EditButton data-id="c28a1bc841dc" />}
                          data-id="fcf3eebe33d2"
                          dateFormatCalendar="MMMM"
                          disabledKeyboardNavigation
                          dropdownMode="select"
                          onChange={(date) => updateResponseDate(date)}
                          ref={dueDatePickerRef}
                          selected={response?.dueDate ? new Date(response?.dueDate) : new Date()}
                          showYearDropdown
                        >
                          <Button
                            colorScheme="purpleHeart"
                            data-id="00ffbf0fef0e"
                            onClick={() => updateResponseDate(null)}
                            size="sm"
                            w="full"
                          >
                            No due date
                          </Button>
                        </DatePicker>
                      </Flex>
                    )}
                  />
                )}
              </Flex>
            </Flex>
          )}
        </Stack>
        <Box
          data-id="ad5f30e95bce"
          overflow={['visible', 'auto']}
          position="relative"
          sx={{
            '&::-webkit-scrollbar': {
              backgroundColor: 'responseChat.scrollBar.bg',
              width: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'responseChat.scrollBar.color',
            },
          }}
          w="full"
        >
          {(response?.trackerItem?.allowAttachments || response?.trackerItem?.evidenceItems?.length > 0) && (
            <Attachments data-id="e29303a626fa" />
          )}
          <ResponseQuestions data-id="6f47063f5a4a" disabled={activeTab === 0} key={activeTab} />
          {(response.questions.filter(({ required }) => required).length > 0 || response.evidence.length > 0) && activeTab === 1 && (
            <Flex data-id="3a04b45b8ee2" mt="3" w="full">
              <Asterisk
                data-id="65b804dc01d9"
                fill="questionListElement.iconAsterisk"
                h="9px"
                stroke="questionListElement.iconAsterisk"
                w="9px"
              />
              &nbsp;
              <Text data-id="e47d9c460a4b" fontSize="sm" fontWeight="semi_medium">
                Required
              </Text>
            </Flex>
          )}
        </Box>
      </VStack>
    </>
  );
};

export default TrackerItemResponse;

export const trackerItemResponseStyles = {
  trackerItemResponse: {
    bg: 'white',
    nextButtonColor: '#818197',
    labelColor: '#818197',
    expandButtonText: '#462AC4',
    labelTextColor: '#1F1F1F',
    textColor: '#282F36',
  },
};
