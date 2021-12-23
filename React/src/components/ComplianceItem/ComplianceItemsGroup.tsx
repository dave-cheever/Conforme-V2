import { useEffect, useState} from 'react';
import {
  Flex,
  Stack
} from '@chakra-ui/react';

import ComplianceItemSquare from './ComplianceItemSquare';
import { IResponse } from '../../interfaces/IResponse';
import useResponseUtils from '../../hooks/useResponseUtils';
import { responseStatusesGroup } from '../../hooks/useResponseUtils';

const ComplianceGridItems = ({ responses }: { responses: IResponse[] }) => {
  const [ filteredResults, setFilteredResults ] = useState<any>({});
  const { getStatus } = useResponseUtils();

  useEffect(() => {
    let filteredResponses: any = {}
    filteredResponses['compliant'] = responses.filter(response => getStatus(response) === 'compliant');
    filteredResponses['nonCompliant'] = responses.filter(response => getStatus(response) === 'nonCompliant');
    setFilteredResults(filteredResponses)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responses]);

  const renderGroup = (group: string) => (
    <Flex key={group} pl={8} pr={3} pt={2} minW='calc(347px + 1rem)' direction='column'>
      <Flex
        w="full"
        mb={4}
        minH='40px'
        bg={`complianceGroup.${group}`}
        color='#FFFFFF'
        fontWeight='700'
        align='center'
        justify='space-between'
        pr={4}
        pl={5}
        rounded="full"
      >
        {responseStatusesGroup[group]}
      </Flex>
      <Stack spacing={6} direction="column" w='full' align='center' pb={5}>
        {(filteredResults[group]?.map((response: IResponse) => <ComplianceItemSquare key={response['_id']} response={response} />))}
      </Stack>
    </Flex>
  );

  return (
    <Flex w="full" h='full' overflow='auto' pt="3">
      {Object.keys(responseStatusesGroup).map(status => renderGroup(status))}
    </Flex>
  );
};

export default ComplianceGridItems;


export const complianceGroupItemsStyles = {
  complianceGroup: {
    compliant: "#62c240",
    nonCompliant: "#FC5960",
    comingUp: "#FFA012"
  },
}