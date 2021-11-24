import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import DescriptionText from './DescriptionText';

const Details = ({response}) => {
    return (
    <Flex flexDir="column">
        <Text color="complianceItemResponse.labelColor" fontSize="14px">Description</Text>
        <DescriptionText response={response}/>
    </Flex>
    )
}

export default Details
