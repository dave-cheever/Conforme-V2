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
      <RenewalModal data-id="000766" />
      {/* <Confetti height={confettiHeight} recycle={false} run={run} width={confettiWidth} /> */}
      <VStack
        border="1px solid"
        borderColor="trackerItemResponse.borderColor"
        borderRadius="8px"
        data-id="000767"
        h={['fit-content', 'full']}
        overflowY="scroll"
        p={[4, 6]}
        spacing={8}
        w="full"
      >
        <Tabs
          colorScheme="purple"
          data-id="000768"
          index={tabIndex}
          onChange={setActiveTab}
          variant="unstyled"
          w="full">
          <TabList data-id="000769" mb={4} overflow="auto">
            <Tab
              _focus={{ boxShadow: 'none' }}
              _selected={{ bg: '#462AC4', color: 'white' }}
              alignItems="center"
              borderRadius="10px"
              data-id="000770"
              display="flex"
              fontSize={["12px", "14px"]}
              fontWeight="500"
              gap={2}
              mr={3}
              px={3}
              py={2}>
              <EnvelopeIcon data-id="000771" /> Details
            </Tab>
            <Tab
              _focus={{ boxShadow: 'none' }}
              _selected={{ bg: '#462AC4', color: 'white' }}
              alignItems="center"
              borderRadius="10px"
              data-id="000772"
              display="flex"
              fontSize={["12px", "14px"]}
              fontWeight="500"
              gap={2}
              mr={3}
              px={3}
              py={2}>
              <AttachmentClipIcon data-id="000773" /> Attachments
            </Tab>
            <Tab
              _focus={{ boxShadow: 'none' }}
              _selected={{ bg: '#462AC4', color: 'white' }}
              alignItems="center"
              borderRadius="10px"
              data-id="000774"
              display="flex"
              fontSize={["12px", "14px"]}
              fontWeight="500"
              gap={2}
              px={3}
              py={2}>
              <QuestionIconNew data-id="000775" /> Questions
            </Tab>
          </TabList>
          <TabPanels data-id="000776">
            {/* Details Tab */}
            <TabPanel data-id="000777" px={0}>
              {response?.trackerItem?.description && (
                <VStack align="flex-start" data-id="000778" w="full">
                  <Text color="responseRenewalDetails.labelColor" data-id="000779" fontSize="14px">
                    Description
                  </Text>
                  <DescriptionText data-id="000780" />
                </VStack>
              )}
              <Stack align="center" data-id="000781" direction={['column', 'row']} mt={6} spacing={4} w="full">
                <Flex cursor={neverReviewed ? 'default' : 'pointer'} data-id="000782" justify="space-between" w={['full', '30%']}>
                  <Flex
                    align={['center', 'flex-start']}
                    bg="responseRenewalDetails.bg"
                    border={activeTab === 0 ? '1px solid #ccc' : 'null'}
                    borderRadius="10px"
                    boxShadow={activeTab === 0 ? 'simple' : 'null'}
                    data-id="000783"
                    flexDir="column"
                    onClick={() => !neverReviewed && setActiveTab(0)}
                    p="10px 20px"
                    w="full"
                  >
                    <Text color="responseRenewalDetails.labelColor" data-id="000784" fontSize="11px">
                      {snapshot ? 'Review date' : 'Last reviewed'}
                    </Text>
                    <Text color="responseRenewalDetails.textColor" data-id="000785" fontSize="14px">
                      {response.lastCompletionDate
                        ? format(new Date(response.lastCompletionDate), 'dd MMMM yyyy')
                        : 'Never reviewed before'}
                    </Text>
                  </Flex>
                </Flex>
                {!snapshot && (
                  <ArrowDownIcon color="responseRenewalDetails.labelColor" data-id="000786" transform={['', 'rotate(270deg)']} />
                )}
                {!snapshot && (
                  <Flex
                    align="center"
                    bg="responseRenewalDetails.bg"
                    border={activeTab === 1 ? '1px solid #ccc' : 'null'}
                    borderRadius="10px"
                    boxShadow={activeTab === 1 ? 'simple' : 'null'}
                    cursor="pointer"
                    data-id="000787"
                    onClick={() => {
                      if (!inProgress) handleRenewalOpen();
                      else setActiveTab(1);
                    }}
                    p="10px 20px"
                    position="relative"
                    w={['full', '30%']}
                  >
                    <Flex align="center" data-id="000788" flexDir={['column', 'row']} justifyContent="space-between" w="full">
                      <VStack align={['center', 'flex-start']} data-id="000789" spacing={0} w="full">
                        <Text color="responseRenewalDetails.labelColor" data-id="000790" fontSize="11px">
                          Perform new review by
                        </Text>
                        <Text color="responseRenewalDetails.textColor" data-id="000791" fontSize="14px">
                          {response.dueDate ? format(new Date(response.dueDate), 'dd MMMM yyyy') : 'No due date'}
                        </Text>
                      </VStack>
                      {!snapshot && response?.trackerItem?.dueDateEditable && (
                        <Can
                          action="responses.edit"
                          data={{ response }}
                          data-id="000792"
                          yes={() => (
                            <Flex data-id="000793" onClick={(e) => e.stopPropagation()}>
                              <DatePicker
                                customInput={<EditButton data-id="000795" />}
                                data-id="000794"
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
                                  data-id="000796"
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
            <TabPanel data-id="000797" px={0}>
              <Box
                data-id="000798"
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
                  <Attachments data-id="000799" />
                )}
              </Box>
            </TabPanel>
            {/* Questions Tab */}
            <TabPanel data-id="000800" px={0}>
              <Box
                data-id="000801"
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
                <ResponseQuestions data-id="000802" disabled={activeTab === 0} key={activeTab} />
                {(response.questions.filter(({ required }) => required).length > 0 || response.evidence.length > 0) && (
                  <Flex data-id="000803" mt="3" w="full">
                    <Asterisk
                      data-id="000804"
                      fill="questionListElement.iconAsterisk"
                      h="9px"
                      stroke="questionListElement.iconAsterisk"
                      w="9px"
                    />
                    &nbsp;
                    <Text data-id="000805" fontSize="sm" fontWeight="semi_medium">
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
