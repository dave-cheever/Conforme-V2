import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import DescriptionText from './DescriptionText';

const Details = () => {
    return (
    <Flex h="full" flexDir="column">
        <Text color="complianceItemResponse.labelColor" fontSize="14px">Description</Text>
        <DescriptionText/>
    </Flex>
    )
}

export default Details
