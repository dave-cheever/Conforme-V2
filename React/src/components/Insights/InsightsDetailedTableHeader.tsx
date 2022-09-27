import { Grid } from '@chakra-ui/react';

const InsightsDetailedTableHeader = ({ children }) => (
  <Grid
    bg="white"
    borderBottom="1px solid"
    borderColor="adminTableHeader.border"
    color="adminTableHeader.font"
    fontSize="11px"
    fontWeight="semi_medium"
    p="15px 25px"
    templateColumns="1fr repeat(4, 135px)"
  >
    {children}
  </Grid>
);

export default InsightsDetailedTableHeader;
