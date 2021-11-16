import React from 'react';
import { Box, Flex, Text } from "@chakra-ui/react";

import BusinessUnitsSelector from '../BusinessUnitsSelector';
import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';

const BusinessUnitsForm = () => {
  const {
    businessUnits,
    complianceItem,
    setValue, trigger,
  } = useComplianceItemModalContext();

  const handleChange = ({ target: { value } }) => {
    setValue('businessUnitsIds', value);
    trigger('businessUnitsIds');
  };

  return (
    <Box w='full' px={[0, 0, 3]}>
      <Flex direction='column'>
        <Text pb={3} pl={3} fontSize='14px' color='adminComplianceItemModal.section.businessUnits.description' opacity='0.7'>
          Please define the corresponding business unit(s) for this item.
        </Text>
        <BusinessUnitsSelector
          businessUnits={businessUnits as IBusinessUnit[]}
          selected={complianceItem.businessUnitsIds || []}
          note="Business unit owners of selected units will be assigned as responsible persons by default"
          handleChange={handleChange}
        />
      </Flex>
    </Box>
  );
};

export default BusinessUnitsForm;
