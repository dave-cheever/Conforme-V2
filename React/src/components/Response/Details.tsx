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
    <VStack
        data-id="000209"
        align="flex-start"
        h="full"
        minH={['30vh', 'none']}
        overflow="visible"
        pb="25px"
        spacing={8}
        w="full">
      <VStack data-id="000210" align="flex-start">
        {response?.trackerItem?.description && (
          <Text
            data-id="000211"
            color="responseRenewalDetails.labelColor"
            fontSize="14px">
            Description
          </Text>
        )}
        <DescriptionText data-id="000212" />
      </VStack>
      <Grid
        data-id="000213"
        gap={[3, 6]}
        mt={4}
        templateColumns={['repeat(1, 1fr)', 'repeat(3, 1fr)']}
        w="full">
        <Flex
          data-id="000214"
          align="center"
          cursor="pointer"
          flexDir={['column', 'row']}
          h="full"
          justify="space-between"
          w="full">
          <Flex
            data-id="000215"
            align={['center', 'flex-start']}
            bg="responseRenewalDetails.bg"
            border={activeTab === 0 ? '1px solid #ccc' : 'null'}
            borderRadius="10px"
            boxShadow={activeTab === 0 ? 'simple' : 'null'}
            flexDir="column"
            mb={[1, 0]}
            mr={[0, 5]}
            onClick={() => setActiveTab(0)}
            p="10px 20px"
            w="full">
            <Text
              data-id="000216"
              color="responseRenewalDetails.labelColor"
              fontSize="11px">
              Last reviewed
            </Text>
            <Text
              data-id="000217"
              color="responseRenewalDetails.textColor"
              fontSize="14px">
              {response.lastCompletionDate ? format(new Date(response.lastCompletionDate), 'dd MMMM yyyy') : 'Never reviewed before'}
            </Text>
          </Flex>
          <ArrowDownIcon
            data-id="000218"
            color="responseRenewalDetails.labelColor"
            transform={['', 'rotate(270deg)']} />
        </Flex>
        <Flex
          data-id="000219"
          align="center"
          bg="responseRenewalDetails.bg"
          border={activeTab === 1 ? '1px solid #ccc' : 'null'}
          borderRadius="10px"
          boxShadow={activeTab === 1 ? 'simple' : 'null'}
          cursor="pointer"
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
            data-id="000220"
            align={['center', 'flex-start']}
            flexDir="column"
            w="full">
            <Text
              data-id="000221"
              color="responseRenewalDetails.labelColor"
              fontSize="11px">
              Perform new review by
            </Text>
            <Flex data-id="000222">
              <Text
                data-id="000223"
                color="responseRenewalDetails.textColor"
                fontSize="14px">
                {response.dueDate ? format(new Date(response.dueDate), 'dd MMMM yyyy') : 'No due date'}
              </Text>
              {!snapshot && (
                <Can
                  data-id="000224"
                  action="responses.edit"
                  data={{ response }}
                  // eslint-disable-next-line react/no-unstable-nested-components
                  yes={() => (
                    <Flex data-id="000225" align="center">
                      <DatePicker
                        data-id="000226"
                        customInput={<EditButton data-id="000227" />}
                        dateFormatCalendar="MMMM"
                        disabledKeyboardNavigation
                        dropdownMode="select"
                        onChange={(date) => updateResponseDate(date)}
                        ref={startRef}
                        selected={response?.dueDate ? new Date(response?.dueDate) : new Date()}
                        showYearDropdown>
                        <Button
                          data-id="000228"
                          colorScheme="purpleHeart"
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
      <ResponseQuestions data-id="000229" disabled={activeTab === 0} />
    </VStack>
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
