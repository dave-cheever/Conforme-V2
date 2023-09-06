import { useRef } from 'react';
import DatePicker from 'react-datepicker';

import { gql, useMutation } from '@apollo/client';
import { Button, Flex, Grid, Text, VStack } from '@chakra-ui/react';
import format from 'date-fns/format';

import { useResponseContext } from '../../contexts/ResponseProvider';
import { ArrowDownIcon } from '../../icons';
import Can from '../can';
import DescriptionText from './DescriptionText';
import EditButton from './EditButton';
import ResponseQuestions from './ResponseQuestions';

const UPDATE_DUE_DATE = gql`
  mutation ($updateResponseModify: UpdateResponseModify!) {
    updateResponse(updateResponseModify: $updateResponseModify) {
      dueDate
    }
  }
`;

function Details() {
  const { response, snapshot, refetch, activeTab, setActiveTab, handleRenewalOpen } = useResponseContext();
  const [updateDueDate] = useMutation(UPDATE_DUE_DATE);
  const startRef = useRef<DatePicker>();

  const updateResponseDate = async (date) => {
    await updateDueDate({
      variables: {
        updateResponseModify: {
          _id: response._id,
          dueDate: date,
        },
      },
    });
    startRef.current.setOpen(false);
    refetch();
  };

  if (!response) return null;
  return (
    (<VStack
      align="flex-start"
      data-id="e2b24a25eec6"
      h="full"
      minH={['30vh', 'none']}
      overflow="visible"
      pb="25px"
      spacing={8}
      w="full">
      <VStack align="flex-start" data-id="42cdfdf8f26f">
        {response?.trackerItem?.description && (
          <Text
            color="responseRenewalDetails.labelColor"
            data-id="2bb6b39c53bd"
            fontSize="14px">
            Description
          </Text>
        )}
        <DescriptionText data-id="3223c1354131" />
      </VStack>
      <Grid
        data-id="d24bb0d386e7"
        gap={[3, 6]}
        mt={4}
        templateColumns={['repeat(1, 1fr)', 'repeat(3, 1fr)']}
        w="full">
        <Flex
          align="center"
          cursor="pointer"
          data-id="a00af276799d"
          flexDir={['column', 'row']}
          h="full"
          justify="space-between"
          w="full">
          <Flex
            align={['center', 'flex-start']}
            bg="responseRenewalDetails.bg"
            border={activeTab === 0 ? '1px solid #ccc' : 'null'}
            borderRadius="10px"
            boxShadow={activeTab === 0 ? 'simple' : 'null'}
            data-id="7075c45927f8"
            flexDir="column"
            mb={[1, 0]}
            mr={[0, 5]}
            onClick={() => setActiveTab(0)}
            p="10px 20px"
            w="full">
            <Text
              color="responseRenewalDetails.labelColor"
              data-id="f516dc9d396e"
              fontSize="11px">
              Last reviewed
            </Text>
            <Text
              color="responseRenewalDetails.textColor"
              data-id="36fecdfee1cc"
              fontSize="14px">
              {response.lastCompletionDate ? format(new Date(response.lastCompletionDate), 'dd MMMM yyyy') : 'Never reviewed before'}
            </Text>
          </Flex>
          <ArrowDownIcon
            color="responseRenewalDetails.labelColor"
            data-id="f8214341ea31"
            transform={['', 'rotate(270deg)']} />
        </Flex>
        <Flex
          align="center"
          bg="responseRenewalDetails.bg"
          border={activeTab === 1 ? '1px solid #ccc' : 'null'}
          borderRadius="10px"
          boxShadow={activeTab === 1 ? 'simple' : 'null'}
          cursor="pointer"
          data-id="be8f34a8ade9"
          h="full"
          justify="space-between"
          onClick={() => {
            if (response.status === 'submitted') handleRenewalOpen();
            else setActiveTab(1);
          }}
          p="10px 20px"
          position="relative"
          w="full">
          <Flex
            align={['center', 'flex-start']}
            data-id="ff6696185102"
            flexDir="column"
            w="full">
            <Text
              color="responseRenewalDetails.labelColor"
              data-id="b9c86b2d96fb"
              fontSize="11px">
              Perform new review by
            </Text>
            <Flex data-id="72f2ee8cfebf">
              <Text
                color="responseRenewalDetails.textColor"
                data-id="3e1731dacc86"
                fontSize="14px">
                {response.dueDate ? format(new Date(response.dueDate), 'dd MMMM yyyy') : 'No due date'}
              </Text>
              {!snapshot && (
                <Can
                  action="responses.edit"
                  data={{ response }}
                  data-id="e83f27a79335"
                  // eslint-disable-next-line react/no-unstable-nested-components
                  yes={() => (
                    <Flex align="center" data-id="f8b76251428b">
                      <DatePicker
                        customInput={<EditButton data-id="533e38d2459a" />}
                        data-id="89abdf0842a7"
                        dateFormatCalendar="MMMM"
                        disabledKeyboardNavigation
                        dropdownMode="select"
                        onChange={(date) => updateResponseDate(date)}
                        ref={startRef}
                        selected={response?.dueDate ? new Date(response?.dueDate) : new Date()}
                        showYearDropdown>
                        <Button
                          colorScheme="purpleHeart"
                          data-id="fb08198c53c6"
                          onClick={() => updateResponseDate(null)}
                          size="sm"
                          w="full">
                          No due date
                        </Button>
                      </DatePicker>
                    </Flex>
                  )} />
              )}
            </Flex>
          </Flex>
        </Flex>
      </Grid>
      <ResponseQuestions data-id="91f3a1ea351a" disabled={activeTab === 0} />
    </VStack>)
  );
}

export default Details;

export const responseRenewalDetailsStyles = {
  responseRenewalDetails: {
    labelColor: '#818197',
    textColor: '#282F36',
    bg: '#F0F2F5',
    nextRenewalBg: 'rgba(65, 185, 22, 0.1)',
    progressColor: '#41B916',
    editButtonColor: '#818197',
  },
};
