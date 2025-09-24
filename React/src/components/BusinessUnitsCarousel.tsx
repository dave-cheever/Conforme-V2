import React from 'react';

import { Flex, Image, Skeleton, Stack, Text } from '@chakra-ui/react';

import { IBusinessUnit } from '../interfaces/IBusinessUnit';

function BusinessUnitsCarousel({
  businessUnits,
  selectedBusinessUnits,
}: {
  businessUnits: IBusinessUnit[];
  selectedBusinessUnits: IBusinessUnit[];
}) {
  if (selectedBusinessUnits?.length > 10) {
    return (
      <Flex
          data-id="000171"
          bg="businessUnitsCarousel.manyBg"
          borderRadius="10px"
          boxShadow="md"
          flexDirection="column"
          h="fit-content"
          mr="3"
          p="3"
          pl="4"
          w={['full', 'full', '160px']}>
        <Text data-id="000172" fontSize="14px">Assigned to {selectedBusinessUnits.length === businessUnits.length && 'all'}</Text>
        <Text data-id="000173" fontSize="48px" fontWeight="500" lineHeight="57px">
          {selectedBusinessUnits?.length}
        </Text>
        <Text data-id="000174" fontSize="sm">Units</Text>
      </Flex>
    );
  }

  return (
    <Stack data-id="000175" mr="3" spacing={2}>
      {selectedBusinessUnits?.map((businessUnit, i) => (
        <Skeleton data-id="000176" isLoaded={!!businessUnit} key={`bu-${i}`}>
          <Flex
            data-id="000177"
            bg="businessUnitsCarousel.elementBg"
            borderRadius="md"
            h="50px"
            key={businessUnit?._id}
            w={['full', 'full', '160px']}>
            <Image
              data-id="000178"
              borderLeftRadius="md"
              objectFit="cover"
              src={businessUnit?.imgUrl}
              w="50px" />
            <Flex data-id="000179" align="center" p="2" w="calc(100% - 50px)">
              <Text
                data-id="000180"
                fontSize="sm"
                noOfLines={2}
                overflow="hidden"
                textOverflow="ellipsis">
                {businessUnit?.name}
              </Text>
            </Flex>
          </Flex>
        </Skeleton>
      ))}
    </Stack>
  );
}

export default BusinessUnitsCarousel;
