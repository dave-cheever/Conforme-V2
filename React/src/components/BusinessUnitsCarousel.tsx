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
      (<Flex
        bg="businessUnitsCarousel.manyBg"
        borderRadius="10px"
        boxShadow="md"
        data-id="116231cd482c"
        flexDirection="column"
        h="fit-content"
        mr="3"
        p="3"
        pl="4"
        w={['full', 'full', '160px']}>
        <Text data-id="5cd4d033a7c3" fontSize="14px">Assigned to {selectedBusinessUnits.length === businessUnits.length && 'all'}</Text>
        <Text data-id="372150e117b5" fontSize="48px" fontWeight="500" lineHeight="57px">
          {selectedBusinessUnits?.length}
        </Text>
        <Text data-id="67fcb404da31" fontSize="sm">Units</Text>
      </Flex>)
    );
  }

  return (
    (<Stack data-id="a42f0bbd05f0" mr="3" spacing={2}>
      {selectedBusinessUnits?.map((businessUnit, i) => (
        <Skeleton data-id="63a8372f022a" isLoaded={!!businessUnit} key={`bu-${i}`}>
          <Flex
            bg="businessUnitsCarousel.elementBg"
            borderRadius="md"
            data-id="87661da96b49"
            h="50px"
            key={businessUnit?._id}
            w={['full', 'full', '160px']}>
            <Image
              borderLeftRadius="md"
              data-id="a448fb887715"
              objectFit="cover"
              src={businessUnit?.imgUrl}
              w="50px" />
            <Flex align="center" data-id="ddc7b26dfe6d" p="2" w="calc(100% - 50px)">
              <Text
                data-id="d600f98a63dd"
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
    </Stack>)
  );
}

export default BusinessUnitsCarousel;
