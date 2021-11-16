import { useEffect, useState} from 'react';
import {
  Flex,
} from '@chakra-ui/react';

import ComplianceItemSquare from './ComplianceItemSquare';
import { IResponse } from '../../interfaces/IResponse';
import useResponseUtils from '../../hooks/useResponseUtils';
import { responseStatuses } from '../../hooks/useResponseUtils';

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
    (filteredResults[group]?.length > 0) &&
    <Flex key={group} w='full' px={8} pt={8} direction='column'>
      <Flex
        w='180px'
        mb={4}
        h='50px'
        bg={`complianceGroup.${group}`}
        color='#FFFFFF'
        fontWeight='700'
        align='center'
        justify='space-between'
        pr={4}
        pl={5}
        roundedBottomRight='10px'
        roundedTopLeft='10px'
        roundedTopRight='20px'
        roundedBottomLeft='20px'
      >
        {responseStatuses[group]}
        <Flex
          w='22px'
          h='22px'
          bg='#000000'
          color='#FFFFFF'
          rounded='lg'
          justify='center'
          align='center'
          fontSize='11px'
        >
          {filteredResults[group].length}
        </Flex>
      </Flex>
      <Flex direction={['column','row']} w='full' wrap='wrap' alignContent={['center', 'flex-start']}>
        {(filteredResults[group].map((response: IResponse) => <ComplianceItemSquare key={response['_id']} response={response} />))}
      </Flex>
    </Flex>
  );

  return (
    <Flex direction='column' w='full'  h='full' overflow='auto'>
      {Object.keys(responseStatuses).map(status => renderGroup(status))}
    </Flex>
  );
};

export default ComplianceGridItems;
