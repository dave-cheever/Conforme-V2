import React, { useMemo, useRef } from 'react';
import DatePicker from 'react-datepicker';

import { gql, useMutation } from '@apollo/client';
import { Button, CircularProgress, Flex, Grid, Text } from '@chakra-ui/react';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';

import { useResponseContext } from '../../contexts/ResponseProvider';
import { ArrowDownIcon } from '../../icons';
import Can from '../can';
import DescriptionText from './DescriptionText';
import EditButton from './EditButton';

const UPDATE_RESPONSE = gql`
  mutation ($updateResponseModify: UpdateResponseModify!) {
    updateResponse(updateResponseModify: $updateResponseModify) {
      nextRenewalDate
    }
  }
`;

const Details = () => {
  const { response, snapshot, refetch } = useResponseContext();
  const [updateResponse] = useMutation(UPDATE_RESPONSE);
  const startRef = useRef<DatePicker>();

  const progress = useMemo(() => {
    if (response?.daysToDueDate === undefined) return -1;

    if (response.lastCompletionDate && response.nextRenewalDate) {
      const totalDays = differenceInCalendarDays(
        new Date(response.nextRenewalDate),
        new Date(response.lastCompletionDate),
      );

      if (isToday(new Date(response.nextRenewalDate)))
        return (1 / totalDays) * 100;

      return (response.daysToDueDate / totalDays) * 100;
    }

    if (response.metatags?.addedAt && response.nextRenewalDate) {
      const totalDays = differenceInCalendarDays(
        new Date(response.nextRenewalDate),
        new Date(response.metatags.addedAt),
      );

      if (isToday(new Date(response.nextRenewalDate)))
        return (1 / totalDays) * 100;

      return (response.daysToDueDate / totalDays) * 100;
    }

    return -1;
  }, [response]);

  const updateResponseDate = async (date) => {
    await updateResponse({
      variables: {
        updateResponseModify: {
          _id: response._id,
          nextRenewalDate: date,
        },
      },
    });
    startRef.current.setOpen(false);
    refetch();
  };

  if (!response) return null;

  return (
    <Flex
      flexDir="column"
      h="full"
      minH={['50vh', 'none']}
      overflow={['visible', 'auto']}
      w="full"
    >
      <Grid
        gap={[3, 6]}
        mb={5}
        templateColumns={['repeat(1, 1fr)', 'repeat(3, 1fr)']}
      >
        <Flex
          align="center"
          flexDir={['column', 'row']}
          h="full"
          justify="space-between"
          w="full"
        >
          <Flex
            align={['center', 'flex-start']}
            bg="responseRenewalDetails.bg"
            borderRadius="10px"
            flexDir="column"
            mb={[1, 0]}
            mr={[0, 5]}
            p="10px 20px"
            w="full"
          >
            <Text color="responseRenewalDetails.labelColor" fontSize="11px">
              First completed
            </Text>
            <Text color="responseRenewalDetails.textColor" fontSize="14px">
              {response.firstCompletionDate
                ? format(new Date(response.firstCompletionDate), 'dd MMMM yyyy')
                : 'N/A'}
            </Text>
          </Flex>
          <ArrowDownIcon
            color="responseRenewalDetails.labelColor"
            transform={['', 'rotate(270deg)']}
          />
        </Flex>
        <Flex
          align="center"
          flexDir={['column', 'row']}
          h="full"
          justify="space-between"
          w="full"
        >
          <Flex
            align={['center', 'flex-start']}
            bg="responseRenewalDetails.bg"
            borderRadius="10px"
            flexDir="column"
            mb={[1, 0]}
            mr={[0, 5]}
            p="10px 20px"
            w="full"
          >
            <Text color="responseRenewalDetails.labelColor" fontSize="11px">
              Last completed
            </Text>
            <Text color="responseRenewalDetails.textColor" fontSize="14px">
              {response.lastCompletionDate
                ? format(new Date(response.lastCompletionDate), 'dd MMMM yyyy')
                : 'N/A'}
            </Text>
          </Flex>
          <ArrowDownIcon
            color="responseRenewalDetails.labelColor"
            transform={['', 'rotate(270deg)']}
          />
        </Flex>
        <Flex
          align="center"
          bg="responseRenewalDetails.nextRenewalBg"
          borderRadius="10px"
          h="full"
          justify="space-between"
          p="10px 20px"
          position="relative"
          w="full"
        >
          {progress >= 0 && (
            <CircularProgress
              color={
                progress <= 10 ? 'red' : 'responseRenewalDetails.progressColor'
              }
              display={['none', 'block']}
              size="28px"
              value={progress}
            />
          )}
          <Flex
            align={['center', 'flex-start']}
            flexDir="column"
            ml={progress >= 0 ? 3 : 0}
            w="full"
          >
            <Text color="responseRenewalDetails.labelColor" fontSize="11px">
              Due for renewal
            </Text>
            <Flex>
              <Text color="responseRenewalDetails.textColor" fontSize="14px">
                {response.nextRenewalDate
                  ? format(new Date(response.nextRenewalDate), 'dd MMMM yyyy')
                  : 'No due date'}
              </Text>
              {!snapshot && (
                <Can
                  action="responses.edit"
                  data={{ response }}
                  yes={() => (
                    <Flex align="center">
                      <DatePicker
                        customInput={<EditButton />}
                        dateFormatCalendar="MMMM"
                        disabledKeyboardNavigation
                        dropdownMode="select"
                        onChange={(date) => updateResponseDate(date)}
                        ref={startRef}
                        selected={
                          response?.nextRenewalDate
                            ? new Date(response?.nextRenewalDate)
                            : new Date()
                        }
                        showYearDropdown
                      >
                        <Button
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
        </Flex>
      </Grid>
      <Text color="responseRenewalDetails.labelColor" fontSize="14px">
        Description
      </Text>
      <DescriptionText />
    </Flex>
  );
};

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
