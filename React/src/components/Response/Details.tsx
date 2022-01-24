import React, { useMemo, useRef } from "react";
import { Button, CircularProgress, Flex, Grid, Text } from "@chakra-ui/react";
import format from "date-fns/format";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import DatePicker from "react-datepicker";
import { gql, useMutation } from "@apollo/client";
import isToday from "date-fns/isToday";

import DescriptionText from "./DescriptionText";
import { ArrowDownIcon } from "../../icons";
import { useResponseContext } from "../../contexts/ResponseProvider";
import EditButton from "./EditButton";

const UPDATE_RESPONSE = gql`
  mutation ($updateResponseModify: UpdateResponseModify!) {
    updateResponse(updateResponseModify: $updateResponseModify) {
      nextRenewalDate
    }
  }
`;

const Details = () => {
  const { response, refetch } = useResponseContext();
  const [updateResponse] = useMutation(UPDATE_RESPONSE);
  const startRef = useRef<DatePicker>();

  const progress = useMemo(() => {
    if(response.daysToDueDate === undefined) {
      return -1;
    }

    if (response.lastCompletionDate && response.nextRenewalDate) {
      const totalDays = differenceInCalendarDays(new Date(response.nextRenewalDate),new Date(response.lastCompletionDate));

      if(isToday(new Date(response.nextRenewalDate))){
        return ((1 / totalDays) * 100);
      }
      return ((response.daysToDueDate / totalDays) * 100);
    }

    if (response.metatags?.addedAt && response.nextRenewalDate) {
      const totalDays = differenceInCalendarDays(new Date(response.nextRenewalDate), new Date(response.metatags.addedAt));

      if( isToday(new Date(response.nextRenewalDate)) ){
        return ((1 / totalDays) * 100);
      }
      return ((response.daysToDueDate / totalDays) * 100);
    }

    return -1;
  }, [response]);

  const updateResponseDate = async (date) => {
    await updateResponse({
      variables: {
        updateResponseModify: {
          _id: response._id,
          nextRenewalDate: date
        }
      },
    });
    startRef.current.setOpen(false);
    refetch();
  }

  return (
    <Flex w="full" h="full" minH={["50vh","none"]} flexDir="column" overflow={["visible", "auto"]}>
      <Grid
        templateColumns={["repeat(1, 1fr)", "repeat(3, 1fr)"]}
        mb={5}
        gap={[3, 6]}
      >
        <Flex
          w="full"
          justify="space-between"
          h="full"
          flexDir={["column", "row"]}
          align="center"
        >
          <Flex
            w="full"
            bg="responseRenewalDetails.bg"
            p="10px 20px"
            mb={[1, 0]}
            mr={[0, 5]}
            flexDir="column"
            borderRadius="10px"
            align={["center","flex-start"]}
          >
            <Text color="responseRenewalDetails.labelColor" fontSize="11px">
              First completed
            </Text>
            <Text fontSize="14px" color="responseRenewalDetails.textColor">
              {response.firstCompletionDate
                ? format(new Date(response.firstCompletionDate), "dd MMMM yyyy")
                : "N/A"}
            </Text>
          </Flex>
          <ArrowDownIcon
            color="responseRenewalDetails.labelColor"
            transform={["", "rotate(270deg)"]}
          />
        </Flex>
        <Flex
          w="full"
          justify="space-between"
          h="full"
          flexDir={["column", "row"]}
          align="center"
        >
          <Flex
            w="full"
            bg="responseRenewalDetails.bg"
            p="10px 20px"
            mb={[1, 0]}
            mr={[0, 5]}
            flexDir="column"
            borderRadius="10px"
            align={["center","flex-start"]}
          >
            <Text color="responseRenewalDetails.labelColor" fontSize="11px">
              Last completed
            </Text>
            <Text fontSize="14px" color="responseRenewalDetails.textColor">
              {response.lastCompletionDate
                ? format(new Date(response.lastCompletionDate), "dd MMMM yyyy")
                : "N/A"}
            </Text>
          </Flex>
          <ArrowDownIcon
            color="responseRenewalDetails.labelColor"
            transform={["", "rotate(270deg)"]}
          />
        </Flex>
        <Flex
          w="full"
          bg="responseRenewalDetails.nextRenewalBg"
          p="10px 20px"
          borderRadius="10px"
          justify="space-between"
          h="full"
          align="center"
          position="relative"
        >
          {progress >= 0 && <CircularProgress
            size="28px"
            value={progress}
            color={progress <= 10 ? "red" : "responseRenewalDetails.progressColor"}
            display={["none","block"]}
          />}
          <Flex w="full" flexDir="column" ml={progress >= 0 ? 3 : 0} align={["center","flex-start"]}>
            <Text color="responseRenewalDetails.labelColor" fontSize="11px">
              Due for renewal
            </Text>
            <Flex>
              <Text fontSize="14px" color="responseRenewalDetails.textColor">
                {response.nextRenewalDate
                  ? format(new Date(response.nextRenewalDate), "dd MMMM yyyy")
                  : "No due date"}
              </Text>
              <Flex align="center">
                <DatePicker
                  ref={startRef}
                  selected={response?.nextRenewalDate ? new Date(response?.nextRenewalDate) : new Date()}
                  onChange={(date) => updateResponseDate(date)}
                  customInput={<EditButton />}
                  disabledKeyboardNavigation
                  showYearDropdown
                  dropdownMode="select"
                  dateFormatCalendar="MMMM"
                  >
                    <Button colorScheme="purpleHeart" w="full" size="sm" onClick={() => updateResponseDate(null)}>No due date</Button>
                  </DatePicker>
              </Flex>
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
    labelColor: "#818197",
    textColor: "#282F36",
    bg: "#F0F2F5",
    nextRenewalBg: "rgba(65, 185, 22, 0.1)",
    progressColor: "#41B916",
    editButtonColor: "#818197"
  },
};
