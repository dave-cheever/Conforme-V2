import React, { useCallback } from "react";
import {
  Box,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import moment from "moment";

import { IAuditLog } from "../../interfaces/IAuditLog";
import { CheckIcon } from "../../icons";
import AuditLogRecord from "./AuditLogRecord";

const AuditLogDay = ({ auditLog }: { auditLog: IAuditLog }) => {
  const daysAgo = useCallback((day) => {
    const today = moment(new Date().toISOString().split('T')[0]);
    let value = "";
    const dayAgo = moment(day);

    switch (today.diff(dayAgo, "days").toString()) {
      case '0':
        value = "Today";
        break;
      case '1':
        value = "Yesterday";
        break;
      default:
        value = `${today.diff(dayAgo, "days").toString()} days ago`;
    }
    return value;
  }, []);

  return (
    <Box zIndex="2" mb="60px" p={2}>
      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="85px 35px"
        gridTemplateAreas={`"a c" "b c"`}
        fontSize="12px"
        fontWeight="bold"
        w="125px"
        textAlign="end"
        mb="30px"
      >
        <GridItem color="auditLogDayStyles.day" gridArea="a">{daysAgo(auditLog._id)}</GridItem>
        <GridItem color="auditLogDayStyles.date" gridArea="b">{moment(auditLog._id).format('DD MMM YYYY')}</GridItem>
        <GridItem gridArea="c" alignSelf="center" w="35px"><CheckIcon h="24px" w="24px" /></GridItem>
      </Grid>
      {auditLog.records.map(audit => <AuditLogRecord key={audit.metatags?.addedAt?.toString()} audit={audit} />)}
    </Box>
  );
};

export const auditLogDayStyles = {
  auditLogDayStyles: {
    day: '#434C52',
    date: '#9A9EA1',
  }
};

export default AuditLogDay;
