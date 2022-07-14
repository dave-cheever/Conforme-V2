import { useEffect, useState } from 'react';

import { Flex, Stack } from '@chakra-ui/react';

import useResponseUtils from '../../hooks/useResponseUtils';
import { IResponse } from '../../interfaces/IResponse';
import ComplianceItemSquare from './ComplianceItemSquare';

const ComplianceGridItems = ({ responses }: { responses: IResponse[] }) => {
  const [filteredResults, setFilteredResults] = useState<any>({});
  const { responseStatusesGroup, getStatus, getRenewalStatus } = useResponseUtils();

  useEffect(() => {
    const filteredResponses: any = {};
    filteredResponses.compliant = responses.filter(
      (response) => getStatus(response) === 'compliant' && getRenewalStatus(response) !== 'comingUp',
    );
    filteredResponses.comingUp = responses.filter(
      (response) => getStatus(response) === 'compliant' && getRenewalStatus(response) === 'comingUp',
    );
    filteredResponses.nonCompliant = responses.filter((response) => getStatus(response) === 'nonCompliant');
    setFilteredResults(filteredResponses);
  }, [responses]);

  const renderGroup = (group: string) => (
    <Flex direction="column" key={group} minW="calc(347px + 1rem)" pl={8} pr={3} pt={2}>
      <Flex
        align="center"
        bg={`complianceGroup.${group}`}
        color="#FFFFFF"
        fontWeight="700"
        justify="space-between"
        mb={4}
        minH="40px"
        pl={5}
        pr={4}
        rounded="full"
        w="full"
      >
        {responseStatusesGroup[group]}
      </Flex>
      <Stack align="center" direction="column" pb={5} spacing={6} w="full">
        {filteredResults[group]
          ?.sort((a, b) => {
            if (a.nextRenewalDate === null) return 1;

            if (b.nextRenewalDate === null) return -1;

            return a.nextRenewalDate && b.nextRenewalDate ? a.nextRenewalDate.toString().localeCompare(b.nextRenewalDate.toString()) : 0;
          })
          ?.map((response: IResponse) => (
            <ComplianceItemSquare key={response._id} response={response} />
          ))}
      </Stack>
    </Flex>
  );

  return (
    <Flex h="full" overflow="auto" pt="3" w="full">
      {Object.keys(responseStatusesGroup).map((status) => renderGroup(status))}
    </Flex>
  );
};

export default ComplianceGridItems;

export const complianceGroupItemsStyles = {
  complianceGroup: {
    compliant: '#62c240',
    nonCompliant: '#FC5960',
    comingUp: '#FFA012',
  },
};
