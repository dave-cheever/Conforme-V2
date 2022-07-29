import React from 'react';

import { Flex, Image, Skeleton, Stack, Text } from '@chakra-ui/react';

import { IBusinessUnit } from '../interfaces/IBusinessUnit';

const BusinessUnitsCarousel = ({
  businessUnits,
  selectedBusinessUnits,
}: {
  businessUnits: IBusinessUnit[];
  selectedBusinessUnits: IBusinessUnit[];
}) => {
  if (selectedBusinessUnits?.length > 10) {
    return (
      <Flex
        bg="businessUnitsCarousel.manyBg"
        borderRadius="10px"
        boxShadow="md"
        flexDirection="column"
        h="fit-content"
        mr="3"
        p="3"
        pl="4"
        w={['full', 'full', '160px']}
      >
        <Text fontSize="14px">Assigned to {selectedBusinessUnits.length === businessUnits.length && 'all'}</Text>
        <Text fontSize="48px" fontWeight="500" lineHeight="57px">
          {selectedBusinessUnits?.length}
        </Text>
        <Text fontSize="sm">Units</Text>
      </Flex>
    );
  }

  return (
    <Stack mr="3" spacing={2}>
      {selectedBusinessUnits?.map((businessUnit, i) => (
        <Skeleton isLoaded={!!businessUnit} key={`bu-${i}`}>
          <Flex bg="businessUnitsCarousel.elementBg" borderRadius="md" h="50px" key={businessUnit?._id} w={['full', 'full', '160px']}>
            <Image borderLeftRadius="md" objectFit="cover" src={businessUnit?.imgUrl} w="50px" />
            <Flex align="center" p="2" w="calc(100% - 50px)">
              <Text fontSize="sm" noOfLines={2} overflow="hidden" textOverflow="ellipsis">
                {businessUnit?.name}
              </Text>
            </Flex>
          </Flex>
        </Skeleton>
      ))}
    </Stack>
  );
};

export default BusinessUnitsCarousel;
