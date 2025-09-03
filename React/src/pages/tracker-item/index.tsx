import { useRef, useState } from 'react';
import DatePicker from 'react-datepicker';

import { gql, useMutation } from '@apollo/client';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from '@chakra-ui/react';
import { format } from 'date-fns';

import Can from '../../components/can';
import Attachments from '../../components/Response/Attachments';
import DescriptionText from '../../components/Response/DescriptionText';
import EditButton from '../../components/Response/EditButton';
import RenewalModal from '../../components/Response/RenewalModal';
import ResponseQuestions from '../../components/Response/ResponseQuestions';
import { useResponseContext } from '../../contexts/ResponseProvider';
import { Asterisk, AttachmentClipIcon, EnvelopeIcon, QuestionIconNew } from '../../icons';

const UPDATE_RESPONSE = gql`
  mutation ($updateResponseModify: UpdateResponseModify!) {
    updateResponse(updateResponseModify: $updateResponseModify) {
      dueDate
    }
  }
`;

function TrackerItemResponse() {
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
  const [tabIndex, setTabIndex] = useState(0);

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
    setTabIndex(index);
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
      <RenewalModal data-id="030925-a7c8aa" />
      {/* <Confetti height={confettiHeight} recycle={false} run={run} width={confettiWidth} /> */}
      <VStack
        data-id="030925-bf1ff2"
        border="1px solid"
        borderColor="trackerItemResponse.borderColor"
        borderRadius="8px"
        h={['fit-content', 'full']}
        overflowY="scroll"
        p={[4, 6]}
        spacing={8}
        w="full"
      >
        <Tabs
          data-id="030925-f1ecff"
          colorScheme="purple"
          index={tabIndex}
          onChange={setActiveTab}
          variant="unstyled"
          w="full">
          <TabList data-id="030925-5dbb11" mb={4} overflow="auto">
            <Tab
              data-id="030925-5b40d3"
              _focus={{ boxShadow: 'none' }}
              _selected={{ bg: '#462AC4', color: 'white' }}
              alignItems="center"
              borderRadius="10px"
              display="flex"
              fontSize={["12px", "14px"]}
              fontWeight="500"
              gap={2}
              mr={3}
              px={3}
              py={2}>
              <EnvelopeIcon data-id="030925-f77fa1" /> Details
            </Tab>
            <Tab
              data-id="030925-a269fe"
              _focus={{ boxShadow: 'none' }}
              _selected={{ bg: '#462AC4', color: 'white' }}
              alignItems="center"
              borderRadius="10px"
              display="flex"
              fontSize={["12px", "14px"]}
              fontWeight="500"
              gap={2}
              mr={3}
              px={3}
              py={2}>
              <AttachmentClipIcon data-id="030925-20d106" /> Attachments
            </Tab>
            <Tab
              data-id="030925-bcda5f"
              _focus={{ boxShadow: 'none' }}
              _selected={{ bg: '#462AC4', color: 'white' }}
              alignItems="center"
              borderRadius="10px"
              display="flex"
              fontSize={["12px", "14px"]}
              fontWeight="500"
              gap={2}
              px={3}
              py={2}>
              <QuestionIconNew data-id="030925-205250" /> Questions
            </Tab>
          </TabList>
          <TabPanels data-id="030925-2836fd">
            {/* Details Tab */}
            <TabPanel data-id="030925-c5384a" px={0}>
              {response?.trackerItem?.description && (
                <VStack data-id="030925-8a58bf" align="flex-start" w="full">
                  <Text data-id="030925-8b67bc" color="responseRenewalDetails.labelColor" fontSize="14px">
                    Description
                  </Text>
                  <DescriptionText data-id="030925-76acef" />
                </VStack>
              )}
              <Stack data-id="030925-5975e6" align="center" direction={['column', 'row']} mt={6} spacing={4} w="full">
                <Flex data-id="030925-884747" cursor={neverReviewed ? 'default' : 'pointer'} justify="space-between" w={['full', '30%']}>
                  <Flex
                    data-id="030925-71ec08"
                    align={['center', 'flex-start']}
                    bg="responseRenewalDetails.bg"
                    border={activeTab === 0 ? '1px solid #ccc' : 'null'}
                    borderRadius="10px"
                    boxShadow={activeTab === 0 ? 'simple' : 'null'}
                    flexDir="column"
                    onClick={() => !neverReviewed && setActiveTab(0)}
                    p="10px 20px"
                    w="full"
                  >
                    <Text data-id="030925-b6b697" color="responseRenewalDetails.labelColor" fontSize="11px">
                      {snapshot ? 'Review date' : 'Last reviewed'}
                    </Text>
                    <Text data-id="030925-a83a5e" color="responseRenewalDetails.textColor" fontSize="14px">
                      {response.lastCompletionDate
                        ? format(new Date(response.lastCompletionDate), 'dd MMMM yyyy')
                        : 'Never reviewed before'}
                    </Text>
                  </Flex>
                </Flex>
                {!snapshot && (
                  <ArrowDownIcon data-id="030925-fbfcbe" color="responseRenewalDetails.labelColor" transform={['', 'rotate(270deg)']} />
                )}
                {!snapshot && (
                  <Flex
                    data-id="030925-87c715"
                    align="center"
                    bg="responseRenewalDetails.bg"
                    border={activeTab === 1 ? '1px solid #ccc' : 'null'}
                    borderRadius="10px"
                    boxShadow={activeTab === 1 ? 'simple' : 'null'}
                    cursor="pointer"
                    onClick={() => {
                      if (!inProgress) handleRenewalOpen();
                      else setActiveTab(1);
                    }}
                    p="10px 20px"
                    position="relative"
                    w={['full', '30%']}
                  >
                    <Flex data-id="030925-fbf81f" align="center" flexDir={['column', 'row']} justifyContent="space-between" w="full">
                      <VStack data-id="030925-acc47e" align={['center', 'flex-start']} spacing={0} w="full">
                        <Text data-id="030925-504c4a" color="responseRenewalDetails.labelColor" fontSize="11px">
                          Perform new review by
                        </Text>
                        <Text data-id="030925-04d17f" color="responseRenewalDetails.textColor" fontSize="14px">
                          {response.dueDate ? format(new Date(response.dueDate), 'dd MMMM yyyy') : 'No due date'}
                        </Text>
                      </VStack>
                      {!snapshot && response?.trackerItem?.dueDateEditable && (
                        <Can
                          data-id="030925-c8c127"
                          action="responses.edit"
                          data={{ response }}
                          yes={() => (
                            <Flex data-id="030925-4b2637" onClick={(e) => e.stopPropagation()}>
                              <DatePicker
                                data-id="030925-5524f4"
                                customInput={<EditButton data-id="030925-94e7bd" />}
                                dateFormatCalendar="MMMM"
                                disabledKeyboardNavigation
                                dropdownMode="select"
                                onChange={(date) => updateResponseDate(date)}
                                ref={dueDatePickerRef}
                                selected={response?.dueDate ? new Date(response?.dueDate) : new Date()}
                                showYearDropdown
                              >
                                <Button
                                  data-id="030925-d1a4ca"
                                  colorScheme="purpleHeart"
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
            </TabPanel>
            {/* Attachments Tab */}
            <TabPanel data-id="030925-460c72" px={0}>
              <Box
                data-id="030925-afcd79"
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
                  <Attachments data-id="030925-f8992e" />
                )}
              </Box>
            </TabPanel>
            {/* Questions Tab */}
            <TabPanel data-id="030925-774044" px={0}>
              <Box
                data-id="030925-5cffcf"
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
                <ResponseQuestions data-id="030925-dc6bba" disabled={activeTab === 0} key={activeTab} />
                {(response.questions.filter(({ required }) => required).length > 0 || response.evidence.length > 0) && (
                  <Flex data-id="030925-c5c9cf" mt="3" w="full">
                    <Asterisk
                      data-id="030925-03250d"
                      fill="questionListElement.iconAsterisk"
                      h="9px"
                      stroke="questionListElement.iconAsterisk"
                      w="9px"
                    />
                    &nbsp;
                    <Text data-id="030925-d4c56b" fontSize="sm" fontWeight="semi_medium">
                      Required
                    </Text>
                  </Flex>
                )}
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </>
  );
}

export default TrackerItemResponse;

export const trackerItemResponseStyles = {
  trackerItemResponse: {
    bg: 'white',
    borderColor: '#CBD5E0',
    nextButtonColor: '#818197',
    labelColor: '#818197',
    expandButtonText: '#462AC4',
    labelTextColor: '#1F1F1F',
    textColor: '#282F36',
  },
};
